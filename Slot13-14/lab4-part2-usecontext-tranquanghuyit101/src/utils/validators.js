/**
 * validators.js – Hàm validate cho từng field của form đăng ký (Bài 3)
 *
 * TODO: Hoàn thiện logic validate cho từng field theo yêu cầu bên dưới.
 *
 * Quy tắc:
 *  - fullName : không trống, ít nhất 3 ký tự
 *  - email    : không trống, đúng định dạng email
 *  - password : không trống, ≥ 6 ký tự, có ít nhất 1 chữ hoa, 1 chữ số
 *  - confirmPassword : không trống, phải khớp với password
 *
 * @param {string} name       - tên field
 * @param {string} value      - giá trị hiện tại của field
 * @param {object} allValues  - toàn bộ values của form (dùng cho confirmPassword)
 * @returns {string}          - thông báo lỗi, hoặc '' nếu hợp lệ
 */
export function validateField(name, value, allValues = {}) {
  const trimmed = value.trim();
  switch (name) {
    case 'fullName':
      if (!trimmed) return 'Họ và tên không được để trống.';
      if (trimmed.length < 3) return 'Họ và tên phải có ít nhất 3 ký tự.';
      return '';

    case 'email':
      if (!trimmed) return 'Email không được để trống.';
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(trimmed)) return 'Email không hợp lệ.';
      return '';

    case 'password':
      if (!value) return 'Mật khẩu không được để trống.';
      if (value.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự.';
      if (!/[A-Z]/.test(value)) return 'Mật khẩu phải chứa ít nhất 1 chữ hoa.';
      if (!/[0-9]/.test(value)) return 'Mật khẩu phải chứa ít nhất 1 chữ số.';
      return '';

    case 'confirmPassword':
      if (!value) return 'Xác nhận mật khẩu không được để trống.';
      if (value !== allValues.password) return 'Mật khẩu xác nhận không khớp.';
      return '';

    default:
      return '';
  }
}
