
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function App() {
  // ========== PRODUCT ==========
  const [products, setProducts] = useState([])
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    quantity: ''
  })
  const [editProductId, setEditProductId] = useState(null)
  const [editProductData, setEditProductData] = useState({
    name: '',
    price: '',
    quantity: ''
  })

  const fetchProducts = async () => {
    const res = await fetch('http://127.0.0.1:8000/products/')
    const data = await res.json()
    setProducts(data)
  }

  const addProduct = async (e) => {
    e.preventDefault()
    await fetch('http://127.0.0.1:8000/products/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    })
    fetchProducts()
    setNewProduct({ name: '', price: '', quantity: '' })
  }

  const startEditProduct = (prod) => {
    setEditProductId(prod.id)
    setEditProductData({
      name: prod.name,
      price: prod.price,
      quantity: prod.quantity
    })
  }

  const saveEditProduct = async (e) => {
    e.preventDefault()
    await fetch(`http://127.0.0.1:8000/products/${editProductId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editProductData)
    })
    fetchProducts()
    setEditProductId(null)
  }

  const removeProduct = async (id) => {
    await fetch(`http://127.0.0.1:8000/products/${id}`, {
      method: 'DELETE'
    })
    fetchProducts()
  }

  // ========== SALE ==========
  const [sales, setSales] = useState([])
  const [newSale, setNewSale] = useState({
    product_id: '',
    quantity_sold: ''
  })
  const [editSaleId, setEditSaleId] = useState(null)
  const [editSaleData, setEditSaleData] = useState({
    product_id: '',
    quantity_sold: ''
  })

  const fetchSales = async () => {
    const res = await fetch('http://127.0.0.1:8000/sales/')
    const data = await res.json()
    setSales(data)
  }

  const addSale = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://127.0.0.1:8000/sales/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: Number(newSale.product_id),
          quantity_sold: Number(newSale.quantity_sold)
        })
      })
      if (!res.ok) {
        const errData = await res.json()
        console.error('Server error:', errData)
        alert('Ralat simpan jualan! Semak konsol.')
        return
      }
      await res.json()
      fetchSales()
      setNewSale({ product_id: '', quantity_sold: '' })
    } catch (err) {
      console.error('Fetch error:', err)
      alert('Fetch gagal! Semak konsol.')
    }
  }

  const startEditSale = (sale) => {
    setEditSaleId(sale.id)
    setEditSaleData({
      product_id: String(sale.product_id),
      quantity_sold: String(sale.quantity_sold)
    })
  }

  const saveEditSale = async (e) => {
    e.preventDefault()
    await fetch(`http://127.0.0.1:8000/sales/${editSaleId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: Number(editSaleData.product_id),
        quantity_sold: Number(editSaleData.quantity_sold)
      })
    })
    fetchSales()
    setEditSaleId(null)
  }

  const removeSale = async (id) => {
    await fetch(`http://127.0.0.1:8000/sales/${id}`, {
      method: 'DELETE'
    })
    fetchSales()
  }

  // ========== EXPENSE ==========
  const [expenses, setExpenses] = useState([])
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: ''
  })
  const [editExpenseId, setEditExpenseId] = useState(null)
  const [editExpenseData, setEditExpenseData] = useState({
    description: '',
    amount: '',
    category: ''
  })

  const fetchExpenses = async () => {
    const res = await fetch('http://127.0.0.1:8000/expenses/')
    const data = await res.json()
    setExpenses(data)
  }

  const addExpense = async (e) => {
    e.preventDefault()
    await fetch('http://127.0.0.1:8000/expenses/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newExpense)
    })
    fetchExpenses()
    setNewExpense({ description: '', amount: '', category: '' })
  }

  const startEditExpense = (exp) => {
    setEditExpenseId(exp.id)
    setEditExpenseData({
      description: exp.description,
      amount: exp.amount,
      category: exp.category
    })
  }

  const saveEditExpense = async (e) => {
    e.preventDefault()
    await fetch(`http://127.0.0.1:8000/expenses/${editExpenseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editExpenseData)
    })
    fetchExpenses()
    setEditExpenseId(null)
  }

  const removeExpense = async (id) => {
    await fetch(`http://127.0.0.1:8000/expenses/${id}`, {
      method: 'DELETE'
    })
    fetchExpenses()
  }

  // ========== LOAD DATA ==========
  useEffect(() => {
    fetchProducts()
    fetchSales()
    fetchExpenses()
  }, [])

  // ========== CALCULATION & CHART ==========
  const totalProducts = products.length
  const totalSales = sales.length

  const totalRevenue = sales.reduce((sum, sale) => {
    const product = products.find(p => p.id === sale.product_id)
    if (product) {
      return sum + (product.price * sale.quantity_sold)
    }
    return sum
  }, 0)

  const totalExpense = expenses.reduce((sum, exp) => {
    return sum + Number(exp.amount)
  }, 0)

  const netProfit = totalRevenue - totalExpense

  const chartData = [
    { name: 'Revenue', value: totalRevenue, fill: '#22c55e' },
    { name: 'Expense', value: totalExpense, fill: '#ef4444' }
  ]

  // ========== RENDER ==========
  return (
    <div>
      <h1>BizTrack</h1>
      <h2>Business Management System</h2>

      <h3>Total Products: {totalProducts}</h3>
      <h3>Total Sales: {totalSales}</h3>
      <h3>Total Revenue: RM {totalRevenue}</h3>
      <h3>Total Expense: RM {totalExpense}</h3>
      <h3>Net Profit: RM {netProfit}</h3>

      <h2>Revenue vs Expense Chart</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>

      <h2>Add New Product</h2>
      <form onSubmit={addProduct}>
        <input
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <input
          placeholder="Quantity"
          value={newProduct.quantity}
          onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
        />
        <button type="submit">Add Product</button>
      </form>

      <h2>Product List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              {editProductId === p.id ? (
                <>
                  <td>
                    <input
                      value={editProductData.name}
                      onChange={(e) => setEditProductData({...editProductData, name: e.target.value})}
                    />
                  </td>
                  <td>
                    <input
                      value={editProductData.price}
                      onChange={(e) => setEditProductData({...editProductData, price: e.target.value})}
                    />
                  </td>
                  <td>
                    <input
                      value={editProductData.quantity}
                      onChange={(e) => setEditProductData({...editProductData, quantity: e.target.value})}
                    />
                  </td>
                  <td>
                    <button onClick={saveEditProduct}>Save</button>
                    <button onClick={() => setEditProductId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{p.name}</td>
                  <td>{p.price}</td>
                  <td>{p.quantity}</td>
                  <td>
                    <button onClick={() => startEditProduct(p)}>Edit</button>
                    <button onClick={() => removeProduct(p.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Record Sale</h2>
      <form onSubmit={addSale}>
        <select
          value={newSale.product_id}
          onChange={(e) => setNewSale({ ...newSale, product_id: e.target.value })}
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          placeholder="Quantity Sold"
          value={newSale.quantity_sold}
          onChange={(e) => setNewSale({ ...newSale, quantity_sold: e.target.value })}
        />
        <button type="submit">Record Sale</button>
      </form>

      <h2>Sales List</h2>
      <table>
        <thead>
          <tr>
            <th>Sale ID</th>
            <th>Product ID</th>
            <th>Quantity Sold</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((s) => (
            <tr key={s.id}>
              {editSaleId === s.id ? (
                <>
                  <td>{s.id}</td>
                  <td>
                    <select
                      value={editSaleData.product_id}
                      onChange={(e) => setEditSaleData({...editSaleData, product_id: e.target.value})}
                    >
                      <option value="">Select Product</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      value={editSaleData.quantity_sold}
                      onChange={(e) => setEditSaleData({...editSaleData, quantity_sold: e.target.value})}
                    />
                  </td>
                  <td>
                    <button onClick={saveEditSale}>Save</button>
                    <button onClick={() => setEditSaleId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{s.id}</td>
                  <td>{s.product_id}</td>
                  <td>{s.quantity_sold}</td>
                  <td>
                    <button onClick={() => startEditSale(s)}>Edit</button>
                    <button onClick={() => removeSale(s.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add New Expense</h2>
      <form onSubmit={addExpense}>
        <input
          placeholder="Description"
          value={newExpense.description}
          onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
        />
        <input
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
        />
        <input
          placeholder="Category"
          value={newExpense.category}
          onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
        />
        <button type="submit">Add Expense</button>
      </form>

      <h2>Expense List</h2>
      <table>
        <thead>
          <tr>
            <th>Expense ID</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id}>
              {editExpenseId === exp.id ? (
                <>
                  <td>{exp.id}</td>
                  <td>
                    <input
                      value={editExpenseData.description}
                      onChange={(e) => setEditExpenseData({...editExpenseData, description: e.target.value})}
                    />
                  </td>
                  <td>
                    <input
                      value={editExpenseData.amount}
                      onChange={(e) => setEditExpenseData({...editExpenseData, amount: e.target.value})}
                    />
                  </td>
                  <td>
                    <input
                      value={editExpenseData.category}
                      onChange={(e) => setEditExpenseData({...editExpenseData, category: e.target.value})}
                    />
                  </td>
                  <td>
                    <button onClick={saveEditExpense}>Save</button>
                    <button onClick={() => setEditExpenseId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{exp.id}</td>
                  <td>{exp.description}</td>
                  <td>{exp.amount}</td>
                  <td>{exp.category}</td>
                  <td>
                    <button onClick={() => startEditExpense(exp)}>Edit</button>
                    <button onClick={() => removeExpense(exp.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
