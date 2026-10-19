import { useState, type CSSProperties } from 'react';
import { artSrc, artSrcSet, getArt, type ArtName } from '../../lib/art';
import styles from './Art.module.css';

interface Props {
  name: ArtName;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** object-position for responsive crops */
  position?: string;
}

/** Responsive AVIF/WebP picture with intrinsic size (no layout shift) and a blurred placeholder. */
export function Art({ name, alt, sizes = '100vw', priority = false, className, position }: Props) {
  const art = getArt(name);
  const [loaded, setLoaded] = useState(false);
  const style: CSSProperties = { backgroundImage: `url(${art.placeholder})`, objectPosition: position };
  return (
    <picture className={[styles.picture, className].filter(Boolean).join(' ')}>
      <source type="image/avif" srcSet={artSrcSet(name, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={artSrcSet(name, 'webp')} sizes={sizes} />
      <img
        className={styles.img}
        data-loaded={loaded || undefined}
        src={artSrc(name)}
        width={art.width}
        height={art.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        {...{ fetchpriority: priority ? 'high' : 'auto' }}
        style={style}
        onLoad={() => setLoaded(true)}
        draggable={false}
      />
    </picture>
  );
}
