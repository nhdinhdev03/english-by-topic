import { Outlet } from 'react-router-dom';
import Footer from './Layouts/Footer';
import Header from './Layouts/Header';
import './styles/App.scss';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
