/**
 * AuthContext.jsx – Context quản lý trạng thái đăng nhập (Bài 2)
 *
 * Import dữ liệu: import USERS from '../data/users'
 *
 * TODO 1: Tạo AuthContext bằng createContext()
 *
 * TODO 2: Tạo AuthProvider component
 *         State cần quản lý:
 *         - user    : object | null  (null = chưa đăng nhập)
 *         - loading : boolean        (đang xử lý đăng nhập)
 *         - error   : string         (thông báo lỗi)
 *
 *         Hàm login(email, password):
 *         - Bật loading, xóa error
 *         - Giả lập API call bằng setTimeout (800ms)
 *         - Tìm user trong USERS theo email và password
 *         - Nếu tìm thấy: setUser, tắt loading
 *         - Nếu không: setError('Email hoặc mật khẩu không đúng.'), tắt loading
 *
 *         Hàm logout():
 *         - Xóa user (null) và error
 *
 *         Truyền { user, loading, error, login, logout } vào value của Provider
 *
 * TODO 3: Tạo custom hook useAuth()
 *         - Gọi useContext(AuthContext)
 *         - Ném lỗi nếu context là null
 *
 * Export: AuthProvider, useAuth
 */

import USERS from '../data/users';
import { createContext, useContext, useState } from 'react';

// TODO 1: Tạo AuthContext bằng createContext()
const AuthContext = createContext(null);

function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth phải dùng trong <AuthProvider>');
    return ctx;
}

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const login = async (email, password) => {
        setLoading(true);
        setError('');
        await new Promise(resolve => setTimeout(resolve, 800)); // Giả lập API call
        const found = USERS.find(u => u.email === email && u.password === password);
        if (found) {
            setUser({ name: found.name, email: found.email, role: found.role });
            setLoading(false);
            return true;
        } else {
            setError('Email hoặc mật khẩu không đúng.');
            setLoading(false);
            return false;
        }
    };

    const logout = () => { setUser(null); setError(''); };
    return (
        <AuthContext.Provider value={{ user, loading, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthProvider, useAuth };
