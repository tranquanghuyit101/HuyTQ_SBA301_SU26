package com.fucar.controller;

import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.application.Platform;
import javafx.fxml.*;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.stage.Stage;
import javafx.util.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class MainController {

    @FXML private StackPane contentArea;
    @FXML private Label     lblStatus, lblDateTime;
    @FXML private Button    btnCars, btnCustomers, btnRental, btnReport;
    @FXML private Accordion accordion;

    private static final DateTimeFormatter DT_FMT =
        DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    @FXML
    public void initialize() {
        startClock();
        setupToolbarTooltips();
        
        // Expand the first pane of accordion by default
        if (accordion != null && !accordion.getPanes().isEmpty()) {
            accordion.setExpandedPane(accordion.getPanes().get(0));
        }
    }

    /** Đồng hồ cập nhật mỗi giây */
    private void startClock() {
        Timeline clock = new Timeline(
            new KeyFrame(Duration.seconds(1), e ->
                lblDateTime.setText(LocalDateTime.now().format(DT_FMT))
            )
        );
        clock.setCycleCount(Timeline.INDEFINITE);
        clock.play();
        lblDateTime.setText(LocalDateTime.now().format(DT_FMT));
    }

    /** Tooltip cho các nút ToolBar */
    private void setupToolbarTooltips() {
        addTooltip(btnCars,      "Quản lý xe (Ctrl+1)");
        addTooltip(btnCustomers, "Quản lý khách hàng (Ctrl+2)");
        addTooltip(btnRental,    "Giao dịch thuê xe (Ctrl+3)");
        addTooltip(btnReport,    "Báo cáo thống kê (Ctrl+4)");
    }

    private void addTooltip(Button btn, String text) {
        if (btn == null) return;
        Tooltip tip = new Tooltip(text);
        tip.setShowDelay(Duration.millis(300));
        tip.getStyleClass().add("tooltip");
        btn.setTooltip(tip);
    }

    // ── Navigation ──────────────────────────────────────────
    @FXML 
    public void navCars() { 
        loadView("/com/fucar/list-view.fxml", "Quản lý Xe"); 
    }
    
    @FXML 
    public void navCustomers() { 
        loadView("/com/fucar/customer-view.fxml", "Quản lý Khách Hàng"); 
    }
    
    @FXML 
    public void navRental() { 
        loadView("/com/fucar/rental-view.fxml", "Giao Dịch Thuê Xe"); 
    }
    
    @FXML 
    public void navReport() { 
        loadView("/com/fucar/report-view.fxml", "Báo Cáo Thống Kê"); 
    }
    
    @FXML 
    private void handleExit() { 
        Platform.exit(); 
    }

    @FXML
    private void handleLogout() {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/fucar/login-view.fxml"));
            Parent root = loader.load();
            Stage stage = (Stage) contentArea.getScene().getWindow();
            Scene scene = new Scene(root, 500, 600);
            scene.getStylesheets().add(
                getClass().getResource("/com/fucar/style.css").toExternalForm()
            );
            stage.setScene(scene);
            stage.setTitle("FUCarRentingSystem v1.0");
            stage.centerOnScreen();
            stage.show();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void loadView(String fxmlPath, String title) {
        try {
            FXMLLoader loader = new FXMLLoader(getClass().getResource(fxmlPath));
            Parent root = loader.load();
            contentArea.getChildren().setAll(root);
            lblStatus.setText("Đang hiển thị: " + title);
        } catch (Exception e) {
            e.printStackTrace();
            lblStatus.setText("Lỗi: Không thể tải " + title);
        }
    }
}
