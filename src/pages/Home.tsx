import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Colophon } from '../components/Colophon/Colophon';
import { Footer } from '../components/Footer/Footer';
import { Hero } from '../components/Hero/Hero';
import { Manifesto } from '../components/Manifesto/Manifesto';
import { Projects } from '../components/Projects/Projects';
import { scrollToId } from '../components/Transition/Transition';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export default function Home() {
  const location = useLocation();
  useDocumentTitle('NOCTURNE — Digital Atelier');

  // Land on a section when arriving from another page (state) or a direct /#hash link.
  useLayoutEffect(() => {
    const section = (location.state as { section?: string } | null)?.section ?? location.hash.slice(1);
    if (section) scrollToId(section, false);
  }, [location.key]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Hero />
      <Manifesto />
      <Projects />
      <Colophon />
      <Footer />
    </>
  );
}
