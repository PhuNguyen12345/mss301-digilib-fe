import { ChevronDown, Save } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import LibrarianLayout from './LibrarianLayout'

function LibrarianClassificationForm({ mode = 'add' }) {
  const { classificationId } = useParams()
  const isEdit = mode === 'edit'

  return (
    <LibrarianLayout
      active="classifications"
      title={isEdit ? 'Chỉnh sửa phân loại' : 'Thêm phân loại'}
      description="Tạo hoặc cập nhật phân loại DDC cho librarian."
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
        <div className="grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="text-[13px] font-semibold text-slate-700">Mã phân loại</span>
            <input defaultValue={classificationId || 'DDC-001'} className="mt-2 h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 text-[14px] text-slate-800 outline-none" />
          </label>
          <label className="block">
            <span className="text-[13px] font-semibold text-slate-700">Hệ thống</span>
            <div className="relative mt-2">
              <select defaultValue="ddc" className="h-11 w-full appearance-none rounded-2xl border border-slate-300 bg-white px-4 text-[14px] text-slate-800 outline-none">
                <option value="ddc">DDC</option>
                <option value="lcc">LCC</option>
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </label>
          <label className="block">
            <span className="text-[13px] font-semibold text-slate-700">Tên phân loại</span>
            <input defaultValue={isEdit ? 'Khoa học Máy tính, Tri thức & Hệ thống' : ''} className="mt-2 h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 text-[14px] text-slate-800 outline-none" />
          </label>
          <label className="block">
            <span className="text-[13px] font-semibold text-slate-700">Code</span>
            <input defaultValue={isEdit ? '000.00' : ''} className="mt-2 h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 text-[14px] text-slate-800 outline-none" />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
          <Link to="/librarian/classifications" className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-300 px-5 text-sm font-medium text-slate-700">Hủy</Link>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white">
            <Save size={16} />
            {isEdit ? 'Cập nhật phân loại' : 'Lưu phân loại'}
          </button>
        </div>
      </section>
    </LibrarianLayout>
  )
}

export default LibrarianClassificationForm
