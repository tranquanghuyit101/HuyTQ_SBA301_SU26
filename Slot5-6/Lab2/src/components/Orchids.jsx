import { useState } from 'react'
import { Row, Col, Container, Card, Button } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { OrchidsData } from '../data/ListOfOrchidss'

export default function Orchids() {
    const [show, setShow] = useState(false)
    const [selectedOrchid, setSelectedOrchid] = useState(null)

    const handleClose = () => setShow(false)
    const handleShow = (orchid) => {
        setSelectedOrchid(orchid)
        setShow(true)
    }

    return (
        <Container className="py-5">
            <h1 className="text-center mb-5 text-success font-merriweather">Flower Gallery</h1>
    
            <Row className="g-4">
                {OrchidsData.map((orchid) => (
                    <Col key={orchid.id} xs={12} sm={6} md={4} lg={3} className="d-flex">
                        <Card className="w-100 h-100 d-flex flex-column shadow-sm">
                            <Card.Img 
                                variant="top" 
                                src={orchid.image} 
                                style={{ height: '300px', objectFit: 'cover' }} 
                            />
                            <Card.Body className="d-flex flex-column flex-grow-1 text-center">
                                <Card.Title className="fs-5 fw-bold">{orchid.orchidName}</Card.Title>
                                <Card.Text className="text-muted flex-grow-1">{orchid.category}</Card.Text>                        
                                <Button variant="primary" className="mt-auto w-100" onClick={() => handleShow(orchid)}>
                                    Detail
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedOrchid?.orchidName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrchid ? (
                        <>
                            <img
                                src={selectedOrchid.image}
                                alt={selectedOrchid.orchidName}
                                style={{ 
                                    width: '100%', 
                                    maxHeight: '400px', 
                                    objectFit: 'contain',
                                    marginBottom: '1rem',
                                    borderRadius: '8px'
                                }}
                            />
                            <p>{selectedOrchid.description}</p>
                            <p><strong>Category:</strong> {selectedOrchid.category}</p>
                        </>
                    ) : (
                        <p>Loading details...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}