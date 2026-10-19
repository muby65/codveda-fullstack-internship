import { useState, useEffect } from 'react'
import ProductCard from './components/ProductCard'
import ProductForm from './components/ProductForm'
import AuthForm from './components/AuthForm'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('/api/products')

        if (!response.ok) {
          throw new Error('Failed to load products')
        }

        const data = await response.json()
        setProducts(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    async function checkSession() {
      try {
        const response = await fetch('/api/auth/me')

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch {
        // server unreachable: stay logged out
      }
    }

    loadProducts()
    checkSession()
  }, [])

  function handleAdd(newProduct) {
    setProducts([...products, newProduct])
  }

  async function handleDelete(id) {
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' })

      if (!response.ok) {
        throw new Error('Could not delete product')
      }

      setProducts(products.filter(p => p.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }

  return (
    <>
      <header>
        <h1>Product Store</h1>
        <p>Built with React</p>
      </header>
      <main>
        {user ? (
          <>
            <div className="user-bar">
              <p>
                Logged in as <strong>{user.name}</strong> ({user.role})
              </p>
              <button className="logout-btn" onClick={handleLogout}>
                Log out
              </button>
            </div>
            <ProductForm onAdd={handleAdd} />
          </>
        ) : (
          <AuthForm onAuth={setUser} />
        )}
        <section id="product-list">
          {loading && <p className="message">Loading products...</p>}
          {error && <p className="message error">{error}</p>}
          {!loading && !error && products.length === 0 && (
            <p className="message">No products yet.</p>
          )}
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={user?.role === 'admin' ? handleDelete : null}
            />
          ))}
        </section>
      </main>
    </>
  )
}

export default App
