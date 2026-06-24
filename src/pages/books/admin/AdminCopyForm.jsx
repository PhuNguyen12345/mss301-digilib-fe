import { Building2, CalendarDays, ChevronDown, Hash, Save, UserRoundCog } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import AdminLayout from '@/components/layout/AdminLayout'

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-slate-700">{label}</span>
      <div className="mt-2">{children}</div>
      {hint && <span className="mt-2 block text-xs text-slate-500">{hint}</span>}
    </label>
  )
}

function TextInput({ value, placeholder, icon: Icon }) {
  return (
    <div className="relative">
      {Icon && <Icon size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />}
      <input
        defaultValue={value}
        placeholder={placeholder}
        className={`h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 text-[14px] text-slate-800 outline-none placeholder:text-slate-400 ${Icon ? 'pl-11' : ''}`}
      />
    </div>
  )
}

function SelectInput({ value, children }) {
  return (
    <div className="relative">
      <select
        defaultValue={value}
        className="h-11 w-full appearance-none rounded-2xl border border-slate-300 bg-white px-4 text-[14px] text-slate-800 outline-none"
      >
        {children}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
    </div>
  )
}

function InfoPanel() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">Sách gốc</p>
      <h2 className="mt-2 font-serif text-[22px] font-semibold tracking-tight text-slate-950">Cơ sở dữ liệu nâng cao</h2>
      <p className="mt-1 text-[13px] text-slate-600">Mã đầu sách: BK-MER-8812</p>
    </div>
  )
}

function AdminCopyForm({ mode = 'add' }) {
  const { copyId } = useParams()
  const isEdit = mode === 'edit'

  return (
    <AdminLayout
      active="copies"
      title={isEdit ? 'Chỉnh sửa Bản sao' : 'Thêm Bản sao mới'}
      description={
        isEdit
          ? 'Cập nhật trạng thái lưu thông, mã vạch và vị trí kệ của bản sao theo cùng giao diện quản trị mới.'
          : 'Tạo thêm bản sao mới với bố cục gọn, rõ và đồng nhất với toàn bộ phần admin.'
      }
    >
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
        <div className="border-b border-slate-200 p-5">
          <InfoPanel />
        </div>

        <div className="p-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <Field label="Mã vạch">
              <TextInput value={isEdit ? 'READ-99002231' : ''} placeholder="Ví dụ: 123456789" icon={Hash} />
            </Field>
            <Field label="Vị trí kệ">
              <TextInput value={isEdit ? 'Khu A - Tầng 2 - Kệ 04-B' : ''} placeholder="Ví dụ: A-102-04" icon={Building2} />
            </Field>
            <Field label="Ngày nhập kho">
              <TextInput value={isEdit ? '01/15/2024' : ''} placeholder="mm/dd/yyyy" icon={CalendarDays} />
            </Field>
            <Field label="Trạng thái hiện tại">
              <SelectInput value="available">
                <option value="available">Sẵn sàng</option>
                <option value="borrowed">Đang mượn</option>
                <option value="maintenance">Bảo trì</option>
                <option value="lost">Thất lạc</option>
              </SelectInput>
            </Field>
          </div>

          {!isEdit && (
            <div className="mt-5">
              <Field label="Đầu sách">
                <SelectInput value="">
                  <option value="">Chọn đầu sách...</option>
                  <option value="BK-MER-8812">BK-MER-8812 - Cơ sở dữ liệu nâng cao</option>
                  <option value="BK-COM-3341">BK-COM-3341 - Lập trình ứng dụng Web</option>
                </SelectInput>
              </Field>
            </div>
          )}

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_260px]">
            <Field label="Ghi chú tình trạng" hint="Mô tả nhanh chất lượng vật lý của bản sao để dễ theo dõi sau này.">
              <textarea
                defaultValue={isEdit ? 'Bản sao còn mới, bìa cứng, có kèm tài liệu phụ trợ ở trang cuối.' : ''}
                className="min-h-32 w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-[14px] leading-6 text-slate-800 outline-none placeholder:text-slate-400"
                placeholder="Nhập ghi chú nếu cần..."
              />
            </Field>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[13px] text-slate-600">
              <p className="flex items-center gap-2 font-medium text-slate-800">
                <UserRoundCog size={16} />
                Thông tin cập nhật
              </p>
              <p className="mt-3">Mã bản sao: {copyId || 'Tự động tạo sau khi lưu'}</p>
              <p className="mt-1">Người xử lý: Admin User</p>
              <p className="mt-1">Phiên bản giao diện: Compact UI</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
            <Link to="/admin/copies" className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-300 px-5 text-sm font-medium text-slate-700">
              Hủy
            </Link>
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800">
              <Save size={16} />
              {isEdit ? 'Cập nhật thông tin' : 'Lưu thông tin'}
            </button>
          </div>
        </div>
      </section>
    </AdminLayout>
  )
}

export default AdminCopyForm
