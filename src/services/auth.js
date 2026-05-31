import { supabase } from '../lib/supabase'

export async function signInWithGoogle() {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
  })
}

export async function signOut() {
  return await supabase.auth.signOut()
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}
