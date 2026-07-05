package com.fucar.controller;

import com.fucar.model.Customer;
import javafx.collections.*;
import javafx.collections.transformation.*;
import javafx.fxml.*;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class CustomerController {

    @FXML private TableView<Customer>          tableCustomer;
    @FXML private TableColumn<Customer,String> colId, colName, colMobile,
                                               colBirth, colIdCard, colEmail;
    @FXML private TableColumn<Customer,String> colStatus;
    @FXML private TextField    searchField;
    @FXML private ComboBox<String> cbSearchField;
    @FXML private Label        lblCount;
    @FXML private Button       btnDeleteMulti;

    private ObservableList<Customer> masterData;
    private FilteredList<Customer>   filteredData;
    private static final DateTimeFormatter FMT =
        DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @FXML
    public void initialize() {
        setupColumns();
        loadSampleData();
        setupSearch();
        setupMultiSelect();
        setupContextMenu();
        updateCountLabel();
    }

    private void setupColumns() {
        colId.setCellValueFactory(new PropertyValueFactory<>("customerId"));
        colName.setCellValueFactory(new PropertyValueFactory<>("customerName"));
        colMobile.setCellValueFactory(new PropertyValueFactory<>("mobile"));
        colIdCard.setCellValueFactory(new PropertyValueFactory<>("identityCard"));
        colEmail.setCellValueFactory(new PropertyValueFactory<>("email"));

        // Cột ngày sinh — định dạng dd/MM/yyyy
        colBirth.setCellFactory(col -> new TableCell<>() {
            @Override protected void updateItem(String item, boolean empty) {
                super.updateItem(item, empty);
                if (empty || getTableRow().getItem() == null) {
                    setText(null); return;
                }
                Customer c = (Customer) getTableRow().getItem();
                setText(c.getBirthday() != null
                    ? c.getBirthday().format(FMT) : "");
            }
        });

        // Cột trạng thái — Badge màu
        colStatus.setCellValueFactory(new PropertyValueFactory<>("accountStatus"));
        colStatus.setCellFactory(col -> new TableCell<>() {
            @Override protected void updateItem(String status, boolean empty) {
                super.updateItem(status, empty);
                if (empty || status == null) { setGraphic(null); return; }
                Label badge = new Label(status);
                badge.setStyle(badgeStyle(status));
                setGraphic(badge); setText(null);
            }
        });
    }

    private void loadSampleData() {
        masterData = FXCollections.observableArrayList(
            new Customer("CUS-001","Nguyễn Văn An","0912345678",
                LocalDate.of(1995,3,15),"123456789012","an@mail.com","Hoạt động"),
            new Customer("CUS-002","Trần Thị Bình","0987654321",
                LocalDate.of(1998,7,20),"234567890123","binh@mail.com","Chờ xác nhận"),
            new Customer("CUS-003","Lê Văn Cường","0971234567",
                LocalDate.of(1992,11,5),"345678901234","cuong@mail.com","Không hoạt động"),
            new Customer("CUS-004","Phạm Thị Dung","0961234567",
                LocalDate.of(2000,5,12),"456789012345","dung@mail.com","Hoạt động")
        );
        filteredData = new FilteredList<>(masterData, p -> true);
        SortedList<Customer> sorted = new SortedList<>(filteredData);
        sorted.comparatorProperty().bind(tableCustomer.comparatorProperty());
        tableCustomer.setItems(sorted);
    }

    private void setupSearch() {
        cbSearchField.getItems().addAll(
            "Tất cả trường","Họ tên","Số điện thoại","CCCD","Email");
        cbSearchField.setValue("Tất cả trường");

        // Real-time: lọc ngay khi gõ hoặc đổi trường
        searchField.textProperty().addListener(
            (obs, o, kw) -> applyFilter(kw));
        cbSearchField.valueProperty().addListener(
            (obs, o, f) -> applyFilter(searchField.getText()));
    }

    private void applyFilter(String keyword) {
        String field = cbSearchField.getValue();
        filteredData.setPredicate(c -> {
            if (keyword == null || keyword.trim().isEmpty()) return true;
            String kw = keyword.toLowerCase();
            return switch (field) {
                case "Họ tên"          -> c.getCustomerName().toLowerCase().contains(kw);
                case "Số điện thoại"   -> c.getMobile().contains(kw);
                case "CCCD"            -> c.getIdentityCard().contains(kw);
                case "Email"           -> c.getEmail().toLowerCase().contains(kw);
                default -> c.getCustomerName().toLowerCase().contains(kw)
                        || c.getMobile().contains(kw)
                        || c.getEmail().toLowerCase().contains(kw);
            };
        });
        updateCountLabel();
    }

    private void setupMultiSelect() {
        tableCustomer.getSelectionModel()
            .setSelectionMode(SelectionMode.MULTIPLE);
        // Bật nút "Xóa nhiều" khi có ít nhất 1 dòng được chọn
        tableCustomer.getSelectionModel().getSelectedItems()
            .addListener((ListChangeListener<Customer>) c ->
                btnDeleteMulti.setDisable(
                    tableCustomer.getSelectionModel().isEmpty()));
    }

    private void setupContextMenu() {
        ContextMenu menu = new ContextMenu();

        MenuItem miView = new MenuItem("Xem chi tiết");
        MenuItem miEdit = new MenuItem("Chỉnh sửa");
        MenuItem miPwd  = new MenuItem("Đổi mật khẩu");
        SeparatorMenuItem sep = new SeparatorMenuItem();
        MenuItem miLock = new MenuItem("Khóa tài khoản");
        miLock.setStyle("-fx-text-fill: red;");

        miView.setOnAction(e -> showDetailAlert());
        miEdit.setOnAction(e -> alert("Mở form chỉnh sửa KH."));
        miPwd.setOnAction(e ->  alert("Mở dialog đổi mật khẩu."));
        miLock.setOnAction(e -> confirmLock());

        menu.getItems().addAll(miView, miEdit, miPwd, sep, miLock);
        tableCustomer.setContextMenu(menu);
    }

    private void showDetailAlert() {
        Customer c = tableCustomer.getSelectionModel().getSelectedItem();
        if (c == null) return;
        alert("Mã: " + c.getCustomerId() + "\nTên: " + c.getCustomerName()
            + "\nSĐT: " + c.getMobile());
    }

    private void confirmLock() {
        Customer c = tableCustomer.getSelectionModel().getSelectedItem();
        if (c == null) return;
        new Alert(Alert.AlertType.CONFIRMATION,
            "Khóa tài khoản \"" + c.getCustomerName() + "\"?",
            ButtonType.YES, ButtonType.NO)
            .showAndWait().ifPresent(btn -> {
                if (btn == ButtonType.YES) alert("Đã khóa tài khoản.");
            });
    }

    @FXML private void handleAdd() { alert("Mở form thêm KH."); }

    @FXML
    private void handleDeleteMulti() {
        int count = tableCustomer.getSelectionModel().getSelectedItems().size();
        new Alert(Alert.AlertType.CONFIRMATION,
            "Xóa " + count + " KH đã chọn?", ButtonType.YES, ButtonType.NO)
            .showAndWait().ifPresent(btn -> {
                if (btn == ButtonType.YES) {
                    masterData.removeAll(
                        tableCustomer.getSelectionModel().getSelectedItems());
                    updateCountLabel();
                }
            });
    }

    @FXML private void handleExport()     { alert("Xuất Excel: Đang phát triển."); }
    @FXML private void handleClearFilter(){ searchField.clear();
                                            cbSearchField.setValue("Tất cả trường"); }

    private void updateCountLabel() {
        lblCount.setText("Tổng: " + masterData.size()
            + " KH  |  Hiển thị: " + filteredData.size());
    }

    private void alert(String msg) {
        new Alert(Alert.AlertType.INFORMATION, msg, ButtonType.OK).showAndWait();
    }

    private String badgeStyle(String status) {
        String color = switch (status) {
            case "Hoạt động"       -> "#2E7D32";
            case "Không hoạt động" -> "#C62828";
            default                -> "#F57F17";
        };
        return "-fx-background-color:" + color
            + ";-fx-text-fill:white;-fx-background-radius:12;"
            + "-fx-padding:2 10 2 10;-fx-font-weight:bold;";
    }
}
