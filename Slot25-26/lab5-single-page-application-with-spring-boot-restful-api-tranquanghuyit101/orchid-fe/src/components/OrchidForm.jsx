import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Image } from 'react-bootstrap';

const EMPTY_FORM = {
    orchidName: '',
    isNatural: false,
    orchidDescription: '',
    orchidCategory: '',
    isAttractive: false,
    orchidURL: ''
};

export default function OrchidForm({ initialData, onSubmit, submitLabel = 'Save', loading = false }) {
    const [form, setForm] = useState(EMPTY_FORM);

    useEffect(() => {
        if (initialData) {
            setForm(initialData);
        } else {
            setForm(EMPTY_FORM);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <Form onSubmit={handleSubmit} className="border p-4 rounded bg-white shadow-sm">
            <Form.Group className="mb-3" controlId="formOrchidName">
                <Form.Label className="fw-semibold">Orchid Name <span className="text-danger">*</span></Form.Label>
                <Form.Control
                    type="text"
                    name="orchidName"
                    value={form.orchidName}
                    onChange={handleChange}
                    placeholder="Nhập tên hoa lan..."
                    required
                />
            </Form.Group>

            <Row className="mb-3">
                <Col md={6}>
                    <Form.Group controlId="formOrchidCategory">
                        <Form.Label className="fw-semibold">Category</Form.Label>
                        <Form.Control
                            type="text"
                            name="orchidCategory"
                            value={form.orchidCategory}
                            onChange={handleChange}
                            placeholder="Nhập danh mục..."
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group controlId="formOrchidURL">
                        <Form.Label className="fw-semibold">Image URL</Form.Label>
                        <Form.Control
                            type="url"
                            name="orchidURL"
                            value={form.orchidURL}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                        />
                    </Form.Group>
                </Col>
            </Row>

            {form.orchidURL && (
                <div className="mb-3 text-center">
                    <p className="text-muted small mb-1">Image Preview</p>
                    <Image
                        src={form.orchidURL}
                        alt="Preview"
                        thumbnail
                        style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                </div>
            )}

            <Form.Group className="mb-3" controlId="formOrchidDescription">
                <Form.Label className="fw-semibold">Description</Form.Label>
                <Form.Control
                    as="textarea"
                    name="orchidDescription"
                    value={form.orchidDescription}
                    onChange={handleChange}
                    placeholder="Mô tả về hoa lan..."
                    rows={3}
                />
            </Form.Group>

            <Row className="mb-4">
                <Col xs={6}>
                    <Form.Check
                        type="switch"
                        id="switch-is-natural"
                        name="isNatural"
                        label="Natural (Tự nhiên)"
                        checked={form.isNatural}
                        onChange={handleChange}
                        className="fw-semibold"
                    />
                </Col>
                <Col xs={6}>
                    <Form.Check
                        type="switch"
                        id="switch-is-attractive"
                        name="isAttractive"
                        label="Attractive (Cuốn hút)"
                        checked={form.isAttractive}
                        onChange={handleChange}
                        className="fw-semibold"
                    />
                </Col>
            </Row>

            <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
            >
                {loading ? 'Đang lưu...' : submitLabel}
            </Button>
        </Form>
    );
}
