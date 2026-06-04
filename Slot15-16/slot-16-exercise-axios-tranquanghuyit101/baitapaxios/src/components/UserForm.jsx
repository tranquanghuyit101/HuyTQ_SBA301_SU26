import { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'

const emptyForm = {
  fullName: '',
  email: '',
  phone: '',
  role: 'User',
  status: 'active',
}

function UserForm({ user, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'User',
        status: user.status || 'active',
      })
    } else {
      setForm(emptyForm)
    }
    setErrors({})
  }, [user])

  const validate = () => {
    const e = {}

    if (!form.fullName.trim()) {
      e.fullName = 'Họ tên không được để trống.'
    } else if (form.fullName.trim().length < 3) {
      e.fullName = 'Họ tên phải có ít nhất 3 ký tự.'
    }

    if (!form.email.trim()) {
      e.email = 'Email không được để trống.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Email không hợp lệ.'
    }

    if (!form.phone.trim()) {
      e.phone = 'Số điện thoại không được để trống.'
    } else if (!/^0\d{9}$/.test(form.phone)) {
      e.phone = 'Số điện thoại phải 10 chữ số, bắt đầu bằng 0.'
    }

    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validation = validate()
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }
    onSubmit(form)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>
          <Card.Title className="mb-0">{user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</Card.Title>
          <small className="text-muted">
            {user ? 'Cập nhật dữ liệu và bấm lưu.' : 'Điền thông tin và thêm người dùng.'}
          </small>
        </div>
        <Button variant="outline-secondary" size="sm" onClick={onClose}>
          Đóng
        </Button>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="userFullName">
                <Form.Label>Họ tên</Form.Label>
                <Form.Control
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  isInvalid={Boolean(errors.fullName)}
                  placeholder="Nhập họ tên"
                />
                <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="userEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  isInvalid={Boolean(errors.email)}
                  placeholder="example@mail.com"
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="g-3 mt-1">
            <Col md={6}>
              <Form.Group controlId="userPhone">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  isInvalid={Boolean(errors.phone)}
                  placeholder="0901234567"
                />
                <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="userRole">
                <Form.Label>Vai trò</Form.Label>
                <Form.Select name="role" value={form.role} onChange={handleChange}>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="User">User</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mt-3" controlId="userStatus">
            <Form.Label>Trạng thái</Form.Label>
            <Form.Select name="status" value={form.status} onChange={handleChange}>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button variant="secondary" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">Lưu</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default UserForm
