import { useState } from 'react'
import { Pencil, Trash2, Upload } from 'lucide-react'
import { Link } from 'react-router-dom'
import LibrarianLayout from './LibrarianLayout'

const rows = [
  { id: 'DR-001', title: 'Cơ sở dữ liệu nâng cao', publisher: 'Oxford Research Press', isbn: '978-0-12-345678-9', format: 'PDF', permission: 'PUBLIC', uploadedAt: '12/10/2024' },
  { id: 'DR-002', title: 'Văn hóa Việt Nam qua các thời kỳ', publisher: 'NXB Giáo dục', isbn: '978-604-1-12345-0', format: 'EPUB', permission: 'INTERNAL', uploadedAt: '08/11/2024' },
  { id: 'DR-003', title: 'Tài liệu hướng dẫn LAB-401', publisher: 'Khoa CNTT', isbn: 'N/A (Internal)', format: 'DOCX', permission: 'RESTRICTED', uploadedAt: '15/11/2024' },
]

function Badge({ value }) {
  const styles = {
    PDF: 'bg-red-50 text-red-700 border-red-200',
    EPUB: 'bg-blue-50 text-blue-700 border-blue-200',
    DOCX: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    PUBLIC: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    INTERNAL: 'bg-slate-100 text-slate-600 border-slate-200',
    RESTRICTED: 'bg-red-50 text-red-700 border-red-200',
  }

  return <span className={`rounded-full border px-3 py-1 text-[10px] font-semibold ${styles[value]}`}>{value}</span>
}

function DeleteResourceModal({ resource, onClose }) {
  if (!resource) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="font-serif text-[24px] font-semibold tracking-tight text-slate-950">Xác nhận xóa tài nguyên số</h2>
        <p className="mt-3 text-[14px] leading-7 text-slate-600">Bạn đang xóa tài nguyên <strong>{resource.title}</strong>.</p>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[13px] text-slate-600">
          <p>ISBN: {resource.isbn}</p>
          <p className="mt-1">Định dạng: {resource.format}</p>
          <p className="mt-1">Quyền: {resource.permission}</p>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Hủy</button>
          <button onClick={onClose} className="rounded-2xl bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800">Xác nhận xóa</button>
        </div>
      </div>
    </div>
  )
}

function LibrarianDigitalBooks() {
  const [resourceToDelete, setResourceToDelete] = useState(null)

  return (
    <LibrarianLayout
      active="digital"
      title="Sách điện tử"
      description="Quản lý và điều phối kho tài nguyên số với kiểu card, bảng và bộ lọc đồng nhất cùng admin."
      action={
        <Link to="/librarian/digital-books/add" className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-[13px] font-semibold text-white">
          <Upload size={17} />
          Thêm tài nguyên số
        </Link>
      }
    >
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">Digital resources</p>
            <h2 className="mt-2 font-serif text-[24px] font-semibold tracking-tight text-slate-950">Danh sách tài nguyên số</h2>
          </div>
        </div>
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-slate-50 text-[13px] font-semibold text-slate-500">
            <tr>
              <th className="px-5 py-4">Tên sách</th>
              <th className="px-5 py-4">ISBN</th>
              <th className="px-5 py-4">Định dạng</th>
              <th className="px-5 py-4">Quyền</th>
              <th className="px-5 py-4">Ngày tải lên</th>
              <th className="px-5 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr key={row.id} className="hover:bg-slate-50/70">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    <span className="grid h-12 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-500">{index === 2 ? '■' : '□'}</span>
                    <span>
                      <span className="block max-w-48 font-semibold text-slate-950">{row.title}</span>
                      <span className="text-sm text-slate-600">{row.publisher}</span>
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">{row.isbn}</td>
                <td className="px-5 py-4"><Badge value={row.format} /></td>
                <td className="px-5 py-4"><Badge value={row.permission} /></td>
                <td className="px-5 py-4 text-sm text-slate-600">{row.uploadedAt}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-3 text-slate-600">
                    <Link to={`/librarian/digital-books/${row.id}/edit`} aria-label="Sửa tài nguyên"><Pencil size={17} /></Link>
                    <button onClick={() => setResourceToDelete(row)} aria-label="Xóa tài nguyên"><Trash2 size={17} className="text-red-600" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-slate-200 px-5 py-4 text-[13px] text-slate-600">Hiển thị 1-3 của 128 tài nguyên</div>
      </section>

      <DeleteResourceModal resource={resourceToDelete} onClose={() => setResourceToDelete(null)} />
    </LibrarianLayout>
  )
}

export default LibrarianDigitalBooks
