import { createClient } from '@/lib/supabase-server';
import { syncSupabaseUser } from '@/lib/sync-user';
import { redirect } from 'next/navigation';

export async function auth() {
  const supabase = createClient();
  const { data: { user: supabaseUser } } = await supabase.auth.getUser();
  
  if (!supabaseUser) {
    return null;
  }

  // Sync user with our database
  const dbUser = await syncSupabaseUser();
  
  return { user: dbUser };
}

export async function signIn(provider: string = 'github') {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as any,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error('Error signing in:', error);
    return;
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/');
}
