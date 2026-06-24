import { useEffect, useMemo, useState } from 'react'
import { Bookmark, ChevronDown, ChevronLeft, ChevronRight, ListFilter, Search } from 'lucide-react'
import { getBooks, searchBooks } from '@/api/bookApi'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import { Link } from 'react-router-dom'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
const pageSize = 24

const fallbackBooks = [
  { bookId: 'demo-1', title: 'Cơ sở dữ liệu và Hệ quản trị tri thức', author: 'GS. Nguyễn Văn A', categoryName: 'Khoa học', publicationYear: 2023, availabilityStatus: 'ACTIVE', materialType: 'Sách' },
  { bookId: 'demo-2', title: 'Kinh tế học số: Lý thuyết và Thực tiễn ứng dụng', author: 'PGS. Trần Thị B', categoryName: 'Kinh tế', publicationYear: 2022, availabilityStatus: 'BORROWED', materialType: 'Sách' },
  { bookId: 'demo-3', title: 'Quy hoạch Đô thị và Phát triển Bền vững', author: 'TS. Lê Hoàng C', categoryName: 'Công nghệ', publicationYear: 2024, availabilityStatus: 'ACTIVE', materialType: 'Luận văn' },
  { bookId: 'demo-4', title: 'Tạp chí Khoa học & Công nghệ - Số Đặc biệt', author: 'Hội đồng Khoa học Readora', categoryName: 'Tạp chí', publicationYear: 2024, availabilityStatus: 'ACTIVE', materialType: 'Tạp chí' },
]

const materialTypes = [
  { label: 'Sách', value: 'Sách' },
  { label: 'Tạp chí', value: 'Tạp chí' },
  { label: 'Luận văn', value: 'Luận văn' },
  { label: 'Bản đồ', value: 'Bản đồ' },
]

const topics = ['Khoa học', 'Công nghệ', 'Kinh tế', 'Lịch sử']

function getBookCoverUrl(coverImageUrl) {
  if (!coverImageUrl) return null
  if (coverImageUrl.startsWith('http')) return coverImageUrl
  if (coverImageUrl.startsWith('/')) return `${apiBaseUrl}${coverImageUrl}`
  return `${apiBaseUrl}/${coverImageUrl}`
}

function normalizePage(data) {
  return { books: data?.content || [], totalElements: data?.totalElements || 0, totalPages: data?.totalPages || 1 }
}

function getMaterialType(book) {
  return book.materialType || book.type || book.documentType || book.categoryName || 'Sách'
}

function getStatusLabel(status) {
  const normalized = String(status || '').toUpperCase()
  if (normalized.includes('OVERDUE')) return 'Quá hạn'
  if (normalized.includes('BORROW')) return 'Đang mượn'
  return 'Sẵn có'
}

function BookCover({ book, index }) {
  const coverUrl = getBookCoverUrl(book.coverImageUrl)

  if (coverUrl) {
    return <img src={coverUrl} alt={book.title} className="h-48 w-full object-cover" onError={(event) => { event.currentTarget.style.display = 'none' }} />
  }

  const variants = [
    'from-[#24364b] via-[#162334] to-[#07111f]',
    'from-[#e8edf2] via-[#d6dde4] to-[#f8fafc]',
    'from-[#111827] via-[#202c36] to-[#f3f4f6]',
    'from-[#eef2f3] via-[#c8d5d2] to-[#1f2933]',
  ]

  return (
    <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${variants[index % variants.length]}`}>
      <div className="absolute inset-x-8 bottom-7 top-8 rounded-sm border border-white/25 bg-black/20 shadow-2xl backdrop-blur-[1px]" />
      <div className="absolute inset-x-12 bottom-10 top-12 rounded-sm border border-amber-200/40 bg-white/10" />
      <p className="absolute inset-x-12 top-24 line-clamp-3 text-center text-sm font-bold leading-5 text-white">{book.title}</p>
    </div>
  )
}

function FilterCheckbox({ label, checked, count, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-[13px] text-slate-800">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 rounded border-slate-400 accent-slate-950" />
      <span>{label}</span>
      {typeof count === 'number' && <span className="text-slate-500">({count.toLocaleString('vi-VN')})</span>}
    </label>
  )
}

function BookList() {
  const [books, setBooks] = useState([])
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(0)
  const [keyword, setKeyword] = useState('')
  const [submittedKeyword, setSubmittedKeyword] = useState('')
  const [sort, setSort] = useState('createdAt,desc')
  const [selectedTypes, setSelectedTypes] = useState(['Sách'])
  const [selectedTopics, setSelectedTopics] = useState([])
  const [status, setStatus] = useState('')
  const [year, setYear] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    async function loadBooks() {
      try {
        setLoading(true)
        setError('')
        const request = submittedKeyword ? searchBooks({ keyword: submittedKeyword, page, size: pageSize, sort }) : getBooks({ page, size: pageSize, sort })
        const response = await request
        const data = normalizePage(response.data)
        if (!ignore) {
          setBooks(data.books)
          setTotalElements(data.totalElements)
          setTotalPages(data.totalPages)
        }
      } catch {
        if (!ignore) {
          setBooks(fallbackBooks)
          setTotalElements(6313)
          setTotalPages(264)
          setError('Đang hiển thị dữ liệu mẫu vì chưa kết nối được catalog-service.')
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    loadBooks()
    return () => { ignore = true }
  }, [page, sort, submittedKeyword])

  const typeCounts = useMemo(() => {
    const counts = new Map(materialTypes.map((type) => [type.value, 0]))
    books.forEach((book) => {
      const type = getMaterialType(book)
      counts.set(type, (counts.get(type) || 0) + 1)
    })
    return counts
  }, [books])

  const visibleBooks = useMemo(() => {
    return books.filter((book) => {
      const materialType = getMaterialType(book)
      const bookStatus = getStatusLabel(book.availabilityStatus)
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(materialType)
      const matchesTopic = selectedTopics.length === 0 || selectedTopics.includes(book.categoryName)
      const matchesYear = !year || String(book.publicationYear) === year
      const matchesStatus = !status || bookStatus === status
      return matchesType && matchesTopic && matchesYear && matchesStatus
    })
  }, [books, selectedTypes, selectedTopics, status, year])

  const years = useMemo(() => {
    const values = books.map((book) => book.publicationYear).filter(Boolean).map(String)
    return [...new Set(values)].sort((a, b) => Number(b) - Number(a))
  }, [books])

  function handleSearch(event) {
    event.preventDefault()
    setSubmittedKeyword(keyword.trim())
    setPage(0)
  }

  function toggleValue(value, selected, setter) {
    setter(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value])
  }

  function clearFilters() {
    setSelectedTypes([])
    setSelectedTopics([])
    setStatus('')
    setYear('')
  }

  const pageNumbers = [0, 1, 2].filter((item) => item < totalPages)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Header />

      <main>
        <section className="bg-[#082b51] px-4 py-8 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="text-[13px] font-semibold text-blue-200">Trang chủ &gt; Danh mục</p>
            <h1 className="mt-2 font-serif text-[30px] font-semibold tracking-tight sm:text-[32px]">Danh mục Tài liệu số</h1>

            <form onSubmit={handleSearch} className="mt-5 flex max-w-2xl flex-col gap-3 sm:flex-row">
              <label className="flex h-10 flex-1 items-center gap-2.5 rounded bg-white px-3 text-slate-500">
                <Search size={16} />
                <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Tìm theo tên sách, tác giả, ISBN hoặc từ khóa..." className="h-full w-full bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-500" />
              </label>
              <button className="inline-flex h-10 items-center justify-center gap-2 rounded bg-[#817000] px-5 text-[13px] font-semibold text-white transition hover:bg-[#6e6000]">
                <ListFilter size={15} />
                Tìm kiếm
              </button>
            </form>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
          <aside className="h-fit rounded border border-slate-300 bg-white p-4.5">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold">Bộ lọc</h2>
              <button onClick={clearFilters} className="text-[13px] underline underline-offset-4 hover:text-slate-600">Xóa hết</button>
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Loại tài liệu</h3>
                <div className="mt-3.5 space-y-2.5">
                  {materialTypes.map((type) => (
                    <FilterCheckbox key={type.value} label={type.label} count={typeCounts.get(type.value)} checked={selectedTypes.includes(type.value)} onChange={() => toggleValue(type.value, selectedTypes, setSelectedTypes)} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Chủ đề</h3>
                <div className="mt-3.5 space-y-2.5">
                  {topics.map((topic) => (
                    <FilterCheckbox key={topic} label={topic} checked={selectedTopics.includes(topic)} onChange={() => toggleValue(topic, selectedTopics, setSelectedTopics)} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Năm xuất bản</h3>
                <label className="mt-3.5 flex h-9 items-center justify-between rounded border border-slate-300 px-3 text-sm text-slate-700">
                  <select value={year} onChange={(event) => setYear(event.target.value)} className="h-full w-full appearance-none bg-transparent outline-none">
                    <option value="">Tất cả thời gian</option>
                    {years.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                  <ChevronDown size={15} />
                </label>
              </div>

              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wide text-slate-600">Trạng thái</h3>
                <div className="mt-3.5 space-y-2.5">
                  {['Sẵn có', 'Đang mượn'].map((item) => (
                    <label key={item} className="flex cursor-pointer items-center gap-2 text-[13px] text-slate-800">
                      <input type="radio" name="status" checked={status === item} onChange={() => setStatus(item)} className="h-4 w-4 accent-slate-950" />
                      {item}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-700">Hiển thị {visibleBooks.length} trên {totalElements.toLocaleString('vi-VN')} kết quả</p>
                {error && <p className="mt-1 text-sm text-amber-700">{error}</p>}
              </div>

              <label className="flex items-center gap-2 text-[13px] text-slate-700">
                Sắp xếp theo:
                <select value={sort} onChange={(event) => { setSort(event.target.value); setPage(0) }} className="h-8 rounded-none border border-slate-300 bg-white px-2.5 outline-none">
                  <option value="createdAt,desc">Mới nhất</option>
                  <option value="title,asc">Tên A-Z</option>
                  <option value="publicationYear,desc">Năm mới nhất</option>
                </select>
              </label>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {loading
                ? Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="h-[340px] animate-pulse rounded border border-slate-200 bg-white">
                      <div className="h-48 bg-slate-200" />
                      <div className="space-y-3 p-3.5">
                        <div className="h-4 rounded bg-slate-200" />
                        <div className="h-4 w-4/5 rounded bg-slate-200" />
                        <div className="h-3 w-2/3 rounded bg-slate-100" />
                      </div>
                    </div>
                  ))
                : visibleBooks.map((book, index) => {
                    const statusLabel = getStatusLabel(book.availabilityStatus)
                    const isLate = statusLabel === 'Quá hạn'
                    return (
                      <article key={book.bookId || `${book.title}-${index}`} className="overflow-hidden rounded border border-slate-300 bg-white transition hover:-translate-y-1 hover:shadow-md">
                        <Link to={`/books/${book.bookId || `demo-${index + 1}`}`} className="relative block">
                          <BookCover book={book} index={index} />
                          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${isLate ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>{statusLabel}</span>
                        </Link>
                        <div className="p-3">
                          <Link to={`/books/${book.bookId || `demo-${index + 1}`}`} className="line-clamp-2 min-h-10 font-serif text-[15px] font-semibold leading-6 hover:text-amber-700">{book.title}</Link>
                          <p className="mt-1.5 line-clamp-1 text-[13px] italic text-slate-600">{book.author || 'Chưa cập nhật tác giả'}</p>
                          <div className="mt-5 border-t border-slate-200 pt-3">
                            <div className="flex items-center justify-between gap-3 text-[13px] text-slate-600">
                              <span className="truncate">{book.publicationYear || 'Không rõ năm'} • {book.categoryName || 'Chưa phân loại'}</span>
                              <button aria-label="Lưu tài liệu" className="shrink-0 text-slate-950 hover:text-amber-700"><Bookmark size={17} /></button>
                            </div>
                          </div>
                        </div>
                      </article>
                    )
                  })}
            </div>

            {!loading && visibleBooks.length === 0 && <div className="mt-5 rounded border border-slate-300 bg-white p-6 text-center text-sm text-slate-600">Không có tài liệu phù hợp với bộ lọc hiện tại.</div>}

            <div className="mt-8 flex items-center justify-center gap-2">
              <button onClick={() => setPage((current) => Math.max(0, current - 1))} disabled={page === 0} className="grid h-9 w-9 place-items-center rounded border border-slate-300 bg-white disabled:opacity-50" aria-label="Trang trước"><ChevronLeft size={16} /></button>
              {pageNumbers.map((item) => (
                <button key={item} onClick={() => setPage(item)} className={`h-9 w-9 rounded border text-[13px] ${page === item ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-300 bg-white text-slate-700'}`}>{item + 1}</button>
              ))}
              {totalPages > 4 && <span className="px-2 text-slate-600">...</span>}
              {totalPages > 3 && <button onClick={() => setPage(totalPages - 1)} className="h-9 min-w-9 rounded border border-slate-300 bg-white px-3 text-[13px] text-slate-700">{totalPages}</button>}
              <button onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))} disabled={page >= totalPages - 1} className="grid h-9 w-9 place-items-center rounded border border-slate-300 bg-white disabled:opacity-50" aria-label="Trang sau"><ChevronRight size={16} /></button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default BookList
