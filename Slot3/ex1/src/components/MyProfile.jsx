
import { Card } from 'react-bootstrap';

function MyProfile({ student }) {
  if (!student) return null;

  const { id, name, avatar } = student;

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img 
        variant="top" 
        src={avatar || "https://via.placeholder.com/150"} 
        style={{ height: '200px', objectFit: 'cover' }} 
      />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">ID: {id}</Card.Subtitle>
        <Card.Text>
          This is {name}'s profile page. chuyên ngành Software Engineering.
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">Last updated 3 mins ago</small>
      </Card.Footer>
    </Card>
  );
}

export default MyProfile;