import { useState } from 'react'
import { Archive, Download, Filter, Pencil, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import LibrarianLayout from './LibrarianLayout'

const metrics = [
  ['Tổng bản sao', '12,840', '+12% so với tháng trước'],
  ['Đang có sẵn', '8,421', '65.6% tổng kho'],
  ['Đang cho mượn', '4,112', 'Đang lưu thông'],
  ['Bị mất', '82', 'Cần thanh lý'],
  ['Hư hỏng', '225', 'Đang chờ phục chế'],
]

const rows = [
  { id: 'CPY-001', barcode: 'LIB-880291', title: "The Great Gatsby (Collector's Ed.)", isbn: '978-0743273565', shelf: 'A-12-04', importedAt: '12/01/2024', status: 'AVAILABLE' },
  { id: 'CPY-002', barcode: 'LIB-880342', title: 'Molecular Biology of the Cell', isbn: '978-0815344322', shelf: 'S-05-11', importedAt: '05/02/2024', status: 'LOANED' },
  { id: 'CPY-003', barcode: 'LIB-880115', title: 'An Inquiry into the Nature', isbn: '978-1612903214', shelf: 'E-01-02', importedAt: '15/11/2023', status: 'OVERDUE' },
  { id: 'CPY-004', barcode: 'LIB-880590', title: 'Advanced Engineering Mathematics', isbn: '978-0470458365', shelf: 'M-09-15', importedAt: '02/03/2024', status: 'DAMAGED' },
]

function Status({ value }) {
  const styles = {
    AVAILABLE: 'bg-emerald-100 text-emerald-700',
    LOANED: 'bg-blue-100 text-blue-700',
    OVERDUE: 'bg-red-100 text-red-700',
    DAMAGED: 'bg-slate-200 text-slate-700',
  }

  return <span className={`rounded-full px-3 py-1 text-[10px] font-semibold ${styles[value]}`}>{value}</span>
}

function DeleteCopyModal({ copy, onClose }) {
  if (!copy) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="font-serif text-[24px] font-semibold tracking-tight text-slate-950">Xác nhận xóa bản sao</h2>
        <p className="mt-3 text-[14px] leading-7 text-slate-600">
          Bạn đang xóa bản sao <strong>{copy.barcode}</strong> của <strong>{copy.title}</strong>.
        </p>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[13px] text-slate-600">
          <p>ISBN: {copy.isbn}</p>
          <p className="mt-1">Vị trí kệ: {copy.shelf}</p>
          <p className="mt-1">Trạng thái: {copy.status}</p>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Hủy</button>
          <button onClick={onClose} className="rounded-2xl bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800">Xác nhận xóa</button>
        </div>
      </div>
    </div>
  )
}

function LibrarianInventory() {
  const [copyToDelete, setCopyToDelete] = useState(null)

  return (
    <LibrarianLayout
      active="inventory"
      title="Kho sách"
      description="Theo dõi bản sao vật lý, vị trí kệ và tình trạng lưu thông bằng giao diện cùng hệ với phần admin."
      action={
        <Link to="/librarian/inventory/add" className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-[13px] font-semibold text-white">
          <Plus size={18} />
          Thêm bản sao
        </Link>
      }
    >
      <section className="grid gap-4 xl:grid-cols-5">
        {metrics.map(([title, value, note], index) => (
          <div key={title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
            <div className="flex justify-between gap-3">
              <p className="text-[13px] font-medium text-slate-500">{title}</p>
              {index === 0 && <Archive size={18} className="text-slate-900" />}
            </div>
            <p className={`mt-4 text-2xl font-semibold ${index === 1 ? 'text-emerald-700' : index === 3 ? 'text-red-700' : index === 4 ? 'text-orange-700' : 'text-slate-950'}`}>{value}</p>
            <p className="mt-1.5 text-[13px] text-slate-600">{note}</p>
          </div>
        ))}
      </section>

      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h2 className="font-serif text-[24px] font-semibold tracking-tight text-slate-950">Danh mục bản sao chi tiết</h2>
          <div className="flex gap-2">
            <button className="grid h-9 w-9 place-items-center rounded-xl border border-slate-300"><Filter size={16} /></button>
            <button className="grid h-9 w-9 place-items-center rounded-xl border border-slate-300"><Download size={16} /></button>
          </div>
        </div>
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-slate-50 text-[13px] font-semibold text-slate-500">
            <tr>
              <th className="px-5 py-4">Barcode</th>
              <th className="px-5 py-4">Tên sách</th>
              <th className="px-5 py-4">ISBN</th>
              <th className="px-5 py-4">Vị trí kệ</th>
              <th className="px-5 py-4">Ngày nhập</th>
              <th className="px-5 py-4">Trạng thái</th>
              <th className="px-5 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/70">
                <td className="px-5 py-4 font-semibold text-slate-950">{row.barcode}</td>
                <td className="px-5 py-4 font-semibold text-slate-950">{row.title}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{row.isbn}</td>
                <td className="px-5 py-4 text-sm text-slate-600"><span className="rounded-full bg-slate-100 px-2.5 py-1">{row.shelf}</span></td>
                <td className="px-5 py-4 text-sm text-slate-600">{row.importedAt}</td>
                <td className="px-5 py-4"><Status value={row.status} /></td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-3 text-slate-600">
                    <Link to={`/librarian/inventory/${row.id}/edit`} aria-label="Sửa bản sao"><Pencil size={17} /></Link>
                    <button onClick={() => setCopyToDelete(row)} aria-label="Xóa bản sao"><Trash2 size={17} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-slate-200 px-5 py-4 text-[13px] text-slate-600">Hiển thị 1-10 trong số 12,840 bản sao</div>
      </section>

      <DeleteCopyModal copy={copyToDelete} onClose={() => setCopyToDelete(null)} />
    </LibrarianLayout>
  )
}

export default LibrarianInventory
