import { useLayoutEffect, type DependencyList, type RefObject } from 'react';
import { gsap } from './gsap';

/** Runs GSAP code inside a scoped context and reverts every tween/ScrollTrigger on cleanup. */
export function useGsap(
  setup: (ctx: gsap.Context) => void | (() => void),
  scope: RefObject<HTMLElement>,
  deps: DependencyList = [],
) {
  useLayoutEffect(() => {
    let extra: void | (() => void);
    const ctx = gsap.context((self) => { extra = setup(self); }, scope);
    return () => { extra?.(); ctx.revert(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
