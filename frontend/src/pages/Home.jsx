import { ArrowRight, Clock, Headphones, ShieldCheck, Star, Truck } from "lucide-react"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import ProductCard from "../components/ProductCard"
import { api } from "../lib/api"
import { fallbackCategories, fallbackProducts } from "../data/fallback"

const services = [
  ["Gratis Ongkir", Truck],
  ["Kualitas Premium", Star],
  ["Garansi Produk", ShieldCheck],
  ["Layanan 24/7", Headphones]
]

export default function Home() {
  const [products, setProducts] = useState(fallbackProducts)
  const [categories, setCategories] = useState(fallbackCategories)

  useEffect(() => {
    api.get("/products").then(({ data }) => setProducts(data)).catch(() => {})
    api.get("/categories").then(({ data }) => setCategories(data)).catch(() => {})
  }, [])

  return (
    <main>
      <section className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-ink text-white">
        <img
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=85"
          alt="Model memakai jaket hitam modern"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black/10" />
        <div className="container-page relative flex min-h-[calc(100vh-80px)] items-center py-16">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-cream backdrop-blur">Premium Jacket Collection 2026</p>
            <h1 className="text-5xl font-black leading-tight md:text-7xl">JAKET KEREN UNTUK GAYA ANDA!</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/78">Koleksi hoodie, denim, bomber, dan parka dengan material premium, potongan modern, dan detail elegan untuk aktivitas harian.</p>
            <Link to="/produk" className="mt-8 inline-flex items-center gap-3 rounded-full bg-gold px-7 py-4 text-sm font-black uppercase tracking-wide text-ink transition hover:bg-cream">
              Beli Sekarang <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page -mt-10 relative z-10 grid gap-4 md:grid-cols-4">
        {services.map(([label, Icon]) => (
          <div key={label} className="rounded-md bg-white p-5 shadow-soft">
            <Icon className="mb-4 h-7 w-7 text-gold" />
            <p className="font-black text-ink">{label}</p>
            <p className="mt-1 text-sm text-neutral-500">Pengalaman belanja nyaman dan terpercaya.</p>
          </div>
        ))}
      </section>

      <section className="container-page py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Kategori</p>
            <h2 className="mt-2 text-3xl font-black text-ink">Pilih Gaya Jaket</h2>
          </div>
          <Link to="/kategori" className="hidden text-sm font-bold text-ink hover:text-gold md:block">Lihat semua</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-4">
          {categories.map((category) => (
            <Link to={`/produk?category=${category.slug}`} key={category.id} className="group relative aspect-[4/5] overflow-hidden rounded-md bg-ink shadow-sm">
              <img src={category.image_url} alt={category.name} className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 p-5 text-white">
                <h3 className="text-xl font-black">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page pb-8">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Produk Terbaik</p>
          <h2 className="mt-2 text-3xl font-black text-ink">Best Seller Minggu Ini</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section id="about" className="container-page py-16">
        <div className="grid gap-8 rounded-md bg-white p-8 shadow-sm md:grid-cols-2 md:p-12">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Tentang Kami</p>
            <h2 className="mt-2 text-3xl font-black text-ink">Marketplace fashion outerwear premium.</h2>
          </div>
          <p className="leading-8 text-neutral-600">ShihuyStore menghadirkan jaket modern yang dirancang untuk tampilan clean, material nyaman, dan daya pakai panjang. Setiap produk dikurasi untuk gaya urban yang profesional.</p>
        </div>
      </section>

      <section id="contact" className="container-page pb-12">
        <div className="rounded-md bg-ink p-8 text-white shadow-soft md:p-12">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Kontak</p>
          <div className="mt-4 grid gap-6 md:grid-cols-3">
            <div>
              <p className="font-black">Email</p>
              <p className="mt-2 text-white/65">hello@shihuystore.test</p>
            </div>
            <div>
              <p className="font-black">WhatsApp</p>
              <p className="mt-2 text-white/65">+62 812 0000 2026</p>
            </div>
            <div>
              <p className="font-black">Studio</p>
              <p className="mt-2 text-white/65">Jakarta, Indonesia</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
