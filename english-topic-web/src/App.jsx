
import { Suspense } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Footer from './Layouts/Footer';
import Header from './Layouts/Header';
import { allRoutes } from './Router';
import ScrollToTop from './components/Scroll/ScrollToTop/ScrollToTop';
import ScrollToTopOnNavigate from './components/Scroll/ScrollToTopOnNavigate/ScrollToTopOnNavigate';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/App.scss';

// Loading component
const Loading = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Đang tải...</p>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Suspense fallback={<Loading />}>
              <Routes>
                {allRoutes.map((route, index) => {
                  const Component = route.element;
                  return (
                    <Route
                      key={index}
                      path={route.path}
                      element={<Component />}
                    />
                  );
                })}
              </Routes>
            </Suspense>
          </main>
          <Footer />
          {/* Scroll components */}
          <ScrollToTopOnNavigate />
          <ScrollToTop />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
