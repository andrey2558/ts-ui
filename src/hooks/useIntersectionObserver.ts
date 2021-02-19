import { RefObject, useEffect } from 'react';

export type TIntersectionObserver = {
    el: RefObject<Element>;
    options?: IntersectionObserverInit & {
        intersectInCallback?: (observer: IntersectionObserver, ref?: RefObject<Element>) => void;
        intersectOutCallback?: (observer: IntersectionObserver, ref?: RefObject<Element>) => void;
        errorCallback?: () => void;
    };
};

export const useIntersectionObserver = (props: TIntersectionObserver) => {
    const { el, options } = props;
    const { root = null, rootMargin = '0px', threshold = 1.0, intersectInCallback, intersectOutCallback, errorCallback } = options || {};

    useEffect(() => {
        if (
            (!Object.keys(window).includes('IntersectionObserver') &&
                !Object.keys(window).includes('IntersectionObserverEntry') &&
                !Object.keys(window.IntersectionObserverEntry?.prototype).includes('intersectionRatio')) ||
            ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator?.platform)
        ) {
            errorCallback && errorCallback();
        } else if (typeof window !== 'undefined') {
            const observer = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach(entry => (entry.isIntersecting ? intersectInCallback?.(observer, el) : intersectOutCallback?.(observer, el)));
                },
                {
                    root,
                    rootMargin,
                    threshold,
                }
            );

            if (el && el.current) {
                observer.observe(el.current);
            }

            return () => {
                if (el && el.current) {
                    observer.unobserve(el.current);
                }
                observer.disconnect();
            };
        }
    }, [el]);
};
