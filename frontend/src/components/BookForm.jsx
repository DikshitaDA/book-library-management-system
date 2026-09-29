import React, { useState, useEffect } from 'react';

const GENRES = ['Fiction', 'Technology', 'Science', 'History', 'Philosophy', 'Biography', 'Other'];

const BookForm = ({ onSave, editingBook, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: GENRES[0],
    publishedYear: '',
    status: 'Available'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        author: editingBook.author,
        isbn: editingBook.isbn,
        genre: editingBook.genre,
        publishedYear: editingBook.publishedYear,
        status: editingBook.status
      });
      setError('');
    } else {
      resetForm();
    }
  }, [editingBook]);

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      genre: GENRES[0],
      publishedYear: '',
      status: 'Available'
    });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.author.trim() || !formData.isbn.trim() || !formData.publishedYear) {
      setError('All fields are mandatory.');
      return;
    }

    onSave(formData);
    if (!editingBook) resetForm();
  };

  return (
    <section className="form-card">
      <div className="form-header">
        <h3>{editingBook ? 'Modify Catalog Entry' : 'Register New Volume'}</h3>
        {editingBook && <span className="edit-indicator">Editing ID: {editingBook._id.slice(-6)}</span>}
      </div>

      {error && <div className="form-alert">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="input-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Clean Code"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Author</label>
            <input
              type="text"
              name="author"
              placeholder="e.g. Robert C. Martin"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>ISBN</label>
            <input
              type="text"
              name="isbn"
              placeholder="e.g. 978-0132350884"
              value={formData.isbn}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Genre</label>
            <select name="genre" value={formData.genre} onChange={handleChange}>
              {GENRES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Publication Year</label>
            <input
              type="number"
              name="publishedYear"
              placeholder="e.g. 2008"
              value={formData.publishedYear}
              onChange={handleChange}
              min="1000"
              max="2099"
              required
            />
          </div>

          <div className="input-group">
            <label>Circulation Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Available">Available</option>
              <option value="Checked Out">Checked Out</option>
            </select>
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="btn-primary">
            {editingBook ? 'Update Record' : '+ Commit to Catalog'}
          </button>
          {editingBook && (
            <button type="button" className="btn-secondary" onClick={onCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default BookForm;