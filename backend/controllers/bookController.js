// backend/controllers/bookController.js
import Book from '../models/Book.js';

// Get all books with optional search & filter
export const getBooks = async (req, res) => {
  try {
    const { search, genre, status } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
      ];
    }

    if (genre && genre !== 'All') {
      query.genre = genre;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const books = await Book.find(query).sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving books', error: error.message });
  }
};

// Add a new book
export const addBook = async (req, res) => {
  try {
    const { title, author, isbn, genre, publishedYear, status } = req.body;

    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ message: 'A book with this ISBN already exists.' });
    }

    const newBook = new Book({
      title,
      author,
      isbn,
      genre,
      publishedYear,
      status: status || 'Available',
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: 'Error adding book', error: error.message });
  }
};

// Update an existing book
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: 'Error updating book', error: error.message });
  }
};

// Delete a book
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
};