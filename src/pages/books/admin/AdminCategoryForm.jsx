import { Eye, Info, Layers3, LockKeyhole, Save, Tags, XCircle } from 'lucide-react'
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

function HintCard({ icon: Icon, title, text, active }) {
  return (
    <div className={`rounded-2xl border p-4 ${active ? 'border-blue-200 bg-blue-50 text-sky-900' : 'border-slate-200 bg-white text-slate-600'}`}>
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Icon size={16} />
        {title}
      </p>
      <p className="mt-2 text-[13px] leading-6">{text}</p>
    </div>
  )
}

function AdminCategoryForm({ mode = 'add' }) {
  const { categoryId } = useParams()
  const isEdit = mode === 'edit'

  return (
    <AdminLayout
      active="categories"
      title={isEdit ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục mới'}
      description={
        isEdit
          ? 'Cập nhật nhóm phân loại sách với cùng ngôn ngữ thiết kế đang dùng ở Home và admin.'
          : 'Tạo danh mục mới với bố cục nhẹ, gọn và rõ ràng để đồng bộ toàn bộ hệ thống.'
      }
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4 text-slate-900">
          <Tags size={18} />
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.18em]">Thông tin danh mục</h2>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Field label="Mã danh mục" hint="Được hệ thống tạo tự động để bảo đảm duy nhất.">
            <div className="relative">
              <input
                defaultValue={categoryId || 'CAT-2024-089'}
                disabled
                className="h-11 w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 pr-11 text-[14px] text-slate-700 outline-none"
              />
              <LockKeyhole size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </Field>
          <Field label="Tên danh mục">
            <input
              defaultValue={isEdit ? 'Khoa học viễn tưởng' : ''}
              placeholder="Ví dụ: Kỹ thuật lập trình"
              className="h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 text-[14px] text-slate-800 outline-none placeholder:text-slate-400"
            />
          </Field>
        </div>

        <div className="mt-5">
          <Field label="Mô tả" hint="Mô tả ngắn gọn để người dùng hiểu rõ phạm vi của danh mục này.">
            <textarea
              defaultValue={
                isEdit
                  ? 'Bao gồm các tác phẩm khai thác khoa học, công nghệ và giả tưởng trong bối cảnh tương lai hoặc không gian mở rộng.'
                  : ''
              }
              placeholder="Nhập mô tả về mục đích và phạm vi của danh mục..."
              className="min-h-36 w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-[14px] leading-6 text-slate-800 outline-none placeholder:text-slate-400"
            />
          </Field>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
          <Link to="/admin/categories" className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-300 px-5 text-sm font-medium text-slate-700">
            {isEdit && <XCircle size={16} />}
            Hủy
          </Link>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800">
            <Save size={16} />
            Lưu thông tin
          </button>
        </div>
      </section>

      {!isEdit && (
        <section className="mt-5 grid gap-4 lg:grid-cols-3">
          <HintCard icon={Info} title="Lưu ý" text="Tên danh mục nên ngắn gọn và dễ hiểu để hiển thị đẹp trên cả desktop lẫn mobile." active />
          <HintCard icon={Eye} title="Hiển thị" text="Mô tả sẽ xuất hiện tại phần lọc và chi tiết danh mục khi người dùng duyệt sách." />
          <HintCard icon={Layers3} title="Mở rộng" text="Bạn có thể gắn thêm danh mục cha hoặc cấu trúc phân cấp sau khi lưu bản ghi." />
        </section>
      )}
    </AdminLayout>
  )
}

export default AdminCategoryForm
