import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import AppNavbar from './components/AppNavbar'
import LoginPage from './pages/LoginPage'
import RestaurantListPage from './pages/RestaurantListPage'
import RestaurantDetailPage from './pages/RestaurantDetailPage'
import AddNewRestaurantPage from './pages/AddNewRestaurantPage'
import CategoryListPage from './pages/CategoryListPage'
import AddCategoryPage from './pages/AddCategoryPage'

/**
 * ProtectedRoute — chỉ cho phép truy cập khi đã đăng nhập.
 * Nếu chưa đăng nhập → redirect về /login.
 */
function ProtectedRoute({ children }) {
  const { state } = useAuth()
  return state.isAuthenticated ? children : <Navigate to="/login" replace />
}

function ProtectedLayout({ children }) {
  return (
    <>
      <AppNavbar />
      {children}
    </>
  )
}

/**
 * App — cấu hình routing toàn ứng dụng.
 *
 * Routes:
 *   /login              → LoginPage (public)
 *   /                   → RestaurantListPage (protected)
 *   /restaurants/add    → AddNewRestaurantPage (protected)
 *   /restaurants/:id    → RestaurantDetailPage (protected)
 *   /categories         → CategoryListPage (protected)
 *   /categories/add     → AddCategoryPage (protected)
 *   *                   → redirect về /
 */
function App() {
  const { state } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            state.isAuthenticated ? <Navigate to="/categories/add" replace /> : <LoginPage />
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <RestaurantListPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurants/add"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <AddNewRestaurantPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurants/:id"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <RestaurantDetailPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <CategoryListPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories/add"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <AddCategoryPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
