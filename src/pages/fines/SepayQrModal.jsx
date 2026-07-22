import { useEffect, useState } from 'react'
import { AlertTriangle, Loader2, X } from 'lucide-react'
import { createSepayQr, getLatestPaymentStatus } from '@/api/fineApi'

function formatCurrency(amount) {
  if (amount == null) return '—'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

function formatCountdown(expiresAt) {
  if (!expiresAt) return null
  const diffMs = new Date(expiresAt).getTime() - Date.now()
  if (diffMs <= 0) return null
  const minutes = Math.floor(diffMs / 60000)
  const seconds = Math.floor((diffMs % 60000) / 1000)
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function SepayQrModal({ fineId, onClose, onPaid }) {
  const [qr, setQr] = useState(null)
  const [error, setError] = useState('')
  const [expired, setExpired] = useState(false)
  const [countdown, setCountdown] = useState(null)

  useEffect(() => {
    let cancelled = false
    createSepayQr(fineId)
      .then((res) => { if (!cancelled) setQr(res.data) })
      .catch((e) => { if (!cancelled) setError(e?.response?.data?.message || 'Không thể tạo mã QR.') })
    return () => { cancelled = true }
  }, [fineId])

  useEffect(() => {
    if (!qr) return undefined
    const interval = setInterval(async () => {
      try {
        const res = await getLatestPaymentStatus(fineId)
        if (res.data.fineStatus === 'PAID') {
          clearInterval(interval)
          onPaid(res.data)
        } else if (res.data.paymentStatus === 'EXPIRED') {
          clearInterval(interval)
          setExpired(true)
        }
      } catch {
        // transient poll failure — keep trying until expiresAt
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [qr, fineId, onPaid])

  useEffect(() => {
    if (!qr?.expiresAt) return undefined
    const tick = () => {
      const remaining = formatCountdown(qr.expiresAt)
      setCountdown(remaining)
      if (!remaining) setExpired(true)
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [qr])

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">Thanh toán</p>
            <h3 className="mt-2 font-serif text-xl font-semibold tracking-tight text-slate-950">Quét mã QR để nộp phạt</h3>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Đóng">
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
            <AlertTriangle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        {!error && !qr && (
          <div className="mt-8 flex flex-col items-center gap-3 py-6">
            <Loader2 size={24} className="animate-spin text-slate-400" />
            <p className="text-[13px] text-slate-500">Đang tạo mã QR...</p>
          </div>
        )}

        {!error && qr && expired && (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
            Mã QR đã hết hạn. Vui lòng đóng và thử lại.
          </div>
        )}

        {!error && qr && !expired && (
          <div className="mt-5 flex flex-col items-center gap-4">
            <img src={qr.qrUrl} alt="Mã QR thanh toán SePay" className="h-56 w-56 rounded-xl border border-slate-200 object-contain" />
            <div className="w-full space-y-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px]">
              <div className="flex justify-between"><span className="text-slate-500">Số tiền</span><span className="font-semibold text-slate-950">{formatCurrency(qr.amount)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Ngân hàng</span><span className="font-medium text-slate-800">{qr.bank}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Số tài khoản</span><span className="font-medium text-slate-800">{qr.accountNumber}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Chủ tài khoản</span><span className="font-medium text-slate-800">{qr.accountName}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Nội dung CK</span><span className="font-mono font-medium text-slate-800">{qr.transferContent}</span></div>
            </div>
            {countdown && <p className="text-[12px] text-slate-500">Mã QR hết hạn sau <span className="font-semibold text-slate-700">{countdown}</span></p>}
            <p className="flex items-center gap-2 text-[12px] text-slate-400"><Loader2 size={12} className="animate-spin" />Đang chờ xác nhận thanh toán...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SepayQrModal
