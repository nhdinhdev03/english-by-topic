import { Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import ScrollToTop from "./components/Scroll/ScrollToTop/ScrollToTop";
import ScrollToTopOnNavigate from "./components/Scroll/ScrollToTopOnNavigate/ScrollToTopOnNavigate";
import { ToastContainer } from "./components/UI";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ProgressProvider } from "./contexts/ProgressContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./contexts/ToastContext";
import Footer from "./Layouts/Footer";
import Header from "./Layouts/Header";
import { allRoutes } from "./Router";
import "./styles/App.scss";
import "./styles/enhanced-animations.scss";

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
      <ToastProvider>
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
                  {/* Mobile bottom navigation */}
                  <BottomNav />
                  {/* Scroll components */}
                  <ScrollToTopOnNavigate />
                  <ScrollToTop />
                  {/* Toast notifications */}
                  <ToastContainer />
                </Suspense>
              </div>
            </Router>
          </ProgressProvider>
        </LanguageProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
