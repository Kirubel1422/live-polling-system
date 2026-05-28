import { IAuthUser } from "src/interfaces/auth.interface";

declare global {
  namespace Express {
    interface User extends IAuthUser {}
    interface Request {
      user?: User;
    }
  }
}
