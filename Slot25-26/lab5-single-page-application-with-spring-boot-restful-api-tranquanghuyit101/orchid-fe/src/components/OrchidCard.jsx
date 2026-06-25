import React from 'react';
import { Card, Button, Badge, Row, Col } from 'react-bootstrap';

export default function OrchidCard({ orchids, onEdit, onDelete }) {
    if (!orchids || orchids.length === 0) {
        return (
            <div className="text-center my-4 p-4 border rounded bg-light text-muted">
                Không có hoa lan nào trong danh sách.
            </div>
        );
    }

    return (
        <Row xs={1} md={2} lg={3} className="g-4">
            {orchids.map((o) => (
                <Col key={o.orchidId}>
                    <Card className="h-100 shadow-sm">
                        <div style={{ height: '200px', backgroundColor: '#f8f9fa', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                            {o.orchidURL ? (
                                <Card.Img
                                    variant="top"
                                    src={o.orchidURL}
                                    style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                                    onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=No+Image'; }}
                                />
                            ) : (
                                <span className="text-muted">No Image</span>
                            )}
                        </div>
                        <Card.Body className="d-flex flex-column">
                            <Card.Title className="fw-bold text-dark">{o.orchidName}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{o.orchidCategory || 'No Category'}</Card.Subtitle>
                            <Card.Text className="text-muted flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {o.orchidDescription || 'Không có mô tả.'}
                            </Card.Text>
                            <div className="mb-3 d-flex gap-2 flex-wrap">
                                <Badge bg={o.isNatural ? 'success' : 'secondary'}>
                                    {o.isNatural ? 'Natural' : 'Grown'}
                                </Badge>
                                <Badge bg={o.isAttractive ? 'warning' : 'light'} className={!o.isAttractive ? 'text-dark border' : 'text-dark'}>
                                    {o.isAttractive ? 'Attractive' : 'Normal'}
                                </Badge>
                            </div>
                            <div className="d-flex gap-2">
                                <Button
                                    variant="outline-primary"
                                    className="flex-grow-1"
                                    onClick={() => onEdit(o.orchidId)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    className="flex-grow-1"
                                    onClick={() => onDelete(o.orchidId)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
}
