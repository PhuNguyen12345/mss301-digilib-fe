import { Save } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import LibrarianLayout from './LibrarianLayout'

function LibrarianGenreForm({ mode = 'add' }) {
  const { genreId } = useParams()
  const isEdit = mode === 'edit'

  return (
    <LibrarianLayout
      active="genres"
      title={isEdit ? 'Chỉnh sửa thể loại' : 'Thêm thể loại'}
      description="Tạo hoặc cập nhật thể loại sách trong khu librarian."
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
        <div className="grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="text-[13px] font-semibold text-slate-700">Mã thể loại</span>
            <input defaultValue={genreId || 'TL-001'} className="mt-2 h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 text-[14px] text-slate-800 outline-none" />
          </label>
          <label className="block">
            <span className="text-[13px] font-semibold text-slate-700">Tên thể loại</span>
            <input defaultValue={isEdit ? 'Khoa học Tự nhiên' : ''} className="mt-2 h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 text-[14px] text-slate-800 outline-none" />
          </label>
        </div>
        <label className="mt-5 block">
          <span className="text-[13px] font-semibold text-slate-700">Mô tả</span>
          <textarea defaultValue={isEdit ? 'Tài liệu nghiên cứu vật lý, hóa học và sinh học.' : ''} className="mt-2 min-h-32 w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-[14px] outline-none" />
        </label>
        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
          <Link to="/librarian/genres" className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-300 px-5 text-sm font-medium text-slate-700">Hủy</Link>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white">
            <Save size={16} />
            {isEdit ? 'Cập nhật thể loại' : 'Lưu thể loại'}
          </button>
        </div>
      </section>
    </LibrarianLayout>
  )
}

export default LibrarianGenreForm
