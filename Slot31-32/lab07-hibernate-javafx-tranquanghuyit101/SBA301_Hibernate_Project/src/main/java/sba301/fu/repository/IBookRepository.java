package sba301.fu.repository;

import sba301.fu.pojo.Book;
import java.util.List;

public interface IBookRepository {
    public List<Book> findAll();
    public void save(Book book);
    public void delete(Long bookId);
    public Book findById(Long bookId);
    public void update(Book book);
    public List<Book> findBooksByStudentId(int studentId);
}
