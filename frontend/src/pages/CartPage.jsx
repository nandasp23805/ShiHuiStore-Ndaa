import { Link } from "react-router-dom"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "../context/CartContext"
import { assetUrl } from "../lib/api"
import { formatPrice } from "../lib/format"

export default function CartPage() {
  const { items, total, updateQuantity, removeItem } = useCart()

  return (
    <main className="container-page py-10">
      <h1 className="text-4xl font-black text-ink">Keranjang Belanja</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.length === 0 && <div className="rounded-md bg-white p-8 text-neutral-600 shadow-sm">Keranjang masih kosong.</div>}
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 rounded-md bg-white p-4 shadow-sm">
              <img src={assetUrl(item.product?.image_url)} alt={item.product?.name} className="h-28 w-24 rounded-md object-cover" />
              <div className="min-w-0 flex-1">
                <h2 className="font-black text-ink">{item.product?.name}</h2>
                <p className="mt-1 font-bold text-gold">{formatPrice(item.product?.price)}</p>
                <div className="mt-4 flex items-center gap-2">
                  <button onClick={() => updateQuantity(item, Math.max(1, item.quantity - 1))} className="rounded-full border p-2"><Minus className="h-4 w-4" /></button>
                  <span className="w-8 text-center font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item, item.quantity + 1)} className="rounded-full border p-2"><Plus className="h-4 w-4" /></button>
                  <button onClick={() => removeItem(item.id)} className="ml-auto rounded-full border p-2 text-red-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <aside className="h-fit rounded-md bg-white p-6 shadow-soft">
          <p className="text-lg font-black text-ink">Ringkasan</p>
          <div className="mt-4 flex justify-between border-t border-black/10 pt-4 font-black">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Link to="/checkout" className="mt-6 block rounded-full bg-ink px-5 py-3 text-center font-black text-white transition hover:bg-gold">Checkout</Link>
        </aside>
      </div>
    </main>
  )
}

