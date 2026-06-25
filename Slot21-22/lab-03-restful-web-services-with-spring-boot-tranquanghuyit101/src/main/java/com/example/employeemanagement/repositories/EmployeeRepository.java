package com.example.employeemanagement.repositories;

import com.example.employeemanagement.pojos.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class EmployeeRepository implements IEmployeeRepository {
    private final List<Employee> employees = new ArrayList<>();

    public EmployeeRepository() {
        employees.add(new Employee("EMP001", "Nguyen Van A", "Developer", 1500.0));
        employees.add(new Employee("EMP002", "Tran Thi B", "Tester", 1200.0));
        employees.add(new Employee("EMP003", "Le Van C", "Manager", 2500.0));
        employees.add(new Employee("EMP004", "Pham Thi D", "Designer", 1300.0));
        employees.add(new Employee("EMP005", "Hoang Van E", "Technical Lead", 3000.0));
    }

    @Override
    public List<Employee> getAllEmployees() {
        return employees;
    }

    @Override
    public Employee getEmployeeById(String empId) {
        if (empId == null) return null;
        for (Employee emp : employees) {
            if (empId.equals(emp.getEmpId())) {
                return emp;
            }
        }
        return null;
    }

    @Override
    public Employee create(Employee employee) {
        employees.add(employee);
        return employee;
    }

    @Override
    public Employee delete(int id) {
        if (id >= 0 && id < employees.size()) {
            return employees.remove(id);
        }
        return null;
    }

    @Override
    public Iterable<Employee> findAll(Sort sort) {
        List<Employee> sortedList = new ArrayList<>(employees);
        if (sort != null && sort.isSorted()) {
            sortedList.sort((e1, e2) -> {
                int result = 0;
                for (Sort.Order order : sort) {
                    String property = order.getProperty();
                    int comp = 0;
                    if ("empId".equals(property)) {
                        comp = e1.getEmpId().compareTo(e2.getEmpId());
                    } else if ("name".equals(property)) {
                        comp = e1.getName().compareTo(e2.getName());
                    } else if ("designation".equals(property)) {
                        comp = e1.getDesignation().compareTo(e2.getDesignation());
                    } else if ("salary".equals(property)) {
                        comp = Double.compare(e1.getSalary(), e2.getSalary());
                    }
                    if (order.isDescending()) {
                        comp = -comp;
                    }
                    if (comp != 0) {
                        result = comp;
                        break;
                    }
                }
                return result;
            });
        }
        return sortedList;
    }

    @Override
    public Page<Employee> findAll(Pageable pageable) {
        if (pageable == null) {
            return new PageImpl<>(employees);
        }
        
        List<Employee> sortedList;
        if (pageable.getSort() != null && pageable.getSort().isSorted()) {
            sortedList = (List<Employee>) findAll(pageable.getSort());
        } else {
            sortedList = new ArrayList<>(employees);
        }

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), sortedList.size());

        List<Employee> content;
        if (start > sortedList.size()) {
            content = new ArrayList<>();
        } else {
            content = sortedList.subList(start, end);
        }

        return new PageImpl<>(content, pageable, sortedList.size());
    }

    @Override
    public Employee update(String empId, Employee employee) {
        if (empId == null || employee == null) return null;
        for (Employee emp : employees) {
            if (empId.equals(emp.getEmpId())) {
                emp.setName(employee.getName());
                emp.setDesignation(employee.getDesignation());
                emp.setSalary(employee.getSalary());
                return emp;
            }
        }
        return null;
    }

    @Override
    public List<Employee> search(String keyword) {
        List<Employee> result = new ArrayList<>();
        if (keyword == null || keyword.trim().isEmpty()) {
            return result;
        }
        String lowerKeyword = keyword.toLowerCase();
        for (Employee emp : employees) {
            if ((emp.getName() != null && emp.getName().toLowerCase().contains(lowerKeyword)) ||
                (emp.getDesignation() != null && emp.getDesignation().toLowerCase().contains(lowerKeyword))) {
                result.add(emp);
            }
        }
        return result;
    }
}
