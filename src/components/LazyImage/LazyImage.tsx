import React, { FC, memo, useRef, useState } from 'react';
import { useIntersectionObserver } from '../..';

export type TLazyImage = {
  type: 'image' | 'picture';
  src?: string;
  srcset?: string;
  alt?: string;
  preloader?: string;
  delay?: number;
  desktopImage?: string;
  tabletImage?: string;
  mobileImage?: string;
  className?: string;
};

const loadImage = (item: HTMLImageElement | HTMLSourceElement): void => {
  if (item.dataset.src) {
    item.src = item.dataset.src;
  }
  if (item.dataset.srcset) {
    item.srcset = item.dataset.srcset;
  }
};
const loadPicture = (item: HTMLPictureElement): void => {
  const sources = item.querySelectorAll('source');
  sources.forEach(i => loadImage(i));
};
const loadRef = (el: Element): void => {
  if (el.nodeName === 'IMG') {
    loadImage(el as HTMLImageElement);
  } else if (el.nodeName === 'PICTURE') {
    loadPicture(el as HTMLPictureElement);
  }
};

const LazyImage: FC<TLazyImage> = props => {
  const {
    type,
    src = '',
    srcset = '',
    alt = '',
    desktopImage = '',
    tabletImage = '',
    mobileImage = '',
    className = '',
    preloader = null,
    delay = 500,
  } = props;
  const el = useRef<Element>(null);
  useIntersectionObserver({
    el,
    options: {
      intersectInCallback: (observer, ref) => {
        // @ts-ignore
        const { current } = ref;
        loadRef(current);
        observer.unobserve(current);
      },
      errorCallback() {
        // @ts-ignore
        setTimeout(() => loadRef(el.current), delay);
      },
    },
  });
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const onLoad = (): void => {
    setTimeout(() => setIsLoaded(true), delay);
  };
  return (
    <span className={`lazyImage ${className} ${isLoaded ? 'is-load' : ''}`}>
      {type === 'image' && (
        <span className="lazyImage__container">
          <img
            // @ts-ignore
            ref={el}
            className="lazyImage__main"
            alt={alt}
            data-src={src}
            loading="lazy"
            onLoad={onLoad}
            data-srcset={srcset ? srcset + ' 1.5x' : ''}
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY/j//z8ABf4C/qc1gYQAAAAASUVORK5CYII="
          />
        </span>
      )}

      {type === 'picture' && (
        <span className="lazyImage__container">
          <picture
            // @ts-ignore
            ref={el}
            onLoad={onLoad}
          >
            <source
              media="(min-width: 1024px)"
              data-srcset={desktopImage || src}
            />
            <source
              media="(min-width: 768px)"
              data-srcset={tabletImage || src}
            />
            <source media="(min-width: 0px)" data-srcset={mobileImage || src} />
            <img
              className="lazyImage__main"
              alt={alt}
              data-src={src}
              loading="lazy"
              data-srcset={srcset ? srcset + ' 1.5x' : ''}
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY/j//z8ABf4C/qc1gYQAAAAASUVORK5CYII="
            />
          </picture>
        </span>
      )}
      {preloader && !isLoaded && <span>{preloader}</span>}
    </span>
  );
};

export default memo(LazyImage);
