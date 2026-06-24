import { ChevronDown, FileImage, Save, Upload } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import LibrarianLayout from './LibrarianLayout'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-slate-700">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  )
}

function TextInput({ value, placeholder }) {
  return <input defaultValue={value} placeholder={placeholder} className="h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 text-[14px] text-slate-800 outline-none placeholder:text-slate-400" />
}

function SelectInput({ value, children }) {
  return (
    <div className="relative">
      <select defaultValue={value} className="h-11 w-full appearance-none rounded-2xl border border-slate-300 bg-white px-4 text-[14px] text-slate-800 outline-none">
        {children}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
    </div>
  )
}

function LibrarianBookForm({ mode = 'add' }) {
  const { bookId } = useParams()
  const isEdit = mode === 'edit'

  return (
    <LibrarianLayout
      active="catalog"
      title={isEdit ? 'Chỉnh sửa sách' : 'Thêm sách mới'}
      description={isEdit ? 'Cập nhật thông tin sách trong catalog của thủ thư.' : 'Tạo đầu sách mới trong khu quản lý librarian.'}
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
        <div className="grid gap-5 lg:grid-cols-3">
          <Field label="Mã sách">
            <TextInput value={bookId || 'BK-LIB-001'} placeholder="Tự động tạo" />
          </Field>
          <Field label="ISBN">
            <TextInput value={isEdit ? '978-3-16-148410-0' : ''} placeholder="978-3-16-148410-0" />
          </Field>
          <Field label="Trạng thái">
            <SelectInput value="available">
              <option value="available">Available</option>
              <option value="borrowed">Borrowed</option>
              <option value="damaged">Damaged</option>
            </SelectInput>
          </Field>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Field label="Tên sách">
            <TextInput value={isEdit ? 'Advanced Algorithms' : ''} placeholder="Nhập tên sách" />
          </Field>
          <Field label="Tác giả">
            <TextInput value={isEdit ? 'Dr. Thomas H. Cormen' : ''} placeholder="Nhập tác giả" />
          </Field>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Field label="Thể loại">
            <SelectInput value="cs">
              <option value="cs">Computer Science</option>
              <option value="economics">Economics</option>
              <option value="medicine">Medicine</option>
            </SelectInput>
          </Field>
          <Field label="Phân loại">
            <SelectInput value="reference">
              <option value="reference">Reference</option>
              <option value="textbook">Textbook</option>
              <option value="thesis">Thesis</option>
            </SelectInput>
          </Field>
        </div>
        <div className="mt-5">
          <Field label="Mô tả ngắn">
            <textarea defaultValue={isEdit ? 'Mô tả tài liệu dành cho thủ thư quản lý.' : ''} className="min-h-32 w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-[14px] outline-none" />
          </Field>
        </div>
        <div className="mt-5 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <FileImage size={24} className="mx-auto text-slate-400" />
          <p className="mt-3 text-sm font-medium text-slate-900">Tải ảnh bìa sách</p>
          <button className="mt-4 inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-300 px-4 text-sm font-medium text-slate-700">
            <Upload size={16} />
            Chọn ảnh
          </button>
        </div>
        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
          <Link to="/librarian/books" className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-300 px-5 text-sm font-medium text-slate-700">Hủy</Link>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white">
            <Save size={16} />
            {isEdit ? 'Cập nhật sách' : 'Lưu sách'}
          </button>
        </div>
      </section>
    </LibrarianLayout>
  )
}

export default LibrarianBookForm
