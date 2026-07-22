import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ClipboardList, History, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminLayout from '@/components/layout/AdminLayout'
import { getBorrowRequests, getLoans } from '@/api/loanApi'
import LibrarianLayout from '@/pages/books/librarian/LibrarianLayout'

function formatDateTime(value) {
  if (!value) return 'Chưa cập nhật'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Chưa cập nhật'

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.response?.data?.detail || fallback
}

function pickRequestTimestamp(request) {
  return request?.updatedAt || request?.processedAt || request?.requestedAt || request?.createdAt || request?.requestDate || null
}

function ActivityLogPage({ mode = 'admin' }) {
  const Layout = mode === 'admin' ? AdminLayout : LibrarianLayout
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [entries, setEntries] = useState([])

  const loadEntries = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const statuses = ['PENDING', 'BORROWED', 'OVERDUE', 'RETURNED', 'REJECTED', 'CANCELLED']
      const requestResponses = await Promise.all(
        statuses.map((status) => getBorrowRequests({ status, page: 0, size: 20 })),
      )
      const loansResponse = await getLoans({ page: 0, size: 50, sort: 'borrowedAt,desc' })

      const requestEntries = requestResponses
        .flatMap((response) => response.data?.content || [])
        .map((request) => ({
          id: `request-${request.requestId}`,
          timestamp: pickRequestTimestamp(request),
          type: 'Yêu cầu mượn',
          title: `Yêu cầu #${request.requestId}`,
          description: `Thành viên #${request.memberId} gửi hoặc cập nhật yêu cầu cho sách #${request.bookId}.`,
          status: request.status || 'UNKNOWN',
        }))

      const loanEntries = (loansResponse.data?.content || []).map((loan) => ({
        id: `loan-${loan.loanId}`,
        timestamp: loan.returnedAt || loan.borrowedAt || loan.dueDate,
        type: 'Phiếu mượn',
        title: `Phiếu #${loan.loanId}`,
        description: `Thành viên #${loan.memberId} với sách #${loan.bookId}${loan.copyId ? `, bản sao #${loan.copyId}` : ''}.`,
        status: loan.status || 'UNKNOWN',
      }))

      setEntries(
        [...requestEntries, ...loanEntries]
          .sort((left, right) => new Date(right.timestamp || 0).getTime() - new Date(left.timestamp || 0).getTime())
          .slice(0, 40),
      )
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Không tải được nhật ký nghiệp vụ từ backend.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEntries()
  }, [loadEntries])

  const grouped = useMemo(() => {
    return entries.reduce((accumulator, entry) => {
      const key = entry.timestamp ? new Date(entry.timestamp).toISOString().slice(0, 10) : 'unknown'
      if (!accumulator[key]) accumulator[key] = []
      accumulator[key].push(entry)
      return accumulator
    }, {})
  }, [entries])

  const reportLink = mode === 'admin' ? '/admin/reports' : '/librarian/reports'

  return (
    <Layout
      active="logs"
      title="Nhật ký"
      description="Theo dõi nhật ký nghiệp vụ gần đây từ yêu cầu mượn và phiếu mượn. Hiện tại màn này dùng dữ liệu hoạt động thực tế thay cho audit log chuyên biệt."
      action={
        <button
          onClick={loadEntries}
          disabled={loading}
          className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-[13px] font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Làm mới nhật ký
        </button>
      }
    >
      {error && (
        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={loadEntries} className="w-fit rounded-xl bg-red-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-red-700">
            Thử lại
          </button>
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">Activity stream</p>
            <h2 className="mt-2 font-serif text-[24px] font-semibold tracking-tight text-slate-950">Dòng sự kiện gần đây</h2>
          </div>
          <Link to={reportLink} className="text-[13px] font-medium text-slate-600 underline-offset-4 hover:text-slate-950 hover:underline">
            Mở báo cáo
          </Link>
        </div>

        {loading ? (
          <div className="mt-6 space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
            Chưa có mục nhật ký nào để hiển thị.
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {Object.entries(grouped).map(([dateKey, items]) => (
              <div key={dateKey}>
                <div className="mb-3 flex items-center gap-2">
                  <History size={16} className="text-slate-500" />
                  <p className="text-sm font-semibold text-slate-800">{dateKey === 'unknown' ? 'Không rõ thời gian' : formatDateTime(dateKey)}</p>
                </div>
                <div className="space-y-3">
                  {items.map((entry) => (
                    <article key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <ClipboardList size={15} />
                            <span>{entry.title}</span>
                          </div>
                          <p className="mt-1 text-[13px] text-slate-500">{entry.type}</p>
                          <p className="mt-2 text-[13px] leading-6 text-slate-700">{entry.description}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="inline-flex rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-700 ring-1 ring-slate-200">
                            {entry.status}
                          </span>
                          <p className="mt-2 text-[12px] text-slate-500">{formatDateTime(entry.timestamp)}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  )
}

export default ActivityLogPage
