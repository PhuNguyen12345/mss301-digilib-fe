import { Database, FileText, UploadCloud, UserRoundCog } from 'lucide-react'
import AdminLayout from '@/components/layout/AdminLayout'

const metrics = [
  { title: 'Tổng số tài liệu', value: '24,850', note: '+3.1%', icon: FileText },
  { title: 'Tài liệu mới tháng này', value: '1,245', note: '+124', icon: UploadCloud },
  { title: 'Người dùng tích cực', value: '3,892', note: 'ACTIVE', icon: UserRoundCog },
  { title: 'Dung lượng lưu trữ', value: '1.2 TB', note: '68% đã dùng', icon: Database },
]

const recentUploads = [
  ['Giáo trình Cấu trúc dữ liệu', 'Admin_Vinh', '12.5 MB', '24/05/2024', 'PUBLIC'],
  ['Tạp chí Khoa học số 12', 'Librarian_Ha', '45.0 MB', '23/05/2024', 'PUBLIC'],
  ['Báo cáo Nghiên cứu AI 2024', 'Admin_Vinh', '8.2 MB', '22/05/2024', 'DRAFT'],
  ['Sách trắng chuyển đổi số', 'Librarian_An', '15.4 MB', '22/05/2024', 'PUBLIC'],
]

function MetricCard({ title, value, note, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium text-slate-500">{title}</p>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-900">
          <Icon size={18} />
        </span>
      </div>
      <div className="mt-4">
        <strong className="text-2xl font-semibold text-slate-950">{value}</strong>
        <p className="mt-1.5 text-[13px] text-emerald-600">{note}</p>
      </div>
    </div>
  )
}

function TrendPanel() {
  const points = [170, 148, 155, 118, 96, 82, 70]

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">Traffic trend</p>
          <h2 className="mt-2 font-serif text-[24px] font-semibold tracking-tight text-slate-950">Xu hướng truy cập tài liệu</h2>
          <p className="mt-1.5 text-[13px] text-slate-600">Thống kê lượt xem và tải về trong tuần hiện tại.</p>
        </div>
        <div className="flex w-fit rounded-full bg-slate-100 p-1 text-[13px] font-medium text-slate-600">
          <button className="rounded-full bg-slate-950 px-4 py-1.5 text-white">Daily</button>
          <button className="px-4 py-1.5">Weekly</button>
        </div>
      </div>

      <div className="mt-5 h-60 rounded-3xl bg-[linear-gradient(180deg,#f8fbff,#eef5ff)] p-3">
        <svg viewBox="0 0 640 260" className="h-full w-full" role="img" aria-label="Biểu đồ xu hướng truy cập">
          {[60, 110, 160, 210].map((y) => (
            <path key={y} d={`M40 ${y} H600`} stroke="#dbe4f0" strokeWidth="1" />
          ))}
          <path
            d={`M70 ${points[0]} C150 ${points[1]} 190 ${points[2]} 245 ${points[3]} S390 ${points[4]} 470 ${points[5]} S560 ${points[6]} 600 72`}
            fill="none"
            stroke="#0f172a"
            strokeWidth="4"
          />
          <circle cx="470" cy={points[5]} r="6" fill="#ffffff" stroke="#0f172a" strokeWidth="4" />
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, index) => (
            <text key={day} x={70 + index * 82} y="245" fill="#64748b" fontSize="11" fontWeight="700" textAnchor="middle">{day}</text>
          ))}
        </svg>
      </div>
    </section>
  )
}

function RecentUploads() {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">Recent uploads</p>
          <h2 className="mt-2 font-serif text-[24px] font-semibold tracking-tight text-slate-950">Tài liệu tải lên gần đây</h2>
        </div>
        <a href="#all" className="text-[13px] font-medium text-slate-600 underline-offset-4 hover:text-slate-950 hover:underline">Xem tất cả</a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-slate-50 text-[13px] font-semibold text-slate-500">
            <tr>
              <th className="px-5 py-4">Tên tài liệu</th>
              <th className="px-5 py-4">Người đăng</th>
              <th className="px-5 py-4">Kích thước</th>
              <th className="px-5 py-4">Ngày đăng</th>
              <th className="px-5 py-4">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recentUploads.map(([title, owner, size, date, status]) => (
              <tr key={title} className="hover:bg-slate-50/70">
                <td className="px-5 py-4 font-medium text-slate-950">{title}</td>
                <td className="px-5 py-4 text-[13px] text-slate-600">{owner}</td>
                <td className="px-5 py-4 text-[13px] text-slate-600">{size}</td>
                <td className="px-5 py-4 text-[13px] text-slate-600">{date}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${status === 'PUBLIC' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function AdminDashboard() {
  return (
    <AdminLayout
      active="dashboard"
      title="Dashboard"
      description="Tổng quan hoạt động quản lý thư viện và kho tài liệu Readora theo phong cách giao diện đồng nhất với trang chủ."
    >
      <section className="grid gap-4 xl:grid-cols-4">
        {metrics.map((metric) => <MetricCard key={metric.title} {...metric} />)}
      </section>

      <div className="mt-5 grid gap-5 2xl:grid-cols-[1.05fr_1fr]">
        <TrendPanel />
        <RecentUploads />
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
