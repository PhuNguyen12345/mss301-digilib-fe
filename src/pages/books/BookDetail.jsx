import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  FileText,
  Globe2,
  History,
  Library,
  MapPin,
  Navigation,
  Star,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { getBookById, getBooks } from '@/api/bookApi'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''

const fallbackBook = {
  bookId: 'demo-1',
  title: 'Cơ sở dữ liệu và Hệ quản trị tri thức',
  author: 'GS. Nguyễn Văn A',
  categoryName: 'Công nghệ thông tin',
  publicationYear: 2023,
  language: 'VIETNAMESE',
  availabilityStatus: 'ACTIVE',
  borrowCount: 1200,
  rating: 4.8,
  availableCopies: 4,
  shelfLocation: 'Tầng 3 - Kệ 04-B',
  locationName: 'Cơ sở chính',
  description:
    'Cuốn giáo trình "Cơ sở dữ liệu và Hệ quản trị tri thức" cung cấp cái nhìn toàn diện về kiến thức dữ liệu hiện đại. Tác giả đi sâu vào các mô hình dữ liệu quan hệ, ngôn ngữ SQL, và đặc biệt là sự giao thoa giữa quản lý dữ liệu truyền thống với các hệ thống dựa trên tri thức.',
  summary:
    'Sách phù hợp cho sinh viên chuyên ngành Công nghệ thông tin, Hệ thống thông tin quản lý và các nhà nghiên cứu đang tìm kiếm nền tảng lý thuyết vững chắc kết hợp với các ví dụ thực tiễn trong kỷ nguyên dữ liệu lớn.',
  isbn: '978-604-123-456-7',
  publisher: 'Readora Academic Press',
  pages: 428,
}

const fallbackRelatedBooks = [
  { bookId: 'related-1', title: 'Kỹ thuật tri thức và Hệ chuyên gia', author: 'Lê Văn B.', code: 'DDC 006' },
  { bookId: 'related-2', title: 'Cơ sở dữ liệu phân tán', author: 'Trần Thị C.' },
  { bookId: 'related-3', title: 'Phân tích dữ liệu lớn', author: 'Hoàng Minh D.' },
  { bookId: 'related-4', title: 'Quản trị Hệ thống thông tin', author: 'Phạm Tuấn E.' },
  { bookId: 'related-5', title: 'Ngôn ngữ truy vấn SQL nâng cao', author: 'Đặng Vân F.' },
]

function getBookCoverUrl(coverImageUrl) {
  if (!coverImageUrl) return null
  if (coverImageUrl.startsWith('http')) return coverImageUrl
  if (coverImageUrl.startsWith('/')) return `${apiBaseUrl}${coverImageUrl}`
  return `${apiBaseUrl}/${coverImageUrl}`
}

function formatBorrowCount(value) {
  const count = Number(value || 0)
  if (count >= 1000) return `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1)}k`
  return count.toLocaleString('vi-VN')
}

function getAvailableCopies(book) {
  return book.availableCopies ?? book.availableQuantity ?? book.copyAvailable ?? 4
}

function DetailCover({ book }) {
  const coverUrl = getBookCoverUrl(book.coverImageUrl)

  if (coverUrl) {
    return (
      <img
        src={coverUrl}
        alt={book.title}
        className="h-full w-full rounded border border-slate-300 object-cover"
      />
    )
  }

  return (
    <div className="relative flex h-full min-h-[470px] items-center justify-center rounded border border-slate-300 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8">
      <div className="relative h-[330px] w-[230px] rotate-[-4deg] rounded-sm bg-[#092b45] shadow-2xl">
        <div className="absolute inset-y-0 left-0 w-8 rounded-l-sm bg-[#06172a]" />
        <div className="absolute inset-x-10 top-20 h-px bg-cyan-300/70" />
        <div className="absolute inset-x-12 top-28 h-px bg-cyan-300/30" />
        <div className="absolute inset-x-10 bottom-20 h-28 border border-cyan-300/40" />
        <p className="absolute inset-x-8 top-32 text-center text-sm font-bold uppercase leading-6 text-white">
          {book.title}
        </p>
      </div>
    </div>
  )
}

function RelatedCover({ book, index }) {
  const variants = [
    'from-[#0d3b3d] via-[#0f5a55] to-[#021314]',
    'from-[#eef2f6] via-[#0b4b73] to-[#05243c]',
    'from-[#6f9291] via-[#174456] to-[#091923]',
    'from-[#132f35] via-[#33505a] to-[#081418]',
    'from-[#f8fafc] via-[#152234] to-[#020817]',
  ]

  return (
    <div className={`relative h-80 rounded border border-slate-300 bg-gradient-to-br ${variants[index % variants.length]} p-7`}>
      {book.code && (
        <span className="absolute right-3 top-3 rounded-sm bg-white px-2 py-1 text-xs font-bold text-slate-950">
          {book.code}
        </span>
      )}
      <div className="mx-auto mt-10 h-44 w-32 rounded-sm border border-white/20 bg-black/20 shadow-2xl" />
      <p className="absolute inset-x-8 top-32 text-center text-sm font-bold uppercase tracking-wide text-white">
        {book.title}
      </p>
    </div>
  )
}

function BookDetail() {
  const { bookId } = useParams()
  const [book, setBook] = useState(fallbackBook)
  const [relatedBooks, setRelatedBooks] = useState(fallbackRelatedBooks)
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    let ignore = false

    async function loadBook() {
      try {
        const response = await getBookById(bookId)

        if (!ignore) {
          setBook({ ...fallbackBook, ...response.data })
        }
      } catch {
        if (!ignore) {
          setBook(fallbackBook)
        }
      }
    }

    if (bookId) {
      loadBook()
    }

    return () => {
      ignore = true
    }
  }, [bookId])

  useEffect(() => {
    let ignore = false

    async function loadRelatedBooks() {
      try {
        const response = await getBooks({ size: 5 })
        const books = response.data?.content || []

        if (!ignore && books.length > 0) {
          setRelatedBooks(books.filter((item) => item.bookId !== bookId).slice(0, 5))
        }
      } catch {
        if (!ignore) {
          setRelatedBooks(fallbackRelatedBooks)
        }
      }
    }

    loadRelatedBooks()

    return () => {
      ignore = true
    }
  }, [bookId])

  const detailRows = useMemo(
    () => [
      ['ISBN', book.isbn || 'Đang cập nhật'],
      ['Nhà xuất bản', book.publisher || 'Readora Academic Press'],
      ['Năm xuất bản', book.publicationYear || 'Đang cập nhật'],
      ['Số trang', book.pages || book.pageCount || 'Đang cập nhật'],
      ['Chủ đề', book.categoryName || 'Chưa phân loại'],
    ],
    [book],
  )

  const availableCopies = getAvailableCopies(book)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Header />

      <main>
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
          <Link
            to="/books"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-950 hover:text-amber-700"
          >
            <ArrowLeft size={18} />
            Quay lại danh mục
          </Link>

          <p className="mt-4 text-sm font-semibold text-slate-600">
            Trang chủ &gt; {book.categoryName || 'Danh mục'} &gt; {book.title}
          </p>

          <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr_380px]">
            <div className="h-fit">
              <DetailCover book={book} />
            </div>

            <section>
              <h1 className="font-serif text-4xl font-bold leading-tight text-slate-950 lg:text-5xl">
                {book.title}
              </h1>
              <p className="mt-4 text-xl italic text-slate-600">{book.author || 'Chưa cập nhật tác giả'}</p>

              <div className="mt-7 grid gap-5 border-y border-slate-300 py-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-slate-600">Đánh giá</p>
                  <p className="mt-1 flex items-center gap-1 text-2xl font-semibold">
                    <Star size={22} className="fill-[#8a7600] text-[#8a7600]" />
                    {book.rating || 4.8}
                    <span className="text-sm font-normal text-slate-600">/ 5</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-slate-600">Lượt mượn</p>
                  <p className="mt-1 flex items-center gap-2 text-2xl font-semibold">
                    <Library size={22} />
                    {formatBorrowCount(book.borrowCount || 1200)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-slate-600">Ngôn ngữ</p>
                  <p className="mt-1 flex items-center gap-2 font-serif text-2xl font-semibold">
                    <Globe2 size={22} />
                    {book.language || 'VIETNAMESE'}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <button className="inline-flex h-16 items-center justify-center gap-3 rounded bg-slate-950 px-8 text-sm font-bold text-white transition hover:bg-slate-800">
                  <BookOpen size={22} />
                  Đăng ký mượn sách
                </button>
                <button className="inline-flex h-16 items-center justify-center gap-3 rounded border-2 border-slate-950 px-8 text-sm font-bold text-slate-950 transition hover:bg-white">
                  <FileText size={22} />
                  Đọc bản điện tử
                </button>
              </div>

              <div className="mt-8 border-b border-slate-300">
                {[
                  ['description', 'Mô tả'],
                  ['detail', 'Thông tin chi tiết'],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setActiveTab(value)}
                    className={`mr-8 border-b-2 px-6 py-4 text-sm font-bold ${
                      activeTab === value
                        ? 'border-slate-950 text-slate-950'
                        : 'border-transparent text-slate-500'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {activeTab === 'description' ? (
                <div className="mt-7 max-w-xl space-y-5 text-base leading-8 text-slate-800">
                  <p>{book.description || fallbackBook.description}</p>
                  <p>{book.summary || fallbackBook.summary}</p>
                </div>
              ) : (
                <dl className="mt-7 max-w-xl divide-y divide-slate-200 rounded border border-slate-200 bg-white">
                  {detailRows.map(([label, value]) => (
                    <div key={label} className="grid grid-cols-[140px_1fr] gap-4 px-4 py-3 text-sm">
                      <dt className="font-bold text-slate-600">{label}</dt>
                      <dd className="text-slate-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </section>

            <aside className="space-y-8">
              <section className="overflow-hidden rounded border border-slate-300 bg-white">
                <h2 className="border-b border-slate-300 bg-slate-200 px-6 py-4 text-sm font-bold uppercase tracking-wide">
                  Tình trạng khả dụng
                </h2>

                <div className="p-6">
                  <div className="flex items-center justify-between gap-4 border-b border-slate-300 pb-6">
                    <div className="flex items-center gap-4">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#092b51] text-white">
                        <MapPin size={18} />
                      </span>
                      <div>
                        <p className="font-bold">{book.locationName || 'Cơ sở chính'}</p>
                        <p className="text-sm text-slate-600">{book.shelfLocation || 'Tầng 3 - Kệ 04-B'}</p>
                      </div>
                    </div>
                    <span className="bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase text-emerald-700">
                      Sẵn sàng
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between text-sm">
                    <span className="text-slate-600">Số bản còn lại:</span>
                    <strong className="text-lg">{String(availableCopies).padStart(2, '0')} bản</strong>
                  </div>
                  <div className="mt-3 h-1 bg-slate-200">
                    <div className="h-full w-4/5 bg-emerald-500" />
                  </div>

                  <button className="mt-6 inline-flex h-11 w-full items-center justify-center gap-3 rounded bg-amber-200 text-sm font-bold text-[#817000] transition hover:bg-amber-300">
                    <Navigation size={19} />
                    Chỉ đường đến kệ
                  </button>
                </div>
              </section>

              <section className="rounded border border-slate-300 bg-white p-6">
                <h2 className="font-bold text-slate-700">Lịch sử cá nhân</h2>
                <p className="mt-5 flex items-center gap-4 text-sm text-slate-600">
                  <History size={22} />
                  Bạn chưa từng mượn cuốn sách này.
                </p>
              </section>
            </aside>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="font-serif text-3xl font-semibold">Sách liên quan</h2>
              <p className="mt-1 text-sm text-slate-600">Khám phá các tài liệu khác cùng chủ đề quản trị tri thức</p>
            </div>
            <Link to="/books" className="hidden items-center gap-1 text-sm font-bold hover:text-amber-700 sm:flex">
              Xem tất cả <ArrowRight size={20} />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {relatedBooks.map((item, index) => (
              <Link
                key={item.bookId || `${item.title}-${index}`}
                to={`/books/${item.bookId || `related-${index + 1}`}`}
                className="group block"
              >
                <RelatedCover book={item} index={index} />
                <h3 className="mt-3 line-clamp-2 text-sm font-bold leading-5 group-hover:text-amber-700">
                  {item.title}
                </h3>
                <p className="mt-1 line-clamp-1 text-sm text-slate-600">{item.author || 'Chưa cập nhật'}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default BookDetail
