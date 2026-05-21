import { useEffect, useState } from "react"
import { api } from "../lib/api"
import { fallbackCategories } from "../data/fallback"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { formatPrice } from "../lib/format"

const emptyProduct = { name: "", description: "", price: "", stock: "", rating: "5", category_id: "", image_url: "" }

export default function AdminDashboard() {
  const { isAdmin } = useAuth()
  const { showToast } = useToast()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(fallbackCategories)
  const [product, setProduct] = useState(emptyProduct)
  const [category, setCategory] = useState({ name: "", slug: "", image_url: "" })
  const [image, setImage] = useState(null)

  const load = async () => {
    const [productRes, categoryRes] = await Promise.all([api.get("/products"), api.get("/categories")])
    setProducts(productRes.data)
    setCategories(categoryRes.data)
  }

  useEffect(() => {
    if (isAdmin) load().catch(() => {})
  }, [isAdmin])

  if (!isAdmin) {
    return <main className="container-page py-12"><div className="rounded-md bg-white p-8 shadow-sm">Dashboard admin membutuhkan akun admin.</div></main>
  }

  const saveProduct = async (e) => {
    e.preventDefault()
    if (!product.name || !product.price || !product.category_id) {
      showToast("Nama, harga, dan kategori wajib diisi", "error")
      return
    }
    const formData = new FormData()
    Object.entries(product).forEach(([key, value]) => formData.append(key, value))
    if (image) formData.append("image", image)
    try {
      await api.post("/admin/products", formData, { headers: { "Content-Type": "multipart/form-data" } })
      showToast("Produk berhasil disimpan")
      setProduct(emptyProduct)
      setImage(null)
      await load()
    } catch (error) {
      showToast(error.response?.data?.message || "Gagal menyimpan produk", "error")
    }
  }

  const saveCategory = async (e) => {
    e.preventDefault()
    try {
      await api.post("/admin/categories", category)
      showToast("Kategori berhasil disimpan")
      setCategory({ name: "", slug: "", image_url: "" })
      await load()
    } catch (error) {
      showToast(error.response?.data?.message || "Gagal menyimpan kategori", "error")
    }
  }

  const deleteProduct = async (id) => {
    await api.delete(`/admin/products/${id}`)
    showToast("Produk dihapus")
    await load()
  }

  return (
    <main className="container-page py-10">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Admin</p>
      <h1 className="mt-2 text-4xl font-black text-ink">Dashboard Admin</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <form onSubmit={saveProduct} className="rounded-md bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">Tambah Produk</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input className="rounded-md border px-4 py-3" placeholder="Nama produk" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
            <input className="rounded-md border px-4 py-3" placeholder="Harga" type="number" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} />
            <input className="rounded-md border px-4 py-3" placeholder="Stok" type="number" value={product.stock} onChange={(e) => setProduct({ ...product, stock: e.target.value })} />
            <select className="rounded-md border px-4 py-3" value={product.category_id} onChange={(e) => setProduct({ ...product, category_id: e.target.value })}>
              <option value="">Pilih kategori</option>
              {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            <input className="rounded-md border px-4 py-3 md:col-span-2" placeholder="URL gambar opsional" value={product.image_url} onChange={(e) => setProduct({ ...product, image_url: e.target.value })} />
            <input className="rounded-md border px-4 py-3 md:col-span-2" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            <textarea className="min-h-24 rounded-md border px-4 py-3 md:col-span-2" placeholder="Deskripsi" value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} />
          </div>
          <button className="mt-4 rounded-full bg-ink px-5 py-3 font-black text-white hover:bg-gold">Simpan Produk</button>
        </form>

        <form onSubmit={saveCategory} className="rounded-md bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">Tambah Kategori</h2>
          <input className="mt-4 w-full rounded-md border px-4 py-3" placeholder="Nama kategori" value={category.name} onChange={(e) => setCategory({ ...category, name: e.target.value })} />
          <input className="mt-3 w-full rounded-md border px-4 py-3" placeholder="Slug kategori" value={category.slug} onChange={(e) => setCategory({ ...category, slug: e.target.value })} />
          <input className="mt-3 w-full rounded-md border px-4 py-3" placeholder="URL gambar" value={category.image_url} onChange={(e) => setCategory({ ...category, image_url: e.target.value })} />
          <button className="mt-4 rounded-full bg-ink px-5 py-3 font-black text-white hover:bg-gold">Simpan Kategori</button>
        </form>
      </div>

      <section className="mt-8 rounded-md bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black">Manajemen Produk</h2>
        <div className="mt-4 overflow-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b text-neutral-500">
              <tr><th className="py-3">Produk</th><th>Harga</th><th>Stok</th><th>Kategori</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-3 font-bold">{item.name}</td>
                  <td>{formatPrice(item.price)}</td>
                  <td>{item.stock}</td>
                  <td>{item.category?.name || "-"}</td>
                  <td><button onClick={() => deleteProduct(item.id)} className="rounded-full border border-red-200 px-3 py-1 font-bold text-red-600">Hapus</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

