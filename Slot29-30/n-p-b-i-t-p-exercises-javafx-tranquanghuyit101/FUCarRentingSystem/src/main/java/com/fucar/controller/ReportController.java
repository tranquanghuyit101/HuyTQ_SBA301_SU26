package com.fucar.controller;

import javafx.collections.FXCollections;
import javafx.fxml.*;
import javafx.scene.chart.*;
import javafx.scene.control.*;
import javafx.scene.layout.VBox;
import java.time.LocalDate;

public class ReportController {

    @FXML private DatePicker dpStart, dpEnd;
    @FXML private ComboBox<String> cbReportType;
    @FXML private BarChart<String,Number>  barChart;
    @FXML private LineChart<String,Number> lineChart;
    @FXML private PieChart     pieChart;
    @FXML private TableView<?> tableDetail;
    @FXML private VBox cardTotal, cardRevenue, cardCars, cardNewCus;

    @FXML
    public void initialize() {
        // Mặc định: đầu tháng → hôm nay
        dpStart.setValue(LocalDate.now().withDayOfMonth(1));
        dpEnd.setValue(LocalDate.now());

        cbReportType.getItems().addAll(
            "Doanh thu theo tháng","Số lượng giao dịch",
            "Top xe được thuê","Trạng thái giao dịch");
        cbReportType.setValue("Doanh thu theo tháng");

        // Validate: dpEnd phải >= dpStart
        dpEnd.valueProperty().addListener((obs,old,date) -> {
            if (date != null && dpStart.getValue() != null
                    && date.isBefore(dpStart.getValue())) {
                new Alert(Alert.AlertType.WARNING,
                    "Đến ngày phải ≥ Từ ngày!", ButtonType.OK).showAndWait();
                dpEnd.setValue(old);
            }
        });

        buildSummaryCards();
        loadBarChart();
        loadLineChart();
        loadPieChart();
    }

    private void buildSummaryCards() {
        fillCard(cardTotal,   "156",           "Tổng giao dịch",  "#1565C0");
        fillCard(cardRevenue, "124.500.000 ₫", "Tổng doanh thu",  "#2E7D32");
        fillCard(cardCars,    "23",            "Xe được thuê",    "#F57F17");
        fillCard(cardNewCus,  "18",            "Khách hàng mới",  "#6A1B9A");
    }

    private void fillCard(VBox card, String number, String title, String color) {
        card.setStyle("-fx-background-color:" + color
            + ";-fx-background-radius:10;-fx-padding:16;");
        Label lNum = new Label(number);
        lNum.setStyle("-fx-font-size:26px;-fx-font-weight:bold;-fx-text-fill:white;");
        Label lTitle = new Label(title);
        lTitle.setStyle("-fx-font-size:12px;-fx-text-fill:rgba(255,255,255,0.85);");
        card.getChildren().setAll(lNum, lTitle);
    }

    private void loadBarChart() {
        barChart.getData().clear();
        barChart.setTitle("Doanh thu theo tháng (triệu VNĐ)");
        barChart.setAnimated(true);

        String[] months = {"T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"};
        double[] last = {8,12,10,15,11,14,9,13,16,10,12,18};
        double[] curr = {10,14,13,17,15,19,12,16,20,14,15,22};

        XYChart.Series<String,Number> sLast = new XYChart.Series<>();
        sLast.setName("Năm trước");
        XYChart.Series<String,Number> sCurr = new XYChart.Series<>();
        sCurr.setName("Năm nay");

        for (int i = 0; i < months.length; i++) {
            sLast.getData().add(new XYChart.Data<>(months[i], last[i]));
            sCurr.getData().add(new XYChart.Data<>(months[i], curr[i]));
        }
        barChart.getData().addAll(sLast, sCurr);
    }

    private void loadLineChart() {
        lineChart.getData().clear();
        lineChart.setTitle("Số giao dịch theo tuần");
        lineChart.setCreateSymbols(true);

        XYChart.Series<String,Number> s = new XYChart.Series<>();
        s.setName("Giao dịch");
        String[] weeks = {"Tuần 1","Tuần 2","Tuần 3","Tuần 4"};
        int[]    vals  = {12, 18, 15, 22};
        for (int i = 0; i < weeks.length; i++)
            s.getData().add(new XYChart.Data<>(weeks[i], vals[i]));
        lineChart.getData().add(s);
    }

    private void loadPieChart() {
        pieChart.setTitle("Phân bố trạng thái giao dịch");
        pieChart.setData(FXCollections.observableArrayList(
            new PieChart.Data("Đã xác nhận (65%)", 65),
            new PieChart.Data("Chờ xác nhận (25%)", 25),
            new PieChart.Data("Đã hủy (10%)",       10)
        ));
    }

    @FXML
    private void handleGenerate() {
        if (dpStart.getValue() == null || dpEnd.getValue() == null) {
            new Alert(Alert.AlertType.WARNING,
                "Vui lòng chọn khoảng thời gian!", ButtonType.OK).showAndWait();
            return;
        }
        loadBarChart(); loadLineChart(); loadPieChart();
    }

    @FXML
    private void handleExportPdf() {
        new Alert(Alert.AlertType.INFORMATION,
            "Xuất PDF: Chức năng đang phát triển.", ButtonType.OK).showAndWait();
    }
}
