/**
 * RegistrationForm.jsx – Form đăng ký với validation (Bài 3)
 *
 * TODO: Dùng useFormContext() từ FormContext để lấy state và dispatch.
 *
 *       Render 4 FormField:
 *         - fullName        label="Họ và tên"
 *         - email           label="Email"           type="email"
 *         - password        label="Mật khẩu"        type="password"
 *         - confirmPassword label="Xác nhận mật khẩu" type="password"
 *
 *       Khi submit (handleSubmit):
 *         1. Dispatch VALIDATE_ALL để hiện toàn bộ lỗi
 *         2. Kiểm tra xem còn lỗi không – nếu có thì return sớm
 *         3. Dispatch SET_STATUS 'submitting'
 *         4. Giả lập API call (setTimeout 1000ms)
 *         5. Dispatch SET_STATUS 'success'
 *
 *       Khi status === 'success': hiển thị thông báo thành công và nút "Đăng ký lại"
 *         - Nút "Đăng ký lại": dispatch RESET
 *
 *       Khi status === 'error': hiển thị banner lỗi phía trên nút submit.
 *
 *       Nút submit: disabled khi status === 'submitting'.
 */
import { useFormContext } from '../../context/FormContext';
import FormField from './FormField';
import { validateField } from '../../utils/validators';

export default function RegistrationForm() {
  const { state, dispatch } = useFormContext();

  const validateAll = () => {
    return {
      fullName: validateField('fullName', state.values.fullName, state.values),
      email: validateField('email', state.values.email, state.values),
      password: validateField('password', state.values.password, state.values),
      confirmPassword: validateField('confirmPassword', state.values.confirmPassword, state.values),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateAll();
    const hasError = Object.values(errors).some(Boolean);

    dispatch({ type: 'VALIDATE_ALL' });

    if (hasError) {
      dispatch({ type: 'SET_STATUS', status: 'error' });
      return;
    }

    dispatch({ type: 'SET_STATUS', status: 'submitting' });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    dispatch({ type: 'SET_STATUS', status: 'success' });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET' });
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <FormField name="fullName" label="Họ và tên" placeholder="Nhập họ và tên" />
      <FormField name="email" label="Email" type="email" placeholder="Nhập email" />
      <FormField name="password" label="Mật khẩu" type="password" placeholder="Nhập mật khẩu" />
      <FormField name="confirmPassword" label="Xác nhận mật khẩu" type="password" placeholder="Nhập lại mật khẩu" />

      {state.status === 'error' && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          Vui lòng kiểm tra lại các trường chưa hợp lệ.
        </div>
      )}

      {state.status === 'success' ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'green' }}>Đăng ký thành công!</p>
          <button type="button" onClick={handleReset}>
            Đăng ký lại
          </button>
        </div>
      ) : (
        <button type="submit" disabled={state.status === 'submitting'}>
          {state.status === 'submitting' ? 'Đang gửi...' : 'Đăng ký'}
        </button>
      )}
    </form>
  );
}
