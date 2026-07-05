package com.fucar.controller;

import com.fucar.model.Car;
import com.fucar.model.Customer;
import javafx.beans.property.*;
import javafx.fxml.*;
import javafx.scene.control.*;
import javafx.stage.Stage;
import javafx.util.StringConverter;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

public class RentalController {

    @FXML private ComboBox<Customer> customerCombo;
    @FXML private ComboBox<Car>      carCombo;
    @FXML private DatePicker dpPickup, dpReturn;
    @FXML private Label lblCusId, lblCusMobile, lblCarName,
                        lblPricePerDay, lblDays, lblTotal;
    @FXML private ProgressBar progressDays;
    @FXML private ComboBox<String> cbStatus;

    private final LongProperty   numDays     = new SimpleLongProperty(0);
    private final DoubleProperty pricePerDay = new SimpleDoubleProperty(0);
    private final NumberFormat   fmt =
        NumberFormat.getInstance(new Locale("vi","VN"));

    @FXML
    public void initialize() {
        setupCustomerCombo();
        setupCarCombo();
        setupDatePickers();
        cbStatus.getItems().addAll("Đã xác nhận","Chờ xác nhận","Đã hủy");
        cbStatus.setValue("Chờ xác nhận");
        lblTotal.setText("0 VNĐ");
        lblDays.setText("—");
    }

    private void setupCustomerCombo() {
        customerCombo.getItems().addAll(
            new Customer("CUS-001","Nguyễn Văn An","0912345678",
                LocalDate.of(1995,3,15),"CK001","an@mail.com","Hoạt động"),
            new Customer("CUS-002","Trần Thị Bình","0987654321",
                LocalDate.of(1998,7,20),"CK002","binh@mail.com","Hoạt động")
        );
        customerCombo.setConverter(new StringConverter<>() {
            public String toString(Customer c) {
                return c==null?"":c.getCustomerName()+" ("+c.getCustomerId()+")";
            }
            public Customer fromString(String s) { return null; }
        });
        customerCombo.valueProperty().addListener((obs,o,c) -> {
            if (c != null) {
                lblCusId.setText(c.getCustomerId());
                lblCusMobile.setText(c.getMobile());
            }
        });
    }

    private void setupCarCombo() {
        Car c1 = new Car(); c1.setCarId("CAR-001");
        c1.setCarName("Toyota Camry"); c1.setRentPrice(800000);
        Car c2 = new Car(); c2.setCarId("CAR-002");
        c2.setCarName("Honda Civic");  c2.setRentPrice(600000);
        carCombo.getItems().addAll(c1, c2);
        carCombo.setConverter(new StringConverter<>() {
            public String toString(Car c) {
                return c==null?"":c.getCarName()+" ("+c.getCarId()+")";
            }
            public Car fromString(String s) { return null; }
        });
        carCombo.valueProperty().addListener((obs,o,car) -> {
            if (car != null) {
                lblCarName.setText(car.getCarName());
                pricePerDay.set(car.getRentPrice());
                lblPricePerDay.setText(fmt.format(car.getRentPrice())+" VNĐ");
                updateTotal();
            }
        });
    }

    private void setupDatePickers() {
        // Ngày lấy không được là quá khứ
        dpPickup.setDayCellFactory(p -> new DateCell() {
            @Override public void updateItem(LocalDate d, boolean empty) {
                super.updateItem(d, empty);
                setDisable(empty || d.isBefore(LocalDate.now()));
            }
        });

        // Khi đổi ngày → tính lại số ngày
        dpPickup.valueProperty().addListener((obs,o,d) -> recalcDays());
        dpReturn.valueProperty().addListener((obs,o,d) -> recalcDays());
    }

    private void recalcDays() {
        LocalDate pickup = dpPickup.getValue();
        LocalDate ret    = dpReturn.getValue();

        // Cập nhật DateCell ngày trả: phải sau ngày lấy
        if (pickup != null) {
            dpReturn.setDayCellFactory(p -> new DateCell() {
                @Override public void updateItem(LocalDate d, boolean empty) {
                    super.updateItem(d, empty);
                    setDisable(empty || !d.isAfter(pickup));
                }
            });
        }

        if (pickup != null && ret != null && ret.isAfter(pickup)) {
            long days = ChronoUnit.DAYS.between(pickup, ret);
            numDays.set(days);
            lblDays.setText(days + " ngày");
            progressDays.setProgress(Math.min(days / 30.0, 1.0));
        } else {
            numDays.set(0);
            lblDays.setText("—");
            progressDays.setProgress(0);
        }
        updateTotal();
    }

    private void updateTotal() {
        double total = pricePerDay.get() * numDays.get();
        lblTotal.setText(fmt.format(total) + " VNĐ");
    }

    @FXML
    private void handleCreate() {
        List<String> errors = new ArrayList<>();

        if (customerCombo.getValue() == null)
            errors.add("• Chưa chọn khách hàng.");
        if (carCombo.getValue() == null)
            errors.add("• Chưa chọn xe.");
        if (dpPickup.getValue() == null)
            errors.add("• Chưa chọn ngày lấy xe.");
        else if (dpPickup.getValue().isBefore(LocalDate.now()))
            errors.add("• Ngày lấy xe phải ≥ hôm nay.");
        if (dpReturn.getValue() == null)
            errors.add("• Chưa chọn ngày trả xe.");
        if (numDays.get() > 30)
            errors.add("• Số ngày thuê tối đa 30 ngày.");
        if (numDays.get() == 0 && dpPickup.getValue() != null && dpReturn.getValue() != null)
            errors.add("• Ngày trả phải sau ngày lấy ít nhất 1 ngày.");

        if (!errors.isEmpty()) {
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setTitle("Lỗi xác thực");
            alert.setHeaderText("Vui lòng kiểm tra các thông tin sau:");
            alert.setContentText(String.join("\n", errors));
            alert.showAndWait();
            return;
        }

        new Alert(Alert.AlertType.INFORMATION,
            "Tạo giao dịch thành công!", ButtonType.OK).showAndWait();
        handleCancel();
    }

    @FXML private void handleFindCustomer() {
        new Alert(Alert.AlertType.INFORMATION,
            "Dialog tìm KH (chưa triển khai).", ButtonType.OK).showAndWait();
    }
    @FXML private void handleFindCar() {
        new Alert(Alert.AlertType.INFORMATION,
            "Dialog tìm xe (chưa triển khai).", ButtonType.OK).showAndWait();
    }
    @FXML private void handleCancel() {
        ((Stage) lblDays.getScene().getWindow()).close();
    }
}
