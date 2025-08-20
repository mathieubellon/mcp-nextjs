import { prisma } from '@/app/prisma';
import { createClient } from '@/lib/supabase-server';

export async function syncSupabaseUser() {
  const supabase = createClient();
  const { data: { user: supabaseUser } } = await supabase.auth.getUser();
  
  if (!supabaseUser) {
    return null;
  }

  // Check if user exists in our database
  let dbUser = await prisma.user.findUnique({
    where: { id: supabaseUser.id }
  });

  if (!dbUser) {
    // Create user in our database
    dbUser = await prisma.user.create({
      data: {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email || '',
        emailVerified: supabaseUser.email_confirmed_at ? new Date(supabaseUser.email_confirmed_at) : null,
        image: supabaseUser.user_metadata?.avatar_url || null,
      }
    });
  } else {
    // Update user in our database
    dbUser = await prisma.user.update({
      where: { id: supabaseUser.id },
      data: {
        email: supabaseUser.email || dbUser.email,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email || dbUser.name,
        emailVerified: supabaseUser.email_confirmed_at ? new Date(supabaseUser.email_confirmed_at) : dbUser.emailVerified,
        image: supabaseUser.user_metadata?.avatar_url || dbUser.image,
      }
    });
  }

  return dbUser;
}