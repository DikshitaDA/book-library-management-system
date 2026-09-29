import React from 'react';
import BookItem from './BookItem';

const BookList = ({ books, loading, onEdit, onDelete, onToggleStatus }) => {
  if (loading) {
    return <div className="state-message">Fetching catalog from database...</div>;
  }

  if (books.length === 0) {
    return <div className="state-message">No volume records match the active query.</div>;
  }

  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookItem
          key={book._id}
          book={book}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
};

export default BookList;