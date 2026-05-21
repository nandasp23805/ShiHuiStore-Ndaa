import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { api } from "../lib/api"
import { useAuth } from "./AuthContext"
import { useToast } from "./ToastContext"

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const { token } = useAuth()
  const { showToast } = useToast()

  const fetchCart = async () => {
    if (!token) {
      setItems([])
      return
    }
    const { data } = await api.get("/cart")
    setItems(data)
  }

  useEffect(() => {
    fetchCart().catch(() => setItems([]))
  }, [token])

  const addToCart = async (product, quantity = 1) => {
    if (!token) {
      showToast("Silakan login terlebih dahulu", "error")
      return
    }
    await api.post("/cart", { product_id: product.id, quantity })
    showToast("Produk masuk keranjang")
    await fetchCart()
  }

  const updateQuantity = async (item, quantity) => {
    await api.put(`/cart/${item.id}`, { product_id: item.product_id, quantity })
    await fetchCart()
  }

  const removeItem = async (id) => {
    await api.delete(`/cart/${id}`)
    showToast("Item dihapus")
    await fetchCart()
  }

  const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)
  const value = useMemo(() => ({ items, total, addToCart, updateQuantity, removeItem, fetchCart }), [items, total, token])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)

