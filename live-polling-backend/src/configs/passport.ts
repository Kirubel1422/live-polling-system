import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { AppDataSource } from "./database";
import { UserEntity } from "src/entities/User.entity";
import bcrypt from "bcryptjs";
import { ENV } from "src/constants/dotenv";

// ── Local Strategy for Login ───────────────────────────────────────────────

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const userRepo = AppDataSource.getRepository(UserEntity);
        const user = await userRepo.findOne({ where: { email } });

        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password || "");
        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// ── JWT Strategy for API protection ────────────────────────────────────────

const extractJwtFromCookie = (req: any) => {
  let token = null;
  if (req && req.cookies) token = req.cookies["jwt"];
  return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
};

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: extractJwtFromCookie,
      secretOrKey: ENV.JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        const userRepo = AppDataSource.getRepository(UserEntity);
        const user = await userRepo.findOne({ where: { id: jwtPayload.id } });

        if (!user) {
          return done(null, false);
        }

        return done(null, {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          avatarUrl: user.avatarUrl,
          provider: user.provider,
        });
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// ── Google OAuth Strategy ──────────────────────────────────────────────────

if (ENV.GOOGLE_CLIENT_ID && ENV.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: ENV.GOOGLE_CLIENT_ID,
        clientSecret: ENV.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const userRepo = AppDataSource.getRepository(UserEntity);
          const email = profile.emails?.[0]?.value;

          if (!email) {
            return done(new Error("Google account has no email"), false as any);
          }

          // Check if user already exists with this provider+ID
          let user = await userRepo.findOne({
            where: { provider: "google", providerId: profile.id },
          });

          // If not found by provider, check by email (could be a local user linking)
          if (!user) {
            user = await userRepo.findOne({ where: { email } });
          }

          if (user) {
            // Update provider info if they previously registered with email/password
            if (user.provider === "local") {
              user.provider = "google";
              user.providerId = profile.id;
            }
            if (!user.avatarUrl && profile.photos?.[0]?.value) {
              user.avatarUrl = profile.photos[0].value;
            }
            await userRepo.save(user);
          } else {
            // Create new user
            user = userRepo.create({
              email,
              displayName: profile.displayName,
              avatarUrl: profile.photos?.[0]?.value,
              provider: "google",
              providerId: profile.id,
              isEmailVerified: true,
            });
            await userRepo.save(user);
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error, false as any);
        }
      }
    )
  );
}

// ── GitHub OAuth Strategy ──────────────────────────────────────────────────

if (ENV.GITHUB_CLIENT_ID && ENV.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: ENV.GITHUB_CLIENT_ID,
        clientSecret: ENV.GITHUB_CLIENT_SECRET,
        callbackURL: "/api/auth/github/callback",
        scope: ["user:email"],
      },
      async (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
        try {
          const userRepo = AppDataSource.getRepository(UserEntity);
          const email =
            profile.emails?.[0]?.value ||
            `${profile.username}@github.noreply.com`;

          // Check if user already exists with this provider+ID
          let user = await userRepo.findOne({
            where: { provider: "github", providerId: profile.id },
          });

          // If not found by provider, check by email
          if (!user) {
            user = await userRepo.findOne({ where: { email } });
          }

          if (user) {
            if (user.provider === "local") {
              user.provider = "github";
              user.providerId = profile.id;
            }
            if (!user.avatarUrl && profile.photos?.[0]?.value) {
              user.avatarUrl = profile.photos[0].value;
            }
            await userRepo.save(user);
          } else {
            user = userRepo.create({
              email,
              displayName: profile.displayName || profile.username,
              avatarUrl: profile.photos?.[0]?.value,
              provider: "github",
              providerId: profile.id,
              isEmailVerified: true,
            });
            await userRepo.save(user);
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error, false as any);
        }
      }
    )
  );
}

export default passport;
