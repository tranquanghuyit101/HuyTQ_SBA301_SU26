import MyCarousel from './components/MyCarousel';
import 'bootstrap/dist/css/bootstrap.min.css';  
import Navbar from './components/NavBar';
import Orchids from './components/Orchids';

function App() {

  return (
    <>
    <Navbar/>

    <div className="container mt-5">
      <MyCarousel />
    </div>

    <Orchids />
    </>
  );
}

export default App;