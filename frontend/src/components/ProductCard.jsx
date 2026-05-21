import { Star, ShoppingBag } from "lucide-react"
import { assetUrl } from "../lib/api"
import { formatPrice } from "../lib/format"
import { useCart } from "../context/CartContext"

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  return (
    <article className="group overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="aspect-[4/5] overflow-hidden bg-neutral-200">
        <img src={assetUrl(product.image_url)} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-center gap-1 text-sm font-bold text-gold">
          <Star className="h-4 w-4 fill-current" /> {product.rating || 5}
        </div>
        <h3 className="text-lg font-black text-ink">{product.name}</h3>
        <p className="mt-2 min-h-10 text-sm leading-5 text-neutral-600 line-clamp-2">{product.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="font-black text-ink">{formatPrice(product.price)}</span>
          <button onClick={() => addToCart(product)} className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-gold">
            <ShoppingBag className="h-4 w-4" /> Tambah
          </button>
        </div>
      </div>
    </article>
  )
}

