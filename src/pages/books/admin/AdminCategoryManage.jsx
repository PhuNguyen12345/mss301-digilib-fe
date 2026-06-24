import { useState } from 'react'
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Edit3,
  FolderTree,
  Plus,
  RefreshCw,
  Search,
  Tags,
  TrendingUp,
  Trash2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminLayout from '@/components/layout/AdminLayout'

const categories = [
  {
    id: 'CAT-001',
    name: 'Khoa học & Công nghệ',
    group: 'Lĩnh vực STEM',
    description: 'Tập trung vào lập trình, cơ sở dữ liệu, AI và các ngành công nghệ ứng dụng.',
    books: '1,240',
  },
  {
    id: 'CAT-002',
    name: 'Văn học Nghệ thuật',
    group: 'Nhân văn',
    description: 'Bao gồm văn học cổ điển, hiện đại và các đầu sách về nghệ thuật biểu đạt.',
    books: '856',
  },
  {
    id: 'CAT-003',
    name: 'Kinh tế & Tài chính',
    group: 'Chuyên ngành',
    description: 'Hệ thống giáo trình và tài liệu về kinh tế vi mô, vĩ mô và quản trị.',
    books: '2,105',
  },
  {
    id: 'CAT-004',
    name: 'Ngoại ngữ',
    group: 'Hỗ trợ học tập',
    description: 'Phục vụ học tiếng Anh, Nhật, Hàn và các ngôn ngữ khác theo nhiều cấp độ.',
    books: '532',
  },
  {
    id: 'CAT-005',
    name: 'Kỹ năng mềm',
    group: 'Phát triển cá nhân',
    description: 'Rèn luyện giao tiếp, tư duy phản biện và năng lực làm việc chuyên nghiệp.',
    books: '421',
  },
]

const metrics = [
  { title: 'Tổng số danh mục', value: '42', note: 'Đang hoạt động', icon: Tags },
  { title: 'Danh mục nổi bật', value: '16', note: 'Cập nhật tốt', icon: FolderTree },
  { title: 'Mới trong tháng', value: '+5', note: 'Tăng trưởng', icon: TrendingUp },
  { title: 'Chưa gắn sách', value: '02', note: 'Cần rà soát', icon: AlertTriangle, danger: true },
]

function MetricCard({ title, value, note, icon: Icon, danger }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
      <div className="flex items-start justify-between">
        <p className="text-[13px] font-medium text-slate-500">{title}</p>
        <span
          className={`grid h-10 w-10 place-items-center rounded-2xl ${
            danger ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-900'
          }`}
        >
          <Icon size={18} />
        </span>
      </div>
      <p className={`mt-4 text-2xl font-semibold ${danger ? 'text-red-700' : 'text-slate-950'}`}>{value}</p>
      <p className={`mt-1.5 text-[13px] ${danger ? 'text-red-500' : 'text-slate-500'}`}>{note}</p>
    </div>
  )
}

function DeleteCategoryModal({ category, onClose }) {
  if (!category) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="font-serif text-[24px] font-semibold tracking-tight text-slate-950">Xác nhận xóa danh mục</h2>
        <p className="mt-3 text-[14px] leading-7 text-slate-600">
          Danh mục <strong>{category.name}</strong> sẽ bị xóa khỏi cấu trúc phân loại hiện tại.
        </p>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[13px] text-slate-600">
          <p>Mã danh mục: {category.id}</p>
          <p className="mt-1">Nhóm: {category.group}</p>
          <p className="mt-1">Số đầu sách liên kết: {category.books}</p>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">
            Hủy
          </button>
          <button onClick={onClose} className="rounded-2xl bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800">
            Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  )
}

function AdminCategoryManage() {
  const [categoryToDelete, setCategoryToDelete] = useState(null)

  return (
    <AdminLayout
      active="categories"
      title="Quản lý Danh mục"
      description="Sắp xếp chủ đề sách theo cấu trúc gọn gàng, dễ tra cứu và nhất quán với giao diện trang chủ."
      action={
        <Link to="/admin/categories/add" className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-[13px] font-semibold text-white transition hover:bg-slate-800">
          <Plus size={16} />
          Thêm danh mục mới
        </Link>
      }
    >
      <section className="grid gap-4 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </section>

      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_40px_-28px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">Category structure</p>
            <h2 className="mt-2 font-serif text-[24px] font-semibold tracking-tight text-slate-950">Danh sách danh mục</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="flex h-10 items-center gap-2 rounded-2xl border border-slate-300 px-3 text-[13px] text-slate-500">
              <Search size={15} />
              <input className="w-44 bg-transparent outline-none placeholder:text-slate-400" placeholder="Tìm danh mục..." />
            </label>
            <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-3 py-2 text-[13px] font-medium text-slate-700">
              <RefreshCw size={15} />
              Làm mới
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left">
            <thead className="bg-slate-50 text-[13px] font-semibold text-slate-500">
              <tr>
                <th className="px-5 py-4">Mã danh mục</th>
                <th className="px-5 py-4">Tên danh mục</th>
                <th className="px-5 py-4">Mô tả</th>
                <th className="px-5 py-4 text-center">Số đầu sách</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4 text-[13px] text-slate-600">{category.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-950">{category.name}</p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{category.group}</p>
                  </td>
                  <td className="px-5 py-4 text-[13px] leading-6 text-slate-600">{category.description}</td>
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-700">{category.books}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/categories/${category.id}/edit`} className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950" aria-label="Sửa danh mục">
                        <Edit3 size={16} />
                      </Link>
                      <button onClick={() => setCategoryToDelete(category)} className="rounded-full p-2 text-slate-600 transition hover:bg-red-50 hover:text-red-700" aria-label="Xóa danh mục">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-[13px] text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>Hiển thị 1 - 5 trên tổng số 42 danh mục</p>
          <div className="flex items-center gap-2">
            <button className="grid h-9 w-9 place-items-center rounded-xl border border-slate-300 bg-white disabled:opacity-50" aria-label="Trang trước">
              <ChevronLeft size={16} />
            </button>
            {[1, 2, 3].map((page) => (
              <button key={page} className={`h-9 w-9 rounded-xl border text-[13px] ${page === 1 ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-300 bg-white text-slate-700'}`}>
                {page}
              </button>
            ))}
            <button className="grid h-9 w-9 place-items-center rounded-xl border border-slate-300 bg-white" aria-label="Trang sau">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <DeleteCategoryModal category={categoryToDelete} onClose={() => setCategoryToDelete(null)} />
    </AdminLayout>
  )
}

export default AdminCategoryManage
