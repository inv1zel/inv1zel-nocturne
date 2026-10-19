import { useParams } from 'react-router-dom';
import { Footer } from '../components/Footer/Footer';
import { ProjectDetail } from '../components/ProjectDetail/ProjectDetail';
import { getProject } from '../data/projects';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import NotFound from './NotFound';

export default function ProjectPage() {
  const { slug } = useParams();
  const project = getProject(slug);
  useDocumentTitle(project ? `${project.title} — ${project.category} · NOCTURNE` : 'Not found · NOCTURNE');
  if (!project) return <NotFound />;
  return (
    <>
      <ProjectDetail key={project.slug} project={project} />
      <Footer />
    </>
  );
}
