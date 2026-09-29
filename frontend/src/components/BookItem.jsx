import React from 'react';

const BookItem = ({ book, onEdit, onDelete, onToggleStatus }) => {
  const isAvailable = book.status === 'Available';

  return (
    <div className="book-card">
      <div className="book-details">
        <div className="book-top-bar">
          <span className="genre-tag">{book.genre}</span>
          <span className="isbn-tag">ISBN: {book.isbn}</span>
        </div>
        <h4 className="book-title">{book.title}</h4>
        <p className="book-author">By {book.author} &bull; {book.publishedYear}</p>
      </div>

      <div className="book-actions">
        <button
          className={`status-pill ${isAvailable ? 'pill-available' : 'pill-checked'}`}
          onClick={() => onToggleStatus(book)}
          title="Click to toggle status"
        >
          {book.status}
        </button>

        <button className="icon-btn edit" onClick={() => onEdit(book)} title="Edit">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>

        <button className="icon-btn delete" onClick={() => onDelete(book._id)} title="Delete">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BookItem;