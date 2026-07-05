package sba301.fu.repository;

import sba301.fu.pojo.Student;
import java.util.List;

public interface IStudentRepository {
    public List<Student> findAll();
    public void save(Student student);
    public void delete(int studentID);
    public Student findById(int studentID);
    public void update(Student student);
    public List<Student> findPaged(int pageNumber, int pageSize);
    public long count();
}
