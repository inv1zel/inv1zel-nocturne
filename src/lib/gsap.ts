import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);

/** House curves. "atelier" is a slow, symmetrical in-out; "reveal" decelerates hard for masks. */
CustomEase.create('atelier', '0.76, 0, 0.24, 1');
CustomEase.create('reveal', '0.22, 1, 0.36, 1');

gsap.defaults({ ease: 'reveal', duration: 1.2 });

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export { gsap, ScrollTrigger };
