import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  BookOpen,
  Clock3,
  MoreVertical,
  RefreshCw,
  Repeat2,
  UsersRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getBooks } from '@/api/bookApi'
import { getBorrowRequests, getLoans } from '@/api/loanApi'
import { getAllMembers } from '@/api/memberApi'
import { normalizeMemberList } from '@/utils/member'
import LibrarianLayout from './LibrarianLayout'

function formatCount(value) {
  return Number(value || 0).toLocaleString('vi-VN')
}

function formatDate(value) {
  if (!value) return 'Chưa cập nhật'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Chưa cập nhật'

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.response?.data?.detail || fallback
}

function buildInitials(memberName) {
  const words = String(memberName || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (words.length === 0) return 'NA'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return `${words[0][0] || ''}${words[words.length - 1][0] || ''}`.toUpperCase()
}

function StatCard({ stat, loading }) {
  const Icon = stat.icon
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium text-slate-500">{stat.label}</p>
        <span className={`grid h-10 w-10 place-items-center rounded-2xl ${stat.danger ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-900'}`}>
          <Icon size={18} />
        </span>
      </div>
      <div className="mt-4 flex items-end gap-2">
        <strong className={`text-2xl font-semibold ${stat.danger ? 'text-red-700' : 'text-slate-950'}`}>
          {loading ? '...' : stat.value}
        </strong>
        <span className={`mb-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${stat.danger ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
          {loading ? 'Đang tải' : stat.badge}
        </span>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    BORROWED: 'bg-slate-100 text-slate-700',
    OVERDUE: 'bg-red-100 text-red-700',
    RETURNED: 'bg-emerald-100 text-emerald-700',
    LOST: 'bg-amber-100 text-amber-700',
  }

  return (
    <span className={`rounded-full px-3 py-1 text-[10px] font-semibold ${styles[status] || 'bg-slate-100 text-slate-700'}`}>
      {status || 'UNKNOWN'}
    </span>
  )
}

function TrendPanel({ trendItems, loading }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">Operations</p>
      <h2 className="mt-2 font-serif text-[24px] font-semibold tracking-tight text-slate-950">Lượt mượn 7 ngày gần nhất</h2>
      <p className="mt-1.5 text-[13px] text-slate-600">Thống kê dữ liệu thật từ các phiếu mượn gần đây để librarian theo dõi nhịp vận hành.</p>
      <div className="mt-6 grid h-56 grid-cols-7 items-end gap-3 px-2 sm:gap-5 sm:px-6">
        {trendItems.map((item) => (
          <div key={item.label} className="flex h-full flex-col justify-end gap-2">
            <div
              className={`rounded-t-2xl ${loading ? 'animate-pulse bg-slate-200' : 'bg-slate-950'}`}
              style={{ height: `${item.height}%` }}
            />
            <span className="text-center text-[11px] font-semibold text-slate-600">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function RecentActivities({ activities, loading }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">Recent activity</p>
          <h2 className="mt-2 font-serif text-[24px] font-semibold tracking-tight text-slate-950">Hoạt động mượn trả gần đây</h2>
        </div>
        <Link to="/librarian/loans" className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-3 py-2 text-[13px] font-medium text-slate-700">
          Xem tất cả
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left">
          <thead className="bg-slate-50 text-[13px] font-semibold text-slate-500">
            <tr>
              <th className="px-5 py-4">Thành viên</th>
              <th className="px-5 py-4">Tên sách</th>
              <th className="px-5 py-4">Ngày mượn</th>
              <th className="px-5 py-4">Ngày hết hạn</th>
              <th className="px-5 py-4">Trạng thái</th>
              <th className="px-5 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td className="px-5 py-4" colSpan={6}>
                      <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
                    </td>
                  </tr>
                ))
              : activities.map((activity, index) => (
                  <tr key={activity.loanId} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`grid h-8 w-8 place-items-center rounded-full text-[11px] font-semibold ${index % 2 ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                          {activity.initials}
                        </span>
                        <span className="font-semibold text-slate-950">{activity.memberName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{activity.bookTitle}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{formatDate(activity.borrowedAt)}</td>
                    <td className={`px-5 py-4 text-sm ${activity.status === 'OVERDUE' ? 'font-semibold text-red-600' : 'text-slate-600'}`}>
                      {formatDate(activity.dueDate)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={activity.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link to="/librarian/loans" className="inline-flex text-slate-500" aria-label="Mở trang giao dịch">
                        <MoreVertical size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
            {!loading && activities.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-500">Chưa có giao dịch mượn trả nào để hiển thị.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4 text-[13px] text-slate-600">
        <p>Hiển thị {activities.length} giao dịch gần nhất từ backend</p>
        <Link to="/librarian/loans" className="inline-flex h-9 items-center rounded-xl bg-slate-950 px-4 text-white">
          Mở danh sách loan
        </Link>
      </div>
    </section>
  )
}

function LibrarianDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dashboardData, setDashboardData] = useState({
    totalBooks: 0,
    totalMembers: 0,
    borrowedLoans: 0,
    overdueLoans: 0,
    pendingRequests: 0,
    recentActivities: [],
    trendItems: [],
  })

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const [booksResponse, membersResponse, loansResponse, pendingRequestsResponse] = await Promise.all([
        getBooks({ page: 0, size: 1, sort: 'bookId,desc' }),
        getAllMembers(),
        getLoans({ page: 0, size: 200, sort: 'borrowedAt,desc' }),
        getBorrowRequests({ status: 'PENDING', page: 0, size: 1 }),
      ])

      const members = normalizeMemberList(membersResponse.data)
      const loans = loansResponse.data?.content || []
      const totalLoans = loansResponse.data?.totalElements || 0

      const bookMap = new Map()
      const memberMap = new Map()

      members.forEach((member) => {
        memberMap.set(String(member.id), member)
      })

      const recentActivities = loans.slice(0, 5).map((loan) => {
        const member = memberMap.get(String(loan.memberId)) || {}
        const memberName = `${member.firstName || ''} ${member.lastName || ''}`.trim() || member.email || 'Chưa có tên'

        return {
          loanId: loan.loanId,
          memberName,
          initials: buildInitials(memberName),
          bookTitle: bookMap.get(String(loan.bookId))?.title || `Sách #${loan.bookId}`,
          borrowedAt: loan.borrowedAt,
          dueDate: loan.dueDate,
          status: loan.status,
        }
      })

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
      const trendBuckets = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(today)
        date.setDate(today.getDate() - (6 - index))
        return {
          key: date.toISOString().slice(0, 10),
          label: labels[(date.getDay() + 6) % 7],
          count: 0,
        }
      })

      const trendMap = new Map(trendBuckets.map((item) => [item.key, item]))

      loans.forEach((loan) => {
        if (!loan.borrowedAt) return
        const borrowedDate = new Date(loan.borrowedAt)
        if (Number.isNaN(borrowedDate.getTime())) return
        const key = borrowedDate.toISOString().slice(0, 10)
        const bucket = trendMap.get(key)
        if (bucket) bucket.count += 1
      })

      const maxCount = Math.max(...trendBuckets.map((item) => item.count), 1)
      const trendItems = trendBuckets.map((item) => ({
        ...item,
        height: item.count === 0 ? 8 : Math.max(16, Math.round((item.count / maxCount) * 100)),
      }))

      const borrowedLoans = loans.filter((loan) => loan.status === 'BORROWED').length
      const overdueLoans = loans.filter((loan) => loan.status === 'OVERDUE').length

      const booksTotal = booksResponse.data?.totalElements || 0

      if (booksTotal > 0) {
        const allBooksResponse = await getBooks({ page: 0, size: Math.min(booksTotal, 5000), sort: 'bookId,asc' })
        ;(allBooksResponse.data?.content || []).forEach((book) => {
          bookMap.set(String(book.bookId), book)
        })

        recentActivities.forEach((activity) => {
          const matchedTitle = bookMap.get(String(activity.bookTitle.replace('Sách #', '')))?.title
          if (matchedTitle) activity.bookTitle = matchedTitle
        })
      }

      setDashboardData({
        totalBooks: booksTotal,
        totalMembers: members.length,
        borrowedLoans,
        overdueLoans,
        pendingRequests: pendingRequestsResponse.data?.totalElements || 0,
        recentActivities,
        trendItems,
        totalLoans,
      })
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Không tải được dữ liệu thật cho dashboard librarian.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const stats = useMemo(() => [
    {
      label: 'Tong so dau sach',
      label: 'Tổng số đầu sách',
      value: formatCount(dashboardData.totalBooks),
      icon: BookOpen,
      badge: 'Catalog',
    },
    {
      label: 'Đang cho mượn',
      value: formatCount(dashboardData.borrowedLoans),
      icon: Repeat2,
      badge: 'Dữ liệu thật',
    },
    {
      label: 'Quá hạn trả',
      value: formatCount(dashboardData.overdueLoans),
      icon: AlertTriangle,
      badge: `${formatCount(dashboardData.pendingRequests)} chờ duyệt`,
      danger: dashboardData.overdueLoans > 0,
    },
    {
      label: 'Tổng thành viên',
      value: formatCount(dashboardData.totalMembers),
      icon: UsersRound,
      badge: 'Member service',
    },
  ], [dashboardData])

  return (
    <LibrarianLayout
      active="dashboard"
      title="Dashboard"
      description="Tổng quan dữ liệu thật từ hệ thống thư viện để librarian theo dõi sách, thành viên và luồng mượn trả."
      action={
        <div className="flex gap-2">
          <button onClick={loadDashboard} disabled={loading} className="inline-flex h-10 w-fit items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 text-[13px] font-semibold text-slate-700">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Làm mới
          </button>
          <Link to="/librarian/borrow-requests" className="inline-flex h-10 w-fit items-center gap-2 rounded-2xl bg-slate-950 px-4 text-[13px] font-semibold text-white">
            Duyệt yêu cầu mượn
          </Link>
        </div>
      }
    >
      {error && (
        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={loadDashboard} className="w-fit rounded-xl bg-red-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-red-700">
            Thử lại
          </button>
        </div>
      )}

      <section className="grid gap-4 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} loading={loading} />
        ))}
      </section>
      <div className="mt-5 grid gap-5 2xl:grid-cols-[1.05fr_1fr]">
        <TrendPanel trendItems={dashboardData.trendItems.length ? dashboardData.trendItems : Array.from({ length: 7 }, (_, index) => ({ label: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][index], height: 8 }))} loading={loading} />
        <RecentActivities activities={dashboardData.recentActivities} loading={loading} />
      </div>

      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">System snapshot</p>
        <h2 className="mt-2 font-serif text-[24px] font-semibold tracking-tight text-slate-950">Tình trạng nhanh</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-slate-700">
              <BookOpen size={16} />
              <span className="text-[13px] font-semibold">Catalog</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Hiện có {formatCount(dashboardData.totalBooks)} đầu sách đang được quản lý.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <div className="flex items-center gap-2 text-amber-700">
              <Clock3 size={16} />
              <span className="text-[13px] font-semibold">Hàng đợi</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-amber-800">
              Có {formatCount(dashboardData.pendingRequests)} yêu cầu mượn đang chờ librarian xử lý.
            </p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle size={16} />
              <span className="text-[13px] font-semibold">Cần lưu ý</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-red-800">
              Đang có {formatCount(dashboardData.overdueLoans)} phiếu mượn quá hạn trong tập dữ liệu loan vừa tải.
            </p>
          </div>
        </div>
      </section>
    </LibrarianLayout>
  )
}

export default LibrarianDashboard
