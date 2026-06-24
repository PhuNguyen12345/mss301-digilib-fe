import { useEffect, useMemo, useState } from 'react'
import { Archive, ArrowRight, BookOpen, GraduationCap, LibraryBig, Search, Sparkles } from 'lucide-react'
import { getBooks, searchBooks } from '@/api/bookApi'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''

function getBookCoverUrl(coverImageUrl) {
  if (!coverImageUrl) return null
  if (coverImageUrl.startsWith('http')) return coverImageUrl
  if (coverImageUrl.startsWith('/')) return `${apiBaseUrl}${coverImageUrl}`
  return `${apiBaseUrl}/${coverImageUrl}`
}

function normalizePage(data) {
  return { books: data?.content || [], totalElements: data?.totalElements || 0 }
}

function BookCover({ book }) {
  const coverUrl = getBookCoverUrl(book.coverImageUrl)

  if (coverUrl) {
    return <img src={coverUrl} alt={book.title} className="h-36 w-full object-cover" onError={(event) => { event.currentTarget.style.display = 'none' }} />
  }

  return (
    <div className="grid h-36 place-items-center bg-slate-900 px-4 text-center text-white">
      <BookOpen size={26} className="mb-2 text-amber-300" />
      <span className="line-clamp-3 text-sm font-semibold leading-6">{book.title}</span>
    </div>
  )
}

function Home() {
  const [books, setBooks] = useState([])
  const [totalBooks, setTotalBooks] = useState(0)
  const [keyword, setKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadBooks() {
      try {
        setLoading(true)
        setError('')
        const response = await getBooks({ size: 12 })
        const page = normalizePage(response.data)
        if (!ignore) {
          setBooks(page.books)
          setTotalBooks(page.totalElements)
        }
      } catch {
        if (!ignore) setError('Không tải được dữ liệu sách. Hãy kiểm tra API Gateway và catalog-service.')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadBooks()
    return () => {
      ignore = true
    }
  }, [])

  const categories = useMemo(() => {
    const categoryMap = new Map()
    books.forEach((book) => {
      if (book.categoryName) categoryMap.set(book.categoryName, book.categoryName)
    })
    return Array.from(categoryMap.values())
  }, [books])

  const visibleBooks = useMemo(() => {
    if (selectedCategory === 'all') return books
    return books.filter((book) => book.categoryName === selectedCategory)
  }, [books, selectedCategory])

  const availableBooks = useMemo(() => books.filter((book) => book.availabilityStatus === 'ACTIVE').length, [books])

  async function handleSearch(event) {
    event.preventDefault()
    try {
      setLoading(true)
      setError('')
      const request = keyword.trim() ? searchBooks({ keyword: keyword.trim(), size: 12 }) : getBooks({ size: 12 })
      const response = await request
      const page = normalizePage(response.data)
      setBooks(page.books)
      setTotalBooks(page.totalElements)
      setSelectedCategory('all')
    } catch {
      setError('Không tìm được dữ liệu phù hợp. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Header />

      <main>
        <section className="relative overflow-hidden bg-[#06264a] px-4 py-10 text-center text-white sm:px-6 lg:px-8">
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(30deg,rgba(255,255,255,.15)_12%,transparent_12.5%,transparent_87%,rgba(255,255,255,.15)_87.5%,rgba(255,255,255,.15)),linear-gradient(150deg,rgba(255,255,255,.15)_12%,transparent_12.5%,transparent_87%,rgba(255,255,255,.15)_87.5%,rgba(255,255,255,.15)),linear-gradient(30deg,rgba(255,255,255,.15)_12%,transparent_12.5%,transparent_87%,rgba(255,255,255,.15)_87.5%,rgba(255,255,255,.15)),linear-gradient(150deg,rgba(255,255,255,.15)_12%,transparent_12.5%,transparent_87%,rgba(255,255,255,.15)_87.5%,rgba(255,255,255,.15))] [background-position:0_0,0_0,28px_49px,28px_49px] [background-size:56px_98px]" />
          <div className="relative mx-auto max-w-2xl">
            <h1 className="text-[28px] font-semibold leading-tight tracking-tight sm:text-[34px] lg:text-[42px]">
              <span className="mb-1 block text-amber-300">Readora</span>
              <span className="block">Chào mừng đến với</span>
              <span className="block">Kho tàng tri thức toàn cầu</span>
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-[13px] leading-6 text-slate-300 sm:text-sm">
              Tìm kiếm sách, tác giả và danh mục đang có thật trong hệ thống thư viện số.
            </p>

            <form onSubmit={handleSearch} className="mx-auto mt-6 flex max-w-xl flex-col overflow-hidden rounded-lg border border-slate-200 bg-white p-1.5 shadow-2xl sm:flex-row">
              <label className="flex flex-1 items-center gap-2.5 px-3 text-slate-500">
                <Search size={16} />
                <input value={keyword} onChange={(event) => setKeyword(event.target.value)} className="h-10 w-full bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-500" placeholder="Tìm tên sách, tác giả hoặc ISBN..." />
              </label>
              <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className="h-10 border-t border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none sm:border-l sm:border-t-0">
                <option value="all">Tất cả danh mục</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <button className="h-10 bg-slate-950 px-5 text-[13px] font-semibold uppercase tracking-wide text-white transition hover:bg-slate-800">
                Tìm kiếm
              </button>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-slate-200 bg-white p-3.5">
              <p className="text-[13px] font-medium text-slate-500">Tổng đầu sách</p>
              <p className="mt-1.5 text-xl font-semibold">{totalBooks}</p>
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-3.5">
              <p className="text-[13px] font-medium text-slate-500">Đang hoạt động</p>
              <p className="mt-1.5 text-xl font-semibold">{availableBooks}</p>
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-3.5">
              <p className="text-[13px] font-medium text-slate-500">Danh mục hiển thị</p>
              <p className="mt-1.5 text-xl font-semibold">{categories.length}</p>
            </div>
          </div>

          <div className="mt-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-[26px] font-semibold tracking-tight sm:text-[30px]">Sách mới trong thư viện</h2>
            </div>
            <a href="#books" className="hidden items-center gap-1 text-[13px] font-medium text-slate-700 hover:text-slate-950 sm:flex">
              Xem danh sách <ArrowRight size={15} />
            </a>
          </div>

          {error && <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <div id="books" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="h-64 animate-pulse rounded-md bg-white shadow-sm">
                    <div className="h-36 rounded-t-md bg-slate-200" />
                    <div className="space-y-3 p-3.5">
                      <div className="h-4 rounded bg-slate-200" />
                      <div className="h-4 w-2/3 rounded bg-slate-200" />
                      <div className="h-3 w-1/2 rounded bg-slate-100" />
                    </div>
                  </div>
                ))
              : visibleBooks.map((book) => (
                  <article key={book.bookId} className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    <BookCover book={book} />
                    <div className="p-3.5">
                      <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        <span className="truncate">{book.categoryName || 'Chưa phân loại'}</span>
                        <span className="rounded bg-emerald-50 px-2 py-1 text-emerald-700">{book.availabilityStatus || 'N/A'}</span>
                      </div>
                      <h3 className="mt-3 line-clamp-2 min-h-11 text-[15px] font-semibold leading-6">{book.title}</h3>
                      <p className="mt-1.5 line-clamp-1 text-[13px] text-slate-600">{book.author}</p>
                      <p className="mt-2.5 line-clamp-3 min-h-14 text-[13px] leading-6 text-slate-500">{book.description || 'Chưa có mô tả cho tài liệu này.'}</p>
                      <div className="mt-3 flex items-center justify-between text-[13px]">
                        <span className="font-medium text-slate-700">{book.publicationYear || 'Không rõ năm'}</span>
                        <span className="text-slate-500">{book.language || 'N/A'}</span>
                      </div>
                    </div>
                  </article>
                ))}
          </div>

          {!loading && visibleBooks.length === 0 && <div className="mt-6 rounded-md border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">Không có sách phù hợp với bộ lọc hiện tại.</div>}

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.25fr_1fr]">
            <article className="relative min-h-56 overflow-hidden rounded-md bg-slate-900 p-5 text-white">
              <LibraryBig size={38} className="mb-5 text-amber-300" />
              <h3 className="font-serif text-[24px] font-semibold tracking-tight">Kho sách theo dữ liệu thật</h3>
              <p className="mt-3 max-w-2xl text-[13px] leading-6 text-slate-300">
                Các đầu sách phía trên được tải trực tiếp từ endpoint `/api/catalog/books`.
                Khi backend cập nhật dữ liệu, trang home sẽ đổi theo.
              </p>
            </article>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <article className="rounded-md border border-slate-300 bg-white p-5">
                <GraduationCap size={22} className="text-slate-950" />
                <h3 className="mt-3 text-lg font-semibold">Tra cứu học thuật</h3>
                <p className="mt-3 text-[13px] leading-6 text-slate-600">
                  Lọc nhanh theo danh mục, tìm theo từ khóa và xem thông tin tác giả, nhà xuất bản, năm phát hành.
                </p>
              </article>
              <article className="rounded-md border border-slate-300 bg-white p-5">
                <Archive size={22} className="text-slate-950" />
                <h3 className="mt-3 text-lg font-semibold">Tài nguyên số</h3>
                <p className="mt-3 text-[13px] leading-6 text-slate-600">
                  Sẵn sàng mở rộng để hiển thị file PDF, quyền truy cập và bản sao sách từ các endpoint catalog khác.
                </p>
              </article>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 rounded-md bg-[#020b1b] p-4 text-white sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded bg-blue-200 text-slate-950">
                <Sparkles size={18} />
              </span>
              <div>
                <h3 className="text-lg font-semibold">Dữ liệu luôn đồng bộ</h3>
                <p className="mt-1 text-[13px] text-slate-400">Trang home đang dùng dữ liệu thật từ catalog-service qua API Gateway.</p>
              </div>
            </div>
            <a href="#books" className="w-fit border border-slate-500 px-5 py-2 text-[13px] font-semibold text-white hover:border-white">Xem sách</a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home
