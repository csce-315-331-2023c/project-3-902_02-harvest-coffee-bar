import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      scope: ['profile', 'email'],
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, 
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt(token, user) {
      console.log('Token:', token);
      console.log('Got in here');
      console.log('Token token email: ', token.user.email);

      if (token.user.email) {
        console.log('I got in token.email');

        if (token.user.email === 'niteshduraivel@tamu.edu') {
          console.log('Admin login detected');
          token.role = 'admin';
        } 
        // else if (user.email.endsWith('@tamu.edu')) {
        //   token.role = 'manager';
        // } 
        else if (token.user.email === 'cashier@example.com') {
          token.role = 'cashier';
        } else {
          token.role = 'customer';
        }

        token.id = token.sub || '';
      }

      console.log('Out here');
      return token;
    },
    async session(session, token) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
});
