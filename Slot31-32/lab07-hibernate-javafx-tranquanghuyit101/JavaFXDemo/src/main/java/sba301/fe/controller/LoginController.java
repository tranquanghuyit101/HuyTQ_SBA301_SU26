package sba301.fe.controller;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.stage.Stage;
import org.mindrot.jbcrypt.BCrypt;
import sba301.fu.pojo.Student;
import sba301.fu.service.IStudentService;
import sba301.fu.service.StudentService;

import java.util.List;

public class LoginController {

    @FXML
    private TextField txtLoginEmail;
    @FXML
    private PasswordField txtLoginPassword;

    private final IStudentService iStudentService = new StudentService();

    @FXML
    public void login(ActionEvent event) {
        String email = txtLoginEmail.getText();
        String password = txtLoginPassword.getText();

        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setHeaderText("Validation Error");
            alert.setContentText("Email and password cannot be empty!");
            alert.showAndWait();
            return;
        }

        List<Student> students = iStudentService.findAll();
        Student matched = null;
        if (students != null) {
            for (Student student : students) {
                if (student.getEmail().equalsIgnoreCase(email.trim())) {
                    boolean isPasswordMatch = false;
                    try {
                        isPasswordMatch = BCrypt.checkpw(password, student.getPassword());
                    } catch (IllegalArgumentException e) {
                        isPasswordMatch = student.getPassword().equals(password);
                    }
                    if (isPasswordMatch) {
                        matched = student;
                        break;
                    }
                }
            }
        }

        if (matched != null) {
            SessionContext.setLoggedInStudent(matched);
            openStudentManagementScreen(event);
        } else {
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setHeaderText("Login Failed");
            alert.setContentText("Email hoặc mật khẩu không đúng!");
            alert.showAndWait();
        }
    }

    private void openStudentManagementScreen(ActionEvent event) {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("student-view.fxml"));
            Scene scene = new Scene(loader.load());
            Stage stage = (Stage) ((javafx.scene.Node) event.getSource()).getScene().getWindow();
            stage.setScene(scene);
            stage.setTitle("Library - Manage Student");
            stage.show();
        } catch (Exception e) {
            e.printStackTrace();
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setHeaderText("Error Loading UI");
            alert.setContentText("Could not transition screen: " + e.getMessage());
            alert.showAndWait();
        }
    }
}
