import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { server } from '../../../config';

export default NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		jwt: true,
	},
	callbacks: {
		async jwt({ token, user }) {

			if (user) {
        token.email = user.email;
				var payload = {
					employee_email: user.email
				}

				try {
					const response = await fetch(`${server}/api/admin/get_user_role`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

					if (response.ok) {
						const role = await response.json();

						if (role) {
							token.role = role[0].employee_title;
						} else {
							token.role = 'Customer';
						}

						token.id = user.id;
					} else {
						console.error("Unable to fetch employee role.");
					}
				} catch (error) {
					console.error("Error:", error);
				}
			}

			return token;
		},
		async session({ session, token }) {
			session.user.id = token.id;
			session.user.role = token.role;

			return session;
		},
	},
});
