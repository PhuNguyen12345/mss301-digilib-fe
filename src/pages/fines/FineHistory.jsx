import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertTriangle, BadgeCheck, Check, Clock3, CreditCard, Receipt, RefreshCw, Wallet } from 'lucide-react'
import { getFinePayments, getMyFines } from '@/api/fineApi'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import useAuthStore from '@/store/authSlice'
import SepayQrModal from './SepayQrModal'
import PaymentHistoryModal from './PaymentHistoryModal'

const FINE_STATUS_META = {
  PENDING: { label: 'Chưa thanh toán', classes: 'bg-red-50 text-red-700 ring-red-600/10' },
  PAID: { label: 'Đã thanh toán', classes: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10' },
  WAIVED: { label: 'Đã miễn', classes: 'bg-slate-100 text-slate-700 ring-slate-500/10' },
}

const REASON_LABELS = {
  OVERDUE_RETURN: 'Trả sách trễ hạn',
  OVERDUE_THRESHOLD: 'Quá hạn mượn',
  LOST_BOOK: 'Làm mất sách',
}

function formatCurrency(amount) {
  if (amount == null) return '—'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
}

function StatusBadge({ status }) {
  const meta = FINE_STATUS_META[status] || { label: status || 'Không rõ', classes: 'bg-slate-100 text-slate-700 ring-slate-500/10' }
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${meta.classes}`}>{meta.label}</span>
}

function SummaryCard({ icon: Icon, label, value, classes }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className={`grid h-10 w-10 place-items-center rounded-2xl ${classes}`}><Icon size={18} /></span>
        <div><p className="text-[12px] font-medium text-slate-500">{label}</p><p className="mt-0.5 text-xl font-semibold text-slate-950">{value}</p></div>
      </div>
    </div>
  )
}

const TABS = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'PENDING', label: 'Chưa thanh toán' },
  { key: 'PAID', label: 'Đã thanh toán' },
  { key: 'WAIVED', label: 'Đã miễn' },
]

function FineHistory() {
  const user = useAuthStore((state) => state.user)
  const [fines, setFines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [payFineId, setPayFineId] = useState(null)
  const [historyFineId, setHistoryFineId] = useState(null)
  const studentId = user?.id

  const loadFines = useCallback(async () => {
    if (!studentId) return
    setLoading(true)
    setError('')
    try {
      const res = await getMyFines(studentId)
      setFines(Array.isArray(res.data?.content) ? res.data.content : [])
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Không thể tải khoản phạt. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }, [studentId])

  useEffect(() => {
    // The request owns the loading state after the member profile becomes available.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFines()
  }, [loadFines])

  useEffect(() => {
    if (!notice) return undefined
    const timer = setTimeout(() => setNotice(''), 3500)
    return () => clearTimeout(timer)
  }, [notice])

  const filteredFines = useMemo(() => {
    if (statusFilter === 'ALL') return fines
    return fines.filter((fine) => fine.status === statusFilter)
  }, [fines, statusFilter])

  const counts = useMemo(() => ({
    pending: fines.filter((f) => f.status === 'PENDING').length,
    paid: fines.filter((f) => f.status === 'PAID').length,
    waived: fines.filter((f) => f.status === 'WAIVED').length,
  }), [fines])

  const totalOwed = useMemo(
    () => fines.filter((f) => f.status === 'PENDING').reduce((sum, f) => sum + (f.amountDue || 0), 0),
    [fines],
  )

  function handlePaid() {
    setPayFineId(null)
    setNotice('Thanh toán thành công. Khoản phạt đã được cập nhật.')
    loadFines()
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fcfbf7,#f8fafc_45%,#eef4fb)] text-slate-950">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-sky-700">Tài khoản thư viện</p>
            <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">Khoản phạt của tôi</h1>
            <p className="mt-2 text-[14px] text-slate-600">Theo dõi các khoản phạt trả sách trễ hạn hoặc mất sách và thanh toán trực tuyến.</p>
          </div>
          <button onClick={loadFines} disabled={loading || !user?.id} className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Làm mới
          </button>
        </div>

        {!user?.id && !loading && <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-[14px] text-amber-800">Hồ sơ của bạn chưa sẵn sàng nên chưa thể tra cứu khoản phạt.</div>}
        {notice && <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-medium text-emerald-700"><Check size={16} />{notice}</div>}
        {error && <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700"><span>{error}</span><button onClick={loadFines} className="shrink-0 font-semibold">Thử lại</button></div>}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard icon={Wallet} label="Tổng phải trả" value={formatCurrency(totalOwed)} classes="bg-red-50 text-red-700" />
          <SummaryCard icon={Clock3} label="Chưa thanh toán" value={counts.pending} classes="bg-amber-50 text-amber-700" />
          <SummaryCard icon={BadgeCheck} label="Đã thanh toán" value={counts.paid} classes="bg-emerald-50 text-emerald-700" />
          <SummaryCard icon={AlertTriangle} label="Đã miễn" value={counts.waived} classes="bg-slate-100 text-slate-700" />
        </section>

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap gap-1.5 border-b border-slate-200 p-3">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition ${
                  statusFilter === tab.key ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-slate-50 text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Tài liệu</th>
                  <th className="px-5 py-4">Lý do</th>
                  <th className="px-5 py-4">Hạn trả</th>
                  <th className="px-5 py-4">Số tiền</th>
                  <th className="px-5 py-4">Trạng thái</th>
                  <th className="px-5 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    {Array.from({ length: 6 }).map((__, cell) => <td key={cell} className="px-5 py-5"><div className="h-4 rounded bg-slate-100" /></td>)}
                  </tr>
                )) : filteredFines.length === 0 ? (
                  <tr><td colSpan="6" className="px-5 py-16 text-center"><Receipt size={26} className="mx-auto text-slate-300" /><p className="mt-3 text-[14px] font-medium text-slate-500">Không có khoản phạt phù hợp.</p></td></tr>
                ) : filteredFines.map((fine) => (
                  <tr key={fine.fineId} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <p className="text-[13px] font-semibold text-slate-950">{fine.bookTitle || `Sách #${fine.bookId ?? '—'}`}</p>
                      <p className="mt-1 text-[11px] text-slate-500">Phạt #{fine.fineId} · Phiếu mượn #{fine.loanId}</p>
                    </td>
                    <td className="px-5 py-4 text-[13px] text-slate-600">{REASON_LABELS[fine.reason] || fine.reason}</td>
                    <td className="px-5 py-4 text-[13px] text-slate-600">{formatDate(fine.dueDate)}</td>
                    <td className="px-5 py-4 text-[13px] font-semibold text-slate-950">{formatCurrency(fine.amountDue)}</td>
                    <td className="px-5 py-4"><StatusBadge status={fine.status} /></td>
                    <td className="px-5 py-4 text-right">
                      {fine.status === 'PENDING' ? (
                        <button onClick={() => setPayFineId(fine.fineId)} className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-slate-950 px-3 text-[12px] font-semibold text-white hover:bg-slate-800">
                          <CreditCard size={14} />Thanh toán ngay
                        </button>
                      ) : (
                        <button onClick={() => setHistoryFineId(fine.fineId)} className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-300 px-3 text-[12px] font-semibold text-slate-700 hover:bg-slate-50">
                          <Receipt size={14} />Xem biên lai
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />

      {payFineId && (
        <SepayQrModal fineId={payFineId} onClose={() => setPayFineId(null)} onPaid={handlePaid} />
      )}
      {historyFineId && (
        <PaymentHistoryModal fineId={historyFineId} fetchPayments={getFinePayments} onClose={() => setHistoryFineId(null)} />
      )}
    </div>
  )
}

export default FineHistory
