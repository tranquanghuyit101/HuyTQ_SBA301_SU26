
import { Carousel } from 'react-bootstrap';
import { images } from '../data/banner'; 

function MyCarousel() {

  return (
    <Carousel fade interval={2000}>
      {images.map((item, index) => (
        <Carousel.Item key={index}>
          <img
            className="d-block w-100"
            src={item.url}
            alt={item.title}
            style={{ height: '500px', objectFit: 'cover' }}
          />
          <Carousel.Caption>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default MyCarousel;