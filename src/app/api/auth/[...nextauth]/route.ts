import NextAuth from "next-auth";
import { authOptions } from "@/features/auth/backend/authConfig";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export { authOptions };
