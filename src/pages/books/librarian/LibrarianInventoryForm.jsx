import { ChevronDown, Save } from 'lucide-react'
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

function LibrarianInventoryForm({ mode = 'add' }) {
  const { copyId } = useParams()
  const isEdit = mode === 'edit'

  return (
    <LibrarianLayout
      active="inventory"
      title={isEdit ? 'Chỉnh sửa bản sao' : 'Thêm bản sao mới'}
      description="Quản lý barcode, vị trí kệ và trạng thái bản sao trong khu librarian."
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
        <div className="grid gap-5 lg:grid-cols-2">
          <Field label="Mã bản sao">
            <TextInput value={copyId || 'CPY-LIB-001'} placeholder="Tự động tạo" />
          </Field>
          <Field label="Barcode">
            <TextInput value={isEdit ? 'LIB-880291' : ''} placeholder="Nhập barcode" />
          </Field>
          <Field label="Tên sách">
            <TextInput value={isEdit ? "The Great Gatsby (Collector's Ed.)" : ''} placeholder="Nhập tên sách" />
          </Field>
          <Field label="ISBN">
            <TextInput value={isEdit ? '978-0743273565' : ''} placeholder="Nhập ISBN" />
          </Field>
          <Field label="Vị trí kệ">
            <TextInput value={isEdit ? 'A-12-04' : ''} placeholder="Ví dụ: A-12-04" />
          </Field>
          <Field label="Trạng thái">
            <SelectInput value="available">
              <option value="available">Available</option>
              <option value="loaned">Loaned</option>
              <option value="overdue">Overdue</option>
              <option value="damaged">Damaged</option>
            </SelectInput>
          </Field>
        </div>
        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
          <Link to="/librarian/inventory" className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-300 px-5 text-sm font-medium text-slate-700">Hủy</Link>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white">
            <Save size={16} />
            {isEdit ? 'Cập nhật bản sao' : 'Lưu bản sao'}
          </button>
        </div>
      </section>
    </LibrarianLayout>
  )
}

export default LibrarianInventoryForm
