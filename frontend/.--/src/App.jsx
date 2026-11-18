import { useState, useEffect } from 'react'

function App() {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')

  const addProduct = async (e) => {
    e.preventDefault()
    await fetch('http://127.0.0.1:8000/products/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        price: Number(price)
      })
    })
    setName('')
    setPrice('')
    const res = await fetch('http://127.0.0.1:8000/products/')
    const data = await res.json()
    setItems(data)
  }

  useEffect(() => {
    fetch('http://127.0.0.1:8000/products/')
      .then(res => res.json())
      .then(data => {
        setItems(data)
      })
  }, [])

  return (
    <div className="App">
      <h1>BizTrack</h1>
      <form onSubmit={addProduct}>
        <input
          type="text"
          placeholder="Nama Produk"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Harga"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button type="submit">Tambah Produk</button>
      </form>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.name} - RM{item.price}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App 
