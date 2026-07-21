import { useEffect, useState } from 'react'
import { AlertTriangle, Loader2, X } from 'lucide-react'

function formatCurrency(amount) {
  if (amount == null) return '—'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

function formatDateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date)
}

const ATTEMPT_STATUS_META = {
  CREATED: { label: 'Đã tạo', classes: 'bg-slate-100 text-slate-700' },
  PENDING: { label: 'Đang chờ', classes: 'bg-amber-50 text-amber-700' },
  SUCCEEDED: { label: 'Thành công', classes: 'bg-emerald-50 text-emerald-700' },
  FAILED: { label: 'Thất bại', classes: 'bg-red-50 text-red-700' },
  EXPIRED: { label: 'Hết hạn', classes: 'bg-slate-100 text-slate-500' },
  CANCELLED: { label: 'Đã hủy', classes: 'bg-slate-100 text-slate-500' },
  REFUNDED: { label: 'Đã hoàn tiền', classes: 'bg-violet-50 text-violet-700' },
}

function PaymentHistoryModal({ fineId, fetchPayments, onClose }) {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    // The request owns the loading state whenever fineId changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    setError('')
    fetchPayments(fineId)
      .then((res) => { if (!cancelled) setPayments(Array.isArray(res.data) ? res.data : []) })
      .catch((e) => { if (!cancelled) setError(e?.response?.data?.message || 'Không thể tải lịch sử thanh toán.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [fineId, fetchPayments])

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4">
      <div className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">Biên lai</p>
            <h3 className="mt-2 font-serif text-xl font-semibold tracking-tight text-slate-950">Lịch sử thanh toán #{fineId}</h3>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Đóng">
            <X size={16} />
          </button>
        </div>

        {loading && (
          <div className="mt-8 flex flex-col items-center gap-3 py-6">
            <Loader2 size={22} className="animate-spin text-slate-400" />
          </div>
        )}

        {!loading && error && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
            <AlertTriangle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        {!loading && !error && payments.length === 0 && (
          <p className="mt-8 py-6 text-center text-[13px] text-slate-500">Chưa có lần thanh toán nào cho khoản phạt này.</p>
        )}

        {!loading && !error && payments.length > 0 && (
          <ul className="mt-5 space-y-3">
            {payments.map((payment) => {
              const meta = ATTEMPT_STATUS_META[payment.status] || { label: payment.status, classes: 'bg-slate-100 text-slate-700' }
              return (
                <li key={payment.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[12px] text-slate-500">{payment.paymentCode}</span>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.classes}`}>{meta.label}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[13px]">
                    <span className="text-slate-500">Số tiền</span>
                    <span className="font-semibold text-slate-950">{formatCurrency(payment.amount)}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[12px] text-slate-500">
                    <span>Tạo lúc</span>
                    <span>{formatDateTime(payment.createdAt)}</span>
                  </div>
                  {payment.paidAt && (
                    <div className="mt-1 flex items-center justify-between text-[12px] text-slate-500">
                      <span>Thanh toán lúc</span>
                      <span>{formatDateTime(payment.paidAt)}</span>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default PaymentHistoryModal
