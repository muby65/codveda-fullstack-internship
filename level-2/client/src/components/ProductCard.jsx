function ProductCard({ product, onDelete }) {
  return (
    <article className="card">
      <div className="avatar">{product.name.charAt(0)}</div>
      <h2>{product.name}</h2>
      <p className="price">${product.price}</p>
      <button className="delete-btn" onClick={() => onDelete(product.id)}>
        Delete
      </button>
    </article>
  )
}

export default ProductCard
