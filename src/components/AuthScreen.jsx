import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const signUp = async () => {
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      alert(error.message)
    } else {
      alert('Account created successfully')
    }
  }

  const login = async () => {
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      alert(error.message)
    } else {
      alert('Login successful')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1 className="logo">
          ⚡ AI Superpowers
        </h1>

        <p className="subtitle">
          Learn powerful AI skills daily
        </p>

        <input
          className="auth-input"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="auth-btn"
          onClick={login}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Login'}
        </button>

        <button
          className="auth-btn secondary"
          onClick={signUp}
          disabled={loading}
        >
          Create Account
        </button>

      </div>
    </div>
  )
    }
