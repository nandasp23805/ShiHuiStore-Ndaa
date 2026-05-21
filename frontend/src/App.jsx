import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Products from "./pages/Products"
import AuthPage from "./pages/AuthPage"
import CartPage from "./pages/CartPage"
import CheckoutPage from "./pages/CheckoutPage"
import AdminDashboard from "./pages/AdminDashboard"

export default function App() {
  return (
    <div className="min-h-screen bg-mist">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produk" element={<Products />} />
        <Route path="/kategori" element={<Products />} />
        <Route path="/tentang" element={<Home />} />
        <Route path="/kontak" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <Footer />
    </div>
  )
}
