import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Clock3,
  Database,
  FileDigit,
  FileText,
  RefreshCw,
  UserCheck,
  UsersRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getBooks, getDigitalResources } from '@/api/bookApi'
import { getBorrowRequests, getLoans } from '@/api/loanApi'
import { getAllMembers } from '@/api/memberApi'
import AdminLayout from '@/components/layout/AdminLayout'
import { createMemberNameMap, normalizeMemberList } from '@/utils/member'

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

function MetricCard({ title, value, note, icon: Icon, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-800',
    blue: 'bg-sky-50 text-sky-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
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

function SectionCard({ eyebrow, title, action, children }) {
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
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
      {message}
    </div>
  )
}

function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dashboardData, setDashboardData] = useState({
    totalBooks: 0,
    totalResources: 0,
    totalMembers: 0,
    pendingRequests: 0,
    activeMembers: 0,
    lockedMembers: 0,
    softLockedMembers: 0,
    recentLoans: [],
    recentResources: [],
    totalLoans: 0,
  })

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const [booksResponse, resourcesResponse, membersResponse, loansResponse, pendingRequestsResponse] = await Promise.all([
        getBooks({ page: 0, size: 1, sort: 'bookId,desc' }),
        getDigitalResources({ page: 0, size: 5, sort: 'resourceId,desc' }),
        getAllMembers(),
        getLoans({ page: 0, size: 5, sort: 'borrowedAt,desc' }),
        getBorrowRequests({ status: 'PENDING', page: 0, size: 1 }),
      ])

      const members = normalizeMemberList(membersResponse.data)
      const memberNames = createMemberNameMap(membersResponse.data)
      const resourcesPage = resourcesResponse.data || {}
      const loansPage = loansResponse.data || {}

      const activeMembers = members.filter((member) => member.status === 'UNLOCKED').length
      const softLockedMembers = members.filter((member) => member.status === 'SOFT_LOCKED').length
      const lockedMembers = members.filter((member) => member.status === 'LOCKED').length

      setDashboardData({
        totalBooks: booksResponse.data?.totalElements || 0,
        totalResources: resourcesPage.totalElements || 0,
        totalMembers: members.length,
        pendingRequests: pendingRequestsResponse.data?.totalElements || 0,
        activeMembers,
        softLockedMembers,
        lockedMembers,
        recentLoans: (loansPage.content || []).map((loan) => ({
          ...loan,
          memberName: memberNames.get(String(loan.memberId)) || 'Chưa có tên',
        })),
        recentResources: resourcesPage.content || [],
        totalLoans: loansPage.totalElements || 0,
      })
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Không tải được dữ liệu dashboard admin từ backend.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const metrics = useMemo(() => ([
    {
      title: 'Tổng đầu sách',
      value: formatCount(dashboardData.totalBooks),
      note: 'Lấy trực tiếp từ catalog-service',
      icon: FileText,
      tone: 'blue',
    },
    {
      title: 'Tài liệu số',
      value: formatCount(dashboardData.totalResources),
      note: 'Tổng bản ghi digital resource',
      icon: FileDigit,
      tone: 'emerald',
    },
    {
      title: 'Thành viên',
      value: formatCount(dashboardData.totalMembers),
      note: `${formatCount(dashboardData.activeMembers)} tài khoản đang hoạt động`,
      icon: UsersRound,
      tone: 'slate',
    },
    {
      title: 'Yêu cầu chờ duyệt',
      value: formatCount(dashboardData.pendingRequests),
      note: `${formatCount(dashboardData.totalLoans)} phiếu mượn đã ghi nhận`,
      icon: Clock3,
      tone: 'amber',
    },
  ]), [dashboardData])

  const memberStatusItems = useMemo(() => {
    const total = Math.max(dashboardData.totalMembers, 1)

    return [
      {
        label: 'Đang hoạt động',
        value: dashboardData.activeMembers,
        color: 'bg-emerald-500',
        text: 'text-emerald-700',
      },
      {
        label: 'Tạm khóa',
        value: dashboardData.softLockedMembers,
        color: 'bg-amber-500',
        text: 'text-amber-700',
      },
      {
        label: 'Đã khóa',
        value: dashboardData.lockedMembers,
        color: 'bg-rose-500',
        text: 'text-rose-700',
      },
    ].map((item) => ({
      ...item,
      percent: Math.round((item.value / total) * 100),
    }))
  }, [dashboardData])

  const action = (
    <button
      onClick={loadDashboard}
      disabled={loading}
      className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-[13px] font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
    >
      <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
      Làm mới dữ liệu
    </button>
  )

  return (
    <AdminLayout
      active="dashboard"
      title="Dashboard"
      description="Tổng quan dữ liệu thật từ hệ thống quản trị thư viện để bạn theo dõi nhanh sách, tài nguyên số, thành viên và luồng mượn trả."
      action={action}
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
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </section>

      <div className="mt-5 grid gap-5 2xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard
          eyebrow="Member overview"
          title="Trạng thái thành viên"
          action={
            <Link to="/admin/members" className="text-[13px] font-medium text-slate-600 underline-offset-4 hover:text-slate-950 hover:underline">
              Mở quản lý thành viên
            </Link>
          }
        >
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse rounded-2xl border border-slate-100 p-4">
                  <div className="h-4 w-40 rounded bg-slate-100" />
                  <div className="mt-3 h-3 rounded-full bg-slate-100" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {memberStatusItems.map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`h-3 w-3 rounded-full ${item.color}`} />
                      <span className="text-[14px] font-medium text-slate-800">{item.label}</span>
                    </div>
                    <div className="text-right">
                      <strong className="block text-lg font-semibold text-slate-950">{formatCount(item.value)}</strong>
                      <span className={`text-[12px] font-medium ${item.text}`}>{item.percent}% tổng thành viên</span>
                    </div>
                  </div>
                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <UserCheck size={16} />
                  <span className="text-[13px] font-medium">Tỷ lệ hoạt động</span>
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {dashboardData.totalMembers ? `${Math.round((dashboardData.activeMembers / dashboardData.totalMembers) * 100)}%` : '0%'}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <Database size={16} />
                  <span className="text-[13px] font-medium">Nguồn dữ liệu</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">Dashboard đang dùng dữ liệu thật từ các API frontend hiện có, không còn số liệu mẫu.</p>
              </div>
            </div>
          )}
        </SectionCard>

        <SectionCard
          eyebrow="Recent loan activity"
          title="Phiếu mượn gần đây"
          action={
            <Link to="/admin/borrow-requests" className="text-[13px] font-medium text-slate-600 underline-offset-4 hover:text-slate-950 hover:underline">
              Mở yêu cầu mượn
            </Link>
          }
        >
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          ) : dashboardData.recentLoans.length === 0 ? (
            <EmptyState message="Chưa có phiếu mượn nào để hiển thị." />
          ) : (
            <div className="space-y-3">
              {dashboardData.recentLoans.map((loan) => (
                <div key={loan.loanId} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <BookOpen size={15} />
                      <span>Phiếu #{loan.loanId}</span>
                    </div>
                    <p className="mt-1 text-[13px] text-slate-600">
                      {loan.memberName} • Sách #{loan.bookId}
                      {loan.copyId ? ` • Bản sao #${loan.copyId}` : ' • Tài liệu số'}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                      loan.status === 'RETURNED'
                        ? 'bg-emerald-100 text-emerald-700'
                        : loan.status === 'OVERDUE'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-sky-100 text-sky-700'
                    }`}>
                      {loan.status || 'UNKNOWN'}
                    </span>
                    <p className="mt-2 text-[12px] text-slate-500">{formatDateTime(loan.borrowedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard
          eyebrow="Recent digital resources"
          title="Tài nguyên số mới nhất"
          action={
            <Link to="/admin/digital-books" className="text-[13px] font-medium text-slate-600 underline-offset-4 hover:text-slate-950 hover:underline">
              Mở quản lý tài liệu số
            </Link>
          }
        >
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          ) : dashboardData.recentResources.length === 0 ? (
            <EmptyState message="Chưa có tài nguyên số nào để hiển thị." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead className="bg-slate-50 text-[13px] font-semibold text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Mã tài nguyên</th>
                    <th className="px-4 py-3">Sách</th>
                    <th className="px-4 py-3">Định dạng</th>
                    <th className="px-4 py-3">Quyền truy cập</th>
                    <th className="px-4 py-3">Ngày tải lên</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dashboardData.recentResources.map((resource) => (
                    <tr key={resource.resourceId} className="hover:bg-slate-50/70">
                      <td className="px-4 py-4 text-[13px] font-semibold text-slate-900">#{resource.resourceId}</td>
                      <td className="px-4 py-4 text-[13px] text-slate-700">Sách #{resource.bookId || 'N/A'}</td>
                      <td className="px-4 py-4 text-[13px] text-slate-700">{resource.fileFormat || 'Chưa cập nhật'}</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-700">
                          {resource.accessPermission || 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[13px] text-slate-500">{formatDateTime(resource.uploadedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        <SectionCard eyebrow="System snapshot" title="Tình trạng dữ liệu">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 size={16} />
                  <span className="text-[13px] font-semibold">Catalog data</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-emerald-800">
                  Có {formatCount(dashboardData.totalBooks)} đầu sách và {formatCount(dashboardData.totalResources)} tài nguyên số sẵn sàng để kiểm tra.
                </p>
              </div>
              <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
                <div className="flex items-center gap-2 text-sky-700">
                  <UsersRound size={16} />
                  <span className="text-[13px] font-semibold">Member data</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-sky-800">
                  Tổng {formatCount(dashboardData.totalMembers)} thành viên, trong đó {formatCount(dashboardData.lockedMembers + dashboardData.softLockedMembers)} tài khoản cần lưu ý.
                </p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <div className="flex items-center gap-2 text-amber-700">
                  <Clock3 size={16} />
                  <span className="text-[13px] font-semibold">Borrowing queue</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-amber-800">
                  Hiện có {formatCount(dashboardData.pendingRequests)} yêu cầu mượn đang chờ xử lý ở hàng đợi admin/librarian.
                </p>
              </div>
            </div>
          )}
        </SectionCard>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
