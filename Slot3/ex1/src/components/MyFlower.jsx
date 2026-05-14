import { Card, Button } from 'react-bootstrap';

function MyFlower({ flower }) {
  if (!flower) return null;

  const { name, type, image } = flower;

  const handleDetailClick = () => {
    alert(`Bạn đang xem chi tiết về hoa: ${name}`);
  };

  return (
    <Card className="h-100 shadow-sm border-0">
      <Card.Img 
        variant="top" 
        src={image || "https://via.placeholder.com/150"} 
        style={{ height: '300px', objectFit: 'cover', borderRadius: '15px 15px 0 0' }} 
      />
      <Card.Body className="text-center">
        <Card.Title className="fw-bold text-success">{name}</Card.Title>
        <Card.Subtitle className="mb-3 text-muted">{type}</Card.Subtitle>
        <Button 
          variant="outline-success" 
          className="rounded-pill px-4"
          onClick={handleDetailClick}
        >
          Detail
        </Button>
      </Card.Body>
    </Card>
  );
}

export default MyFlower;