import {
  BadgeDollarSign,
  Building2,
  ChevronDown,
  CloudUpload,
  Globe2,
  Link2,
  LockKeyhole,
  Save,
  Upload,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import AdminLayout from '@/components/layout/AdminLayout'

const accessOptions = [
  {
    value: 'public',
    title: 'Công khai',
    description: 'Mọi người dùng đều có thể đọc trực tuyến.',
    icon: Globe2,
  },
  {
    value: 'internal',
    title: 'Nội bộ',
    description: 'Chỉ nhân viên và quản trị viên thư viện có quyền truy cập.',
    icon: Building2,
  },
  {
    value: 'premium',
    title: 'Trả phí',
    description: 'Yêu cầu thẻ thành viên hoặc gói truy cập nâng cao.',
    icon: BadgeDollarSign,
  },
]

function Panel({ icon: Icon, title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4 text-slate-900">
        <Icon size={18} />
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.18em]">{title}</h2>
      </div>
      <div className="pt-5">{children}</div>
    </section>
  )
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-slate-700">{label}</span>
      <div className="mt-2">{children}</div>
      {hint && <span className="mt-2 block text-xs text-slate-500">{hint}</span>}
    </label>
  )
}

function TextInput({ value, placeholder, disabled }) {
  return (
    <input
      defaultValue={value}
      placeholder={placeholder}
      disabled={disabled}
      className={`h-11 w-full rounded-2xl border border-slate-300 px-4 text-[14px] text-slate-800 outline-none placeholder:text-slate-400 ${
        disabled ? 'bg-slate-100' : 'bg-white'
      }`}
    />
  )
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

function AccessOption({ option, checked, compact }) {
  const Icon = option.icon
  return (
    <label
      className={`relative flex cursor-pointer gap-4 rounded-2xl border p-4 transition ${
        checked ? 'border-slate-950 bg-slate-50 ring-1 ring-slate-950' : 'border-slate-200 hover:border-slate-300'
      } ${compact ? 'items-center' : 'min-h-28 flex-col'}`}
    >
      <input type="radio" name="access" defaultChecked={checked} className="sr-only" />
      <span className={`absolute right-4 top-4 h-4 w-4 rounded-full border ${checked ? 'border-slate-950 bg-slate-950 ring-4 ring-white' : 'border-slate-400'}`} />
      <Icon size={20} className="text-slate-900" />
      <span>
        <span className="block text-sm font-semibold text-slate-950">{option.title}</span>
        <span className="mt-1 block text-[13px] leading-6 text-slate-600">{option.description}</span>
      </span>
    </label>
  )
}

function DocumentPreview() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">Xem trước</h2>
      <div className="mt-4 grid aspect-[3/4] place-items-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-[#10263d] p-6">
        <div className="relative h-full w-3/4 max-w-44 rounded-sm bg-[#183d60] shadow-2xl">
          <div className="absolute inset-y-0 left-0 w-4 bg-[#0a1726]" />
          <div className="absolute inset-x-6 top-8 h-px bg-cyan-200/70" />
          <div className="absolute inset-x-6 top-12 h-px bg-cyan-200/40" />
          <div className="absolute left-7 right-5 top-20 space-y-1 text-xs text-slate-200">
            <p>Algorithms</p>
            <p>and Data</p>
            <p>Structure</p>
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-900">LIB-2024-BK0092</p>
      <p className="mt-1 text-[13px] text-slate-500">Định dạng: PDF</p>
    </div>
  )
}

function ChangeLog() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">Nhật ký</h2>
      <div className="mt-4 space-y-4 text-[13px] text-slate-600">
        <div className="rounded-2xl bg-slate-50 p-4">
          <strong className="block text-slate-900">Lần cuối cập nhật</strong>
          <span className="mt-1 block">10/10/2023 - 14:30 bởi Admin</span>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <strong className="block text-slate-900">Khởi tạo</strong>
          <span className="mt-1 block">01/01/2023 bởi Hệ thống</span>
        </div>
      </div>
    </div>
  )
}

function AdminDigitalBookForm({ mode = 'add' }) {
  const { bookId } = useParams()
  const isEdit = mode === 'edit'

  return (
    <AdminLayout
      active="digital-books"
      title={isEdit ? 'Chỉnh sửa Sách điện tử' : 'Thêm Sách điện tử mới'}
      description={
        isEdit
          ? 'Cập nhật liên kết tài liệu, định dạng và quyền truy cập theo cùng hệ giao diện admin mới.'
          : 'Tạo tài liệu số mới với giao diện gọn nhẹ, rõ ràng và đồng nhất với toàn bộ phần quản trị.'
      }
    >
      <div className={`grid gap-5 ${isEdit ? 'xl:grid-cols-[1fr_280px]' : ''}`}>
        <div className="space-y-5">
          <Panel icon={Link2} title="Thông tin liên kết">
            <Field
              label="Chọn đầu sách vật lý"
              hint={
                isEdit
                  ? 'Liên kết này được khóa để bảo đảm dữ liệu giữa sách giấy và tài liệu số luôn nhất quán.'
                  : 'Liên kết phiên bản điện tử với đầu sách vật lý hiện có trong hệ thống.'
              }
            >
              <div className="relative">
                <TextInput
                  value={isEdit ? 'Cấu trúc dữ liệu và Giải thuật' : ''}
                  placeholder="Tìm theo Book ID hoặc tên sách..."
                  disabled={isEdit}
                />
                {isEdit && <LockKeyhole size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />}
              </div>
            </Field>
          </Panel>

          <Panel icon={CloudUpload} title="Tài liệu số & Quyền truy cập">
            {isEdit ? (
              <>
                <div className="grid gap-5 lg:grid-cols-[1fr_1.45fr]">
                  <Field label="Định dạng tệp">
                    <SelectInput value="pdf">
                      <option value="pdf">PDF</option>
                      <option value="epub">EPUB</option>
                    </SelectInput>
                  </Field>
                  <Field label="Đường dẫn tài liệu">
                    <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
                      <TextInput value="https://cdn.readora.vn/ebooks/cau-truc-du-lieu-v1.pdf" />
                      <button className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800">
                        <Upload size={16} />
                        Update
                      </button>
                    </div>
                  </Field>
                </div>
                <div className="mt-5">
                  <p className="mb-3 text-[13px] font-semibold text-slate-700">Quyền truy cập</p>
                  <div className="grid gap-4 lg:grid-cols-3">
                    {accessOptions.map((option) => (
                      <AccessOption key={option.value} option={option} checked={option.value === 'public'} />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                <div className="space-y-5">
                  <Field label="Định dạng tệp">
                    <SelectInput value="">
                      <option value="">Chọn định dạng</option>
                      <option value="pdf">PDF</option>
                      <option value="epub">EPUB</option>
                    </SelectInput>
                  </Field>
                  <Field label="Đường dẫn tài liệu">
                    <div className="grid gap-3 sm:grid-cols-[1fr_110px]">
                      <TextInput placeholder="https://cdn.readora.com/ebooks/..." />
                      <button className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-950 px-4 text-sm font-semibold text-slate-950">
                        <Upload size={16} />
                        Tải lên
                      </button>
                    </div>
                  </Field>
                </div>
                <div>
                  <p className="mb-3 text-[13px] font-semibold text-slate-700">Quyền truy cập</p>
                  <div className="space-y-3">
                    {accessOptions.map((option) => (
                      <AccessOption key={option.value} option={option} checked={option.value === 'public'} compact />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Panel>
        </div>

        {isEdit && (
          <aside className="space-y-5">
            <DocumentPreview />
            <ChangeLog />
          </aside>
        )}
      </div>

      <div className={`mt-6 flex gap-3 border-t border-slate-200 pt-5 ${isEdit ? 'justify-center' : 'justify-end'}`}>
        <Link to="/admin/digital-books" className="inline-flex h-11 min-w-28 items-center justify-center rounded-2xl border border-slate-300 px-5 text-sm font-medium text-slate-700">
          Hủy
        </Link>
        <button className="inline-flex h-11 min-w-44 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800">
          <Save size={16} />
          {isEdit ? 'Cập nhật thông tin' : 'Lưu thông tin'}
        </button>
      </div>
      {bookId && <span className="sr-only">Editing {bookId}</span>}
    </AdminLayout>
  )
}

export default AdminDigitalBookForm
