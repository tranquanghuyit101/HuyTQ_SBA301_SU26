package sba301.fu.repository;

import sba301.fu.dao.StudentDAO;
import sba301.fu.pojo.Student;
import java.util.List;

public class StudentRepository implements IStudentRepository {
    private StudentDAO studentDAO = null;

    public StudentRepository() {
        studentDAO = new StudentDAO();
    }

    @Override
    public void save(Student student) {
        studentDAO.save(student);
    }

    @Override
    public List<Student> findAll() {
        return studentDAO.getStudents();
    }

    @Override
    public void delete(int studentID) {
        studentDAO.delete(studentID);
    }

    @Override
    public Student findById(int studentID) {
        return studentDAO.findById(studentID);
    }

    @Override
    public void update(Student student) {
        studentDAO.update(student);
    }

    @Override
    public List<Student> findPaged(int pageNumber, int pageSize) {
        return studentDAO.getStudentsPaged(pageNumber, pageSize);
    }

    @Override
    public long count() {
        return studentDAO.getStudentCount();
    }
}
