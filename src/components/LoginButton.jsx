import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function LoginButton() {
  const [email, setEmail] = useState('')

  const login = async () => {
    if (!email) {
      alert('Enter email')
      return
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
    })

    if (error) {
      alert(error.message)
    } else {
      alert('Check your email for login link')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#0f0c29',
        padding: 20,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 320,
          background: '#1e1b4b',
          padding: 24,
          borderRadius: 16,
        }}
      >
        <h2
          style={{
            color: 'white',
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          AI Superpowers Login
        </h2>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: 12,
            borderRadius: 10,
            border: 'none',
            marginBottom: 16,
          }}
        />

        <button
          onClick={login}
          style={{
            width: '100%',
            padding: 12,
            borderRadius: 10,
            border: 'none',
            background: '#6366f1',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  )
        }
