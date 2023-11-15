import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import styles from '../../components/login.module.css';

const script = document.createElement('script');
script.src = 'https://apis.google.com/js/platform.js';
script.async = true;
script.defer = true;
document.body.appendChild(script);

document.head.insertAdjacentHTML('beforeend', `<meta name="google-signin-client_id" content="122918420851-fk99jiamqafbov1rd3godvipp6mur69b.apps.googleusercontent.com.apps.googleusercontent.com">`);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn('google', {
      redirect: false,
      email,
      password,
    });
    console.log(result);
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign In with Google</button>
      </form>
    </div>
  );
}
