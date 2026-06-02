/**
 * Bài 6 – Login Form (useReducer)
 * ===============================
 * Mục tiêu: Quản lý login form state (values, errors, touched, submitted, isLoggedIn)
 * bằng useReducer. Kiểm tra thông tin đăng nhập với dữ liệu từ userData.js.
 *
 * Chạy test: npm test -- Ex06
 */
import React, { useReducer, useState, useEffect } from 'react'
import { Card, Form, Button, Alert, Modal } from 'react-bootstrap'
import { listOfUsers } from '../data/userData'

// ─────────────────────────────────────────────
// TODO 1: Định nghĩa initialState
// ─────────────────────────────────────────────
const initialState = {
  values: { username: '', password: '' },
  errors: {},      // { fieldName: 'thông báo lỗi' }
  touched: {},      // { fieldName: true/false }
  submitted: false,
  isLoggedIn: false,
  loggedInUser: null,
};

// ─────────────────────────────────────────────
// TODO 2: Viết hàm validate(values)
//   Trả về object errors (rỗng = hợp lệ).
// ─────────────────────────────────────────────
function validate(values) {
  const errors = {}
  
  if (!values.username || !values.username.trim()) {
    errors.username = 'Tên đăng nhập không được để trống'
  }
  
  if (!values.password || !values.password.trim()) {
    errors.password = 'Mật khẩu không được để trống'
  }
  
  return errors
}

// ─────────────────────────────────────────────
// TODO 3: Hàm authenticate - kiểm tra username/password với userData
// ─────────────────────────────────────────────
function authenticate(username, password) {
  const user = listOfUsers.find(
    u => u.username === username && u.password === password
  )
  return user
}

// ─────────────────────────────────────────────
// TODO 4: Viết reducer(state, action)
// ─────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD': {
      const { field, value } = action.payload;
      const nextValues = { ...state.values, [field]: value };
      
      return {
        ...state,
        values: nextValues,
        touched: { ...state.touched, [field]: true },
        errors: validate(nextValues),
        submitted: false
      };
    }

    case 'SUBMIT': {
      const currentErrors = validate(state.values);
      const allTouched = { username: true, password: true };

      if (Object.keys(currentErrors).length === 0) {
        // Kiểm tra thông tin đăng nhập
        const user = authenticate(state.values.username, state.values.password);
        
        if (user) {
          // Đăng nhập thành công
          return {
            ...state,
            touched: allTouched,
            errors: {},
            submitted: true,
            isLoggedIn: true,
            loggedInUser: user
          };
        } else {
          // Đăng nhập thất bại
          return {
            ...state,
            touched: allTouched,
            errors: { submit: 'Tên đăng nhập hoặc mật khẩu không chính xác' },
            submitted: false,
            isLoggedIn: false,
            loggedInUser: null
          };
        }
      } else {
        return {
          ...state,
          touched: allTouched,
          errors: currentErrors,
          submitted: false,
          isLoggedIn: false,
          loggedInUser: null
        };
      }
    }

    case 'RESET':
      return initialState;

    case 'LOGOUT':
      return initialState;

    default:
      return state;
  }
}

export default function Ex06_LoginForm({ onLoginSuccess }) {
  // TODO 5: Gọi useReducer(reducer, initialState)
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Helper: trả về thông báo lỗi nếu field đã được touch
  // TODO 6: Hoàn thiện hàm getError
  function getError(field) {
    return state.touched[field] ? state.errors[field] : undefined
  }

  // ─────────────────────────────────────────────
  // TODO 7: Viết hàm handleChange(e)
  // ─────────────────────────────────────────────
  function handleChange(e) {
    const { name, value } = e.target;
    dispatch({ type: 'SET_FIELD', payload: { field: name, value } });
  }

  // ─────────────────────────────────────────────
  // TODO 8: Viết hàm handleSubmit(e)
  // ─────────────────────────────────────────────
  function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: 'SUBMIT' });
  }

  // Gọi callback khi đăng nhập thành công
  useEffect(() => {
    if (state.isLoggedIn && onLoginSuccess) {
      setTimeout(() => {
        onLoginSuccess(state.loggedInUser);
      }, 1500);
    }
  }, [state.isLoggedIn, state.loggedInUser, onLoginSuccess]);

  // Khi đăng nhập thành công
  if (state.isLoggedIn) {
    return (
      <Modal show={true} onHide={() => {}} centered>
        <Modal.Header closeButton>
          <Modal.Title>Đăng nhập thành công</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="success" data-testid="login-success-message">
            Chào mừng <strong>{state.loggedInUser?.fullName}</strong>!
          </Alert>
          <p>Bạn sẽ được chuyển đến trang chủ trong giây lát...</p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="primary" 
            onClick={() => {
              dispatch({ type: 'RESET' });
              window.location.href = '/';
            }}
            data-testid="btn-continue"
          >
            Tiếp tục
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  return (
    <Card className="mx-auto" style={{ maxWidth: 400 }}>
      <Card.Header><strong>Bài 6 – Đăng nhập</strong></Card.Header>
      <Card.Body>

        {/* Thông báo lỗi chung */}
        {state.errors.submit && (
          <Alert variant="danger" data-testid="form-error">
            {state.errors.submit}
          </Alert>
        )}

        {/* TODO 9: Gắn handleSubmit vào onSubmit */}
        <Form onSubmit={handleSubmit} data-testid="login-form" noValidate>

          {/* Trường username */}
          <Form.Group className="mb-3">
            <Form.Label>Tên đăng nhập</Form.Label>
            {/* TODO 10: value, name="username", onChange=handleChange */}
            <Form.Control
              data-testid="input-username"
              name="username"
              placeholder="Nhập tên đăng nhập"
              value={state.values.username}
              onChange={handleChange}
              isInvalid={!!getError('username')}
            />
            <Form.Control.Feedback type="invalid" data-testid="error-username">
              {getError('username')}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Trường password */}
          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu</Form.Label>
            {/* TODO 11: value, name="password", onChange=handleChange */}
            <Form.Control
              type="password"
              data-testid="input-password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={state.values.password}
              onChange={handleChange}
              isInvalid={!!getError('password')}
            />
            <Form.Control.Feedback type="invalid" data-testid="error-password">
              {getError('password')}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex gap-2">
            {/* TODO 12: Nút submit */}
            <Button type="submit" data-testid="btn-login">Đăng nhập</Button>
            {/* TODO 13: onClick dispatch RESET */}
            <Button 
              type="button" 
              variant="secondary" 
              data-testid="btn-reset" 
              onClick={() => dispatch({ type: 'RESET' })}
            >
              Reset
            </Button>
          </div>

        </Form>

        <div className="mt-3 text-muted small">
          <p>Demo credentials:</p>
          <ul>
            <li>username: <code>admin</code> / password: <code>123456</code></li>
            <li>username: <code>user1</code> / password: <code>password123</code></li>
          </ul>
        </div>
      </Card.Body>
    </Card>
  )
}
