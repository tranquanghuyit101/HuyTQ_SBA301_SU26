import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, ButtonGroup, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { useOrchid } from '../context/OrchidContext';
import OrchidTable from '../components/OrchidTable';
import OrchidCard from '../components/OrchidCard';
import ConfirmModal from '../components/ConfirmModal';

export default function HomePage() {
    const { orchids, loading, error, fetchOrchids, removeOrchid } = useOrchid();
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
    const [deleteTarget, setDeleteTarget] = useState(null); // Orchid object to delete
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    useEffect(() => {
        fetchOrchids();
    }, [fetchOrchids]);

    const handleEdit = (id) => {
        navigate(`/edit/${id}`);
    };

    const handleDeleteClick = (id) => {
        const target = orchids.find(o => o.orchidId === id);
        if (target) {
            setDeleteTarget(target);
            setDeleteError('');
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        setDeleteError('');
        try {
            await removeOrchid(deleteTarget.orchidId);
            setDeleteTarget(null);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Lỗi khi xóa hoa lan';
            setDeleteError(errorMsg);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Container className="py-4">
            <Row className="mb-4 align-items-center">
                <Col>
                    <h2 className="fw-bold m-0 text-dark">Danh sách Hoa Lan</h2>
                </Col>
                <Col xs="auto" className="d-flex gap-3">
                    <ButtonGroup>
                        <Button
                            variant={viewMode === 'table' ? 'primary' : 'outline-primary'}
                            onClick={() => setViewMode('table')}
                        >
                            Table View
                        </Button>
                        <Button
                            variant={viewMode === 'card' ? 'primary' : 'outline-primary'}
                            onClick={() => setViewMode('card')}
                        >
                            Card View
                        </Button>
                    </ButtonGroup>
                    <Button variant="success" onClick={() => navigate('/add')}>
                        ➕ Add Orchid
                    </Button>
                </Col>
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}
            {deleteError && <Alert variant="danger">{deleteError}</Alert>}

            {loading ? (
                <div className="text-center my-5 py-5">
                    <Spinner animation="border" variant="primary" role="status" className="mb-2" />
                    <div>Đang tải dữ liệu...</div>
                </div>
            ) : (
                <>
                    {viewMode === 'table' ? (
                        <OrchidTable
                            orchids={orchids}
                            onEdit={handleEdit}
                            onDelete={handleDeleteClick}
                        />
                    ) : (
                        <OrchidCard
                            orchids={orchids}
                            onEdit={handleEdit}
                            onDelete={handleDeleteClick}
                        />
                    )}
                </>
            )}

            <ConfirmModal
                show={deleteTarget !== null}
                onHide={() => !deleting && setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                orchidName={deleteTarget?.orchidName || ''}
                loading={deleting}
            />
        </Container>
    );
}
