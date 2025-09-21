import { Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Footer from "./Layouts/Footer";
import Header from "./Layouts/Header";
import { allRoutes } from "./Router";
import ScrollToTop from "./components/Scroll/ScrollToTop/ScrollToTop";
import ScrollToTopOnNavigate from "./components/Scroll/ScrollToTopOnNavigate/ScrollToTopOnNavigate";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProgressProvider } from "./contexts/ProgressContext";
import "./styles/App.scss";

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
      <LanguageProvider>
        <ProgressProvider>
          <Router>
            <div className="app">
              <Suspense fallback={<Loading />}>
                <Header />
              <main className="main-content">
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
              </main>
              <Footer />
              {/* Scroll components */}
              <ScrollToTopOnNavigate />
              <ScrollToTop />
            </Suspense>
          </div>
        </Router>
      </ProgressProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
