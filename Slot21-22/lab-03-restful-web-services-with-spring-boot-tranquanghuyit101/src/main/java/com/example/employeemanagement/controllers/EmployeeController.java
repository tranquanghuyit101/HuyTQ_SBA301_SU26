package com.example.employeemanagement.controllers;

import com.example.employeemanagement.pojos.Employee;
import com.example.employeemanagement.services.IEmployeeService;
import com.example.employeemanagement.exceptions.EmployeeNotFoundException;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
@Tag(name = "Employee Management", description = "APIs for managing employees in-memory")
public class EmployeeController {

    private final IEmployeeService employeeService;

    @Autowired
    public EmployeeController(IEmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    @Operation(summary = "Get all employees with paging and sorting", description = "Retrieve a list of employees with custom page, size and sorting field")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved list")
    public ResponseEntity<com.example.employeemanagement.dto.ApiResponse<Page<Employee>>> getEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "empId") String sortBy) {
        Page<Employee> employeePage = employeeService.getEmployeesWithPaging(page, size, sortBy);
        return ResponseEntity.ok(com.example.employeemanagement.dto.ApiResponse.success("Successfully retrieved employees", employeePage));
    }

    @GetMapping("/{empId}")
    @Operation(summary = "Get employee by ID", description = "Retrieve details of a single employee by their unique ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Employee found"),
        @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<com.example.employeemanagement.dto.ApiResponse<Employee>> getEmployeeById(@PathVariable String empId) {
        Employee employee = employeeService.getEmployeeById(empId);
        if (employee == null) {
            throw new EmployeeNotFoundException("Employee not found with id: " + empId);
        }
        return ResponseEntity.ok(com.example.employeemanagement.dto.ApiResponse.success("Employee found", employee));
    }

    @PostMapping
    @Operation(summary = "Create a new employee", description = "Add a new employee to the system with validated input")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Employee successfully created"),
        @ApiResponse(responseCode = "400", description = "Invalid input or validation failed")
    })
    public ResponseEntity<com.example.employeemanagement.dto.ApiResponse<Employee>> createEmployee(@Valid @RequestBody Employee employee) {
        Employee created = employeeService.createEmployee(employee);
        return new ResponseEntity<>(com.example.employeemanagement.dto.ApiResponse.success("Employee successfully created", created), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an employee by index", description = "Remove an employee using their list index position")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Employee successfully deleted"),
        @ApiResponse(responseCode = "404", description = "Employee index not found")
    })
    public ResponseEntity<com.example.employeemanagement.dto.ApiResponse<Employee>> deleteEmployee(@PathVariable int id) {
        Employee deleted = employeeService.deleteEmployee(id);
        if (deleted == null) {
            throw new EmployeeNotFoundException("Employee not found at index: " + id);
        }
        return ResponseEntity.ok(com.example.employeemanagement.dto.ApiResponse.success("Employee successfully deleted", deleted));
    }

    @PutMapping("/{empId}")
    @Operation(summary = "Update an employee's details", description = "Modify an existing employee's details using their unique ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Employee successfully updated"),
        @ApiResponse(responseCode = "400", description = "Invalid input or validation failed"),
        @ApiResponse(responseCode = "404", description = "Employee not found")
    })
    public ResponseEntity<com.example.employeemanagement.dto.ApiResponse<Employee>> updateEmployee(@PathVariable String empId, @Valid @RequestBody Employee employee) {
        Employee updated = employeeService.updateEmployee(empId, employee);
        if (updated == null) {
            throw new EmployeeNotFoundException("Employee not found with id: " + empId);
        }
        return ResponseEntity.ok(com.example.employeemanagement.dto.ApiResponse.success("Employee successfully updated", updated));
    }

    @GetMapping("/search")
    @Operation(summary = "Search employees by name or designation", description = "Perform case-insensitive search by name or designation")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved matched employees")
    public ResponseEntity<com.example.employeemanagement.dto.ApiResponse<List<Employee>>> searchEmployees(@RequestParam String keyword) {
        List<Employee> results = employeeService.searchEmployees(keyword);
        return ResponseEntity.ok(com.example.employeemanagement.dto.ApiResponse.success("Successfully searched employees", results));
    }
}
