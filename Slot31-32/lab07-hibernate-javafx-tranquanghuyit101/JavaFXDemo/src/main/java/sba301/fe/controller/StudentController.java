package sba301.fe.controller;

import sba301.fu.pojo.Student;
import sba301.fu.service.IStudentService;
import sba301.fu.service.StudentService;

import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.collections.transformation.FilteredList;
import javafx.collections.transformation.SortedList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.fxml.Initializable;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.stage.Stage;
import org.mindrot.jbcrypt.BCrypt;

import java.net.URL;
import java.util.ResourceBundle;

public class StudentController implements Initializable {

    @FXML
    private TableView<Student> tbData;
    @FXML
    public TableColumn<Student, Integer> studentId;
    @FXML
    public TableColumn<Student, String> email;
    @FXML
    public TableColumn<Student, String> password;
    @FXML
    public TableColumn<Student, String> firstName;
    @FXML
    public TableColumn<Student, String> lastName;
    @FXML
    public TableColumn<Student, Integer> totalMark;

    @FXML
    private TextField txtEmail;
    @FXML
    private TextField txtPassword;
    @FXML
    private TextField txtLastName;
    @FXML
    private TextField txtFirstName;
    @FXML
    private TextField txtTotalMark;
    @FXML
    private TextField txtSearch;
    @FXML
    private Label lblLoggedInUser;

    // Pagination controls
    @FXML
    private Button btnPrevPage;
    @FXML
    private Button btnNextPage;
    @FXML
    private Label lblPageInfo;

    private final int PAGE_SIZE = 5;
    private int currentPage = 1;
    private long totalStudents = 0;
    private int totalPages = 1;

    private int idStudent;

    private IStudentService iStudentService;
    private ObservableList<Student> studentsModels;

    public StudentController() {
        iStudentService = new StudentService();
        studentsModels = FXCollections.observableArrayList();
    }

    public void showAlert(String header, String content) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setHeaderText(header);
        alert.setContentText(content);
        alert.showAndWait();
    }

    private void showStudent(Student student) {
        if (student != null) {
            this.setIdStudent(student.getId());
            this.txtFirstName.setText(student.getFirstName());
            this.txtEmail.setText(student.getEmail());
            this.txtPassword.setText(student.getPassword());
            this.txtLastName.setText(student.getLastName());
            this.txtTotalMark.setText(String.valueOf(student.getMarks()));
        }
    }

    private void refreshDataTable() {
        this.setIdStudent(0);
        this.txtFirstName.setText("");
        this.txtLastName.setText("");
        this.txtTotalMark.setText("");
        this.txtEmail.setText("");
        this.txtPassword.setText("");
        
        loadPagedStudents();
    }

    private void loadPagedStudents() {
        totalStudents = iStudentService.count();
        totalPages = (int) Math.ceil((double) totalStudents / PAGE_SIZE);
        if (totalPages < 1) {
            totalPages = 1;
        }
        if (currentPage > totalPages) {
            currentPage = totalPages;
        }
        if (currentPage < 1) {
            currentPage = 1;
        }

        studentsModels.clear();
        java.util.List<Student> pagedList = iStudentService.findPaged(currentPage, PAGE_SIZE);
        if (pagedList != null) {
            studentsModels.addAll(pagedList);
        }

        lblPageInfo.setText("Page " + currentPage + " of " + totalPages);
        btnPrevPage.setDisable(currentPage <= 1);
        btnNextPage.setDisable(currentPage >= totalPages);
    }

    private boolean isValidInput() {
        if (txtEmail.getText() == null || txtEmail.getText().trim().isEmpty() ||
            txtFirstName.getText() == null || txtFirstName.getText().trim().isEmpty() ||
            txtLastName.getText() == null || txtLastName.getText().trim().isEmpty() ||
            txtPassword.getText() == null || txtPassword.getText().trim().isEmpty()) {
            showAlert("Validation Error", "All fields (Email, Password, First Name, Last Name) must be filled!");
            return false;
        }

        if (!txtEmail.getText().trim().matches("^[\\w.+-]+@[\\w-]+\\.[a-zA-Z]{2,}$")) {
            showAlert("Validation Error", "Invalid Email format!");
            return false;
        }

        try {
            int marks = Integer.parseInt(txtTotalMark.getText().trim());
            if (marks < 0 || marks > 10) {
                showAlert("Validation Error", "Marks must be between 0 and 10!");
                return false;
            }
        } catch (NumberFormatException e) {
            showAlert("Validation Error", "Total Mark must be a valid integer!");
            return false;
        }

        return true;
    }

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        studentId.setCellValueFactory(new PropertyValueFactory<>("id"));
        firstName.setCellValueFactory(new PropertyValueFactory<>("firstName"));
        lastName.setCellValueFactory(new PropertyValueFactory<>("lastName"));
        email.setCellValueFactory(new PropertyValueFactory<>("email"));
        password.setCellValueFactory(new PropertyValueFactory<>("password"));
        totalMark.setCellValueFactory(new PropertyValueFactory<>("marks"));

        // Setup session context display
        if (SessionContext.getLoggedInStudent() != null) {
            lblLoggedInUser.setText("Hello, " + SessionContext.getLoggedInStudent().getFirstName() + " " + SessionContext.getLoggedInStudent().getLastName());
        } else {
            lblLoggedInUser.setText("Hello, Guest");
        }

        // Setup live search / filtering
        FilteredList<Student> filteredData = new FilteredList<>(studentsModels, s -> true);
        txtSearch.textProperty().addListener((obs, oldVal, newVal) -> {
            String keyword = newVal == null ? "" : newVal.toLowerCase().trim();
            filteredData.setPredicate(student -> {
                if (keyword.isEmpty()) {
                    return true;
                }
                boolean matchesFirstName = student.getFirstName() != null && student.getFirstName().toLowerCase().contains(keyword);
                boolean matchesLastName = student.getLastName() != null && student.getLastName().toLowerCase().contains(keyword);
                boolean matchesEmail = student.getEmail() != null && student.getEmail().toLowerCase().contains(keyword);
                return matchesFirstName || matchesLastName || matchesEmail;
            });
        });

        SortedList<Student> sortedData = new SortedList<>(filteredData);
        sortedData.comparatorProperty().bind(tbData.comparatorProperty());
        tbData.setItems(sortedData);

        tbData.getSelectionModel().selectedItemProperty().addListener(new ChangeListener<Student>() {
            @Override
            public void changed(ObservableValue<? extends Student> observableValue, Student oldValue, Student newValue) {
                if (newValue != null) {
                    showStudent(newValue);
                }
            }
        });

        // Initial load
        loadPagedStudents();
    }

    @FXML
    public void addStudent() {
        if (!isValidInput()) return;

        // Check email uniqueness
        java.util.List<Student> allStudents = iStudentService.findAll();
        if (allStudents != null) {
            for (Student s : allStudents) {
                if (s.getEmail().equalsIgnoreCase(txtEmail.getText().trim())) {
                    showAlert("Validation Error", "A student with this email already exists!");
                    return;
                }
            }
        }

        String hashedPassword = BCrypt.hashpw(this.txtPassword.getText().trim(), BCrypt.gensalt());
        Student student = new Student(
                this.txtEmail.getText().trim(),
                hashedPassword,
                this.txtFirstName.getText().trim(),
                this.txtLastName.getText().trim(),
                Integer.parseInt(txtTotalMark.getText().trim())
        );

        iStudentService.save(student);
        refreshDataTable();
    }

    @FXML
    public void deleteStudent() {
        if (getIdStudent() == 0) {
            showAlert("Thông báo", "Vui lòng chọn 1 Student để xóa!");
            return;
        }

        Alert confirm = new Alert(Alert.AlertType.CONFIRMATION,
                "Bạn có chắc muốn xóa Student này?", ButtonType.YES, ButtonType.NO);
        confirm.setHeaderText("Delete Confirmation");
        confirm.showAndWait().ifPresent(response -> {
            if (response == ButtonType.YES) {
                try {
                    iStudentService.delete(this.getIdStudent());
                    refreshDataTable();
                } catch (Exception ex) {
                    showAlert("Error", "Could not delete student: " + ex.getMessage());
                }
            }
        });
    }

    @FXML
    public void updateStudent() {
        if (this.idStudent == 0) {
            showAlert("Error", "Please select a student from the table first!");
            return;
        }
        if (!isValidInput()) return;

        // Check email uniqueness
        java.util.List<Student> allStudents = iStudentService.findAll();
        if (allStudents != null) {
            for (Student s : allStudents) {
                if (s.getId() != this.idStudent && s.getEmail().equalsIgnoreCase(txtEmail.getText().trim())) {
                    showAlert("Validation Error", "Another student with this email already exists!");
                    return;
                }
            }
        }

        Student oldStudent = iStudentService.findById(this.idStudent);
        String inputPassword = this.txtPassword.getText().trim();
        String hashedPassword;

        if (oldStudent != null && oldStudent.getPassword().equals(inputPassword)) {
            hashedPassword = oldStudent.getPassword();
        } else {
            hashedPassword = BCrypt.hashpw(inputPassword, BCrypt.gensalt());
        }

        Student student = new Student(
                this.idStudent,
                this.txtEmail.getText().trim(),
                hashedPassword,
                this.txtFirstName.getText().trim(),
                this.txtLastName.getText().trim(),
                Integer.parseInt(txtTotalMark.getText().trim())
        );

        iStudentService.update(student);
        refreshDataTable();
    }

    @FXML
    public void handlePrevPage() {
        if (currentPage > 1) {
            currentPage--;
            loadPagedStudents();
        }
    }

    @FXML
    public void handleNextPage() {
        if (currentPage < totalPages) {
            currentPage++;
            loadPagedStudents();
        }
    }

    @FXML
    public void handleManageBooks(ActionEvent event) {
        if (this.idStudent == 0) {
            showAlert("Thông báo", "Vui lòng chọn 1 Student để quản lý sách!");
            return;
        }

        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("book-view.fxml"));
            Scene scene = new Scene(loader.load());

            BookController bookController = loader.getController();
            Student selectedStudent = iStudentService.findById(this.idStudent);
            bookController.setStudent(selectedStudent);

            Stage stage = new Stage();
            stage.initOwner(((Stage) ((javafx.scene.Node) event.getSource()).getScene().getWindow()));
            stage.setTitle("Manage Books - " + selectedStudent.getEmail());
            stage.setScene(scene);
            stage.showAndWait();
            
            // Reload context since books might have changed or cascading count changes
            loadPagedStudents();
        } catch (Exception e) {
            e.printStackTrace();
            showAlert("Error", "Could not open Book Management screen: " + e.getMessage());
        }
    }

    @FXML
    public void handleLogout(ActionEvent event) {
        SessionContext.clear();
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("LoginGUI.fxml"));
            Scene scene = new Scene(loader.load());
            Stage stage = (Stage) ((javafx.scene.Node) event.getSource()).getScene().getWindow();
            stage.setScene(scene);
            stage.setTitle("Library - Login");
            stage.show();
        } catch (Exception e) {
            e.printStackTrace();
            showAlert("Error", "Could not load Login UI: " + e.getMessage());
        }
    }

    public int getIdStudent() {
        return idStudent;
    }

    public void setIdStudent(int idStudent) {
        this.idStudent = idStudent;
    }
}
