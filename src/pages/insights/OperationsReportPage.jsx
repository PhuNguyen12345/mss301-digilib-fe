import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertTriangle, BookOpen, ClipboardList, RefreshCw, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminLayout from '@/components/layout/AdminLayout'
import { getBooks } from '@/api/bookApi'
import { getBorrowRequests, getLoans } from '@/api/loanApi'
import { getAllMembers } from '@/api/memberApi'
import LibrarianLayout from '@/pages/books/librarian/LibrarianLayout'
import { normalizeMemberList } from '@/utils/member'

function formatCount(value) {
  return Number(value || 0).toLocaleString('vi-VN')
}

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

function ReportCard({ title, value, note, icon: Icon, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-800',
    blue: 'bg-sky-50 text-sky-700',
    amber: 'bg-amber-50 text-amber-700',
    rose: 'bg-rose-50 text-rose-700',
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] font-medium text-slate-500">{title}</p>
          <strong className="mt-3 block text-2xl font-semibold tracking-tight text-slate-950">{value}</strong>
        </div>
        <span className={`grid h-11 w-11 place-items-center rounded-2xl ${tones[tone] || tones.slate}`}>
          <Icon size={18} />
        </span>
      </div>
      <p className="mt-2 text-[13px] text-slate-600">{note}</p>
    </div>
  )
}

function Section({ eyebrow, title, children, action }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">{eyebrow}</p>
          <h2 className="mt-2 font-serif text-[24px] font-semibold tracking-tight text-slate-950">{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  )
}

function EmptyState({ message }) {
  return <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">{message}</div>
}

function OperationsReportPage({ mode = 'admin' }) {
  const Layout = mode === 'admin' ? AdminLayout : LibrarianLayout
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [report, setReport] = useState({
    totalBooks: 0,
    totalMembers: 0,
    totalLoans: 0,
    pendingRequests: 0,
    activeLoans: 0,
    overdueLoans: 0,
    returnedLoans: 0,
    recentLoans: [],
  })

  const loadReport = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const [booksResponse, membersResponse, loansResponse, requestsResponse] = await Promise.all([
        getBooks({ page: 0, size: 1, sort: 'bookId,desc' }),
        getAllMembers(),
        getLoans({ page: 0, size: 100, sort: 'borrowedAt,desc' }),
        getBorrowRequests({ status: 'PENDING', page: 0, size: 1 }),
      ])

      const loans = loansResponse.data?.content || []
      const members = normalizeMemberList(membersResponse.data)

      setReport({
        totalBooks: booksResponse.data?.totalElements || 0,
        totalMembers: members.length,
        totalLoans: loansResponse.data?.totalElements || 0,
        pendingRequests: requestsResponse.data?.totalElements || 0,
        activeLoans: loans.filter((loan) => loan.status === 'BORROWED').length,
        overdueLoans: loans.filter((loan) => loan.status === 'OVERDUE').length,
        returnedLoans: loans.filter((loan) => loan.status === 'RETURNED').length,
        recentLoans: loans.slice(0, 6),
      })
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Không tải được dữ liệu báo cáo từ backend.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadReport()
  }, [loadReport])

  const cards = useMemo(() => ([
    {
      title: 'Tổng đầu sách',
      value: formatCount(report.totalBooks),
      note: 'Lấy trực tiếp từ catalog-service',
      icon: BookOpen,
      tone: 'blue',
    },
    {
      title: 'Tổng thành viên',
      value: formatCount(report.totalMembers),
      note: 'Dữ liệu member-service hiện có',
      icon: UsersRound,
      tone: 'slate',
    },
    {
      title: 'Phiếu mượn đang xử lý',
      value: formatCount(report.activeLoans + report.overdueLoans),
      note: `${formatCount(report.overdueLoans)} phiếu đang quá hạn`,
      icon: ClipboardList,
      tone: 'amber',
    },
    {
      title: 'Yêu cầu chờ duyệt',
      value: formatCount(report.pendingRequests),
      note: `${formatCount(report.totalLoans)} phiếu mượn đã ghi nhận`,
      icon: AlertTriangle,
      tone: report.pendingRequests > 0 ? 'rose' : 'slate',
    },
  ]), [report])

  const action = (
    <button
      onClick={loadReport}
      disabled={loading}
      className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-[13px] font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
    >
      <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
      Làm mới báo cáo
    </button>
  )

  const reportLink = mode === 'admin' ? '/admin/reports' : '/librarian/reports'
  const logLink = mode === 'admin' ? '/admin/logs' : '/librarian/logs'

  return (
    <Layout
      active="reports"
      title="Báo cáo"
      description="Tổng hợp số liệu vận hành thực tế từ sách, thành viên, luồng mượn trả và hàng đợi xử lý."
      action={action}
    >
      {error && (
        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={loadReport} className="w-fit rounded-xl bg-red-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-red-700">
            Thử lại
          </button>
        </div>
      )}

      <section className="grid gap-4 xl:grid-cols-4">
        {cards.map((card) => (
          <ReportCard key={card.title} {...card} />
        ))}
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Section eyebrow="Loan status" title="Tỷ trọng phiếu mượn">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { label: 'Đang mượn', value: report.activeLoans, color: 'bg-sky-500' },
                { label: 'Quá hạn', value: report.overdueLoans, color: 'bg-rose-500' },
                { label: 'Đã trả', value: report.returnedLoans, color: 'bg-emerald-500' },
              ].map((item) => {
                const total = Math.max(report.recentLoans.length || report.activeLoans + report.overdueLoans + report.returnedLoans, 1)
                const percent = Math.round((item.value / total) * 100)
                return (
                  <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className={`h-3 w-3 rounded-full ${item.color}`} />
                        <span className="text-[14px] font-medium text-slate-800">{item.label}</span>
                      </div>
                      <div className="text-right">
                        <strong className="block text-lg font-semibold text-slate-950">{formatCount(item.value)}</strong>
                        <span className="text-[12px] font-medium text-slate-500">{percent}% trong tập dữ liệu vừa tải</span>
                      </div>
                    </div>
                    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Section>

        <Section
          eyebrow="Navigation"
          title="Đi tiếp"
          action={<Link to={logLink} className="text-[13px] font-medium text-slate-600 underline-offset-4 hover:text-slate-950 hover:underline">Mở nhật ký</Link>}
        >
          <div className="space-y-3">
            <Link to={reportLink} className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
              Theo dõi số liệu tổng hợp của hệ thống trên cùng một màn hình.
            </Link>
            <Link to={logLink} className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
              Xem nhật ký nghiệp vụ gần đây từ luồng yêu cầu mượn và phiếu mượn.
            </Link>
          </div>
        </Section>
      </div>

      <div className="mt-5">
        <Section eyebrow="Recent loans" title="Phiếu mượn gần đây">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          ) : report.recentLoans.length === 0 ? (
            <EmptyState message="Chưa có phiếu mượn nào để hiển thị." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead className="bg-slate-50 text-[13px] font-semibold text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Phiếu</th>
                    <th className="px-4 py-3">Thành viên</th>
                    <th className="px-4 py-3">Sách</th>
                    <th className="px-4 py-3">Ngày mượn</th>
                    <th className="px-4 py-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {report.recentLoans.map((loan) => (
                    <tr key={loan.loanId} className="hover:bg-slate-50/70">
                      <td className="px-4 py-4 text-[13px] font-semibold text-slate-900">#{loan.loanId}</td>
                      <td className="px-4 py-4 text-[13px] text-slate-700">#{loan.memberId}</td>
                      <td className="px-4 py-4 text-[13px] text-slate-700">#{loan.bookId}</td>
                      <td className="px-4 py-4 text-[13px] text-slate-500">{formatDateTime(loan.borrowedAt)}</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-700">
                          {loan.status || 'UNKNOWN'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      </div>
    </Layout>
  )
}

export default OperationsReportPage
