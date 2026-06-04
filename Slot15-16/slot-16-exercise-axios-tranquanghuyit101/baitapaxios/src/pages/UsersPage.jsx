import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, Button, ButtonGroup, Card, Col, Container, Form, Row, Table, Alert, Stack } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext.jsx'
import { userApi } from '../api/userApi.js'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import UserForm from '../components/UserForm.jsx'

function UsersPage() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    window.setTimeout(() => setToast(null), 3000)
  }

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (filterRole) params.role = filterRole
      const { data } = await userApi.getAll(params)
      setUsers(data)
    } catch (err) {
      setError(err?.message || 'Không tải được danh sách người dùng.')
    } finally {
      setLoading(false)
    }
  }, [filterRole])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return users
    return users.filter((user) => {
      return (
        user.fullName.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.phone.includes(keyword)
      )
    })
  }, [search, users])

  const handleOpenAdd = () => {
    setEditUser(null)
    setShowForm(true)
  }

  const handleEdit = (user) => {
    setEditUser(user)
    setShowForm(true)
  }

  const handleSave = async (formData) => {
    try {
      if (editUser) {
        await userApi.update(editUser.id, { ...editUser, ...formData })
        showToast('Cập nhật người dùng thành công.')
      } else {
        await userApi.create(formData)
        showToast('Thêm người dùng thành công.')
      }
      setShowForm(false)
      setEditUser(null)
      fetchUsers()
    } catch (err) {
      showToast(err?.message || 'Lưu thất bại.', 'danger')
    }
  }

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active'
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)))
    try {
      await userApi.patch(user.id, { status: newStatus })
      showToast('Đã cập nhật trạng thái.')
    } catch (err) {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: user.status } : u)))
      showToast('Cập nhật trạng thái thất bại.', 'danger')
    }
  }

  const handleDeleteClick = (user) => {
    setDeleteTarget(user)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      await userApi.remove(deleteTarget.id)
      showToast(`Đã xóa '${deleteTarget.fullName}' thành công.`)
      setDeleteTarget(null)
      fetchUsers()
    } catch (err) {
      showToast('Xóa thất bại.', 'danger')
      setDeleteTarget(null)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const availableRoles = ['Admin', 'Manager', 'User']

  return (
    <Container className="py-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h2>Quản lý người dùng</h2>
          <p className="text-muted mb-0">Xin chào, {currentUser?.fullName || currentUser?.email}</p>
        </Col>
        <Col xs="auto">
          <Button variant="outline-secondary" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Col>
      </Row>

      {toast && (
        <Alert variant={toast.type} dismissible onClose={() => setToast(null)}>
          {toast.message}
        </Alert>
      )}

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="gy-3 align-items-end">
            <Col md={4}>
              <Form.Group controlId="searchInput">
                <Form.Label>Tìm kiếm</Form.Label>
                <Form.Control
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Theo tên, email hoặc số điện thoại"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="roleFilter">
                <Form.Label>Lọc theo vai trò</Form.Label>
                <Form.Select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                  <option value="">Tất cả</option>
                  {availableRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={5} className="text-md-end">
              <Button onClick={handleOpenAdd}>Thêm người dùng</Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {showForm && (
        <UserForm
          user={editUser}
          onClose={() => {
            setShowForm(false)
            setEditUser(null)
          }}
          onSubmit={handleSave}
        />
      )}

      <Card className="shadow-sm">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">Đang tải danh sách...</div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <div className="table-responsive">
              <Table hover bordered responsive className="mb-0 align-middle">
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>SĐT</th>
                    <th>Vai trò</th>
                    <th>Trạng thái</th>
                    <th className="text-end">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        Không có người dùng phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.role}</td>
                        <td>
                          <Badge bg={user.status === 'active' ? 'success' : 'secondary'}>
                            {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                          </Badge>
                        </td>
                        <td className="text-end">
                          <ButtonGroup size="sm">
                            <Button variant="outline-primary" onClick={() => handleEdit(user)}>
                              Sửa
                            </Button>
                            <Button variant="outline-warning" onClick={() => handleToggleStatus(user)}>
                              {user.status === 'active' ? 'Khoá' : 'Kích hoạt'}
                            </Button>
                            {currentUser?.role === 'Admin' && (
                              <Button variant="outline-danger" onClick={() => handleDeleteClick(user)}>
                                Xóa
                              </Button>
                            )}
                          </ButtonGroup>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      <ConfirmDialog
        visible={Boolean(deleteTarget)}
        title="Xác nhận xóa"
        message={deleteTarget ? `Bạn có chắc muốn xóa người dùng ${deleteTarget.fullName}?` : ''}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </Container>
  )
}

export default UsersPage

