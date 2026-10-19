import { useState } from 'react'

function AuthForm({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const body = mode === 'login' ? { email, password } : { name, email, password }

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message)
      }

      onAuth(data.user)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="form-section">
      <h2>{mode === 'login' ? 'Log in' : 'Create an account'}</h2>
      <form id="product-form" onSubmit={handleSubmit}>
        {mode === 'signup' && (
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (8+ characters)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">{mode === 'login' ? 'Log in' : 'Sign up'}</button>
      </form>
      {error && <p id="form-message" className="error">{error}</p>}
      <button
        className="link-btn"
        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
      >
        {mode === 'login' ? 'No account? Sign up' : 'Have an account? Log in'}
      </button>
    </section>
  )
}

export default AuthForm
