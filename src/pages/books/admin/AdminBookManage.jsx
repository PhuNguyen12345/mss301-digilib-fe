import { useState } from 'react'
import { BookOpen, ChevronLeft, ChevronRight, Edit3, FileText, Layers3, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminLayout from '@/components/layout/AdminLayout'

const books = [
  { id: 'BK001', title: 'Giáo trình Cấu trúc dữ liệu và Giải thuật', isbn: '978-3-16-148410-0', code: 'LIB-2024-BK001', authors: 'Nguyễn Văn A, Trần Thị B', category: 'Công nghệ Thông tin', status: 'Sẵn sàng', cover: true },
  { id: 'BK0755', title: 'Kinh tế vi mô dành cho nhà quản lý', isbn: '978-0-13-416739-8', code: 'LIB-2024-BK0755', authors: 'Lê Hoàng Nam', category: 'Kinh tế & Quản trị', status: 'Đang mượn', cover: false },
  { id: 'BK0092', title: 'Triết học Mác-Lênin', isbn: '978-604-57-8190-2', code: 'LIB-2024-BK0092', authors: 'NXB Chính Trị Quốc Gia', category: 'Lý luận', status: 'Sẵn sàng', cover: true },
  { id: 'BK0556', title: 'Lịch sử Văn học Việt Nam', isbn: '978-604-2-35211-6', code: 'LIB-2024-BK0556', authors: 'Lê Văn C', category: 'Xã hội học', status: 'Bảo trì', cover: false },
]

const metrics = [
  { title: 'Tổng số đầu sách', value: '2,140', note: '+84', icon: FileText },
  { title: 'Đang lưu hành', value: '1,862', note: '87%', icon: BookOpen },
  { title: 'Tổng bản sao', value: '8,520', note: '+312', icon: Layers3 },
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

function BookStatus({ status }) {
  const styles = {
    'Sẵn sàng': 'bg-emerald-100 text-emerald-700',
    'Đang mượn': 'bg-amber-100 text-amber-700',
    'Bảo trì': 'bg-slate-100 text-slate-700',
  }
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles[status]}`}>{status}</span>
}

function DeleteConfirmModal({ book, onClose }) {
  if (!book) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="font-serif text-[24px] font-semibold tracking-tight text-slate-950">Xác nhận xóa thông tin sách</h2>
        <p className="mt-3 text-[14px] leading-7 text-slate-600">Bạn có chắc chắn muốn xóa đầu sách "{book.title}" khỏi hệ thống?</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Hủy</button>
          <button onClick={onClose} className="rounded-2xl bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800">Xác nhận xóa</button>
        </div>
      </div>
    </div>
  )
}

function AdminBookManage() {
  const [bookToDelete, setBookToDelete] = useState(null)

  return (
    <AdminLayout
      active="books"
      title="Quản lý Thông tin Sách"
      description="Quản trị đầu sách vật lý, mã phân loại, trạng thái lưu hành và dữ liệu thư mục với giao diện sáng, gọn và đồng bộ."
      action={
        <Link to="/admin/books/add" className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-[13px] font-semibold text-white transition hover:bg-slate-800">
          <Plus size={16} />
          Thêm sách mới
        </Link>
      }
    >
      <section className="grid gap-4 xl:grid-cols-3">
        {metrics.map((metric) => <MetricCard key={metric.title} {...metric} />)}
      </section>

      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">Book catalog</p>
            <h2 className="mt-2 font-serif text-[24px] font-semibold tracking-tight text-slate-950">Danh sách đầu sách</h2>
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
                <th className="px-5 py-4">Tên đầu sách</th>
                <th className="px-5 py-4">Mã sách</th>
                <th className="px-5 py-4">Tác giả</th>
                <th className="px-5 py-4">Danh mục</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {books.map((book) => (
                <tr key={book.code} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <div>
                      <p className="max-w-xs font-medium leading-6 text-slate-950">{book.title}</p>
                      <p className="mt-1 text-[13px] text-slate-600">ISBN: {book.isbn}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-slate-600">{book.code}</td>
                  <td className="px-5 py-4 text-[13px] text-slate-600">{book.authors}</td>
                  <td className="px-5 py-4 text-[13px] text-slate-600">{book.category}</td>
                  <td className="px-5 py-4"><BookStatus status={book.status} /></td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/books/${book.id}/edit`} className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950" aria-label="Sửa sách">
                        <Edit3 size={16} />
                      </Link>
                      <button onClick={() => setBookToDelete(book)} className="rounded-full p-2 text-slate-600 transition hover:bg-red-50 hover:text-red-700" aria-label="Xóa sách">
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
          <p>Hiển thị 1 - 4 trên tổng số 2,140 đầu sách</p>
          <div className="flex items-center gap-2">
            <button className="grid h-9 w-9 place-items-center rounded-xl border border-slate-300 bg-white disabled:opacity-50" aria-label="Trang trước"><ChevronLeft size={16} /></button>
            {[1, 2, 3].map((page) => (
              <button key={page} className={`h-9 w-9 rounded-xl border text-[13px] ${page === 1 ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-300 bg-white text-slate-700'}`}>{page}</button>
            ))}
            <button className="grid h-9 w-9 place-items-center rounded-xl border border-slate-300 bg-white" aria-label="Trang sau"><ChevronRight size={16} /></button>
          </div>
        </div>
      </section>

      <DeleteConfirmModal book={bookToDelete} onClose={() => setBookToDelete(null)} />
    </AdminLayout>
  )
}

export default AdminBookManage
