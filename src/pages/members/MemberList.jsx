import { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import AdminLayout from '@/components/layout/AdminLayout'
import LibrarianLayout from '@/pages/books/librarian/LibrarianLayout'
import { getAllMembers, updateMemberStatus } from '@/api/memberApi'
import {
  Search,
  Filter,
  Shield,
  ShieldAlert,
  ShieldX,
  Lock,
  Unlock,
  AlertTriangle,
  Users,
  Loader2,
  X,
  Check,
} from 'lucide-react'

/* ── Constants ──────────────────────────────────────────────────────── */

const STATUS_CONFIG = {
  UNLOCKED: {
    label: 'Hoạt động',
    icon: Shield,
    classes: 'bg-emerald-100 text-emerald-700',
    radioLabel: 'Mở khóa',
    radioDesc: 'Thành viên hoạt động bình thường',
    radioIcon: Unlock,
    ringClass: 'ring-emerald-500',
    bgSelected: 'bg-emerald-50 border-emerald-300',
  },
  SOFT_LOCKED: {
    label: 'Tạm khóa',
    icon: ShieldAlert,
    classes: 'bg-amber-100 text-amber-700',
    radioLabel: 'Tạm khóa',
    radioDesc: 'Hạn chế một số chức năng',
    radioIcon: AlertTriangle,
    ringClass: 'ring-amber-500',
    bgSelected: 'bg-amber-50 border-amber-300',
  },
  LOCKED: {
    label: 'Đã khóa',
    icon: ShieldX,
    classes: 'bg-red-100 text-red-700',
    radioLabel: 'Khóa hoàn toàn',
    radioDesc: 'Vô hiệu hóa tài khoản',
    radioIcon: Lock,
    ringClass: 'ring-red-500',
    bgSelected: 'bg-red-50 border-red-300',
  },
}

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-amber-100 text-amber-700',
  'bg-violet-100 text-violet-700',
  'bg-emerald-100 text-emerald-700',
  'bg-rose-100 text-rose-700',
  'bg-sky-100 text-sky-700',
]

const MEMBER_TYPE_LABELS = {
  STUDENT: 'Sinh viên',
  LECTURER: 'Giảng viên',
  STAFF: 'Nhân viên',
  EXTERNAL: 'Bên ngoài',
}

/* ── Helpers ─────────────────────────────────────────────────────────── */

function getInitials(firstName, lastName) {
  return `${(firstName || '')[0] || ''}${(lastName || '')[0] || ''}`.toUpperCase()
}

function getAvatarColor(index) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length]
}

/* ── Sub-components ──────────────────────────────────────────────────── */

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status]
  if (!config) return null
  const Icon = config.icon
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold ${config.classes}`}>
      <Icon size={12} />
      {config.label}
    </span>
  )
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-200" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-28 rounded bg-slate-200" />
            <div className="h-3 w-36 rounded bg-slate-100" />
          </div>
        </div>
      </td>
      <td className="px-5 py-4"><div className="h-3.5 w-20 rounded bg-slate-200" /></td>
      <td className="px-5 py-4"><div className="h-3.5 w-16 rounded bg-slate-200" /></td>
      <td className="px-5 py-4"><div className="h-6 w-20 rounded-full bg-slate-200" /></td>
      <td className="px-5 py-4"><div className="h-3.5 w-8 rounded bg-slate-200" /></td>
      <td className="px-5 py-4 text-right"><div className="ml-auto h-8 w-24 rounded-xl bg-slate-200" /></td>
    </tr>
  )
}

function StatusChangeModal({ member, onClose, onConfirm }) {
  const dialogRef = useRef(null)
  const [selected, setSelected] = useState(member?.status || 'UNLOCKED')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (member) {
      setSelected(member.status)
      setError(null)
      setSuccess(false)
      setSubmitting(false)
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [member])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    function handleCancel(e) {
      e.preventDefault()
      onClose()
    }
    dialog.addEventListener('cancel', handleCancel)
    return () => dialog.removeEventListener('cancel', handleCancel)
  }, [onClose])

  async function handleSubmit() {
    if (!member || selected === member.status) {
      onClose()
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await updateMemberStatus(member.id, selected)
      setSuccess(true)
      onConfirm(member.id, selected)
      setTimeout(() => onClose(), 800)
    } catch (err) {
      setError(err?.response?.data?.message || 'Cập nhật trạng thái thất bại. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  const fullName = member ? `${member.firstName || ''} ${member.lastName || ''}`.trim() : ''

  return (
    <dialog
      ref={dialogRef}
      className="w-full max-w-md rounded-2xl border border-slate-200 p-0 shadow-xl backdrop:bg-black/50"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">Quản lý trạng thái</p>
            <h3 className="mt-2 font-serif text-xl font-semibold tracking-tight text-slate-950">Đổi trạng thái</h3>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Đóng"
          >
            <X size={16} />
          </button>
        </div>

        {/* Member info */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-[13px] font-semibold text-slate-950">{fullName}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-[12px] text-slate-500">{member?.email}</span>
            <span className="text-slate-300">·</span>
            <StatusBadge status={member?.status} />
          </div>
        </div>

        {/* Status options */}
        <div className="mt-5 space-y-2.5">
          {Object.entries(STATUS_CONFIG).map(([key, config]) => {
            const Icon = config.radioIcon
            const isSelected = selected === key
            return (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className={`flex w-full items-center gap-3.5 rounded-xl border px-4 py-3 text-left transition ${
                  isSelected ? config.bgSelected : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                  isSelected ? 'bg-white shadow-sm' : 'bg-slate-100'
                }`}>
                  <Icon size={16} className={isSelected ? 'text-slate-900' : 'text-slate-500'} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-slate-900">{config.radioLabel}</span>
                  <span className="block text-[12px] text-slate-500">{config.radioDesc}</span>
                </span>
                {isSelected && (
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-900 text-white">
                    <Check size={12} />
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-medium text-emerald-700">
            <Check size={15} />
            Cập nhật trạng thái thành công!
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="h-10 rounded-xl border border-slate-300 px-5 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || success || selected === member?.status}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-5 text-[13px] font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {submitting && <Loader2 size={14} className="animate-spin" />}
            {submitting ? 'Đang cập nhật...' : 'Xác nhận'}
          </button>
        </div>
      </div>
    </dialog>
  )
}

/* ── Main Component ──────────────────────────────────────────────────── */

function MemberList() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const [modalMember, setModalMember] = useState(null)

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getAllMembers()
      setMembers(res.data || [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Không thể tải danh sách thành viên. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const filteredMembers = useMemo(() => {
    let result = members

    if (statusFilter !== 'ALL') {
      result = result.filter((m) => m.status === statusFilter)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter((m) => {
        const fullName = `${m.firstName || ''} ${m.lastName || ''}`.toLowerCase()
        return (
          fullName.includes(q) ||
          (m.email || '').toLowerCase().includes(q) ||
          (m.memberCode || '').toLowerCase().includes(q)
        )
      })
    }

    return result
  }, [members, searchQuery, statusFilter])

  function handleStatusConfirm(memberId, newStatus) {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, status: newStatus } : m)),
    )
  }

  const handleCloseModal = useCallback(() => setModalMember(null), [])

  /* ── Render content ───────────────────────────────────────────────── */

  const content = (
    <>
      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative max-w-sm flex-1">
            <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, email hoặc mã thành viên..."
              className="h-10 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-[13px] text-slate-900 placeholder:text-slate-400 transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status filter */}
          <div className="relative">
            <Filter size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 appearance-none rounded-xl border border-slate-300 bg-white py-0 pl-9 pr-8 text-[13px] text-slate-700 transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="UNLOCKED">Hoạt động</option>
              <option value="SOFT_LOCKED">Tạm khóa</option>
              <option value="LOCKED">Đã khóa</option>
            </select>
          </div>
        </div>

        {/* Total count */}
        <div className="flex items-center gap-2 text-[13px] text-slate-500">
          <Users size={15} />
          <span>
            <strong className="font-semibold text-slate-900">{filteredMembers.length}</strong> thành viên
          </span>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <AlertTriangle size={16} className="shrink-0 text-red-600" />
            <p className="text-[13px] font-medium text-red-700">{error}</p>
          </div>
          <button
            onClick={fetchMembers}
            className="shrink-0 rounded-xl bg-red-600 px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-slate-50 text-[13px] font-semibold text-slate-500">
              <tr>
                <th className="px-5 py-4">Thành viên</th>
                <th className="px-5 py-4">Mã thành viên</th>
                <th className="px-5 py-4">Loại thành viên</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4">Hạn mức mượn</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100">
                        <Users size={20} className="text-slate-400" />
                      </span>
                      <p className="text-[14px] font-medium text-slate-500">Không tìm thấy thành viên nào.</p>
                      {(searchQuery || statusFilter !== 'ALL') && (
                        <button
                          onClick={() => { setSearchQuery(''); setStatusFilter('ALL') }}
                          className="text-[13px] font-semibold text-sky-600 hover:text-sky-700"
                        >
                          Xóa bộ lọc
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member, index) => (
                  <tr key={member.id} className="transition hover:bg-slate-50/70">
                    {/* Member info */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${getAvatarColor(index)}`}>
                          {getInitials(member.firstName, member.lastName)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold text-slate-950">
                            {`${member.firstName || ''} ${member.lastName || ''}`.trim() || '—'}
                          </p>
                          <p className="truncate text-[12px] text-slate-500">{member.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Member code */}
                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[12px] font-medium text-slate-700">
                        {member.memberCode || '—'}
                      </span>
                    </td>

                    {/* Member type */}
                    <td className="px-5 py-4 text-[13px] text-slate-600">
                      {MEMBER_TYPE_LABELS[member.memberType] || member.memberType || '—'}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={member.status} />
                    </td>

                    {/* Borrowing limit */}
                    <td className="px-5 py-4 text-[13px] text-slate-700">
                      {member.borrowingLimit ?? '—'}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setModalMember(member)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-3.5 py-2 text-[12px] font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                      >
                        <Shield size={13} />
                        Đổi trạng thái
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && filteredMembers.length > 0 && (
          <div className="border-t border-slate-200 px-5 py-4 text-[13px] text-slate-500">
            Hiển thị {filteredMembers.length} trong số {members.length} thành viên
          </div>
        )}
      </div>

      {/* Status change modal */}
      <StatusChangeModal
        member={modalMember}
        onClose={handleCloseModal}
        onConfirm={handleStatusConfirm}
      />
    </>
  )

  /* ── Layout wrapper ───────────────────────────────────────────────── */

  const Layout = isAdmin ? AdminLayout : LibrarianLayout

  return (
    <Layout
      active="users"
      title="Quản lý thành viên"
      description="Xem, tìm kiếm và quản lý trạng thái tài khoản thành viên thư viện."
    >
      {content}
    </Layout>
  )
}

export default MemberList
