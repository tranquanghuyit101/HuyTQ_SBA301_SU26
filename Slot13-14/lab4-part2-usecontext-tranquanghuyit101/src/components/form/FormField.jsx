/**
 * FormField.jsx – Input field tái sử dụng cho form đăng ký (Bài 3)
 *
 * Props nhận vào:
 *   - name        : string  – tên field (khớp với key trong state.values)
 *   - label       : string  – nhãn hiển thị
 *   - type        : string  – loại input ('text' | 'email' | 'password'), mặc định 'text'
 *   - placeholder : string  – placeholder text
 *
 * TODO: Dùng useFormContext() từ FormContext để lấy state và dispatch.
 *       Đọc: state.values[name], state.errors[name], state.touched[name]
 *
 *       Khi onChange: dispatch action CHANGE với { field: name, value }
 *       Khi onBlur:   dispatch action BLUR  với { field: name }
 *
 *       Hiển thị thông báo lỗi CHỈ KHI field đã được touched VÀ có lỗi.
 *       Đổi màu viền input theo trạng thái: lỗi (đỏ) / hợp lệ (xanh) / mặc định.
 */
import { useFormContext } from '../../context/FormContext';

export default function FormField({ name, label, type = 'text', placeholder }) {
  const { state, dispatch } = useFormContext();
  const value = state.values[name] || '';
  const error = state.errors[name];
  const touched = state.touched[name];
  const hasError = touched && Boolean(error);
  const isValid = touched && !error;

  const borderColor = hasError ? 'red' : isValid ? 'green' : '#ccc';

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor={name} style={{ display: 'block', marginBottom: '0.25rem' }}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => dispatch({ type: 'CHANGE', field: name, value: e.target.value })}
        onBlur={() => dispatch({ type: 'BLUR', field: name })}
        style={{
          width: '100%',
          padding: '0.5rem',
          border: `1px solid ${borderColor}`,
          borderRadius: '4px',
        }}
      />
      {hasError && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
    </div>
  );
}
