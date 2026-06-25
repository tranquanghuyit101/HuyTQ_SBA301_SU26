import React from 'react';
import { Table, Button, Badge, Image } from 'react-bootstrap';

export default function OrchidTable({ orchids, onEdit, onDelete }) {
    if (!orchids || orchids.length === 0) {
        return (
            <div className="text-center my-4 p-4 border rounded bg-light text-muted">
                Không có hoa lan nào trong danh sách.
            </div>
        );
    }

    return (
        <Table striped bordered hover responsive className="align-middle">
            <thead className="table-dark">
                <tr>
                    <th>#</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Natural</th>
                    <th>Attractive</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {orchids.map((o, idx) => (
                    <tr key={o.orchidId}>
                        <td>{idx + 1}</td>
                        <td style={{ width: '70px' }}>
                            {o.orchidURL ? (
                                <Image
                                    src={o.orchidURL}
                                    alt={o.orchidName}
                                    thumbnail
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            ) : null}
                        </td>
                        <td className="fw-semibold">{o.orchidName}</td>
                        <td>{o.orchidCategory}</td>
                        <td>
                            <Badge bg={o.isNatural ? 'success' : 'secondary'}>
                                {o.isNatural ? 'Yes' : 'No'}
                            </Badge>
                        </td>
                        <td>
                            <Badge bg={o.isAttractive ? 'warning' : 'light'} className={!o.isAttractive ? 'text-dark border' : 'text-dark'}>
                                {o.isAttractive ? 'Yes' : 'No'}
                            </Badge>
                        </td>
                        <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {o.orchidDescription}
                        </td>
                        <td>
                            <div className="d-flex gap-2">
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => onEdit(o.orchidId)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => onDelete(o.orchidId)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}
