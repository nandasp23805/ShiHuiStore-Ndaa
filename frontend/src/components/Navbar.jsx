import { Link, NavLink } from "react-router-dom"
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"

const navItems = [
  ["Beranda", "/"],
  ["Produk", "/produk"],
  ["Kategori", "/kategori"],
  ["Tentang Kami", "/tentang"],
  ["Kontak", "/kontak"]
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout, isAdmin } = useAuth()
  const { items } = useCart()

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-ink">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-sm font-black text-gold ring-2 ring-gold/25">SH</span>
          <span className="text-xl font-black tracking-wide">ShihuyStore</span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map(([label, path]) => (
            <NavLink key={path} to={path} className={({ isActive }) => `text-sm font-semibold transition ${isActive ? "text-gold" : "text-charcoal hover:text-gold"}`}>
              {label}
            </NavLink>
          ))}
          {isAdmin && <NavLink to="/admin" className="text-sm font-semibold text-charcoal hover:text-gold">Admin</NavLink>}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/produk" className="rounded-full p-2 text-ink transition hover:bg-cream" aria-label="Cari produk"><Search className="h-5 w-5" /></Link>
          <Link to="/cart" className="relative rounded-full p-2 text-ink transition hover:bg-cream" aria-label="Keranjang">
            <ShoppingBag className="h-5 w-5" />
            {items.length > 0 && <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-ink text-[11px] font-bold text-white">{items.length}</span>}
          </Link>
          {user ? (
            <button onClick={() => logout()} className="hidden rounded-full border border-black/10 px-4 py-2 text-sm font-bold text-ink hover:border-gold lg:block">{user.name}</button>
          ) : (
            <Link to="/auth" className="hidden items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-gold lg:flex"><UserRound className="h-4 w-4" /> Login/Register</Link>
          )}
          <button onClick={() => setOpen(!open)} className="rounded-full p-2 lg:hidden" aria-label="Menu">{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      {open && (
        <div className="border-t border-black/10 bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map(([label, path]) => <Link onClick={() => setOpen(false)} key={path} to={path} className="font-semibold text-ink">{label}</Link>)}
            {isAdmin && <Link onClick={() => setOpen(false)} to="/admin" className="font-semibold text-ink">Admin</Link>}
            {user ? <button onClick={() => logout()} className="text-left font-semibold text-ink">Logout {user.name}</button> : <Link onClick={() => setOpen(false)} to="/auth" className="font-semibold text-ink">Login/Register</Link>}
          </div>
        </div>
      )}
    </header>
  )
}
