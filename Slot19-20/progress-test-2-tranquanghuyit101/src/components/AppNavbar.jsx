import { Navbar, Container, Button } from 'react-bootstrap'
import { useAuth } from '../hooks/useAuth'

/**
 * AppNavbar — thanh điều hướng hiển thị khi đã đăng nhập.
 * Render thẻ <nav> (role="navigation") thông qua React Bootstrap Navbar.
 */
function AppNavbar() {
  const { state, dispatch } = useAuth()

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>Lab App</Navbar.Brand>
        <Navbar.Text className="me-3 text-white">
          {state.user?.name}
        </Navbar.Text>
        <Button
          variant="outline-light"
          size="sm"
          onClick={() => dispatch({ type: 'LOGOUT' })}
        >
          Đăng xuất
        </Button>
      </Container>
    </Navbar>
  )
}

export default AppNavbar
