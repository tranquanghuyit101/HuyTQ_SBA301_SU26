import MyFlower from './components/MyFlower';
import MyCarousel from './components/MyCarousel';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';  
import { flowerList } from './data/FlowerData';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


function App() {

  return (
    <>
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Single Page Application</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>


    <div className="container mt-5">
      <MyCarousel />
    </div>

    <Container className="py-5">
      <h1 className="text-center mb-5 text-success font-merriweather">Flower Gallery</h1>
      <Row g={4}>
        {flowerList.map(flower => (
          <Col key={flower.id} xs={12} md={6} lg={3} className="mb-4">
            <MyFlower flower={flower} />
          </Col>
        ))}
      </Row>
    </Container>
    </>
  );
}

export default App;