import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Button, Alert, Table } from 'react-bootstrap'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { getCategories } from '../services/categoryService'
import { MESSAGES } from '../constants/messages'

function CategoryListPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [errorMsg, setErrorMsg] = useState('')

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

  return (
    <>
      <Header />
      <Container className="my-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4>Category List</h4>
          <Button variant="success" onClick={() => navigate('/categories/add')}>
            Add New
          </Button>
        </div>

        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
      <Footer />
    </>
  )
}

export default CategoryListPage
