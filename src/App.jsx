import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/dashboard/Home'
import Login from './pages/auth/Login'
import BookList from './pages/books/BookList'
import BookDetail from './pages/books/BookDetail'
import AboutUs from './pages/books/AboutUs'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import AdminBookManage from './pages/books/admin/AdminBookManage'
import AdminDeletedBookManage from './pages/books/admin/AdminDeletedBookManage'
import AdminDigitalBookManage from './pages/books/admin/AdminDigitalBookManage'
import AdminCopyManage from './pages/books/admin/AdminCopyManage'
import AdminCategoryManage from './pages/books/admin/AdminCategoryManage'
import AdminClassificationManage from './pages/books/admin/AdminClassificationManage'
import LibrarianDashboard from './pages/books/librarian/LibrarianDashboard'
import LibrarianBookCatalog from './pages/books/librarian/LibrarianBookCatalog'
import LibrarianInventory from './pages/books/librarian/LibrarianInventory'
import LibrarianDigitalBooks from './pages/books/librarian/LibrarianDigitalBooks'
import LibrarianGenres from './pages/books/librarian/LibrarianGenres'
import LibrarianClassifications from './pages/books/librarian/LibrarianClassifications'
import LibrarianBookForm from './pages/books/librarian/LibrarianBookForm'
import LibrarianInventoryForm from './pages/books/librarian/LibrarianInventoryForm'
import LibrarianDigitalBookForm from './pages/books/librarian/LibrarianDigitalBookForm'
import LibrarianGenreForm from './pages/books/librarian/LibrarianGenreForm'
import LibrarianClassificationForm from './pages/books/librarian/LibrarianClassificationForm'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<BookList />} />
        <Route path="/books/:bookId" element={<BookDetail />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/books" element={<AdminBookManage />} />
        <Route path="/admin/books/deleted" element={<AdminDeletedBookManage />} />
        <Route path="/admin/books/add" element={<Navigate to="/admin/books" replace />} />
        <Route path="/admin/books/:bookId/edit" element={<Navigate to="/admin/books" replace />} />
        <Route path="/admin/digital-books" element={<AdminDigitalBookManage />} />
        <Route path="/admin/digital-books/add" element={<Navigate to="/admin/digital-books" replace />} />
        <Route path="/admin/digital-books/:resourceId/edit" element={<Navigate to="/admin/digital-books" replace />} />
        <Route path="/admin/copies" element={<AdminCopyManage />} />
        <Route path="/admin/copies/add" element={<Navigate to="/admin/copies" replace />} />
        <Route path="/admin/copies/:copyId/edit" element={<Navigate to="/admin/copies" replace />} />
        <Route path="/admin/categories" element={<AdminCategoryManage />} />
        <Route path="/admin/categories/add" element={<Navigate to="/admin/categories" replace />} />
        <Route path="/admin/categories/:categoryId/edit" element={<Navigate to="/admin/categories" replace />} />
        <Route path="/admin/classifications" element={<AdminClassificationManage />} />
        <Route path="/librarian" element={<LibrarianDashboard />} />
        <Route path="/librarian/books" element={<LibrarianBookCatalog />} />
        <Route path="/librarian/books/add" element={<LibrarianBookForm mode="add" />} />
        <Route path="/librarian/books/:bookId/edit" element={<LibrarianBookForm mode="edit" />} />
        <Route path="/librarian/inventory" element={<LibrarianInventory />} />
        <Route path="/librarian/inventory/add" element={<LibrarianInventoryForm mode="add" />} />
        <Route path="/librarian/inventory/:copyId/edit" element={<LibrarianInventoryForm mode="edit" />} />
        <Route path="/librarian/digital-books" element={<LibrarianDigitalBooks />} />
        <Route path="/librarian/digital-books/add" element={<LibrarianDigitalBookForm mode="add" />} />
        <Route path="/librarian/digital-books/:resourceId/edit" element={<LibrarianDigitalBookForm mode="edit" />} />
        <Route path="/librarian/genres" element={<LibrarianGenres />} />
        <Route path="/librarian/genres/add" element={<LibrarianGenreForm mode="add" />} />
        <Route path="/librarian/genres/:genreId/edit" element={<LibrarianGenreForm mode="edit" />} />
        <Route path="/librarian/classifications" element={<LibrarianClassifications />} />
        <Route path="/librarian/classifications/add" element={<LibrarianClassificationForm mode="add" />} />
        <Route path="/librarian/classifications/:classificationId/edit" element={<LibrarianClassificationForm mode="edit" />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
