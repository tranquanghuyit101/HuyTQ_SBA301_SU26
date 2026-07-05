package sba301.fe.controller;

import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.stage.Stage;
import sba301.fu.pojo.Book;
import sba301.fu.pojo.Student;
import sba301.fu.service.BookService;
import sba301.fu.service.IBookService;
import java.util.List;

import java.net.URL;
import java.util.ResourceBundle;

public class BookController implements Initializable {

    @FXML
    private TableView<Book> tbBooks;
    @FXML
    private TableColumn<Book, Long> colBookId;
    @FXML
    private TableColumn<Book, String> colTitle;
    @FXML
    private TableColumn<Book, String> colAuthor;
    @FXML
    private TableColumn<Book, String> colIsbn;

    @FXML
    private TextField txtTitle;
    @FXML
    private TextField txtAuthor;
    @FXML
    private TextField txtIsbn;
    @FXML
    private Label lblStudentContext;

    private Student currentStudent;
    private IBookService bookService;
    private ObservableList<Book> booksModel;
    private long selectedBookId = 0L;

    public BookController() {
        bookService = new BookService();
        booksModel = FXCollections.observableArrayList();
    }

    public void setStudent(Student student) {
        this.currentStudent = student;
        if (student != null) {
            lblStudentContext.setText("Student: " + student.getEmail());
            loadBooksForStudent();
        }
    }

    private void loadBooksForStudent() {
        if (currentStudent != null) {
            booksModel.clear();
            List<Book> books = bookService.findBooksByStudentId(currentStudent.getId());
            if (books != null) {
                booksModel.addAll(books);
            }
            tbBooks.setItems(booksModel);
        }
    }

    private void showBook(Book book) {
        if (book != null) {
            this.selectedBookId = book.getId();
            this.txtTitle.setText(book.getTitle());
            this.txtAuthor.setText(book.getAuthor());
            this.txtIsbn.setText(book.getIsbn());
        }
    }

    private void refreshDataTable() {
        this.selectedBookId = 0L;
        this.txtTitle.setText("");
        this.txtAuthor.setText("");
        this.txtIsbn.setText("");
        loadBooksForStudent();
    }

    private void showAlert(String header, String content) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setHeaderText(header);
        alert.setContentText(content);
        alert.showAndWait();
    }

    private boolean isValidInput() {
        if (txtTitle.getText() == null || txtTitle.getText().trim().isEmpty() ||
            txtAuthor.getText() == null || txtAuthor.getText().trim().isEmpty() ||
            txtIsbn.getText() == null || txtIsbn.getText().trim().isEmpty()) {
            showAlert("Validation Error", "All fields (Title, Author, ISBN) must be filled!");
            return false;
        }
        return true;
    }

    @Override
    public void initialize(URL location, ResourceBundle resources) {
        colBookId.setCellValueFactory(new PropertyValueFactory<>("id"));
        colTitle.setCellValueFactory(new PropertyValueFactory<>("title"));
        colAuthor.setCellValueFactory(new PropertyValueFactory<>("author"));
        colIsbn.setCellValueFactory(new PropertyValueFactory<>("isbn"));

        tbBooks.getSelectionModel().selectedItemProperty().addListener(new ChangeListener<Book>() {
            @Override
            public void changed(ObservableValue<? extends Book> observableValue, Book oldValue, Book newValue) {
                if (newValue != null) {
                    showBook(newValue);
                }
            }
        });
    }

    @FXML
    public void addBook() {
        if (currentStudent == null) {
            showAlert("Error", "No student context loaded!");
            return;
        }
        if (!isValidInput()) return;

        Book book = new Book(txtTitle.getText().trim(), txtAuthor.getText().trim(), txtIsbn.getText().trim());
        book.setStudent(currentStudent);

        bookService.save(book);
        refreshDataTable();
    }

    @FXML
    public void updateBook() {
        if (selectedBookId == 0L) {
            showAlert("Error", "Please select a book from the table first!");
            return;
        }
        if (!isValidInput()) return;

        Book book = new Book(txtTitle.getText().trim(), txtAuthor.getText().trim(), txtIsbn.getText().trim());
        book.setId(selectedBookId);
        book.setStudent(currentStudent);

        bookService.update(book);
        refreshDataTable();
    }

    @FXML
    public void deleteBook() {
        if (selectedBookId == 0L) {
            showAlert("Error", "Please select a book from the table first!");
            return;
        }

        Alert confirm = new Alert(Alert.AlertType.CONFIRMATION, "Are you sure you want to delete this book?", ButtonType.YES, ButtonType.NO);
        confirm.setHeaderText("Delete Confirmation");
        confirm.showAndWait().ifPresent(response -> {
            if (response == ButtonType.YES) {
                try {
                    bookService.delete(selectedBookId);
                    refreshDataTable();
                } catch (Exception e) {
                    showAlert("Error", "Could not delete book: " + e.getMessage());
                }
            }
        });
    }

    @FXML
    public void handleClose(ActionEvent event) {
        Stage stage = (Stage) ((javafx.scene.Node) event.getSource()).getScene().getWindow();
        stage.close();
    }
}
