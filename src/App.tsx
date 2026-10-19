import { useEffect, useLayoutEffect } from 'react';
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import { CustomCursor } from './components/CustomCursor/CustomCursor';
import { Header } from './components/Header/Header';
import { TransitionProvider } from './components/Transition/Transition';
import { ScrollTrigger } from './lib/gsap';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ProjectPage from './pages/ProjectPage';

/** Browser back/forward: start the new page at the top (in-app links handle their own scroll). */
function ScrollManager() {
  const location = useLocation();
  const type = useNavigationType();
  useLayoutEffect(() => {
    if (type === 'POP' && !location.hash) window.scrollTo(0, 0);
  }, [location.key, type]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [location.pathname]);
  return null;
}

export default function App() {
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return (
    <TransitionProvider>
      <a href="#main" className="skip-link">Skip to content</a>
      <ScrollManager />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <div className="grain" aria-hidden="true" />
      <CustomCursor />
    </TransitionProvider>
  );
}
