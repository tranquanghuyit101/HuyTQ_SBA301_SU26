import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import Ex01_BasicCounter    from './pages/Ex01_BasicCounter'
import Ex02_CounterWithStep from './pages/Ex02_CounterWithStep'
import Ex03_TodoList        from './pages/Ex03_TodoList'
import Ex04_ShoppingCart    from './pages/Ex04_ShoppingCart'
import Ex05_FormValidation  from './pages/Ex05_FormValidation'
import Ex06_LoginForm       from './pages/Ex06_LoginForm'

function Home() {
  return (
    <Container className="py-5 text-center">
      <h1>useReducer – Bài tập thực hành</h1>
      <p className="text-muted">Chọn bài tập từ thanh điều hướng phía trên</p>
    </Container>
  )
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState(null)

  // Nếu chưa đăng nhập, chỉ hiển thị form đăng nhập (Exercise 6)
  if (!isLoggedIn) {
    return (
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <Ex06_LoginForm onLoginSuccess={(user) => {
          setLoggedInUser(user)
          setIsLoggedIn(true)
        }} />
      </Container>
    )
  }

  return (
    <BrowserRouter>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={NavLink} to="/">useReducer</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto">
              <Nav.Link as={NavLink} to="/ex01">Bài 1 – Counter</Nav.Link>
              <Nav.Link as={NavLink} to="/ex02">Bài 2 – Step</Nav.Link>
              <Nav.Link as={NavLink} to="/ex03">Bài 3 – Todo</Nav.Link>
              <Nav.Link as={NavLink} to="/ex04">Bài 4 – Cart</Nav.Link>
              <Nav.Link as={NavLink} to="/ex05">Bài 5 – Form</Nav.Link>
              <Nav.Link as={NavLink} to="/ex06">Bài 6 – Login</Nav.Link>
              <Nav.Link href="#">
                <Button 
                  variant="outline-light" 
                  size="sm"
                  onClick={() => {
                    setIsLoggedIn(false)
                    setLoggedInUser(null)
                  }}
                  data-testid="btn-logout"
                >
                  Đăng xuất
                </Button>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-4">
        <Routes>
          <Route path="/"     element={<Home />} />
          <Route path="/ex01" element={<Ex01_BasicCounter />} />
          <Route path="/ex02" element={<Ex02_CounterWithStep />} />
          <Route path="/ex03" element={<Ex03_TodoList />} />
          <Route path="/ex04" element={<Ex04_ShoppingCart />} />
          <Route path="/ex05" element={<Ex05_FormValidation />} />
          <Route path="/ex06" element={<Ex06_LoginForm />} />
        </Routes>
      </Container>
    </BrowserRouter>
  )
}
