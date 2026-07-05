package com.fucar.controller;

import javafx.fxml.FXML;
import javafx.scene.control.*;

public class LoginController {

    @FXML private TextField     accountNameField;
    @FXML private PasswordField passwordField;
    @FXML private TextField     passwordVisible;
    @FXML private CheckBox      showPasswordCheck;
    @FXML private Label         lblError;

    @FXML
    public void initialize() {
        lblError.setText("");
        // Đồng bộ 2 field password (PasswordField ẩn ↔ TextField hiện)
        passwordField.textProperty()
                .bindBidirectional(passwordVisible.textProperty());
        // Enter trên passwordField = click Đăng nhập
        passwordField.setOnAction(e -> handleLogin());
        passwordVisible.setOnAction(e -> handleLogin());
    }

    @FXML
    private void handleShowPassword() {
        boolean show = showPasswordCheck.isSelected();
        passwordField.setVisible(!show);
        passwordField.setManaged(!show);
        passwordVisible.setVisible(show);
        passwordVisible.setManaged(show);
    }

    @FXML
    private void handleLogin() {
        String username = accountNameField.getText().trim();
        String password = showPasswordCheck.isSelected()
                ? passwordVisible.getText()
                : passwordField.getText();

        if (username.isEmpty() || password.isEmpty()) {
            showError("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        if (username.equals("admin") && password.equals("admin123")) {
            showAlert(Alert.AlertType.INFORMATION,
                    "Đăng nhập thành công! Chào Admin.");
            navigateToMainView();
        } else if (username.equals("customer") && password.equals("cust123")) {
            showAlert(Alert.AlertType.INFORMATION,
                    "Đăng nhập thành công! Chào Customer.");
            navigateToMainView();
        } else {
            showError("Sai tên tài khoản hoặc mật khẩu.");
        }
    }

    @FXML
    private void handleForgotPassword() {
        showAlert(Alert.AlertType.INFORMATION,
                "Chức năng đang phát triển.");
    }

    private void showError(String msg) {
        lblError.setText("⚠ " + msg);
    }

    private void showAlert(Alert.AlertType type, String msg) {
        new Alert(type, msg, ButtonType.OK).showAndWait();
    }

    private void navigateToMainView() {
        try {
            javafx.fxml.FXMLLoader loader = new javafx.fxml.FXMLLoader(
                    getClass().getResource("/com/fucar/main-view.fxml"));
            javafx.scene.Parent root = loader.load();
            javafx.stage.Stage stage = (javafx.stage.Stage) accountNameField.getScene().getWindow();
            
            javafx.scene.Scene scene = new javafx.scene.Scene(root, 1024, 680);
            scene.getStylesheets().add(
                    getClass().getResource("/com/fucar/style.css").toExternalForm()
            );

            // Register global key shortcuts
            scene.setOnKeyPressed(event -> {
                MainController ctrl = loader.getController();
                if (ctrl != null) {
                    switch (event.getCode()) {
                        case DIGIT1 -> { if (event.isControlDown()) ctrl.navCars(); }
                        case DIGIT2 -> { if (event.isControlDown()) ctrl.navCustomers(); }
                        case DIGIT3 -> { if (event.isControlDown()) ctrl.navRental(); }
                        case DIGIT4 -> { if (event.isControlDown()) ctrl.navReport(); }
                        case N -> { if (event.isControlDown()) ctrl.navCars(); }
                        case R -> { if (event.isControlDown()) ctrl.navReport(); }
                        case F -> { if (event.isControlDown()) {
                            javafx.scene.Node searchNode = scene.lookup("#searchField");
                            if (searchNode instanceof javafx.scene.control.TextField tf) {
                                tf.requestFocus();
                            }
                        }}
                        case ESCAPE -> {
                            javafx.stage.Stage.getWindows().stream()
                                    .filter(w -> w.isShowing() && w instanceof javafx.stage.Stage s && s != stage)
                                    .findFirst()
                                    .ifPresent(javafx.stage.Window::hide);
                        }
                        default -> {}
                    }
                }
            });

            stage.setScene(scene);
            stage.setTitle("FUCarRentingSystem v1.0");
            stage.setResizable(true);
            stage.centerOnScreen();
            stage.show();
        } catch (java.io.IOException e) {
            e.printStackTrace();
            showError("Không thể tải trang chính: " + e.getMessage());
        }
    }
}