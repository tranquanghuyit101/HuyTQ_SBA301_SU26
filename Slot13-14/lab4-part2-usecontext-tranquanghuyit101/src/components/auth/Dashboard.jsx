/**
 * Dashboard.jsx – Màn hình sau khi đăng nhập thành công (Bài 2)
 *
 * TODO: Dùng useAuth() từ AuthContext để lấy user.
 *       Hiển thị thông tin: tên, email, vai trò của user.
 *       Component này KHÔNG nhận bất kỳ props nào.
 */
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();

    if (!user) {
      return <p>Không có thông tin người dùng.</p>;
    }

    const roleLabel = user.role === 'Admin' ? 'Quản trị viên' : user.role;

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        <label>Email</label>
        <input type="text" value={user.email} readOnly />
      </div>
      <div>
        <label>Vai trò</label>
        <input type="text" value={roleLabel} readOnly />
      </div>
    </div>
  );
}
