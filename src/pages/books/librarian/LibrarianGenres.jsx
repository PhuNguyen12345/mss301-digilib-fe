import { useState } from 'react'
import { CheckCircle2, Clock, Pencil, PlusCircle, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import LibrarianLayout from './LibrarianLayout'

const genres = [
  { id: 'TL-001', name: 'Khoa học Tự nhiên', description: 'Tài liệu nghiên cứu vật lý, hóa học và sinh học', count: '452' },
  { id: 'TL-002', name: 'Kỹ thuật & Công nghệ', description: 'Khoa học máy tính, trí tuệ nhân tạo và hệ thống', count: '328' },
  { id: 'TL-003', name: 'Kinh tế học', description: 'Tài chính, quản trị kinh doanh và kinh tế vĩ mô', count: '215' },
  { id: 'TL-004', name: 'Văn học Nghệ thuật', description: 'Lịch sử nghệ thuật, âm nhạc học và tác phẩm', count: '156' },
  { id: 'TL-005', name: 'Khoa học Xã hội', description: 'Xã hội học, tâm lý học và nghiên cứu nhân chủng', count: '289' },
]

function DeleteGenreModal({ genre, onClose }) {
  if (!genre) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="font-serif text-[24px] font-semibold tracking-tight text-slate-950">Xác nhận xóa thể loại</h2>
        <p className="mt-3 text-[14px] leading-7 text-slate-600">Bạn đang xóa thể loại <strong>{genre.name}</strong>.</p>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[13px] text-slate-600">
          <p>Mã thể loại: {genre.id}</p>
          <p className="mt-1">Số lượng sách: {genre.count}</p>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Hủy</button>
          <button onClick={onClose} className="rounded-2xl bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800">Xác nhận xóa</button>
        </div>
      </div>
    </div>
  )
}

function LibrarianGenres() {
  const [genreToDelete, setGenreToDelete] = useState(null)

  return (
    <LibrarianLayout
      active="genres"
      title="Danh mục thể loại"
      description="Quản lý và phân loại các đầu sách theo cấu trúc học thuật chuẩn với cùng kiểu trình bày như admin."
      action={
        <Link to="/librarian/genres/add" className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-[13px] font-semibold text-white">
          <PlusCircle size={18} />
          Thêm thể loại
        </Link>
      }
    >
      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-slate-50 text-[13px] font-semibold text-slate-500">
            <tr>
              <th className="px-5 py-4">Mã thể loại</th>
              <th className="px-5 py-4">Tên thể loại</th>
              <th className="px-5 py-4">Mô tả</th>
              <th className="px-5 py-4 text-center">Số lượng sách</th>
              <th className="px-5 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {genres.map((genre) => (
              <tr key={genre.id} className="hover:bg-slate-50/70">
                <td className="px-5 py-4 font-medium text-slate-950">{genre.id}</td>
                <td className="px-5 py-4 font-semibold text-slate-950">{genre.name}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{genre.description}</td>
                <td className="px-5 py-4 text-center">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">{genre.count}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-3 text-slate-600">
                    <Link to={`/librarian/genres/${genre.id}/edit`} aria-label="Sửa thể loại"><Pencil size={18} /></Link>
                    <button onClick={() => setGenreToDelete(genre)} aria-label="Xóa thể loại"><Trash2 size={18} className="text-red-600" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-slate-200 px-5 py-4 text-[13px] text-slate-600">Đang hiển thị 1 - 5 trên tổng số 24 thể loại</div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="rounded-2xl bg-[#0b2441] p-6 text-white shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
          <h2 className="text-xl font-semibold text-yellow-200">Gợi ý hệ thống: Cân đối tài nguyên</h2>
          <p className="mt-3 max-w-2xl text-sm text-blue-50/90">
            Hệ thống nhận thấy thể loại "Kỹ thuật & Công nghệ" đang có tỷ lệ mượn cao. Cần nhập bổ sung thêm đầu sách cho thể loại này.
          </p>
          <button className="mt-6 rounded-2xl bg-yellow-200 px-5 py-2.5 text-sm font-bold text-slate-950">Xem báo cáo chi tiết</button>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-950">
            <CheckCircle2 size={18} />
            Tiêu chuẩn phân loại
          </h3>
          {[
            'Mã thể loại phải bắt đầu bằng tiền tố TL-.',
            'Mô tả tối thiểu 20 ký tự để hỗ trợ tìm kiếm.',
            'Phân loại theo chuẩn Dewey Decimal (DDC).',
          ].map((text) => (
            <p key={text} className="mt-4 flex gap-2 text-sm text-slate-600">
              <Clock size={15} />
              {text}
            </p>
          ))}
        </div>
      </section>

      <DeleteGenreModal genre={genreToDelete} onClose={() => setGenreToDelete(null)} />
    </LibrarianLayout>
  )
}

export default LibrarianGenres
