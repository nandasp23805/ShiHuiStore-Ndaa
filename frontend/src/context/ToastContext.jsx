import { createContext, useContext, useMemo, useState } from "react"
import { CheckCircle2, XCircle } from "lucide-react"

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const showToast = (message, type = "success") => {
    setToast({ message, type })
    window.setTimeout(() => setToast(null), 2800)
  }

  const value = useMemo(() => ({ showToast }), [])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div className="fixed right-4 top-4 z-50 flex items-center gap-3 rounded-md bg-white px-4 py-3 text-sm font-semibold text-ink shadow-soft">
          {toast.type === "success" ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

