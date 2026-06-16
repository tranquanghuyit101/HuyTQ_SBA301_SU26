import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Form, Button, Alert } from 'react-bootstrap'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { createCategory, getCategories } from '../services/categoryService'
import { validateCategoryForm } from '../utils/validators'
import { MESSAGES } from '../constants/messages'

function AddCategoryPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({ name: '' })
  const [errors, setErrors] = useState({})
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    try {
      const data = await getCategories()
      setCategories(data)
      setErrorMsg('')
    } catch (error) {
      setErrorMsg(MESSAGES.MS05)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: null }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    const validationErrors = validateCategoryForm(formData, categories)
    const hasErrors = Object.values(validationErrors).some((value) => value !== null)

    if (hasErrors) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const response = await createCategory({
        name: formData.name.trim(),
      })
      setSuccessMsg('Category created successfully!')
      setFormData({ name: '' })
      setErrors({})
      // Chuyển hướng sau 1.5 giây để người dùng thấy thông báo success
      setTimeout(() => {
        navigate('/categories')
      }, 1500)
    } catch (error) {
      console.error('Error creating category:', error)
      setErrorMsg(error.response?.data?.message || MESSAGES.MS05)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <Container className="my-4">
        <h4>Add New Category</h4>

        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
        {successMsg && <Alert variant="success">{successMsg}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="name">Category Name</Form.Label>
            <Form.Control
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.name && <Form.Text className="text-danger">{errors.name}</Form.Text>}
          </Form.Group>

          <div className="d-flex gap-2">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="secondary" onClick={() => navigate('/categories')} disabled={loading}>
              Back
            </Button>
          </div>
        </Form>
      </Container>
      <Footer />
    </>
  )
}

export default AddCategoryPage
