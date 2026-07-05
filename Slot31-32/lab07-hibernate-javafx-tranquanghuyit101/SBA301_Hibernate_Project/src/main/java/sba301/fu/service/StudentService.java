package sba301.fu.service;

import sba301.fu.repository.IStudentRepository;
import sba301.fu.repository.StudentRepository;
import sba301.fu.pojo.Student;
import java.util.List;

public class StudentService implements IStudentService {
    private IStudentRepository iStudentRepo = null;

    public StudentService() {
        iStudentRepo = new StudentRepository();
    }

    public StudentService(IStudentRepository iStudentRepo) {
        this.iStudentRepo = iStudentRepo;
    }

    @Override
    public void save(Student student) {
        iStudentRepo.save(student);
    }

    @Override
    public List<Student> findAll() {
        return iStudentRepo.findAll();
    }

    @Override
    public void delete(int studentID) {
        iStudentRepo.delete(studentID);
    }

    @Override
    public Student findById(int studentID) {
        return iStudentRepo.findById(studentID);
    }

    @Override
    public void update(Student student) {
        iStudentRepo.update(student);
    }

    @Override
    public List<Student> findPaged(int pageNumber, int pageSize) {
        return iStudentRepo.findPaged(pageNumber, pageSize);
    }

    @Override
    public long count() {
        return iStudentRepo.count();
    }
}
