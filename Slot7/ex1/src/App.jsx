import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Counter from './components/Counter';
import RegistrationForm from './components/RegistrationForm';

function App() {
  return (
    <div className="container">
      <Counter />
      <RegistrationForm />
    </div>

  );
}

export default App;