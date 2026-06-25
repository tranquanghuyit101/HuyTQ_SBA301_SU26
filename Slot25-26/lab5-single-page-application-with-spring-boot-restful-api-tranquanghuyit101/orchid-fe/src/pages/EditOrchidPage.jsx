import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Breadcrumb, Spinner, Alert } from 'react-bootstrap';
import { useOrchid } from '../context/OrchidContext';
import { getOrchidById } from '../utils/orchidApi';
import OrchidForm from '../components/OrchidForm';

export default function EditOrchidPage() {
    const { id } = useParams();
    const { editOrchid } = useOrchid();
    const navigate = useNavigate();
    const [orchid, setOrchid] = useState(null);
    const [fetching, setFetching] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const loadOrchid = async () => {
            setFetching(true);
            setError('');
            try {
                const response = await getOrchidById(id);
                setOrchid(response.data);
            } catch (err) {
                const errorMsg = err.response?.data?.message || err.message || 'Lỗi khi tải thông tin hoa lan';
                setError(errorMsg);
            } finally {
                setFetching(false);
            }
        };
        if (id) {
            loadOrchid();
        }
    }, [id]);

    const handleSubmit = async (formData) => {
        setSaving(true);
        setError('');
        setSuccess(false);
        try {
            await editOrchid(id, formData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Lỗi khi cập nhật hoa lan';
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
                <Breadcrumb.Item active>Edit Orchid #{id}</Breadcrumb.Item>
            </Breadcrumb>

            <h2 className="fw-bold mb-4 text-dark text-center">Chỉnh sửa Hoa Lan #{id}</h2>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && (
                <Alert variant="success">
                    Cập nhật hoa lan thành công! Đang chuyển hướng về trang chủ...
                </Alert>
            )}

            {fetching ? (
                <div className="text-center my-5 py-5">
                    <Spinner animation="border" variant="primary" role="status" className="mb-2" />
                    <div>Đang tải dữ liệu hoa lan...</div>
                </div>
            ) : (
                orchid && (
                    <OrchidForm
                        initialData={orchid}
                        onSubmit={handleSubmit}
                        submitLabel="Save Changes"
                        loading={saving}
                    />
                )
            )}
        </Container>
    );
}
