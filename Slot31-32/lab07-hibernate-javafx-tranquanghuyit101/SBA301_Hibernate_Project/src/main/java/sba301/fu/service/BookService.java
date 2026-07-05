package sba301.fu.service;

import sba301.fu.repository.IBookRepository;
import sba301.fu.repository.BookRepository;
import sba301.fu.pojo.Book;
import java.util.List;

public class BookService implements IBookService {
    private IBookRepository iBookRepo = null;

    public BookService() {
        iBookRepo = new BookRepository();
    }

    @Override
    public List<Book> findAll() {
        return iBookRepo.findAll();
    }

    @Override
    public void save(Book book) {
        iBookRepo.save(book);
    }

    @Override
    public void delete(Long bookId) {
        iBookRepo.delete(bookId);
    }

    @Override
    public Book findById(Long bookId) {
        return iBookRepo.findById(bookId);
    }

    @Override
    public void update(Book book) {
        iBookRepo.update(book);
    }

    @Override
    public List<Book> findBooksByStudentId(int studentId) {
        return iBookRepo.findBooksByStudentId(studentId);
    }
}
