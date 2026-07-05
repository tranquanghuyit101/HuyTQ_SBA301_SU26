package sba301.fu.dao;

import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;
import sba301.fu.pojo.Book;

import java.util.List;

public class BookDAO {

    public BookDAO() {
    }

    // 1. Save Book
    public void save(Book book) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction t = session.beginTransaction();
        try {
            session.persist(book);
            t.commit();
            System.out.println("successfully saved book");
        } catch (Exception ex) {
            t.rollback();
            System.out.println("Error saving book: " + ex.getMessage());
        } finally {
            session.close();
        }
    }

    // 2. Get All Books
    public List<Book> getBooks() {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction t = session.beginTransaction();
        try {
            Query<Book> query = session.createQuery("from Book", Book.class);
            List<Book> list = query.list();
            t.commit();
            return list;
        } catch (Exception ex) {
            t.rollback();
            System.out.println("Error getting books: " + ex.getMessage());
        } finally {
            session.close();
        }
        return null;
    }

    // 3. Delete Book
    public void delete(Long bookId) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction tx = session.beginTransaction();
        try {
            Book book = session.get(Book.class, bookId);
            if (book != null) {
                session.remove(book);
            }
            tx.commit();
        } catch (RuntimeException e) {
            tx.rollback();
            throw e;
        } finally {
            session.close();
        }
    }

    // 4. Find Book by ID
    public Book findById(Long bookId) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            return session.get(Book.class, bookId);
        } catch (RuntimeException e) {
            throw e;
        } finally {
            session.close();
        }
    }

    // 5. Update Book
    public void update(Book book) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction t = session.beginTransaction();
        try {
            session.merge(book);
            t.commit();
            System.out.println("book update saved");
        } catch (Exception ex) {
            t.rollback();
            System.out.println("Error updating book: " + ex.getMessage());
        } finally {
            session.close();
        }
    }

    // 6. Find Books by Student ID (Advanced 7.1)
    public List<Book> findBooksByStudentId(int studentId) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction t = session.beginTransaction();
        try {
            Query<Book> query = session.createQuery("from Book where student.id = :sid", Book.class);
            query.setParameter("sid", studentId);
            List<Book> list = query.list();
            t.commit();
            return list;
        } catch (Exception ex) {
            t.rollback();
            System.out.println("Error getting books by student: " + ex.getMessage());
        } finally {
            session.close();
        }
        return null;
    }
}
