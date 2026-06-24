import { ChevronDown, Save, Upload } from 'lucide-react'
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

function LibrarianDigitalBookForm({ mode = 'add' }) {
  const { resourceId } = useParams()
  const isEdit = mode === 'edit'

  return (
    <LibrarianLayout
      active="digital"
      title={isEdit ? 'Chỉnh sửa tài nguyên số' : 'Thêm tài nguyên số'}
      description="Quản lý định dạng, đường dẫn và quyền truy cập tài nguyên số cho thủ thư."
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
        <div className="grid gap-5 lg:grid-cols-2">
          <Field label="Mã tài nguyên">
            <TextInput value={resourceId || 'DR-LIB-001'} placeholder="Tự động tạo" />
          </Field>
          <Field label="Tên sách">
            <TextInput value={isEdit ? 'Cơ sở dữ liệu nâng cao' : ''} placeholder="Nhập tên tài nguyên" />
          </Field>
          <Field label="ISBN">
            <TextInput value={isEdit ? '978-0-12-345678-9' : ''} placeholder="Nhập ISBN" />
          </Field>
          <Field label="Định dạng">
            <SelectInput value="pdf">
              <option value="pdf">PDF</option>
              <option value="epub">EPUB</option>
              <option value="docx">DOCX</option>
            </SelectInput>
          </Field>
          <Field label="Quyền truy cập">
            <SelectInput value="public">
              <option value="public">PUBLIC</option>
              <option value="internal">INTERNAL</option>
              <option value="restricted">RESTRICTED</option>
            </SelectInput>
          </Field>
          <Field label="Đường dẫn tài liệu">
            <TextInput value={isEdit ? 'https://cdn.readora.vn/resources/db.pdf' : ''} placeholder="https://..." />
          </Field>
        </div>
        <div className="mt-5 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <Upload size={24} className="mx-auto text-slate-400" />
          <p className="mt-3 text-sm font-medium text-slate-900">Tải file tài nguyên</p>
        </div>
        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
          <Link to="/librarian/digital-books" className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-300 px-5 text-sm font-medium text-slate-700">Hủy</Link>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white">
            <Save size={16} />
            {isEdit ? 'Cập nhật tài nguyên' : 'Lưu tài nguyên'}
          </button>
        </div>
      </section>
    </LibrarianLayout>
  )
}

export default LibrarianDigitalBookForm
