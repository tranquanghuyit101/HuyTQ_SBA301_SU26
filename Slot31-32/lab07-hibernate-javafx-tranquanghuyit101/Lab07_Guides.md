# Lab 07 – Building Desktop Application Using JavaFX and Hibernate

Hướng dẫn thực hành dựa trên `Lab 07_Hibernate Application Development & CRUD Operations.docx`, kết hợp lý thuyết ở `Chapter17.md` / `Chapter18.md`, và **code thực tế trích xuất từ các slide demo trong `Chapter 18. Hibernate Application Development & CRUD Operations.pptx`** (IntelliJ project `SBA301_Hibernate_Project` + `JavaFXDemo`).

> Ghi chú quan trọng: slide demo dùng quan hệ **`@OneToMany` (Student) / `@ManyToOne` (Book)** với cột khóa ngoại `student_id` ngay trong bảng `Books`, **không dùng bảng trung gian `STUDENTS_BOOKS`** như mô tả trong docx (vốn ngụ ý many-to-many). Hướng dẫn dưới đây bám theo code thực tế của slide (one-to-many); nếu đề bài yêu cầu đúng many-to-many với bảng `STUDENTS_BOOKS`, xem phần "Biến thể Many-to-Many" ở cuối TODO 2.4/2.5.

---

## 1. Bối cảnh (Introduction)

Bạn đóng vai admin phòng IT của một trường Đại học. Quản lý giao nhiệm vụ xây dựng ứng dụng desktop cho phòng Thư viện để quản lý **Student** và **Book** (một Student có thể có nhiều Book).

Schema database:
- `BOOKS(id, author, isbn, title)`
- `STUDENTS(id IDENTITY(1,1), email, password, firstName, lastName, marks)`

Ứng dụng phải hỗ trợ đầy đủ 4 thao tác chuẩn: **Create, Read, Update, Delete (CRUD)**.

Công nghệ: **Hibernate** (ORM, lưu trữ dữ liệu qua SQL Server) + **JavaFX** (giao diện desktop) + **Repository Pattern** (DAO → Repository → Service).

## 2. Mục tiêu Lab (Lab Objectives)

- Dùng IntelliJ/Eclipse tạo Maven Project.
- Phát triển ứng dụng dùng JavaFX, Hibernate.
- Dùng JPA/Hibernate tạo database SQL Server (theo docx: `LibraryDB`; theo demo slide: DB tên `tutorial` — đổi tên tùy ý trong `hibernate.cfg.xml`).
- Xây dựng kiến trúc 3 tầng (3-Layer) theo Repository Pattern để thực hiện CRUD bằng Hibernate và JavaFX.
- Chạy project và kiểm thử các chức năng của ứng dụng.

## 3. Kiến trúc & cấu trúc thư mục tham chiếu

Có **2 project Maven riêng biệt**, project JavaFX tham chiếu (module dependency) tới project Hibernate:

```
SBA301_Hibernate_Project/            (module: sba301.com)
└── src/main/java/sba301/fu/
    ├── dao/StudentDAO.java
    ├── pojo/Student.java
    ├── pojo/Book.java
    ├── repository/IStudentRepository.java
    ├── repository/StudentRepository.java
    ├── service/IStudentService.java
    ├── service/StudentService.java
    └── module-info.java
└── src/main/resources/hibernate.cfg.xml

JavaFXDemo/                          (module: hsf302.javafx.com)
└── src/main/java/sba301/fe/controller/
    ├── MainApplication.java
    ├── StudentController.java
    └── module-info.java
└── src/main/resources/sba301/fe/controller/
    └── student-view.fxml
```

---

## 4. Hướng dẫn từng bước kèm TODO và code chi tiết

### Activity 01: Design the Student Management

- [ ] **TODO 1.1** — Step 01: Mở **Gluon Scene Builder**.
- [ ] **TODO 1.2** — Step 02: Thiết kế mockup màn hình **Manage Student** (bảng danh sách + form nhập + nút Add/Update/Delete) và màn hình **Login** (2 field + nút Login). Không cần code ở bước này — chỉ phác thảo layout, sẽ hiện thực hoá bằng FXML ở Activity 03/04.

### Activity 02: Develop the Architecture with Repository Pattern

- [ ] **TODO 2.1** — Step 01: Mở IntelliJ → **File → New → Maven Project**, đặt tên `SBA301_Hibernate_Project`.

- [ ] **TODO 2.2** — Step 02: Tạo cấu trúc package như sơ đồ mục 3 (`dao`, `pojo`, `repository`, `service`).

- [ ] **TODO 2.3** — Step 03: Tạo `src/main/resources/hibernate.cfg.xml`:

```xml
<?xml version = "1.0" encoding = "utf-8"?>
<!DOCTYPE hibernate-configuration SYSTEM
"http://www.hibernate.org/dtd/hibernate-configuration-3.0.dtd">
<hibernate-configuration>
    <session-factory>
        <property name="hbm2ddl.auto">update</property>
        <property name="dialect">org.hibernate.dialect.SQLServerDialect</property>
        <property name="connection.url">jdbc:sqlserver://localhost:1433;DatabaseName=LibraryDB;encrypt=true;trustServerCertificate=true</property>
        <property name="connection.username">sa</property>
        <property name="connection.password">YOUR_PASSWORD</property>
        <property name="connection.driver_class">com.microsoft.sqlserver.jdbc.SQLServerDriver</property>

        <mapping class="sba301.fu.pojo.Student" />
        <mapping class="sba301.fu.pojo.Book" />

    </session-factory>
</hibernate-configuration>
```
> Đổi `DatabaseName` thành `LibraryDB` theo yêu cầu lab, và `connection.password` theo SQL Server thật của bạn. `hbm2ddl.auto=update` giúp Hibernate tự tạo/cập nhật bảng theo entity.

- [ ] **TODO 2.4** — Step 04: Tạo `Book.java` trong package `pojo`:

```java
package sba301.fu.pojo;

import jakarta.persistence.*;

@Entity
@Table(name = "Books")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "title", length = 30)
    private String title;

    private String author;

    private String isbn;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "student_id")
    private Student student;

    public Book() { super(); }

    public Book(String title, String author, String isbn) {
        super();
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }

    public Book(Book book) {
        super();
        this.title = book.title;
        this.author = book.author;
        this.isbn = book.isbn;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
}
```

- [ ] **TODO 2.5** — Step 05: Tạo `Student.java` trong package `pojo`:

```java
package sba301.fu.pojo;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "fistName")
    private String firstName;

    @Column(name = "lastName")
    private String lastName;

    @Column(name = "marks")
    private int marks;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "student_id")
    private Set<Book> books;

    public Student() {
        this.setId(0);
        this.setEmail("");
        this.setPassword("");
        this.setFirstName("");
        this.setLastName("");
        this.setMarks(0);
        this.setBooks(new HashSet<Book>());
    }

    public Student(String email, String password, String firstName, String lastName, int marks) {
        super();
        this.setEmail(email);
        this.setPassword(password);
        this.setFirstName(firstName);
        this.setLastName(lastName);
        this.setMarks(marks);
        this.setBooks(new HashSet<Book>());
    }

    public Student(int id, String email, String password, String firstName, String lastName, int marks) {
        super();
        this.setId(id);
        this.setEmail(email);
        this.setPassword(password);
        this.setFirstName(firstName);
        this.setLastName(lastName);
        this.setMarks(marks);
        this.setBooks(new HashSet<Book>());
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public int getMarks() { return marks; }
    public void setMarks(int marks) { this.marks = marks; }

    public Set<Book> getBooks() { return books; }
    public void setBooks(Set<Book> books) { this.books = books; }
}
```

> **Biến thể Many-to-Many (nếu đề yêu cầu đúng bảng `STUDENTS_BOOKS`)**: thay `@OneToMany`/`@ManyToOne` bằng:
> ```java
> // Trong Student.java
> @ManyToMany(cascade = CascadeType.ALL)
> @JoinTable(
>     name = "Students_Books",
>     joinColumns = @JoinColumn(name = "student_id"),
>     inverseJoinColumns = @JoinColumn(name = "book_id"))
> private Set<Book> books;
>
> // Trong Book.java
> @ManyToMany(mappedBy = "books")
> private Set<Student> students;
> ```

- [ ] **TODO 2.6** & **TODO 2.7** — Step 06–07: Tạo `StudentDAO.java` trong package `dao` với đủ 5 thao tác CRUD:

```java
package sba301.fu.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import org.hibernate.query.Query;
import sba301.fu.pojo.Student;

import java.util.List;

public class StudentDAO {

    private SessionFactory sessionFactory = null;
    private Configuration cf = null;

    public StudentDAO() {
        cf = new Configuration();
        cf = cf.configure("hibernate.cfg.xml");
        sessionFactory = cf.buildSessionFactory();
    }

    // 1. Save Student
    public void save(Student student) {
        Session session = sessionFactory.openSession();
        Transaction t = session.beginTransaction();
        try {
            session.save(student);
            t.commit();
            System.out.println("successfully saved");
        } catch (Exception ex) {
            t.rollback();
            System.out.println("Error " + ex.getMessage());
        }
    }

    // 2. Get All Student
    public List<Student> getStudents() {
        Session session = sessionFactory.openSession();
        Transaction t = session.beginTransaction();
        try {
            Query query = session.createQuery("from Student");
            return query.list();
        } catch (Exception ex) {
            t.rollback();
            System.out.println("Error " + ex.getMessage());
        }
        return null;
    }

    // 3. Delete Student
    public void delete(int studentID) {
        Session session = sessionFactory.openSession();
        Transaction tx = session.getTransaction();
        try {
            tx.begin();
            Student student = (Student) session.get(Student.class, studentID);
            session.delete(student);
            tx.commit();
        } catch (RuntimeException e) {
            tx.rollback();
            throw e;
        }
    }

    // 4. Find A Student
    public Student findById(int studentID) {
        Session session = sessionFactory.openSession();
        try {
            return (Student) session.get(Student.class, studentID);
        } catch (RuntimeException e) {
            throw e;
        }
    }

    // 5. Update a Student
    public void update(Student student) {
        Session session = sessionFactory.openSession();
        Transaction t = session.beginTransaction();
        try {
            session.update(student);
            t.commit();
            System.out.println("update saved");
        } catch (Exception ex) {
            t.rollback();
            System.out.println("Error " + ex.getMessage());
        }
    }
}
```

- [ ] **TODO 2.8** — Step 08: Tạo `IStudentRepository.java` trong package `repository`:

```java
package sba301.fu.repository;

import sba301.fu.pojo.Student;
import java.util.List;

public interface IStudentRepository {
    public List<Student> findAll();
    public void save(Student student);
    public void delete(int studentID);
    public Student findById(int studentID);
    public void update(Student student);
}
```

- [ ] **TODO 2.9** — Step 09: Tạo `StudentRepository.java`:

```java
package sba301.fu.repository;

import sba301.fu.dao.StudentDAO;
import sba301.fu.pojo.Student;
import java.util.List;

public class StudentRepository implements IStudentRepository {
    private StudentDAO studentDAO = null;

    public StudentRepository() { studentDAO = new StudentDAO(); }

    @Override
    public void save(Student student) {
        studentDAO.save(student);
    }

    @Override
    public List<Student> findAll() {
        return studentDAO.getStudents();
    }

    @Override
    public void delete(int studentID) { studentDAO.delete(studentID); }

    @Override
    public Student findById(int studentID) {
        return studentDAO.findById(studentID);
    }

    @Override
    public void update(Student student) { studentDAO.update(student); }
}
```

- [ ] **TODO 2.10** — Step 10: Tạo `IStudentService.java` trong package `service`:

```java
package sba301.fu.service;

import sba301.fu.pojo.Student;
import java.util.List;

public interface IStudentService {
    public List<Student> findAll();
    public void save(Student student);
    public void delete(int studentID);
    public Student findById(int studentID);
    public void update(Student student);
}
```

- [ ] **TODO 2.11** — Step 11: Tạo `StudentService.java`:

```java
package sba301.fu.service;

import sba301.fu.repository.IStudentRepository;
import sba301.fu.repository.StudentRepository;
import sba301.fu.pojo.Student;
import java.util.List;

public class StudentService implements IStudentService {
    private IStudentRepository iStudentRepo = null;

    public StudentService() { iStudentRepo = new StudentRepository(); }

    @Override
    public void save(Student student) { iStudentRepo.save(student); }

    @Override
    public List<Student> findAll() { return iStudentRepo.findAll(); }

    @Override
    public void delete(int studentID) { iStudentRepo.delete(studentID); }

    @Override
    public Student findById(int studentID) { return iStudentRepo.findById(studentID); }

    @Override
    public void update(Student student) { iStudentRepo.update(student); }
}
```

- [ ] **TODO 2.12** — Step 12: Tạo `module-info.java` (project Hibernate):

```java
module sba301.com {
    requires jakarta.persistence;
    requires org.hibernate.orm.core;
    requires java.naming;
    opens sba301.fu.pojo;
    exports sba301.fu.pojo;
    exports sba301.fu.service;
}
```

### Activity 03: Develop the Student List Page (JavaFX)

- [ ] **TODO 3.1** & **TODO 3.2** — Step 01–02: IntelliJ → **File → New → Maven/JavaFX Project**, đặt tên `JavaFXDemo`.

- [ ] **TODO 3.3** — Step 03: Cấu trúc thư mục như mục 3: package `sba301.fe.controller` chứa `MainApplication`, `StudentController`; `resources/sba301.fe.controller/student-view.fxml`.

- [ ] **TODO 3.4** — Step 04: `module-info.java` của `JavaFXDemo`:

```java
module hsf302.javafx.com {
    requires javafx.controls;
    requires javafx.fxml;
    requires com.dlsc.formsfx;
    requires sba301.com;

    opens sba301.fe.controller to javafx.fxml;
    exports sba301.fe.controller;
}
```

- [ ] **TODO 3.5** — Step 05: Add Reference Another Project — trong `pom.xml` của `JavaFXDemo`, thêm dependency module tới `SBA301_Hibernate_Project` (hoặc **File → Project Structure → Modules → Dependencies → + → Module Dependency**).

```xml
<dependency>
    <groupId>org.example</groupId>
    <artifactId>SBA301_Hibernate_Project</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>
```

- [ ] **TODO 3.6** & **TODO 3.7** — Step 06–07: Mở `student-view.fxml` bằng SceneBuilder, thiết kế:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?import javafx.geometry.Insets?>
<?import javafx.scene.control.Button?>
<?import javafx.scene.control.Label?>
<?import javafx.scene.control.TableColumn?>
<?import javafx.scene.control.TableView?>
<?import javafx.scene.control.TextField?>
<?import javafx.scene.layout.AnchorPane?>
<?import javafx.scene.layout.ColumnConstraints?>
<?import javafx.scene.layout.GridPane?>
<?import javafx.scene.layout.HBox?>
<?import javafx.scene.layout.Pane?>
<?import javafx.scene.layout.RowConstraints?>
<?import javafx.scene.text.Font?>

<AnchorPane xmlns="http://javafx.com/javafx"
            xmlns:fx="http://javafx.com/fxml" prefHeight="563.0" prefWidth="600.0" fx:controller="sba301.fe.controller.StudentController">
   <children>
      <Pane prefHeight="83.0" prefWidth="500" style="-fx-background-color: #2D75E8;" AnchorPane.leftAnchor="0.0" AnchorPane.rightAnchor="0.0" AnchorPane.topAnchor="0.0">
         <children>
            <Label layoutX="176.0" layoutY="7.0" text="Manage Student" textFill="WHITE">
               <font><Font size="36.0" /></font>
            </Label>
         </children>
      </Pane>
      <TableView fx:id="tbData" layoutX="20.0" layoutY="328.0" prefHeight="213.0" prefWidth="624.0" AnchorPane.bottomAnchor="22.0" AnchorPane.leftAnchor="20.0">
        <columns>
          <TableColumn fx:id="studentId" prefWidth="75.0" text="StudentId" />
          <TableColumn fx:id="email" prefWidth="75.0" text="Email" />
          <TableColumn fx:id="password" prefWidth="75.0" text="Password" />
          <TableColumn fx:id="firstName" prefWidth="75.0" text="First Name" />
          <TableColumn fx:id="lastName" prefWidth="75.0" text="Last Name" />
          <TableColumn fx:id="totalMark" prefWidth="75.0" text="Total Mark" />
        </columns>
      </TableView>
      <GridPane layoutX="20.0" layoutY="100.0" prefHeight="232.0" prefWidth="575.0">
        <columnConstraints>
          <ColumnConstraints hgrow="SOMETIMES" maxWidth="429.0" minWidth="10.0" prefWidth="427.0" />
          <ColumnConstraints hgrow="SOMETIMES" maxWidth="281.0" minWidth="10.0" prefWidth="148.0" />
        </columnConstraints>
        <rowConstraints>
          <RowConstraints minHeight="10.0" prefHeight="30.0" vgrow="SOMETIMES" />
          <RowConstraints minHeight="10.0" prefHeight="30.0" vgrow="SOMETIMES" />
          <RowConstraints minHeight="10.0" prefHeight="30.0" vgrow="SOMETIMES" />
          <RowConstraints minHeight="10.0" prefHeight="30.0" vgrow="SOMETIMES" />
          <RowConstraints minHeight="10.0" prefHeight="30.0" vgrow="SOMETIMES" />
        </rowConstraints>
        <children>
          <HBox prefHeight="61.0" prefWidth="362.0" GridPane.rowIndex="0">
            <children>
              <Label text="Email:" />
              <TextField fx:id="txtEmail" prefHeight="26.0" prefWidth="254.0">
                <HBox.margin><Insets left="37.0" /></HBox.margin>
              </TextField>
            </children>
          </HBox>
          <HBox prefHeight="61.0" prefWidth="362.0" GridPane.rowIndex="1">
            <children>
              <Label text="Password :" />
              <TextField fx:id="txtPassword" prefHeight="26.0" prefWidth="254.0">
                <HBox.margin><Insets left="15.0" /></HBox.margin>
              </TextField>
            </children>
          </HBox>
          <HBox prefHeight="61.0" prefWidth="362.0" GridPane.rowIndex="2">
            <children>
              <Label text="First Name :" />
              <TextField fx:id="txtFirstName" prefHeight="26.0" prefWidth="254.0">
                <HBox.margin><Insets left="10.0" /></HBox.margin>
              </TextField>
            </children>
          </HBox>
          <HBox maxWidth="-Infinity" minHeight="-Infinity" minWidth="-Infinity" prefHeight="100.0" prefWidth="200.0" GridPane.columnIndex="1" GridPane.rowIndex="1">
            <children>
              <Button fx:id="btnAdd" onAction="#addStudent" mnemonicParsing="false" prefHeight="43.0" prefWidth="124.0" text="Add Student" />
            </children>
          </HBox>
          <HBox prefHeight="100.0" prefWidth="200.0" GridPane.rowIndex="3">
            <children>
              <Label text="Last Name :" />
              <TextField fx:id="txtLastName" prefHeight="26.0" prefWidth="254.0">
                <HBox.margin><Insets left="10.0" /></HBox.margin>
              </TextField>
            </children>
          </HBox>
          <HBox maxWidth="-Infinity" prefHeight="77.0" prefWidth="210.0" GridPane.columnIndex="1" GridPane.rowIndex="2">
            <children>
              <Button fx:id="btnUpdate" onAction="#updateStudent" mnemonicParsing="false" prefHeight="42.0" prefWidth="124.0" text="Update Student" />
            </children>
          </HBox>
          <HBox prefHeight="100.0" prefWidth="200.0" GridPane.rowIndex="4">
            <children>
              <Label text="Total Mark :" />
              <TextField fx:id="txtTotalMark" prefHeight="26.0" prefWidth="254.0">
                <HBox.margin><Insets left="10.0" /></HBox.margin>
              </TextField>
            </children>
          </HBox>
          <HBox maxWidth="-Infinity" prefHeight="60.0" prefWidth="200.0" GridPane.columnIndex="1" GridPane.rowIndex="3">
            <children>
              <Button fx:id="btnDelete" onAction="#deleteStudent" mnemonicParsing="false" prefHeight="43.0" prefWidth="125.0" text="Delete Student" />
            </children>
          </HBox>
        </children>
      </GridPane>
   </children>
</AnchorPane>
```

`MainApplication.java` (điểm khởi chạy, không có sẵn trong slide — boilerplate chuẩn JavaFX):

```java
package sba301.fe.controller;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class MainApplication extends Application {
    @Override
    public void start(Stage stage) throws Exception {
        FXMLLoader fxmlLoader = new FXMLLoader(MainApplication.class.getResource("student-view.fxml"));
        Scene scene = new Scene(fxmlLoader.load());
        stage.setTitle("Library - Manage Student");
        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
```

- [ ] **TODO 3.8**, **TODO 3.9**, **TODO 3.10** — Step 08–10: `StudentController.java` đầy đủ:

```java
package sba301.fe.controller;

import sba301.fu.pojo.Student;
import sba301.fu.service.IStudentService;
import sba301.fu.service.StudentService;

import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;

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

    private int idStudent;

    private IStudentService iStudentService;
    private ObservableList<Student> studentsModels;

    public StudentController() {
        iStudentService = new StudentService();
        studentsModels = FXCollections.observableArrayList(iStudentService.findAll());
    }

    public void showAlert(String header, String content) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION);
        alert.setHeaderText(header);
        alert.setContentText(content);
        alert.showAndWait();
    }

    private void showStudent(Student student) {
        this.setIdStudent(student.getId());
        this.txtFirstName.setText(student.getFirstName());
        this.txtEmail.setText(student.getEmail());
        this.txtPassword.setText(student.getPassword());
        this.txtLastName.setText(student.getLastName());
        this.txtTotalMark.setText(String.valueOf(student.getMarks()));
    }

    private void refreshDataTable() {
        this.setIdStudent(0);
        this.txtFirstName.setText("");
        this.txtLastName.setText("");
        this.txtTotalMark.setText("");
        this.txtEmail.setText("");
        this.txtPassword.setText("");
        studentsModels = FXCollections.observableArrayList(iStudentService.findAll());
        tbData.setItems(studentsModels);
    }

    @Override
    public void initialize(URL location, ResourceBundle resources) {

        studentId.setCellValueFactory(new PropertyValueFactory<>("Id"));
        firstName.setCellValueFactory(new PropertyValueFactory<>("FirstName"));
        lastName.setCellValueFactory(new PropertyValueFactory<>("LastName"));
        email.setCellValueFactory(new PropertyValueFactory<>("Email"));
        password.setCellValueFactory(new PropertyValueFactory<>("Password"));
        totalMark.setCellValueFactory(new PropertyValueFactory<>("Marks"));
        tbData.setItems(studentsModels);

        tbData.getSelectionModel().selectedItemProperty().addListener(new ChangeListener() {
            @Override
            public void changed(ObservableValue observableValue, Object oldValue, Object index) {
                if (tbData.getSelectionModel().getSelectedItem() != null) {
                    TableView.TableViewSelectionModel selectionModel = tbData.getSelectionModel();
                    ObservableList selectedCells = selectionModel.getSelectedCells();
                    TablePosition tablePosition = (TablePosition) selectedCells.get(0);

                    Object studentID = tablePosition.getTableColumn().getCellData(index);

                    try {
                        Student student = iStudentService.findById(Integer.valueOf(studentID.toString()));
                        showStudent(student);
                    } catch (Exception ex) {
                        showAlert("Infomation Board !", "Please choose the First Cell !");
                    }
                }
            }
        });
    }

    @FXML
    public void addStudent() {
        Student student = new Student(this.txtEmail.getText(), this.txtPassword.getText(), this.txtFirstName.getText(), this.txtLastName.getText(),
                Integer.parseInt(txtTotalMark.getText()));
        iStudentService.save(student);
        refreshDataTable();
    }

    @FXML
    public void deleteStudent() {
        iStudentService.delete(this.getIdStudent());
        refreshDataTable();
    }

    @FXML
    public void updateStudent() {
        Student student = new Student(this.idStudent, this.txtEmail.getText(), this.txtPassword.getText(),
                this.txtFirstName.getText(),
                this.txtLastName.getText(),
                Integer.parseInt(txtTotalMark.getText()));
        iStudentService.update(student);
        refreshDataTable();
    }

    public int getIdStudent() { return idStudent; }

    public void setIdStudent(int idStudent) { this.idStudent = idStudent; }
}
```

- [ ] **TODO 3.11** — Step 11: Chạy `MainApplication` (Shift+F10 / nút Run trong IntelliJ). Kiểm tra: bảng hiển thị danh sách Student, click 1 dòng → form tự điền, Add/Update/Delete hoạt động và đồng bộ với SQL Server.

### Activity 04: Design and Develop the Login Page

> Slide gốc không có code chi tiết cho phần này (chỉ có tiêu đề Step 01/02/09 + "After Login Success"). Code dưới đây được viết theo đúng phong cách/kiến trúc đã dùng ở Activity 02–03 (dùng lại `IStudentService`) để bạn hoàn thiện.

- [ ] **TODO 4.1** — Step 01: Thiết kế `LoginGUI.fxml` (đặt cùng thư mục `resources/sba301/fe/controller/`):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?import javafx.geometry.Insets?>
<?import javafx.scene.control.Button?>
<?import javafx.scene.control.Label?>
<?import javafx.scene.control.PasswordField?>
<?import javafx.scene.control.TextField?>
<?import javafx.scene.layout.VBox?>

<VBox alignment="CENTER" spacing="12.0" xmlns="http://javafx.com/javafx"
      xmlns:fx="http://javafx.com/fxml" fx:controller="sba301.fe.controller.LoginController"
      prefHeight="300.0" prefWidth="400.0">
    <padding><Insets bottom="20" left="20" right="20" top="20" /></padding>
    <children>
        <Label text="Login" style="-fx-font-size: 28px; -fx-font-weight: bold;" />
        <Label text="Email:" />
        <TextField fx:id="txtLoginEmail" promptText="Enter email" />
        <Label text="Password:" />
        <PasswordField fx:id="txtLoginPassword" promptText="Enter password" />
        <Button fx:id="btnLogin" text="Login" onAction="#login" defaultButton="true" />
    </children>
</VBox>
```

- [ ] **TODO 4.2** — Step 02: `LoginController.java` trong package `sba301.fe.controller`:

```java
package sba301.fe.controller;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.stage.Stage;
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

        List<Student> students = iStudentService.findAll();
        Student matched = students.stream()
                .filter(s -> s.getEmail().equals(email) && s.getPassword().equals(password))
                .findFirst()
                .orElse(null);

        if (matched != null) {
            openStudentManagementScreen(event);
        } else {
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setHeaderText("Login Failed");
            alert.setContentText("Email hoặc mật khẩu không đúng!");
            alert.showAndWait();
        }
    }

    // TODO 4.4: After Login Success -> chuyển sang student-view.fxml
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
        }
    }
}
```

`MainApplication.java` nên khởi động ở `LoginGUI.fxml` trước, chuyển sang `student-view.fxml` sau khi đăng nhập thành công (sửa `getResource("student-view.fxml")` ở TODO 3.7 thành `getResource("LoginGUI.fxml")`).

- [ ] **TODO 4.3** — Step 09: Chạy project, kiểm tra luồng: nhập sai → Alert lỗi; nhập đúng email/password của một Student có sẵn trong DB → chuyển màn hình.
- [ ] **TODO 4.4** — Kiểm tra **After Login Success**: màn hình `Manage Student` load đúng danh sách Student từ DB.

---

## 5. Checklist hoàn thành Lab

- [ ] Thiết kế xong mockup Manage Student và Login bằng Scene Builder (Activity 01).
- [ ] Tạo Maven Project `SBA301_Hibernate_Project`, cấu trúc package đầy đủ (pojo/dao/repository/service).
- [ ] `hibernate.cfg.xml` cấu hình đúng kết nối SQL Server (`LibraryDB`), dialect, 2 mapping class Student/Book.
- [ ] `Book.java` và `Student.java` annotate đúng (`@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@Column`), quan hệ `@OneToMany`/`@ManyToOne` (hoặc `@ManyToMany` nếu làm biến thể).
- [ ] `StudentDAO` cài đủ 5 method: `save`, `getStudents`, `delete`, `findById`, `update`.
- [ ] Repository Pattern hoàn chỉnh: `IStudentRepository` → `StudentRepository` → `IStudentService` → `StudentService`.
- [ ] `module-info.java` (Hibernate project) khai báo đúng `opens sba301.fu.pojo` để Hibernate reflection hoạt động.
- [ ] Project `JavaFXDemo` được tạo, có module dependency tới `SBA301_Hibernate_Project`.
- [ ] `student-view.fxml` đủ TableView (6 cột) + form input (email/password/firstName/lastName/totalMark) + 3 nút Add/Update/Delete.
- [ ] `StudentController.java`: load danh sách vào `tbData`, chọn dòng → `showStudent()` tự điền form, đủ 3 hàm `addStudent/updateStudent/deleteStudent`.
- [ ] Chạy thử: thêm/sửa/xóa Student → dữ liệu đồng bộ đúng với SQL Server.
- [ ] `LoginGUI.fxml` + `LoginController.java` hoàn chỉnh, login đúng → chuyển sang `student-view.fxml`; login sai → hiển thị Alert lỗi.
- [ ] Kiểm thử toàn bộ luồng end-to-end (Login → CRUD Student) không lỗi, không exception ở console.

---

## 6. Commit message gợi ý theo từng bước

Quy ước: `<type>: <mô tả ngắn>` (Conventional Commits).

**Activity 01 – Design**
```
design: create Gluon Scene Builder mockups for Manage Student and Login screens
```

**Activity 02 – Architecture & Repository Pattern**
```
chore: init Maven project SBA301_Hibernate_Project
chore: setup package structure (pojo, dao, repository, service)
feat: add hibernate.cfg.xml configuration for SQL Server connection
feat: add Book entity with JPA/Hibernate annotations
feat: add Student entity with OneToMany relationship to Book
feat: implement StudentDAO with SessionFactory
feat: implement save, getStudents, delete, findById, update in StudentDAO
feat: add IStudentRepository interface
feat: implement StudentRepository
feat: add IStudentService interface
feat: implement StudentService
chore: configure module-info.java for Hibernate reflection access
```

**Activity 03 – Student List Page (JavaFX)**
```
chore: init JavaFX Maven project JavaFXDemo
chore: build JavaFX project architecture (view/controller)
chore: configure module-info.java for JavaFX modules
chore: add module dependency to SBA301_Hibernate_Project
feat: design student-view.fxml with TableView and CRUD controls
feat: add MainApplication entry point
feat: implement StudentController bindings and event handlers
feat: display student list and capture StudentID on row selection
feat: implement addStudent/updateStudent/deleteStudent in StudentController
test: run and verify Student CRUD application
```

**Activity 04 – Login Page**
```
feat: design LoginGUI.fxml with email/password form
feat: implement LoginController for authentication logic
feat: navigate to Student management screen after successful login
fix: show alert on invalid login credentials
test: run and verify login flow end-to-end
```

**Hoàn tất Lab**
```
docs: update Lab07 guide with detailed code per TODO
chore: final review and cleanup for Lab 07 submission
```

---

## 7. Phần nâng cao (Advanced) — Yêu cầu làm thêm

Sau khi hoàn thành lab cơ bản (Activity 01–04), sinh viên làm thêm các yêu cầu nâng cao dưới đây để lấy điểm cộng / rèn kỹ năng thực tế. Không bắt buộc theo đúng code mẫu — mẫu chỉ mang tính gợi ý cách triển khai.

### 7.1. Quản lý Book đầy đủ (CRUD cho Book + gán Book cho Student)

Hiện tại lab chỉ CRUD Student; Book mới chỉ là entity liên kết. Yêu cầu xây dựng màn hình quản lý Book độc lập, và cho phép gán/gỡ Book cho một Student.

- [ ] **TODO A1.1** — Tạo `BookDAO.java` (package `dao`) với đủ `save`, `getBooks`, `delete`, `findById`, `update` (tương tự `StudentDAO`, dùng chung `SessionFactory`).
- [ ] **TODO A1.2** — Tạo `IBookRepository` / `BookRepository`, `IBookService` / `BookService` theo đúng Repository Pattern đã dùng cho Student.
- [ ] **TODO A1.3** — Tạo `book-view.fxml` + `BookController.java`: TableView liệt kê Book (id, title, author, isbn, student), form nhập, nút Add/Update/Delete.
- [ ] **TODO A1.4** — Trên màn hình `student-view.fxml`, thêm nút **"Manage Books"** mở `book-view.fxml` cho Student đang chọn; khi tạo Book mới từ màn hình này, tự gán `book.setStudent(selectedStudent)`.
- [ ] **TODO A1.5** — Trong `StudentDAO`/`StudentService`, thêm method `findBooksByStudentId(int studentId)` (dùng HQL: `"from Book where student.id = :sid"`) để hiển thị danh sách sách của 1 Student.

Gợi ý HQL lấy sách theo student (tham chiếu cách viết Query đã học ở `Chapter17.md` slide 35–36):
```java
public List<Book> findBooksByStudentId(int studentId) {
    Session session = sessionFactory.openSession();
    Query query = session.createQuery("from Book where student.id = :sid");
    query.setParameter("sid", studentId);
    return query.list();
}
```

### 7.2. Tìm kiếm / lọc Student trên giao diện

- [ ] **TODO A2.1** — Thêm `TextField fx:id="txtSearch"` phía trên `TableView` trong `student-view.fxml`.
- [ ] **TODO A2.2** — Dùng `FilteredList<Student>` bọc `studentsModels`, lọc theo `firstName`/`lastName`/`email` chứa từ khóa (không phân biệt hoa thường), cập nhật mỗi khi `txtSearch` thay đổi (`textProperty().addListener`).

```java
FilteredList<Student> filteredData = new FilteredList<>(studentsModels, s -> true);
txtSearch.textProperty().addListener((obs, oldVal, newVal) -> {
    String keyword = newVal == null ? "" : newVal.toLowerCase().trim();
    filteredData.setPredicate(student ->
        keyword.isEmpty()
        || student.getFirstName().toLowerCase().contains(keyword)
        || student.getLastName().toLowerCase().contains(keyword)
        || student.getEmail().toLowerCase().contains(keyword));
});
tbData.setItems(filteredData);
```

### 7.3. Validate dữ liệu nhập (Form Input Validation)

- [ ] **TODO A3.1** — Không cho lưu nếu `txtEmail`, `txtFirstName`, `txtLastName` để trống, hoặc `txtTotalMark` không phải số.
- [ ] **TODO A3.2** — Kiểm tra định dạng email bằng regex trước khi `save`/`update`.
- [ ] **TODO A3.3** — Giới hạn `marks` trong khoảng hợp lệ (ví dụ 0–10), hiển thị `Alert` lỗi nếu vi phạm thay vì để Exception văng ra console.

```java
private boolean isValidInput() {
    if (txtEmail.getText().isBlank() || txtFirstName.getText().isBlank() || txtLastName.getText().isBlank()) {
        showAlert("Validation Error", "Email, First Name, Last Name không được để trống!");
        return false;
    }
    if (!txtEmail.getText().matches("^[\\w.+-]+@[\\w-]+\\.[a-zA-Z]{2,}$")) {
        showAlert("Validation Error", "Email không đúng định dạng!");
        return false;
    }
    try {
        int marks = Integer.parseInt(txtTotalMark.getText());
        if (marks < 0 || marks > 10) {
            showAlert("Validation Error", "Marks phải trong khoảng 0-10!");
            return false;
        }
    } catch (NumberFormatException e) {
        showAlert("Validation Error", "Total Mark phải là số nguyên!");
        return false;
    }
    return true;
}
```
> Gọi `if (!isValidInput()) return;` ở đầu `addStudent()` và `updateStudent()`.

### 7.4. Xác nhận trước khi xóa (Confirmation Dialog)

- [ ] **TODO A4.1** — Thay vì xóa ngay khi bấm `btnDelete`, hiển thị `Alert.AlertType.CONFIRMATION` hỏi "Bạn có chắc muốn xóa Student này?" — chỉ xóa khi người dùng chọn OK.

```java
@FXML
public void deleteStudent() {
    if (getIdStudent() == 0) {
        showAlert("Thông báo", "Vui lòng chọn 1 Student để xóa!");
        return;
    }
    Alert confirm = new Alert(Alert.AlertType.CONFIRMATION,
            "Bạn có chắc muốn xóa Student này?", ButtonType.YES, ButtonType.NO);
    confirm.showAndWait().ifPresent(response -> {
        if (response == ButtonType.YES) {
            iStudentService.delete(this.getIdStudent());
            refreshDataTable();
        }
    });
}
```

### 7.5. Bảo mật mật khẩu (Password Hashing)

- [ ] **TODO A5.1** — Thêm dependency `org.mindrot:jbcrypt` vào `pom.xml` của project Hibernate.
- [ ] **TODO A5.2** — Khi `addStudent`, hash password bằng `BCrypt.hashpw(rawPassword, BCrypt.gensalt())` trước khi lưu — không lưu plaintext.
- [ ] **TODO A5.3** — Trong `LoginController.login()`, so sánh bằng `BCrypt.checkpw(rawPassword, student.getPassword())` thay vì `.equals()`.
- [ ] **TODO A5.4** — Không hiển thị password thật trên form Update (để trống hoặc mask `••••••`).

### 7.6. Tối ưu SessionFactory (Singleton)

Hiện tại mỗi lần tạo `StudentDAO`/`BookDAO` sẽ tạo mới một `SessionFactory` — tốn tài nguyên và có thể gây lỗi khi chạy nhiều DAO cùng lúc.

- [ ] **TODO A6.1** — Tạo class `HibernateUtil` dùng `static` `SessionFactory` khởi tạo 1 lần duy nhất (singleton), các DAO gọi `HibernateUtil.getSessionFactory()` thay vì tự `new Configuration()`.

```java
package sba301.fu.dao;

import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

public class HibernateUtil {
    private static final SessionFactory sessionFactory = buildSessionFactory();

    private static SessionFactory buildSessionFactory() {
        return new Configuration().configure("hibernate.cfg.xml").buildSessionFactory();
    }

    public static SessionFactory getSessionFactory() {
        return sessionFactory;
    }
}
```
- [ ] **TODO A6.2** — Refactor `StudentDAO`, `BookDAO` để dùng `HibernateUtil.getSessionFactory().openSession()`.

### 7.7. Sắp xếp & phân trang danh sách (Sorting & Paging)

- [ ] **TODO A7.1** — Cho phép click vào header cột (`TableColumn`) để sort tăng/giảm (JavaFX `TableView` hỗ trợ sẵn nếu bọc dữ liệu bằng `SortedList`).
- [ ] **TODO A7.2** — Thêm phân trang ở tầng dữ liệu bằng `setFirstResult`/`setMaxResults` (tham khảo `Chapter17.md` mục "Ví dụ HQL phân trang" — slide 35), hiển thị nút **Previous/Next** dưới bảng.

### 7.8. Đăng xuất & quản lý phiên đăng nhập (Logout / Session)

- [ ] **TODO A8.1** — Sau khi login thành công, lưu lại `Student` đang đăng nhập (ví dụ static field trong `SessionContext`, hoặc truyền qua constructor của `StudentController`).
- [ ] **TODO A8.2** — Hiển thị tên Student đang đăng nhập trên `Pane` tiêu đề của `student-view.fxml` (VD: "Xin chào, Nguyen Van A").
- [ ] **TODO A8.3** — Thêm nút **Logout** quay lại `LoginGUI.fxml`.

### 7.9. Unit test cho tầng Service/Repository

- [ ] **TODO A9.1** — Thêm dependency `JUnit 5` (`org.junit.jupiter`) vào `pom.xml`.
- [ ] **TODO A9.2** — Viết test cho `StudentService`: mock `IStudentRepository` (dùng Mockito) để test logic `save`, `delete`, `update`, `findById` mà không cần kết nối SQL Server thật.
- [ ] **TODO A9.3** — (Nâng cao hơn) Cấu hình `hibernate.test.cfg.xml` trỏ tới H2 in-memory DB, viết integration test thật cho `StudentDAO`.

```java
@Test
void save_shouldCallRepositorySave() {
    IStudentRepository mockRepo = Mockito.mock(IStudentRepository.class);
    StudentService service = new StudentService(mockRepo); // cần thêm constructor nhận repo để test dễ hơn
    Student student = new Student("a@fpt.edu.vn", "123", "A", "Nguyen", 8);
    service.save(student);
    Mockito.verify(mockRepo, Mockito.times(1)).save(student);
}
```

### 7.10. Đóng gói ứng dụng (Packaging)

- [ ] **TODO A10.1** — Dùng `maven-shade-plugin` hoặc `javafx-maven-plugin` để build file `.jar` chạy được (fat-jar) cho project `JavaFXDemo`.
- [ ] **TODO A10.2** — Viết hướng dẫn cài đặt/chạy ứng dụng (README) kèm yêu cầu JDK version, driver SQL Server cần cài.

---

## 8. Checklist phần nâng cao (Advanced)

- [ ] CRUD đầy đủ cho `Book` (màn hình riêng), gán/gỡ Book cho Student hoạt động đúng.
- [ ] Tìm kiếm/lọc Student theo tên hoặc email hoạt động realtime trên `TableView`.
- [ ] Validate đầy đủ: không cho lưu khi thiếu dữ liệu, sai định dạng email, marks ngoài khoảng hợp lệ.
- [ ] Có `Confirmation Dialog` trước khi xóa Student (và Book nếu đã làm 7.1).
- [ ] Password được hash bằng BCrypt khi lưu, và so khớp đúng khi login (không còn so sánh plaintext).
- [ ] `SessionFactory` dùng singleton qua `HibernateUtil`, không tạo mới ở mỗi DAO.
- [ ] `TableView` sort được theo cột; có phân trang (Previous/Next) cho danh sách Student.
- [ ] Có chức năng Logout, hiển thị tên Student đang đăng nhập trên màn hình quản lý.
- [ ] Có ít nhất vài unit test cho `StudentService` (mock repository) chạy pass.
- [ ] Build được file chạy (`.jar`) và có README hướng dẫn chạy ứng dụng.

---

## 9. Commit message gợi ý cho phần nâng cao

```
feat: add Book CRUD screen and DAO/Repository/Service layer
feat: assign and unassign books for a student
feat: add search/filter for student list
feat: add form input validation for student form
feat: add confirmation dialog before deleting a student
feat: hash student password with BCrypt on save
fix: verify password with BCrypt on login instead of plain equals
refactor: introduce HibernateUtil singleton SessionFactory
feat: add column sorting and pagination for student table
feat: add logout and display logged-in student session
test: add unit tests for StudentService with mocked repository
chore: package JavaFXDemo into a runnable fat jar
docs: add README with build and run instructions
```
