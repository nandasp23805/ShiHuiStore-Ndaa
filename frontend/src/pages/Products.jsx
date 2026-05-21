import { Search } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { api } from "../lib/api"
import { fallbackCategories, fallbackProducts } from "../data/fallback"

export default function Products() {
  const [params, setParams] = useSearchParams()
  const [products, setProducts] = useState(fallbackProducts)
  const [categories, setCategories] = useState(fallbackCategories)
  const [search, setSearch] = useState(params.get("search") || "")
  const category = params.get("category") || ""

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data)).catch(() => {})
  }, [])

  useEffect(() => {
    api.get("/products", { params: { search, category } }).then(({ data }) => setProducts(data)).catch(() => {
      const next = fallbackProducts.filter((product) => {
        const matchSearch = !search || product.name.toLowerCase().includes(search.toLowerCase())
        const selectedCategory = fallbackCategories.find((item) => item.slug === category)
        const matchCategory = !selectedCategory || product.category_id === selectedCategory.id
        return matchSearch && matchCategory
      })
      setProducts(next)
    })
  }, [search, category])

  const activeName = useMemo(() => categories.find((item) => item.slug === category)?.name || "Semua Produk", [categories, category])

  const chooseCategory = (slug) => {
    const next = {}
    if (slug) next.category = slug
    if (search) next.search = search
    setParams(next)
  }

  return (
    <main className="container-page py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Katalog</p>
          <h1 className="mt-2 text-4xl font-black text-ink">{activeName}</h1>
        </div>
        <label className="flex w-full items-center gap-3 rounded-full bg-white px-4 py-3 shadow-sm ring-1 ring-black/5 md:w-96">
          <Search className="h-5 w-5 text-neutral-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari jaket premium" className="w-full bg-transparent text-sm outline-none" />
        </label>
      </div>
      <div className="mb-8 flex gap-3 overflow-auto pb-2">
        <button onClick={() => chooseCategory("")} className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold ${!category ? "bg-ink text-white" : "bg-white text-ink"}`}>Semua</button>
        {categories.map((item) => (
          <button key={item.id} onClick={() => chooseCategory(item.slug)} className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold ${category === item.slug ? "bg-ink text-white" : "bg-white text-ink"}`}>{item.name}</button>
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </main>
  )
}

