import { useState } from 'react'
import { ChevronLeft, ChevronRight, Cloud, Edit3, Eye, FileText, Link2, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminLayout from '@/components/layout/AdminLayout'

const digitalBooks = [
  { title: 'Cấu trúc dữ liệu và Giải thuật', author: 'Nguyễn Văn A', category: 'CNTT', format: 'PDF', access: 'PUBLIC', link: 'readora.vn/doc/392', uploadedAt: '15/05/2024', code: 'LIB-2024-BK0092', size: '8.6 MB' },
  { title: 'Kế toán tài chính nâng cao', author: 'Trần Thị B', category: 'Kinh tế', format: 'EPUB', access: 'PREMIUM', link: 'readora.vn/doc/405', uploadedAt: '12/05/2024', code: 'LIB-2024-BK0755', size: '12.4 MB' },
  { title: 'Triết học Mác-Lênin', author: 'NXB Chính Trị Quốc Gia', category: 'Lý luận', format: 'PDF', access: 'INTERNAL', link: 'readora.vn/doc/512', uploadedAt: '08/05/2024', code: 'LIB-2024-BK0512', size: '6.1 MB' },
]

const metrics = [
  { title: 'Tổng số PDF', value: '1,284', note: '+12%', icon: FileText },
  { title: 'Lượt xem tháng này', value: '24.5k', note: '+5.2k', icon: Eye },
  { title: 'Dung lượng lưu trữ', value: '72%', note: 'Đã dùng', icon: Cloud },
]

function MetricCard({ title, value, note, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
      <div className="flex items-start justify-between">
        <p className="text-[13px] font-medium text-slate-500">{title}</p>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-900"><Icon size={18} /></span>
      </div>
      <p className="mt-4 text-2xl font-semibold text-slate-950">{value}</p>
      <p className="mt-1.5 text-[13px] text-emerald-600">{note}</p>
    </div>
  )
}

function AccessBadge({ value }) {
  const styles = {
    PUBLIC: 'bg-emerald-100 text-emerald-700',
    PREMIUM: 'bg-amber-100 text-amber-700',
    INTERNAL: 'bg-slate-100 text-slate-700',
  }
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles[value]}`}>{value}</span>
}

function DeleteDigitalModal({ book, onClose }) {
  if (!book) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="font-serif text-[24px] font-semibold tracking-tight text-slate-950">Xác nhận xóa tài liệu số</h2>
        <p className="mt-3 text-[14px] leading-7 text-slate-600">Bạn có chắc chắn muốn xóa tài liệu "{book.title}" khỏi hệ thống?</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Hủy</button>
          <button onClick={onClose} className="rounded-2xl bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800">Xác nhận xóa</button>
        </div>
      </div>
    </div>
  )
}

function AdminDigitalBookManage() {
  const [bookToDelete, setBookToDelete] = useState(null)

  return (
    <AdminLayout
      active="digital-books"
      title="Quản lý Sách Điện tử"
      description="Quản trị kho tài liệu số, kiểm soát định dạng và quyền truy cập người dùng với giao diện đồng nhất như bên trang chủ."
      action={
        <Link to="/admin/digital-books/add" className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-[13px] font-semibold text-white transition hover:bg-slate-800">
          <Plus size={16} />
          Thêm tài liệu mới
        </Link>
      }
    >
      <section className="grid gap-4 xl:grid-cols-3">
        {metrics.map((metric) => <MetricCard key={metric.title} {...metric} />)}
      </section>

      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">Digital documents</p>
            <h2 className="mt-2 font-serif text-[24px] font-semibold tracking-tight text-slate-950">Danh sách tài liệu số</h2>
          </div>
          <div className="flex gap-2">
            <button className="rounded-2xl border border-slate-300 px-3 py-2 text-[13px] font-medium text-slate-700">Bộ lọc</button>
            <button className="rounded-2xl border border-slate-300 px-3 py-2 text-[13px] font-medium text-slate-700">Sắp xếp</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left">
            <thead className="bg-slate-50 text-[13px] font-semibold text-slate-500">
              <tr>
                <th className="px-5 py-4">Tên tài liệu</th>
                <th className="px-5 py-4">Định dạng</th>
                <th className="px-5 py-4">Liên kết</th>
                <th className="px-5 py-4">Quyền truy cập</th>
                <th className="px-5 py-4">Thời gian tải lên</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {digitalBooks.map((book) => (
                <tr key={book.code} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <p className="max-w-xs font-medium leading-6 text-slate-950">{book.title}</p>
                    <p className="mt-1 text-[13px] text-slate-600">{book.author} • {book.category}</p>
                  </td>
                  <td className="px-5 py-4"><span className={`inline-flex rounded px-2 py-1 text-[10px] font-semibold ${book.format === 'PDF' ? 'bg-red-100 text-red-700' : 'bg-sky-100 text-sky-700'}`}>{book.format}</span></td>
                  <td className="px-5 py-4 text-[13px] text-slate-700"><span className="inline-flex items-center gap-2"><Link2 size={14} />{book.link}</span></td>
                  <td className="px-5 py-4"><AccessBadge value={book.access} /></td>
                  <td className="px-5 py-4 text-[13px] text-slate-600">{book.uploadedAt}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/digital-books/${book.code}/edit`} className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950" aria-label="Sửa tài liệu số">
                        <Edit3 size={16} />
                      </Link>
                      <button onClick={() => setBookToDelete(book)} className="rounded-full p-2 text-slate-600 transition hover:bg-red-50 hover:text-red-700" aria-label="Xóa tài liệu số">
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
          <p>Hiển thị 1 - 3 trên tổng số 2,140 tài liệu</p>
          <div className="flex items-center gap-2">
            <button className="grid h-9 w-9 place-items-center rounded-xl border border-slate-300 bg-white" aria-label="Trang trước"><ChevronLeft size={16} /></button>
            {[1, 2, 3].map((page) => (
              <button key={page} className={`h-9 w-9 rounded-xl border text-[13px] ${page === 1 ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-300 bg-white text-slate-700'}`}>{page}</button>
            ))}
            <button className="grid h-9 w-9 place-items-center rounded-xl border border-slate-300 bg-white" aria-label="Trang sau"><ChevronRight size={16} /></button>
          </div>
        </div>
      </section>

      <DeleteDigitalModal book={bookToDelete} onClose={() => setBookToDelete(null)} />
    </AdminLayout>
  )
}

export default AdminDigitalBookManage
