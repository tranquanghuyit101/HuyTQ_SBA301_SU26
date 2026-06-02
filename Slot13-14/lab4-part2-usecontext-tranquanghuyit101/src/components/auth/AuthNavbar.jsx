/**
 * AuthNavbar.jsx – Thanh điều hướng hiển thị thông tin đăng nhập (Bài 2)
 *
 * TODO: Dùng useAuth() từ AuthContext để lấy user và logout.
 *       Nếu user tồn tại:  hiển thị tên user và nút "Đăng xuất"
 *       Nếu chưa đăng nhập: hiển thị "Chưa đăng nhập"
 *       Component này KHÔNG nhận bất kỳ props nào.
 */
import { useAuth } from '../../context/AuthContext';

export default function AuthNavbar() {
  const { user, logout } = useAuth();
  return (
    <nav style={{ padding: '1rem', backgroundColor: '#eee' }}>
     <strong>My App</strong>
     {user ? (
      <div>
        <span>Xin chào, {user.name} [{user.role}]</span>
        <button onClick={logout} style={{ marginLeft: '1rem' }}>Đăng xuất</button>
      </div>
      ) : (<span>Chưa đăng nhập</span>
      )}
    </nav>
  );
}
