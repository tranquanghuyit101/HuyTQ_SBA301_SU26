package sba301.fu.service;

import sba301.fu.pojo.Student;
import java.util.List;

public interface IStudentService {
    public List<Student> findAll();
    public void save(Student student);
    public void delete(int studentID);
    public Student findById(int studentID);
    public void update(Student student);
    public List<Student> findPaged(int pageNumber, int pageSize);
    public long count();
}
