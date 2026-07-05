module com.fucar {
    requires javafx.controls;
    requires javafx.fxml;

    opens com.fucar.controller to javafx.fxml;
    opens com.fucar.model to javafx.base;
    exports com.fucar;
}