'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const Login = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [email, setEmail] = React.useState('');

  const signInWithEmail = async () => {
    await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    router.refresh();
  };

  const handleSignUp = async () => {
    await supabase.auth.signUp({
      email: 'jon@supabase.com',
      password: 'sup3rs3cur3',
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    router.refresh();
  };

  const handleSignIn = async () => {
    await supabase.auth.signInWithPassword({
      email: 'jon@supabase.com',
      password: 'sup3rs3cur3',
    });
    router.refresh();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div>
      <h1>Login</h1>
      <div>
        <input name="email" onChange={(e) => setEmail(e.target.value)} value={email} />
        <button onClick={signInWithEmail}>Sign in with Email</button>
      </div>
    </div>
  );
};
