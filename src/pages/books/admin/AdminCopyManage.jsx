import { useState } from 'react'
import {
  AlertTriangle,
  BookCopy,
  ChevronLeft,
  ChevronRight,
  Edit3,
  MapPin,
  Plus,
  RefreshCw,
  Settings,
  TrendingUp,
  Trash2,
  Wrench,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminLayout from '@/components/layout/AdminLayout'

const copies = [
  {
    id: 'CPY-2024-001',
    bookCode: 'BK-MER-8812',
    barcode: '9780141187761-01',
    shelf: 'KS A-12-04',
    importedAt: '12/01/2024',
    status: 'Sẵn sàng',
    title: 'Cơ sở dữ liệu nâng cao',
  },
  {
    id: 'CPY-2024-002',
    bookCode: 'BK-COM-3341',
    barcode: '9780593078754-05',
    shelf: 'KS B-05-11',
    importedAt: '15/01/2024',
    status: 'Đang mượn',
    title: 'Lập trình ứng dụng Web',
  },
  {
    id: 'CPY-2023-998',
    bookCode: 'BK-HIS-1109',
    barcode: '9781781100219-02',
    shelf: 'KS C-01-01',
    importedAt: '22/11/2023',
    status: 'Bảo trì',
    title: 'Lịch sử văn minh thế giới',
  },
  {
    id: 'CPY-2023-850',
    bookCode: 'BK-LAW-4490',
    barcode: '9780140449136-01',
    shelf: 'N/A',
    importedAt: '05/10/2023',
    status: 'Thất lạc',
    title: 'Pháp luật đại cương',
  },
]

const metrics = [
  { title: 'Tổng số bản sao', value: '12,482', note: '+2.4%', icon: BookCopy },
  { title: 'Đang cho mượn', value: '3,105', note: '24.8%', icon: TrendingUp },
  { title: 'Bảo trì', value: '142', note: 'Cần xử lý', icon: Wrench },
  { title: 'Thất lạc', value: '28', note: 'Ưu tiên cao', icon: AlertTriangle, danger: true },
]

function MetricCard({ title, value, note, icon: Icon, danger }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
      <div className="flex items-start justify-between">
        <p className="text-[13px] font-medium text-slate-500">{title}</p>
        <span
          className={`grid h-10 w-10 place-items-center rounded-2xl ${
            danger ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-900'
          }`}
        >
          <Icon size={18} />
        </span>
      </div>
      <p className={`mt-4 text-2xl font-semibold ${danger ? 'text-red-700' : 'text-slate-950'}`}>{value}</p>
      <p className={`mt-1.5 text-[13px] ${danger ? 'text-red-500' : 'text-slate-500'}`}>{note}</p>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    'Sẵn sàng': 'bg-emerald-100 text-emerald-700',
    'Đang mượn': 'bg-amber-100 text-amber-700',
    'Bảo trì': 'bg-slate-100 text-slate-700',
    'Thất lạc': 'bg-red-100 text-red-700',
  }

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles[status]}`}>{status}</span>
}

function DeleteCopyModal({ copy, onClose }) {
  if (!copy) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="font-serif text-[24px] font-semibold tracking-tight text-slate-950">Xác nhận xóa bản sao</h2>
        <p className="mt-3 text-[14px] leading-7 text-slate-600">
          Bản sao <strong>{copy.id}</strong> của sách <strong>{copy.title}</strong> sẽ bị gỡ khỏi danh sách quản lý hiện tại.
        </p>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[13px] text-slate-600">
          <p>Mã vạch: {copy.barcode}</p>
          <p className="mt-1">Vị trí kệ: {copy.shelf}</p>
          <p className="mt-1">Trạng thái hiện tại: {copy.status}</p>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">
            Hủy
          </button>
          <button onClick={onClose} className="rounded-2xl bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800">
            Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  )
}

function AdminCopyManage() {
  const [copyToDelete, setCopyToDelete] = useState(null)

  return (
    <AdminLayout
      active="copies"
      title="Quản lý Bản sao"
      description="Theo dõi vị trí, tình trạng lưu thông và chất lượng vật lý của từng bản sao sách trong thư viện với bố cục gọn và đồng nhất."
      action={
        <Link to="/admin/copies/add" className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-[13px] font-semibold text-white transition hover:bg-slate-800">
          <Plus size={16} />
          Thêm bản sao mới
        </Link>
      }
    >
      <section className="grid gap-4 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </section>

      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">Copies overview</p>
            <h2 className="mt-2 font-serif text-[24px] font-semibold tracking-tight text-slate-950">Danh sách bản sao</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-3 py-2 text-[13px] font-medium text-slate-700">
              <MapPin size={15} />
              Vị trí kệ
            </button>
            <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-3 py-2 text-[13px] font-medium text-slate-700">
              <RefreshCw size={15} />
              Làm mới
            </button>
            <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-3 py-2 text-[13px] font-medium text-slate-700">
              <Settings size={15} />
              Tùy chọn
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left">
            <thead className="bg-slate-50 text-[13px] font-semibold text-slate-500">
              <tr>
                <th className="px-5 py-4">Mã bản sao</th>
                <th className="px-5 py-4">Mã đầu sách</th>
                <th className="px-5 py-4">Mã vạch</th>
                <th className="px-5 py-4">Vị trí kệ</th>
                <th className="px-5 py-4">Ngày nhập</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {copies.map((copy) => (
                <tr key={copy.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-slate-950">{copy.id}</p>
                      <p className="mt-1 text-[13px] text-slate-600">{copy.title}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-slate-600">{copy.bookCode}</td>
                  <td className="px-5 py-4 text-[13px] text-slate-600">{copy.barcode}</td>
                  <td className="px-5 py-4 text-[13px] text-slate-600">{copy.shelf}</td>
                  <td className="px-5 py-4 text-[13px] text-slate-600">{copy.importedAt}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={copy.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/copies/${copy.id}/edit`} className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950" aria-label="Sửa bản sao">
                        <Edit3 size={16} />
                      </Link>
                      <button onClick={() => setCopyToDelete(copy)} className="rounded-full p-2 text-slate-600 transition hover:bg-red-50 hover:text-red-700" aria-label="Xóa bản sao">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-[13px] text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>Hiển thị 1 - 4 trên tổng số 12,482 bản sao</p>
          <div className="flex items-center gap-2">
            <button className="grid h-9 w-9 place-items-center rounded-xl border border-slate-300 bg-white disabled:opacity-50" aria-label="Trang trước">
              <ChevronLeft size={16} />
            </button>
            {[1, 2, 3].map((page) => (
              <button key={page} className={`h-9 w-9 rounded-xl border text-[13px] ${page === 1 ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-300 bg-white text-slate-700'}`}>
                {page}
              </button>
            ))}
            <button className="grid h-9 w-9 place-items-center rounded-xl border border-slate-300 bg-white" aria-label="Trang sau">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <DeleteCopyModal copy={copyToDelete} onClose={() => setCopyToDelete(null)} />
    </AdminLayout>
  )
}

export default AdminCopyManage
