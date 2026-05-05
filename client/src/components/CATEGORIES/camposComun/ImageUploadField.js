import React from 'react';
import { Card, Form, Button, Row, Col, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ImageUploadField = ({ images, handleChangeImages, deleteImages, theme }) => {
    const { t } = useTranslation('formfields'); // <-- Solo 'formfields'

    // Mostrar solo imágenes
    const imageShow = (src, index) => (
        <div className="position-relative">
            <img
                src={src}
                alt={t('preview')} // <-- Usa traducción
                style={{
                    width: '100%',
                    height: '120px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                }}
            />
            <Badge
                className="position-absolute top-0 start-0 m-1"
            >
                🖼️
            </Badge>
            <Badge
                className="position-absolute top-0 end-0 m-1"
            >
                #{index + 1}
            </Badge>
        </div>
    );

    return (
        <Card className="mb-4 border-0 shadow-sm">
            <Card.Body>
                {/* Preview de imágenes */}
                {images.length > 0 && (
                    <div className="mb-4">
                        <Row className="g-3">
                            {images.map((img, index) => (
                                <Col key={index} xs={6} md={4} lg={3}>
                                    <div className="position-relative media-thumbnail">
                                        {img.camera
                                            ? imageShow(img.camera, index)
                                            : img.url
                                                ? imageShow(img.url, index)
                                                : imageShow(URL.createObjectURL(img), index)
                                        }
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="position-absolute top-0 end-0 rounded-circle"
                                            onClick={() => deleteImages(index)}
                                            style={{
                                                width: '28px',
                                                height: '28px',
                                                transform: 'translate(30%, -30%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '14px',
                                                padding: 0
                                            }}
                                        >
                                            ×
                                        </Button>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}

                {/* Upload d'images avec icône */}
                <Form.Group className="text-center">
                    <label
                        htmlFor="image-upload"
                        className="cursor-pointer"
                        style={{
                            display: 'inline-block',
                            cursor: 'pointer',
                            fontSize: '2rem',
                            color: theme ? '#f8f9fa' : '#0d6efd',
                        }}
                    >
                        <i className="fas fa-image"></i>
                    </label>
                    <Form.Control
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleChangeImages}
                        style={{ display: 'none' }}
                    />
                </Form.Group>
            </Card.Body>
        </Card>
    );
};

export default ImageUploadField;