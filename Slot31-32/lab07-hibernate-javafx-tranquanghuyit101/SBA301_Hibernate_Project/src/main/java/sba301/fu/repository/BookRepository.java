package sba301.fu.repository;

import sba301.fu.dao.BookDAO;
import sba301.fu.pojo.Book;
import java.util.List;

public class BookRepository implements IBookRepository {
    private BookDAO bookDAO = null;

    public BookRepository() {
        bookDAO = new BookDAO();
    }

    @Override
    public List<Book> findAll() {
        return bookDAO.getBooks();
    }

    @Override
    public void save(Book book) {
        bookDAO.save(book);
    }

    @Override
    public void delete(Long bookId) {
        bookDAO.delete(bookId);
    }

    @Override
    public Book findById(Long bookId) {
        return bookDAO.findById(bookId);
    }

    @Override
    public void update(Book book) {
        bookDAO.update(book);
    }

    @Override
    public List<Book> findBooksByStudentId(int studentId) {
        return bookDAO.findBooksByStudentId(studentId);
    }
}
