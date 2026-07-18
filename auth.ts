import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const STRAPI_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api").replace(/\/api$/, "");

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: { identifier: {}, password: {} },
      async authorize(credentials) {
        const loginRes = await fetch(`${STRAPI_URL}/api/auth/local`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: credentials?.identifier,
            password: credentials?.password,
          }),
        });
        if (!loginRes.ok) return null;
        const { jwt, user } = await loginRes.json();

        const meRes = await fetch(`${STRAPI_URL}/api/users/me?populate=role`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        const me = meRes.ok ? await meRes.json() : null;

        return {
          id: String(user.id),
          email: user.email,
          name: user.username,
          role: me?.role?.type ?? "authenticated",
          strapiToken: jwt,
          mustResetPassword: me?.mustResetPassword ?? false,
          description: me?.description ?? "",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.strapiToken = user.strapiToken;
        token.role = user.role;
        token.mustResetPassword = user.mustResetPassword;
        token.description = user.description;
      }
      if (trigger === "update" && session?.mustResetPassword !== undefined) {
        token.mustResetPassword = session.mustResetPassword;
      }
      if (trigger === "update" && typeof session?.name === "string") {
        token.name = session.name;   // reflect a renamed account in the session
      }
      if (trigger === "update" && typeof session?.description === "string") {
        token.description = session.description;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.strapiToken = token.strapiToken as string;
      session.user.role = token.role as string;
      session.user.mustResetPassword = token.mustResetPassword as boolean;
      session.user.description = (token.description as string) ?? "";
      return session;
    },
  },
});
