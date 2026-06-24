import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import LibrarianLayout from './LibrarianLayout'

const rows = [
  { id: 'BK-LIB-001', title: 'Advanced Algorithms', isbn: '978-3-16-148410-0', author: 'Dr. Thomas H. Cormen', genre: 'Computer Science', classification: 'Reference', status: 'AVAILABLE', copies: '12' },
  { id: 'BK-LIB-002', title: 'Microeconomic Analysis', isbn: '978-0-19-953592-7', author: 'Hal R. Varian', genre: 'Economics', classification: 'Textbook', status: 'BORROWED', copies: '5' },
  { id: 'BK-LIB-003', title: 'Biomedical Ethics', isbn: '978-1-4503-4633-4', author: 'Jane L. Doe', genre: 'Medicine', classification: 'Thesis', status: 'DAMAGED', copies: '1' },
]

function Status({ value }) {
  const styles = {
    AVAILABLE: 'bg-emerald-100 text-emerald-700',
    BORROWED: 'bg-blue-100 text-blue-700',
    DAMAGED: 'bg-red-100 text-red-700',
  }

  return <span className={`rounded-full px-3 py-1 text-[10px] font-semibold ${styles[value]}`}>{value}</span>
}

function DeleteBookModal({ book, onClose }) {
  if (!book) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="font-serif text-[24px] font-semibold tracking-tight text-slate-950">Xác nhận xóa sách</h2>
        <p className="mt-3 text-[14px] leading-7 text-slate-600">
          Bạn đang xóa đầu sách <strong>{book.title}</strong>. Hành động này hiện mới là mô phỏng giao diện.
        </p>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[13px] text-slate-600">
          <p>ISBN: {book.isbn}</p>
          <p className="mt-1">Tác giả: {book.author}</p>
          <p className="mt-1">Số bản sao: {book.copies}</p>
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

function LibrarianBookCatalog() {
  const [bookToDelete, setBookToDelete] = useState(null)

  return (
    <LibrarianLayout
      active="catalog"
      title="Danh mục sách"
      description="Quản lý kho tài liệu in và siêu dữ liệu học thuật với bố cục gọn, sáng và đồng nhất như bên admin."
      action={
        <Link to="/librarian/books/add" className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-[13px] font-semibold text-white">
          <Plus size={18} />
          Thêm sách mới
        </Link>
      }
    >
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">Book catalog</p>
            <h2 className="mt-2 font-serif text-[24px] font-semibold tracking-tight text-slate-950">Danh sách đầu sách</h2>
          </div>
        </div>

        <table className="w-full min-w-[980px] text-left">
          <thead className="bg-slate-50 text-[13px] font-semibold text-slate-500">
            <tr>
              <th className="px-4 py-3">Ảnh bìa</th>
              <th className="px-4 py-3">ISBN</th>
              <th className="px-4 py-3">Tên sách</th>
              <th className="px-4 py-3">Tác giả</th>
              <th className="px-4 py-3">Thể loại</th>
              <th className="px-4 py-3">Phân loại</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Số bản</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr key={row.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3">
                  <span className={`block h-14 w-8 rounded-2xl ${index === 0 ? 'bg-[#082b51]' : index === 1 ? 'bg-amber-900' : 'bg-emerald-800'}`} />
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">{row.isbn}</td>
                <td className="px-4 py-3 font-semibold text-slate-950">{row.title}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{row.author}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{row.genre}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{row.classification}</td>
                <td className="px-4 py-3">
                  <Status value={row.status} />
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{row.copies}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3 text-slate-600">
                    <Link to={`/librarian/books/${row.id}/edit`} aria-label="Sửa sách"><Pencil size={17} /></Link>
                    <button onClick={() => setBookToDelete(row)} aria-label="Xóa sách"><Trash2 size={17} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-slate-200 px-4 py-4 text-[13px] text-slate-600">Hiển thị 1-10 trên 1,245 cuốn sách</div>
      </section>

      <DeleteBookModal book={bookToDelete} onClose={() => setBookToDelete(null)} />
    </LibrarianLayout>
  )
}

export default LibrarianBookCatalog
