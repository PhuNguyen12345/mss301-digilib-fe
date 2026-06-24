import { ChevronDown, FileImage, ImageUp, Info, Save, Upload } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import AdminLayout from '@/components/layout/AdminLayout'

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

function Field({ label, required, hint, children }) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-slate-700">
        {label} {required && <span className="text-red-600">*</span>}
      </span>
      <div className="mt-2">{children}</div>
      {hint && <span className="mt-2 block text-xs text-slate-500">{hint}</span>}
    </label>
  )
}

function TextInput({ value, placeholder, disabled }) {
  return (
    <input
      defaultValue={value}
      disabled={disabled}
      placeholder={placeholder}
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

function CoverPreview() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">Xem trước</h2>
      <div className="mt-4 grid aspect-[3/4] place-items-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-[#10263d] p-6">
        <div className="relative h-full w-3/4 max-w-44 rounded-sm bg-[#183d60] shadow-2xl">
          <div className="absolute inset-y-0 left-0 w-4 bg-[#0a1726]" />
          <div className="absolute inset-x-6 top-8 h-px bg-cyan-200/70" />
          <div className="absolute inset-x-6 top-12 h-px bg-cyan-200/40" />
          <div className="absolute left-7 right-5 top-20 space-y-1 text-xs text-slate-200">
            <p>Data</p>
            <p>Structures</p>
            <p>Algorithms</p>
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-900">LIB-2024-BK001</p>
      <p className="mt-1 text-[13px] text-slate-500">ISBN: 978-3-16-148410-0</p>
    </div>
  )
}

function StatusPanel() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">Trạng thái</h2>
      <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
        <span className="text-sm font-medium text-slate-800">Cho phép lưu hành</span>
        <span className="relative h-6 w-11 rounded-full bg-slate-950">
          <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" />
        </span>
      </div>
      <div className="mt-4 space-y-3 rounded-2xl bg-slate-50 p-4 text-[13px] text-slate-600">
        <p className="flex justify-between gap-3">
          <span>Ngày thêm</span>
          <strong className="text-slate-900">12/03/2024</strong>
        </p>
        <p className="flex justify-between gap-3">
          <span>Người cập nhật</span>
          <strong className="text-slate-900">Admin Nguyen</strong>
        </p>
        <p className="flex justify-between gap-3">
          <span>Tổng lượt mượn</span>
          <strong className="text-slate-900">142</strong>
        </p>
      </div>
    </div>
  )
}

function AdminBookForm({ mode = 'add' }) {
  const { bookId } = useParams()
  const isEdit = mode === 'edit'

  return (
    <AdminLayout
      active="books"
      title={isEdit ? 'Chỉnh sửa Thông tin sách' : 'Thêm Sách mới'}
      description={
        isEdit
          ? 'Cập nhật dữ liệu thư mục, phân loại và trạng thái lưu hành của đầu sách theo cùng giao diện admin mới.'
          : 'Tạo đầu sách mới với bố cục gọn, rõ và đồng nhất cùng toàn bộ khu vực quản trị.'
      }
    >
      <div className={`grid gap-5 ${isEdit ? 'xl:grid-cols-[1fr_280px]' : ''}`}>
        <div className="space-y-5">
          <Panel icon={Info} title="Thông tin chung">
            <div className="grid gap-5 lg:grid-cols-3">
              <Field label="Mã sách" hint="Mã định danh được hệ thống tạo tự động.">
                <TextInput value="LIB-2024-BK001" disabled />
              </Field>
              <Field label="Danh mục sách" required>
                <SelectInput value="computer-science">
                  <option value="computer-science">Khoa học máy tính</option>
                  <option value="economics">Kinh tế & Quản trị</option>
                  <option value="society">Khoa học xã hội</option>
                </SelectInput>
              </Field>
              <Field label="Mã ISBN">
                <TextInput value={isEdit ? '978-3-16-148410-0' : ''} placeholder="978-3-16-148410-0" />
              </Field>
            </div>

            <div className="mt-5">
              <Field label="Tên sách" required>
                <TextInput
                  value={isEdit ? 'Giáo trình Cấu trúc dữ liệu và Giải thuật' : ''}
                  placeholder="Ví dụ: Giáo trình Cấu trúc dữ liệu và Giải thuật"
                />
              </Field>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-3">
              <Field label="Tác giả" required>
                <TextInput value={isEdit ? 'PGS. TS. Nguyễn Văn A' : ''} placeholder="Tên tác giả hoặc nhóm tác giả" />
              </Field>
              <Field label="Nhà xuất bản">
                <TextInput value={isEdit ? 'NXB Giáo dục Việt Nam' : ''} placeholder="NXB Giáo dục, NXB Trẻ..." />
              </Field>
              <Field label="Năm xuất bản">
                <TextInput value={isEdit ? '2024' : ''} placeholder="2024" />
              </Field>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-3">
              <Field label="Lần tái bản">
                <TextInput value={isEdit ? 'Tái bản lần 1' : ''} placeholder="Lần 1, lần 2..." />
              </Field>
              <Field label="Ngôn ngữ">
                <SelectInput value="vi">
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">Tiếng Anh</option>
                </SelectInput>
              </Field>
              <Field label="Hệ thống phân loại" required>
                <SelectInput value="ddc">
                  <option value="ddc">DDC (Dewey Decimal Classification)</option>
                </SelectInput>
              </Field>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <Field label="Mã phân loại" required hint="Chọn đúng mã phân loại để thống nhất tra cứu.">
                <SelectInput value={isEdit ? '005.1' : ''}>
                  <option value="">Chọn mã phân loại...</option>
                  <option value="005.1">005.1 (Software engineering)</option>
                </SelectInput>
              </Field>
              <Field label="Mã code" required hint="Mã nội bộ của cơ sở giáo dục.">
                <TextInput value={isEdit ? '005.1-A-2024' : ''} placeholder="VD: CS-101-2024" />
              </Field>
            </div>

            <div className="mt-5">
              <Field label="Mô tả ngắn">
                <textarea
                  defaultValue={
                    isEdit
                      ? 'Cuốn sách cung cấp kiến thức nền tảng về cấu trúc dữ liệu và giải thuật, bao gồm các phương pháp sắp xếp, tìm kiếm, cây và đồ thị.'
                      : ''
                  }
                  placeholder="Nhập tóm tắt nội dung hoặc mô tả ngắn về tài liệu..."
                  className="min-h-32 w-full resize-none rounded-2xl border border-slate-300 px-4 py-3 text-[14px] leading-6 text-slate-800 outline-none placeholder:text-slate-400"
                />
              </Field>
            </div>
          </Panel>

          <Panel icon={FileImage} title="Tài liệu hình ảnh">
            <div className={`grid gap-5 ${isEdit ? 'md:grid-cols-[90px_1fr]' : ''}`}>
              {isEdit && (
                <div className="relative h-28 w-20 overflow-hidden rounded-2xl bg-[#10263d] shadow-sm">
                  <div className="absolute inset-y-0 left-0 w-4 bg-[#0a1726]" />
                  <div className="absolute inset-x-4 top-7 h-px bg-cyan-300/80" />
                  <div className="absolute inset-x-4 top-12 h-8 border border-cyan-300/40" />
                </div>
              )}
              <div className="grid min-h-32 place-items-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <div>
                  {isEdit ? <Upload size={24} className="mx-auto text-slate-400" /> : <ImageUp size={24} className="mx-auto text-slate-400" />}
                  <p className="mt-3 text-sm font-medium text-slate-900">{isEdit ? 'Thay đổi ảnh bìa' : 'Kéo thả hoặc nhấn để tải lên'}</p>
                  <p className="mt-1 text-xs text-slate-500">Định dạng JPG, PNG, WEBP. Tối đa 2MB.</p>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        {isEdit && (
          <aside className="space-y-5">
            <CoverPreview />
            <StatusPanel />
          </aside>
        )}
      </div>

      <div className={`mt-6 flex gap-3 border-t border-slate-200 pt-5 ${isEdit ? 'justify-center' : 'justify-end'}`}>
        <Link to="/admin/books" className="inline-flex h-11 min-w-28 items-center justify-center rounded-2xl border border-slate-300 px-5 text-sm font-medium text-slate-700">
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

export default AdminBookForm
