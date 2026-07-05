package sba301.fu.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import sba301.fu.pojo.Student;
import sba301.fu.repository.IStudentRepository;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

public class StudentServiceTest {

    private IStudentRepository mockRepo;
    private StudentService service;

    @BeforeEach
    public void setUp() {
        mockRepo = mock(IStudentRepository.class);
        service = new StudentService(mockRepo);
    }

    @Test
    public void testFindAll() {
        Student s1 = new Student("a@fpt.edu.vn", "123", "First", "Last", 9);
        Student s2 = new Student("b@fpt.edu.vn", "456", "Second", "Last", 8);
        when(mockRepo.findAll()).thenReturn(Arrays.asList(s1, s2));

        List<Student> result = service.findAll();
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("a@fpt.edu.vn", result.get(0).getEmail());
        verify(mockRepo, times(1)).findAll();
    }

    @Test
    public void testSave() {
        Student s = new Student("a@fpt.edu.vn", "123", "First", "Last", 9);
        service.save(s);
        verify(mockRepo, times(1)).save(s);
    }

    @Test
    public void testDelete() {
        int id = 5;
        service.delete(id);
        verify(mockRepo, times(1)).delete(id);
    }

    @Test
    public void testFindById() {
        Student s = new Student(10, "a@fpt.edu.vn", "123", "First", "Last", 9);
        when(mockRepo.findById(10)).thenReturn(s);

        Student result = service.findById(10);
        assertNotNull(result);
        assertEquals("First", result.getFirstName());
        verify(mockRepo, times(1)).findById(10);
    }

    @Test
    public void testUpdate() {
        Student s = new Student("a@fpt.edu.vn", "123", "First", "Last", 9);
        service.update(s);
        verify(mockRepo, times(1)).update(s);
    }
}
