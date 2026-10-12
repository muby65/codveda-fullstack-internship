import { useState, useEffect } from 'react'
import ProductCard from './components/ProductCard'
import ProductForm from './components/ProductForm'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('/products')

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

    loadProducts()
  }, [])

    function handleAdd(newProduct) {
    setProducts([...products, newProduct])
  }

  async function handleDelete(id) {
    try {
      const response = await fetch(`/products/${id}`, { method: 'DELETE' })

      if (!response.ok) {
        throw new Error('Could not delete product')
      }

      setProducts(products.filter(p => p.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <header>
        <h1>Product Store</h1>
        <p>Built with React</p>
      </header>
      <main>
        <ProductForm onAdd={handleAdd} />
        <section id="product-list">
          {loading && <p className="message">Loading products...</p>}
          {error && <p className="message error">{error}</p>}
          {!loading && !error && products.length === 0 && (
            <p className="message">No products yet.</p>
          )}
          {products.map(product => (
            <ProductCard key={product.id} product={product} onDelete={handleDelete} />
          ))}
        </section>
      </main>
    </>
  )
}

export default App
