package sba301.fu.dao;

import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;
import sba301.fu.pojo.Student;

import java.util.List;

public class StudentDAO {

    public StudentDAO() {
    }

    // 1. Save Student
    public void save(Student student) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction t = session.beginTransaction();
        try {
            session.persist(student);
            t.commit();
            System.out.println("successfully saved");
        } catch (Exception ex) {
            t.rollback();
            System.out.println("Error " + ex.getMessage());
        } finally {
            session.close();
        }
    }

    // 2. Get All Student
    public List<Student> getStudents() {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction t = session.beginTransaction();
        try {
            Query<Student> query = session.createQuery("from Student", Student.class);
            List<Student> list = query.list();
            t.commit();
            return list;
        } catch (Exception ex) {
            t.rollback();
            System.out.println("Error " + ex.getMessage());
        } finally {
            session.close();
        }
        return null;
    }

    // 3. Delete Student
    public void delete(int studentID) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction tx = session.beginTransaction();
        try {
            Student student = session.get(Student.class, studentID);
            if (student != null) {
                session.remove(student);
            }
            tx.commit();
        } catch (RuntimeException e) {
            tx.rollback();
            throw e;
        } finally {
            session.close();
        }
    }

    // 4. Find A Student
    public Student findById(int studentID) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            return session.get(Student.class, studentID);
        } catch (RuntimeException e) {
            throw e;
        } finally {
            session.close();
        }
    }

    // 5. Update a Student
    public void update(Student student) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction t = session.beginTransaction();
        try {
            session.merge(student);
            t.commit();
            System.out.println("update saved");
        } catch (Exception ex) {
            t.rollback();
            System.out.println("Error " + ex.getMessage());
        } finally {
            session.close();
        }
    }

    // 6. Get Paged Students (Advanced 7.7)
    public List<Student> getStudentsPaged(int pageNumber, int pageSize) {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction t = session.beginTransaction();
        try {
            Query<Student> query = session.createQuery("from Student", Student.class);
            query.setFirstResult((pageNumber - 1) * pageSize);
            query.setMaxResults(pageSize);
            List<Student> list = query.list();
            t.commit();
            return list;
        } catch (Exception ex) {
            t.rollback();
            System.out.println("Error " + ex.getMessage());
        } finally {
            session.close();
        }
        return null;
    }

    // 7. Get Student Count (Advanced 7.7)
    public long getStudentCount() {
        Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction t = session.beginTransaction();
        try {
            Query<Long> query = session.createQuery("select count(s) from Student s", Long.class);
            long count = query.uniqueResult();
            t.commit();
            return count;
        } catch (Exception ex) {
            t.rollback();
            System.out.println("Error " + ex.getMessage());
        } finally {
            session.close();
        }
        return 0;
    }
}
