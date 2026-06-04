import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Col, Container, Form, Row, Alert } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext.jsx'

function LoginPage() {
  const { currentUser, error, loading, login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')

  useEffect(() => {
    if (currentUser) {
      navigate('/users', { replace: true })
    }
  }, [currentUser, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (!username.trim() || !password.trim()) {
      setLocalError('Vui lòng nhập tài khoản và mật khẩu.')
      return
    }

    const success = await login(username.trim(), password.trim())
    if (success) {
      navigate('/users', { replace: true })
    }
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-center mb-4">Đăng nhập</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="loginUsername">
                  <Form.Label>Tài khoản</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin / manager / user1"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="loginPassword">
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="123456"
                  />
                </Form.Group>
                {(localError || error) && (
                  <Alert variant="danger">{localError || error}</Alert>
                )}
                <Button type="submit" disabled={loading} className="w-100">
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="text-center text-muted mt-3">
            Tài khoản mẫu: <strong>admin</strong>, <strong>manager</strong>, <strong>user1</strong>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default LoginPage
