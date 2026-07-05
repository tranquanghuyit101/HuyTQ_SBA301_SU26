package com.fucar.controller;

import com.fucar.model.Car;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.stage.Stage;
import java.time.LocalDate;

public class CarDialogController {

    @FXML private Label    lblTitle;
    @FXML private TextField tfCarId, tfCarName, tfRentPrice;
    @FXML private Spinner<Integer> spinnerYear, spinnerCapacity;
    @FXML private ComboBox<String> cbColor, cbProducer;
    @FXML private DatePicker dpImport;
    @FXML private TextArea   taDesc;
    @FXML private RadioButton rbAvailable, rbRenting, rbMaintenance;
    @FXML private Label errCarName, errRentPrice, errImport, errProducer;

    private ToggleGroup statusGroup;
    private boolean     isEditMode = false;

    @FXML
    public void initialize() {
        // Spinner năm SX: 1990–2030, mặc định năm nay
        spinnerYear.setValueFactory(
            new SpinnerValueFactory.IntegerSpinnerValueFactory(
                1990, 2030, LocalDate.now().getYear()));

        // Spinner số chỗ: 2–16
        spinnerCapacity.setValueFactory(
            new SpinnerValueFactory.IntegerSpinnerValueFactory(2, 16, 4));

        // Màu sắc
        cbColor.getItems().addAll("Trắng","Đen","Bạc","Đỏ","Xanh","Vàng","Khác");
        cbColor.setValue("Trắng");

        // Nhà sản xuất
        cbProducer.getItems().addAll("Toyota","Honda","Ford","VinFast","Mazda");

        // ToggleGroup trạng thái — mặc định "Có sẵn"
        statusGroup = new ToggleGroup();
        rbAvailable.setToggleGroup(statusGroup);
        rbRenting.setToggleGroup(statusGroup);
        rbMaintenance.setToggleGroup(statusGroup);
        rbAvailable.setSelected(true);

        // Chỉ cho nhập số vào giá thuê
        tfRentPrice.textProperty().addListener((obs, old, newVal) -> {
            if (!newVal.matches("\\d*\\.?\\d*")) tfRentPrice.setText(old);
        });

        // Xóa lỗi khi người dùng bắt đầu nhập lại
        tfCarName.textProperty().addListener((o,ov,nv) -> {
            errCarName.setText("");
            tfCarName.getStyleClass().remove("field-error");
        });
        tfRentPrice.textProperty().addListener((o,ov,nv) -> {
            errRentPrice.setText("");
            tfRentPrice.getStyleClass().remove("field-error");
        });
        dpImport.valueProperty().addListener((o,ov,nv) -> {
            errImport.setText("");
            dpImport.getStyleClass().remove("field-error");
        });
        cbProducer.valueProperty().addListener((o,ov,nv) -> {
            errProducer.setText("");
            cbProducer.getStyleClass().remove("field-error");
        });
    }

    /** Gọi từ màn hình cha để chuyển sang chế độ Edit */
    public void setEditMode(Car car) {
        isEditMode = true;
        lblTitle.setText("Chỉnh sửa thông tin xe");
        tfCarId.setText(car.getCarId());
        tfCarName.setText(car.getCarName());
        spinnerYear.getValueFactory().setValue(car.getModelYear());
        cbColor.setValue(car.getColor());
        spinnerCapacity.getValueFactory().setValue(car.getCapacity());
        tfRentPrice.setText(String.valueOf(car.getRentPrice()));
        dpImport.setValue(car.getImportDate());
        cbProducer.setValue(car.getProducer());
        taDesc.setText(car.getDescription());
        switch (car.getStatus()) {
            case "Đang cho thuê" -> rbRenting.setSelected(true);
            case "Bảo dưỡng"    -> rbMaintenance.setSelected(true);
            default              -> rbAvailable.setSelected(true);
        }
    }

    @FXML
    private void handleSave() {
        boolean valid = true;

        // Validate tên xe
        if (tfCarName.getText() == null || tfCarName.getText().trim().length() < 3) {
            errCarName.setText("Tên xe phải có 3–100 ký tự.");
            if (!tfCarName.getStyleClass().contains("field-error")) {
                tfCarName.getStyleClass().add("field-error");
            }
            valid = false;
        }

        // Validate giá thuê
        try {
            double price = Double.parseDouble(tfRentPrice.getText().trim());
            if (price <= 0) {
                errRentPrice.setText("Giá thuê phải > 0.");
                if (!tfRentPrice.getStyleClass().contains("field-error")) {
                    tfRentPrice.getStyleClass().add("field-error");
                }
                valid = false;
            }
        } catch (Exception e) {
            errRentPrice.setText("Giá thuê không hợp lệ.");
            if (!tfRentPrice.getStyleClass().contains("field-error")) {
                tfRentPrice.getStyleClass().add("field-error");
            }
            valid = false;
        }

        // Validate ngày nhập
        if (dpImport.getValue() == null) {
            errImport.setText("Vui lòng chọn ngày nhập.");
            if (!dpImport.getStyleClass().contains("field-error")) {
                dpImport.getStyleClass().add("field-error");
            }
            valid = false;
        } else if (dpImport.getValue().isAfter(LocalDate.now())) {
            errImport.setText("Ngày nhập không được là tương lai.");
            if (!dpImport.getStyleClass().contains("field-error")) {
                dpImport.getStyleClass().add("field-error");
            }
            valid = false;
        }

        // Validate nhà SX
        if (cbProducer.getValue() == null) {
            errProducer.setText("Vui lòng chọn nhà sản xuất.");
            if (!cbProducer.getStyleClass().contains("field-error")) {
                cbProducer.getStyleClass().add("field-error");
            }
            valid = false;
        }

        if (!valid) return;

        // Xác nhận lưu
        Alert confirm = new Alert(Alert.AlertType.CONFIRMATION,
            "Xác nhận " + (isEditMode ? "cập nhật" : "thêm mới") + "?",
            ButtonType.YES, ButtonType.NO);
        confirm.showAndWait().ifPresent(btn -> {
            if (btn == ButtonType.YES) closeDialog();
        });
    }

    @FXML
    private void handleCancel() { closeDialog(); }

    private void closeDialog() {
        ((Stage) tfCarName.getScene().getWindow()).close();
    }
}
