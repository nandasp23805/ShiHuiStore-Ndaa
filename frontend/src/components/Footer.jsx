export default function Footer() {
  return (
    <footer className="mt-20 bg-ink py-10 text-white">
      <div className="container-page flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gold text-sm font-black text-ink">SH</span>
            <p className="text-lg font-black">ShihuyStore</p>
          </div>
          <p className="mt-2 text-sm text-white/60">Premium outerwear untuk gaya harian yang tajam dan nyaman.</p>
        </div>
        <p className="text-sm text-white/50">© 2026 ShihuyStore. All rights reserved.</p>
      </div>
    </footer>
  )
}
