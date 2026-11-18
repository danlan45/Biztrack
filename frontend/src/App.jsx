
import { useState, useEffect } from 'react'

export default function App() {
  const [summary, setSummary] = useState({
    total_sales: 0,
    total_expenses: 0,
    net_balance: 0,
    total_products: 0
  })

  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])
  const [expenses, setExpenses] = useState([])

  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [productQuantity, setProductQuantity] = useState('')

  const [saleProductId, setSaleProductId] = useState('')
  const [saleQuantitySold, setSaleQuantitySold] = useState('')

  const [expenseDescription, setExpenseDescription] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')

  const loadSummary = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/dashboard/summary')
      const data = await res.json()
      setSummary(data)
    } catch (e) {
      console.log('Error loading summary:', e)
    }
  }

  const loadProducts = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/products/')
      const data = await res.json()
      setProducts(data)
    } catch (e) {
      console.log('Error loading products:', e)
    }
  }

  const loadSales = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/sales/')
      const data = await res.json()
      setSales(data)
    } catch (e) {
      console.log('Error loading sales:', e)
    }
  }

  const loadExpenses = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/expenses/')
      const data = await res.json()
      setExpenses(data)
    } catch (e) {
      console.log('Error loading expenses:', e)
    }
  }

  useEffect(() => {
    loadSummary()
    loadProducts()
    loadSales()
    loadExpenses()
  }, [])

  const addProduct = async () => {
    if (!productName.trim() || !productPrice.trim() || !productQuantity.trim()) {
      alert('Please fill all fields!')
      return
    }
    try {
      const res = await fetch('http://127.0.0.1:8000/products/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productName.trim(),
          price: Number(productPrice),
          quantity: Number(productQuantity)
        })
      })
      if (!res.ok) throw new Error('Failed')
      setProductName('')
      setProductPrice('')
      setProductQuantity('')
      await loadProducts()
      await loadSummary()
    } catch (e) {
      alert('Failed to add product!')
    }
  }

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await fetch(`http://127.0.0.1:8000/products/${id}`, { method: 'DELETE' })
      await loadProducts()
      await loadSummary()
    } catch (e) {
      alert('Failed to delete product!')
    }
  }

  const addSale = async () => {
    if (!saleProductId || !saleQuantitySold.trim()) {
      alert('Please select product and enter quantity!')
      return
    }
    try {
      const res = await fetch('http://127.0.0.1:8000/sales/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: Number(saleProductId),
          quantity_sold: Number(saleQuantitySold)
        })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Failed')
      }
      setSaleProductId('')
      setSaleQuantitySold('')
      await loadSales()
      await loadSummary()
      await loadProducts()
    } catch (e) {
      alert(`Failed: ${e.message}`)
    }
  }

  const deleteSale = async (id) => {
    if (!confirm('Delete this sale?')) return
    try {
      await fetch(`http://127.0.0.1:8000/sales/${id}`, { method: 'DELETE' })
      await loadSales()
      await loadSummary()
      await loadProducts()
    } catch (e) {
      alert('Failed to delete sale!')
    }
  }

  const addExpense = async () => {
    if (!expenseDescription.trim() || !expenseAmount.trim()) {
      alert('Please fill all fields!')
      return
    }
    try {
      const res = await fetch('http://127.0.0.1:8000/expenses/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: expenseDescription.trim(),
          amount: Number(expenseAmount)
        })
      })
      if (!res.ok) throw new Error('Failed')
      setExpenseDescription('')
      setExpenseAmount('')
      await loadExpenses()
      await loadSummary()
    } catch (e) {
      alert('Failed to add expense!')
    }
  }

  const deleteExpense = async (id) => {
    if (!confirm('Delete this expense?')) return
    try {
      await fetch(`http://127.0.0.1:8000/expenses/${id}`, { method: 'DELETE' })
      await loadExpenses()
      await loadSummary()
    } catch (e) {
      alert('Failed to delete expense!')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">BizTrack</h1>
        <p className="text-slate-400">Business Management System</p>
      </div>

      <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
      <p className="text-slate-300 mb-6">Welcome back! Here's your business overview.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white text-slate-900 p-5 rounded-xl shadow">
          <p className="text-slate-500 text-sm">Total Sales</p>
          <p className="text-3xl font-bold text-green-600">RM {summary.total_sales}</p>
        </div>
        <div className="bg-white text-slate-900 p-5 rounded-xl shadow">
          <p className="text-slate-500 text-sm">Total Expenses</p>
          <p className="text-3xl font-bold text-red-600">RM {summary.total_expenses}</p>
        </div>
        <div className="bg-white text-slate-900 p-5 rounded-xl shadow">
          <p className="text-slate-500 text-sm">Net Balance</p>
          <p className={`text-3xl font-bold ${summary.net_balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            RM {summary.net_balance}
          </p>
        </div>
        <div className="bg-white text-slate-900 p-5 rounded-xl shadow">
          <p className="text-slate-500 text-sm">Total Products</p>
          <p className="text-3xl font-bold text-blue-600">{summary.total_products}</p>
        </div>
      </div>

      <div className="bg-white text-slate-900 p-5 rounded-xl mb-6">
        <h3 className="text-xl font-bold mb-4">Add New Product</h3>
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={productQuantity}
          onChange={(e) => setProductQuantity(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />
        <button
          onClick={addProduct}
          className="bg-blue-600 text-white p-2 rounded w-full font-semibold"
        >
          Add Product
        </button>
      </div>

      <div className="bg-white text-slate-900 p-5 rounded-xl mb-6">
        <h3 className="text-xl font-bold mb-4">Product List</h3>
        {products.length === 0 ? (
          <p className="text-slate-500">No products yet.</p>
        ) : (
          products.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b py-3">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-slate-500">RM {item.price} — Qty: {item.quantity}</p>
              </div>
              <button
                onClick={() => deleteProduct(item.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <div className="bg-white text-slate-900 p-5 rounded-xl mb-6">
        <h3 className="text-xl font-bold mb-4">Record Sale</h3>
        <select
          value={saleProductId}
          onChange={(e) => setSaleProductId(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — RM {p.price}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Quantity Sold"
          value={saleQuantitySold}
          onChange={(e) => setSaleQuantitySold(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />
        <button
          onClick={addSale}
          className="bg-green-600 text-white p-2 rounded w-full font-semibold"
        >
          Record Sale
        </button>
      </div>

      <div className="bg-white text-slate-900 p-5 rounded-xl mb-6">
        <h3 className="text-xl font-bold mb-4">Sales List</h3>
        {sales.length === 0 ? (
          <p className="text-slate-500">No sales yet.</p>
        ) : (
          sales.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b py-3">
              <div>
                <p className="font-semibold">Product ID: {item.product_id}</p>
                <p className="text-sm text-slate-500">Qty Sold: {item.quantity_sold} — Amount: RM {item.amount}</p>
              </div>
              <button
                onClick={() => deleteSale(item.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <div className="bg-white text-slate-900 p-5 rounded-xl mb-6">
        <h3 className="text-xl font-bold mb-4">Record Expense</h3>
        <input
          type="text"
          placeholder="Expense Description"
          value={expenseDescription}
          onChange={(e) => setExpenseDescription(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />
        <button
          onClick={addExpense}
          className="bg-orange-600 text-white p-2 rounded w-full font-semibold"
        >
          Record Expense
        </button>
      </div>

      <div className="bg-white text-slate-900 p-5 rounded-xl mb-6">
        <h3 className="text-xl font-bold mb-4">Expense List</h3>
        {expenses.length === 0 ? (
          <p className="text-slate-500">No expenses yet.</p>
        ) : (
          expenses.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b py-3">
              <div>
                <p className="font-semibold">{item.description}</p>
                <p className="text-sm text-slate-500">RM {item.amount}</p>
              </div>
              <button
                onClick={() => deleteExpense(item.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
