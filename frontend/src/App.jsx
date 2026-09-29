// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Navbar from './components/Navbar';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import AuthModal from './components/AuthModal';

const API_ROOT = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const BOOKS_API = `${API_ROOT}/books`;

export default function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [editingBook, setEditingBook] = useState(null);
  const [notification, setNotification] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('library_user');
    return saved ? JSON.parse(saved) : null;
  });

  const showNotice = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedGenre !== 'All') params.genre = selectedGenre;
      if (selectedStatus !== 'All') params.status = selectedStatus;

      const res = await axios.get(BOOKS_API, { params });
      setBooks(res.data);
    } catch (err) {
      showNotice(err.response?.data?.message || 'Error fetching records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchBooks();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, selectedGenre, selectedStatus]);

  const handleSaveBook = async (formData) => {
    try {
      if (editingBook) {
        const res = await axios.put(`${BOOKS_API}/${editingBook._id}`, formData);
        setBooks((prev) => prev.map((b) => (b._id === editingBook._id ? res.data : b)));
        setEditingBook(null);
        showNotice('Catalog record updated');
      } else {
        const res = await axios.post(BOOKS_API, formData);
        setBooks((prev) => [res.data, ...prev]);
        showNotice('New volume registered');
      }
    } catch (err) {
      showNotice(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Delete this volume from catalog permanently?')) return;
    try {
      await axios.delete(`${BOOKS_API}/${id}`);
      setBooks((prev) => prev.filter((b) => b._id !== id));
      showNotice('Volume removed');
    } catch (err) {
      showNotice(err.response?.data?.message || 'Deletion failed');
    }
  };

  const handleToggleStatus = async (book) => {
    const updatedStatus = book.status === 'Available' ? 'Checked Out' : 'Available';
    try {
      const res = await axios.put(`${BOOKS_API}/${book._id}`, { status: updatedStatus });
      setBooks((prev) => prev.map((b) => (b._id === book._id ? res.data : b)));
    } catch (err) {
      showNotice('Status update failed');
    }
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('library_user', JSON.stringify(user));
    showNotice(`Welcome, ${user.name}`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('library_user');
    showNotice('Logged out');
  };

  const availableBooksCount = books.filter((b) => b.status === 'Available').length;

  return (
    <div className="layout-wrapper">
      <Navbar
        totalCount={books.length}
        availableCount={availableBooksCount}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      {notification && <div className="notice-banner">{notification}</div>}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      <main className="content-container">
        <BookForm
          onSave={handleSaveBook}
          editingBook={editingBook}
          onCancelEdit={() => setEditingBook(null)}
        />

        <section className="search-filter-section">
          <div className="filter-controls">
            <div className="search-bar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search by title, author, or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
              <option value="All">All Genres</option>
              <option value="Fiction">Fiction</option>
              <option value="Technology">Technology</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Philosophy">Philosophy</option>
              <option value="Biography">Biography</option>
              <option value="Other">Other</option>
            </select>

            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Checked Out">Checked Out</option>
            </select>
          </div>

          <BookList
            books={books}
            loading={loading}
            onEdit={(book) => {
              setEditingBook(book);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDelete={handleDeleteBook}
            onToggleStatus={handleToggleStatus}
          />
        </section>
      </main>
    </div>
  );
}