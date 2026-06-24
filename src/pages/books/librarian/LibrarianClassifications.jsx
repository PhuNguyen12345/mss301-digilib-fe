import { useState } from 'react'
import { Pencil, PlusCircle, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import LibrarianLayout from './LibrarianLayout'

const rows = [
  { id: 'DDC-001', system: 'DDC', name: 'Khoa học Máy tính, Tri thức & Hệ thống', code: '000.00', count: '1,245' },
  { id: 'DDC-500', system: 'DDC', name: 'Khoa học Tự nhiên & Toán học', code: '500.00', count: '3,120' },
  { id: 'DDC-300', system: 'DDC', name: 'Khoa học Xã hội', code: '300.00', count: '2,450' },
  { id: 'DDC-600', system: 'DDC', name: 'Công nghệ (Khoa học ứng dụng)', code: '600.00', count: '4,280' },
]

function DeleteClassificationModal({ item, onClose }) {
  if (!item) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="font-serif text-[24px] font-semibold tracking-tight text-slate-950">Xác nhận xóa phân loại</h2>
        <p className="mt-3 text-[14px] leading-7 text-slate-600">Bạn đang xóa phân loại <strong>{item.name}</strong>.</p>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[13px] text-slate-600">
          <p>Hệ thống: {item.system}</p>
          <p className="mt-1">Code: {item.code}</p>
          <p className="mt-1">Số sách: {item.count}</p>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Hủy</button>
          <button onClick={onClose} className="rounded-2xl bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800">Xác nhận xóa</button>
        </div>
      </div>
    </div>
  )
}

function LibrarianClassifications() {
  const [classificationToDelete, setClassificationToDelete] = useState(null)

  return (
    <LibrarianLayout
      active="classifications"
      title="Phân loại sách"
      description="Quản lý hệ thống phân loại DDC cho kho tri thức học thuật theo đúng ngôn ngữ thiết kế đang dùng ở admin."
      action={
        <Link to="/librarian/classifications/add" className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-[13px] font-semibold text-white">
          <PlusCircle size={18} />
          Thêm phân loại DDC
        </Link>
      }
    >
      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-slate-50 text-[13px] font-semibold text-slate-500">
            <tr>
              <th className="px-5 py-4">Mã phân loại</th>
              <th className="px-5 py-4">Hệ thống</th>
              <th className="px-5 py-4">Tên phân loại</th>
              <th className="px-5 py-4">Code DDC</th>
              <th className="px-5 py-4">Số sách</th>
              <th className="px-5 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/70">
                <td className="px-5 py-4 font-semibold text-slate-950">{row.id}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-[10px] font-semibold text-yellow-800">{row.system}</span>
                </td>
                <td className="max-w-xs px-5 py-4 font-semibold text-slate-950">{row.name}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{row.code}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{row.count}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-3 text-slate-600">
                    <Link to={`/librarian/classifications/${row.id}/edit`} aria-label="Sửa phân loại"><Pencil size={18} /></Link>
                    <button onClick={() => setClassificationToDelete(row)} aria-label="Xóa phân loại"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-slate-200 px-5 py-4 text-[13px] text-slate-600">Hiển thị 1-10 của 850 phân loại DDC</div>
      </section>

      <DeleteClassificationModal item={classificationToDelete} onClose={() => setClassificationToDelete(null)} />
    </LibrarianLayout>
  )
}

export default LibrarianClassifications
