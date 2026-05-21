import { useState } from "react";
import { Form, Button, Card, Container, Alert, Row, Col } from "react-bootstrap";

function RegistrationForm() {
  // 1. Quản lý toàn bộ dữ liệu Form trong 1 Object duy nhất
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // 2. State quản lý các thông báo lỗi của từng trường dữ liệu
  const [errors, setErrors] = useState({});
  // 3. State hiển thị trạng thái Submit thành công chung
  const [successMessage, setSuccessMessage] = useState("");

  // Hàm xử lý thay đổi dữ liệu động bằng cú pháp [name]
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Computed Property Name cập nhật chính xác trường đang gõ
    }));

    // Xóa lỗi của trường đó ngay khi người dùng bắt đầu sửa sai
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Hàm Validate dữ liệu ở Client trước khi Submit
  const validateForm = () => {
    let localErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) {
      localErrors.fullName = "The full name must not be left blank..";
    }
    if (!formData.email) {
      localErrors.email = "The email must not be left blank.";
    } else if (!emailRegex.test(formData.email)) {
      localErrors.email = "The email format is invalid.";
    }
    if (!formData.password) {
      localErrors.password = "The password must not be left blank.";
    } else if (formData.password.length < 6) {
      localErrors.password = "The password must contain at least 6 characters.";
    }
    if (!formData.confirmPassword) {
      localErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      localErrors.confirmPassword = "The password confirmation does not match.";
    }

    setErrors(localErrors);
    return Object.keys(localErrors).length === 0; // Trả về true nếu không có lỗi nào
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (validateForm()) {
      try {
        // Giả lập hoặc gọi thẳng API kết nối tới Spring Boot
        // const response = await fetch("http://localhost:8080/api/auth/register", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(formData)
        // });
        
        // Đoạn này test local trước khi có API:
        setSuccessMessage("🎉 Đăng ký tài khoản thành công!");
        // Reset form về trạng thái trống sạch sẽ
        setFormData({ fullName: "", email: "", password: "", confirmPassword: "" });
        setErrors({});
      } catch (err) {
        console.error("Lỗi hệ thống:", err);
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center my-5">
      <Card className="shadow-lg p-4" style={{ width: "100%", maxWidth: "500px" }}>
        <Card.Body>
          <h2 className="text-center mb-4 text-primary font-weight-bold">Register to System</h2>

          {successMessage && <Alert variant="success">{successMessage}</Alert>}

          <Form onSubmit={handleSubmit} noValidate>
            {/* Họ và tên */}
            <Form.Group className="mb-3" controlId="fullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                placeholder="Nguyễn Văn A"
                value={formData.fullName}
                onChange={handleChange}
                isInvalid={!!errors.fullName} // Bật viền đỏ nếu có lỗi
              />
              <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>

            {/* Mật khẩu và Xác nhận mật khẩu trên cùng 1 hàng */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="••••••"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    isInvalid={!!errors.confirmPassword}
                  />
                  <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Button variant="primary" type="submit" className="w-100 mt-3 size-lg">
              Register Now
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default RegistrationForm;