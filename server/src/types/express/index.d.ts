import { User as DbUser } from "../../services/users"; // or wherever your User interface is

declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      email?: string;
      role?: string;
      // Add anything else Passport attaches
    }

    interface Request {
      user?: User; // Optional, because passport might not set it
    }
  }
}
