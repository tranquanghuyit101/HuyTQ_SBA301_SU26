// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import PostList from './pages/PostList';
import PostDetail from './pages/PostDetail';
import About from './pages/About';
import NotFound from './pages/NotFound';
import RegistrationForm from './components/RegistrationForm';
import DynamicBreadcrumb from './components/DynamicBreadcrumb';

function App() {
  return (
    <BrowserRouter>
      <AppNavbar />
      <DynamicBreadcrumb />
      <Routes>
        <Route path='/'          element={<Home />} />
        <Route path='/posts'     element={<PostList />} />
        <Route path='/posts/:id' element={<PostDetail />} />
        <Route path='/about'     element={<About />} />
        <Route path='*'          element={<NotFound />} />
        <Route path='/register'  element={<RegistrationForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
