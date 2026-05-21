// src/pages/PostList.jsx
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Form, InputGroup, Button, Pagination } from 'react-bootstrap';
import { posts } from '../data/posts';

function PostList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('q') || '';
  const activeCategory = searchParams.get('category') || 'Tất cả';
  
  const currentPage = parseInt(searchParams.get('page') || '1', 10); 
  const POSTS_PER_PAGE = 2; 
  const categories = ['Tất cả', ...new Set(posts.map(p => p.category))];

  const updateQueryParams = (newParams) => {
    const params = {
      q: search,
      category: activeCategory,
      page: currentPage.toString(),
      ...newParams
    };

    if (newParams.q !== undefined || newParams.category !== undefined) {
      params.page = '1';
    }

    if (!params.q.trim()) delete params.q;
    if (params.category === 'Tất cả') delete params.category;
    if (params.page === '1') delete params.page; 

    setSearchParams(params);
  };

  const filteredPosts = posts.filter(post => {
    const matchSearch = post.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'Tất cả' || post.category === activeCategory;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      updateQueryParams({ page: pageNumber.toString() });
    }
  };

  return (
    <Container className="py-4">
      <h2 className='mb-4'>📚 Danh sách bài viết (Phân trang)</h2>
      <InputGroup className="mb-3">
        <InputGroup.Text>🔍</InputGroup.Text>
        <Form.Control
          value={search}
          onChange={e => updateQueryParams({ q: e.target.value })}
          placeholder='Tìm kiếm bài viết...'
        />
        {search && (
          <Button variant='outline-secondary' onClick={() => updateQueryParams({ q: '' })}>× Xóa</Button>
        )}
      </InputGroup>

      <div className='mb-4 d-flex gap-2 flex-wrap'>
        {categories.map(cat => (
          <Button
            key={cat}
            variant={activeCategory === cat ? 'primary' : 'outline-primary'}
            size="sm"
            onClick={() => updateQueryParams({ category: cat })}
          >
            {cat}
          </Button>
        ))}
      </div>

      {currentPosts.length === 0 ? (
        <p className='text-muted text-center py-5'>Không tìm thấy bài viết nào.</p>
      ) : (
        <>
          <Row>
            {currentPosts.map(post => (
              <Col md={6} lg={6} key={post.id} className="mb-4"> 
                <Card className='h-100 shadow-sm' style={{ cursor: 'pointer' }} onClick={() => navigate(`/posts/${post.id}`)}>
                  <Card.Body>
                    <div className='d-flex justify-content-between mb-2'>
                      <Badge bg='primary'>{post.category}</Badge>
                      <small className='text-muted'>{post.date}</small>
                    </div>
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Text className='text-muted small'>{post.body.substring(0, 100)}...</Card.Text>
                  </Card.Body>
                  <Card.Footer className='text-muted small'>✍️ {post.author}</Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <Pagination.Item
                      key={pageNumber}
                      active={pageNumber === currentPage}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </Pagination.Item>
                  );
                })}

                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
              </Pagination>
            </div>
          )}
        </>
      )}
    </Container>
  );
}

export default PostList;