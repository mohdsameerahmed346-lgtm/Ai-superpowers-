import { supabase } from '../lib/supabase'

export default function LoginButton() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })

    if (error) {
      console.error('Login error:', error.message)
    }
  }

  return (
    <button
      onClick={handleLogin}
      className="bg-black text-white px-6 py-3 rounded-xl"
    >
      Continue with Google
    </button>
  )
}
