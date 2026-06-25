import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Breadcrumb, Alert } from 'react-bootstrap';
import { useOrchid } from '../context/OrchidContext';
import OrchidForm from '../components/OrchidForm';

export default function AddOrchidPage() {
    const { addOrchid } = useOrchid();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (formData) => {
        setSaving(true);
        setError('');
        setSuccess(false);
        try {
            await addOrchid(formData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Lỗi khi thêm mới hoa lan';
            setError(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Container className="py-4" style={{ maxWidth: '720px' }}>
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
                    Home
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Add Orchid</Breadcrumb.Item>
            </Breadcrumb>

            <h2 className="fw-bold mb-4 text-dark text-center">Thêm Hoa Lan Mới</h2>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && (
                <Alert variant="success">
                    Thêm hoa lan thành công! Đang chuyển hướng về trang chủ...
                </Alert>
            )}

            <OrchidForm
                onSubmit={handleSubmit}
                submitLabel="Add Orchid"
                loading={saving}
            />
        </Container>
    );
}
