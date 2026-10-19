import { useState } from 'react'

function ProductForm({ onAdd }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [message, setMessage] = useState({ text: '', type: '' })

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), price: Number(price) }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message)
      }

      onAdd(data)
      setName('')
      setPrice('')
      setMessage({ text: 'Product added!', type: 'success' })
    } catch (err) {
      setMessage({ text: err.message, type: 'error' })
    }
  }

  return (
    <section className="form-section">
      <h2>Add a product</h2>
      <form id="product-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          min="0"
          step="any"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
        />
        <button type="submit">Add Product</button>
      </form>
      {message.text && (
        <p id="form-message" className={message.type}>{message.text}</p>
      )}
    </section>
  )
}

export default ProductForm
