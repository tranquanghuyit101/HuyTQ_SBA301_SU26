/**
 * Header — thanh tiêu đề chung toàn app.
 * Layout: [Logo] [Restaurant Management]  [Date: yyyy-MM-dd]
 */
function Header() {
  // Lấy ngày hiện tại theo định dạng yyyy-MM-dd
  const today = new Date().toISOString().split('T')[0]

  return (
    <header className="bg-primary text-white py-2 px-4 d-flex justify-content-between align-items-center">
      <div className="fw-bold fs-5">
        🍽️ Restaurant Management
      </div>
      <div className="small">Date: {today}</div>
    </header>
  )
}

export default Header
