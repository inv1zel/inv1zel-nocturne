import { site } from '../../config/site';
import { scrollToId } from '../Transition/Transition';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <span className="micro">© {new Date().getFullYear()} {site.name} — {site.tagline}</span>
      <span className={`micro ${styles.note}`}>{site.disclaimer}</span>
      <button type="button" className={`micro ${styles.top}`} onClick={() => scrollToId('top')}>
        Back to top ↑
      </button>
    </footer>
  );
}
