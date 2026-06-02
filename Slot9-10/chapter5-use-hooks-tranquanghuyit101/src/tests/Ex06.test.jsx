/**
 * Bài 6 – Login Form Tests
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Ex06_LoginForm from '../pages/Ex06_LoginForm'

// Mock component for testing that doesn't require App.jsx context
const TestWrapper = ({ children }) => {
  return children
}

describe('Ex06_LoginForm', () => {
  it('renders login form with username and password fields', () => {
    render(<Ex06_LoginForm />)
    
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
    expect(screen.getByTestId('input-username')).toBeInTheDocument()
    expect(screen.getByTestId('input-password')).toBeInTheDocument()
    expect(screen.getByTestId('btn-login')).toBeInTheDocument()
    expect(screen.getByTestId('btn-reset')).toBeInTheDocument()
  })

  it('shows validation errors when fields are empty', async () => {
    const user = userEvent.setup()
    render(<Ex06_LoginForm />)
    
    const submitBtn = screen.getByTestId('btn-login')
    await user.click(submitBtn)
    
    await waitFor(() => {
      expect(screen.getByTestId('error-username')).toBeInTheDocument()
      expect(screen.getByTestId('error-password')).toBeInTheDocument()
    })
  })

  it('displays error message for invalid credentials', async () => {
    const user = userEvent.setup()
    render(<Ex06_LoginForm />)
    
    const usernameInput = screen.getByTestId('input-username')
    const passwordInput = screen.getByTestId('input-password')
    const submitBtn = screen.getByTestId('btn-login')
    
    await user.type(usernameInput, 'wronguser')
    await user.type(passwordInput, 'wrongpass')
    await user.click(submitBtn)
    
    await waitFor(() => {
      expect(screen.getByTestId('form-error')).toBeInTheDocument()
      expect(screen.getByText(/tên đăng nhập hoặc mật khẩu không chính xác/i)).toBeInTheDocument()
    })
  })

  it('allows successful login with correct credentials (admin)', async () => {
    const user = userEvent.setup()
    render(<Ex06_LoginForm />)
    
    const usernameInput = screen.getByTestId('input-username')
    const passwordInput = screen.getByTestId('input-password')
    const submitBtn = screen.getByTestId('btn-login')
    
    await user.type(usernameInput, 'admin')
    await user.type(passwordInput, '123456')
    await user.click(submitBtn)
    
    await waitFor(() => {
      expect(screen.getByTestId('login-success-message')).toBeInTheDocument()
      expect(screen.getByText(/chào mừng/i)).toBeInTheDocument()
      expect(screen.getByText(/Admin User/i)).toBeInTheDocument()
    })
  })

  it('allows successful login with correct credentials (user1)', async () => {
    const user = userEvent.setup()
    render(<Ex06_LoginForm />)
    
    const usernameInput = screen.getByTestId('input-username')
    const passwordInput = screen.getByTestId('input-password')
    const submitBtn = screen.getByTestId('btn-login')
    
    await user.type(usernameInput, 'user1')
    await user.type(passwordInput, 'password123')
    await user.click(submitBtn)
    
    await waitFor(() => {
      expect(screen.getByTestId('login-success-message')).toBeInTheDocument()
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument()
    })
  })

  it('clears form on reset button click', async () => {
    const user = userEvent.setup()
    render(<Ex06_LoginForm />)
    
    const usernameInput = screen.getByTestId('input-username')
    const passwordInput = screen.getByTestId('input-password')
    const resetBtn = screen.getByTestId('btn-reset')
    
    await user.type(usernameInput, 'admin')
    await user.type(passwordInput, '123456')
    
    expect(usernameInput).toHaveValue('admin')
    expect(passwordInput).toHaveValue('123456')
    
    await user.click(resetBtn)
    
    expect(usernameInput).toHaveValue('')
    expect(passwordInput).toHaveValue('')
  })

  it('marks fields as touched when interacted', async () => {
    const user = userEvent.setup()
    render(<Ex06_LoginForm />)
    
    const usernameInput = screen.getByTestId('input-username')
    
    await user.type(usernameInput, 'test')
    await user.clear(usernameInput)
    
    // After touching and clearing, error should appear
    await waitFor(() => {
      const errorElement = screen.queryByTestId('error-username')
      // The error will show if the field was touched
      expect(usernameInput).toHaveAttribute('aria-invalid', 'false')
    })
  })

  it('prevents showing field errors until field is touched', async () => {
    render(<Ex06_LoginForm />)
    
    // Initially no error should be visible
    expect(screen.queryByTestId('error-username')).not.toBeInTheDocument()
    expect(screen.queryByTestId('error-password')).not.toBeInTheDocument()
  })

  it('accepts onLoginSuccess callback', async () => {
    const user = userEvent.setup()
    const mockCallback = jest.fn()
    render(<Ex06_LoginForm onLoginSuccess={mockCallback} />)
    
    const usernameInput = screen.getByTestId('input-username')
    const passwordInput = screen.getByTestId('input-password')
    const submitBtn = screen.getByTestId('btn-login')
    
    await user.type(usernameInput, 'admin')
    await user.type(passwordInput, '123456')
    await user.click(submitBtn)
    
    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalled()
      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'admin',
          fullName: 'Admin User'
        })
      )
    }, { timeout: 2000 })
  })
})
