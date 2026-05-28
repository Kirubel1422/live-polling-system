import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
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

        const isMatch = await bcrypt.compare(password, user.password);
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
          name: user.displayName,
          role: user.role,
        });
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;
