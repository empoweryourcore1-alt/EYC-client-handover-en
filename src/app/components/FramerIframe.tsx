'use client';

import { useEffect, useRef } from 'react';

type FramerIframeProps = {
  src: string;
};

export default function FramerIframe({ src }: FramerIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    let observerTeardown: number | null = null;

    const removeFramerUI = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      const targets = [
        '#__framer-editorbar',
        '#__framer-editorbar-container',
        '#__framer-badge-container',
      ];

      targets.forEach((selector) => {
        doc.querySelectorAll(selector).forEach((node) => node.remove());
      });

      if (!doc.getElementById('mirror-hide-framer-ui')) {
        const style = doc.createElement('style');
        style.id = 'mirror-hide-framer-ui';
        style.textContent =
          '#__framer-editorbar,#__framer-editorbar-container,#__framer-badge-container{display:none!important}' +
          'html,body{overflow-x:hidden!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior-y:auto!important}' +
          /* Hide scrollbar on all browsers so it doesn't show as a sidebar on Windows */
          'html::-webkit-scrollbar,body::-webkit-scrollbar,*::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}html,body,*{scrollbar-width:none!important;-ms-overflow-style:none!important}';
        doc.head?.appendChild(style);
      }
    };

    let observer: MutationObserver | null = null;
    const setup = () => {
      removeFramerUI();
      const doc = iframe.contentDocument;
      if (!doc) return;
      if (observerTeardown) window.clearTimeout(observerTeardown);
      observer = new MutationObserver(removeFramerUI);
      observer.observe(doc.documentElement, {
        childList: true,
        subtree: true,
      });
      observerTeardown = window.setTimeout(() => {
        observer?.disconnect();
        observer = null;
      }, 5000);
    };

    const handleLoad = () => {
      observer?.disconnect();
      setup();
    };

    setup();
    iframe.addEventListener('load', handleLoad);

    return () => {
      iframe.removeEventListener('load', handleLoad);
      if (observerTeardown) window.clearTimeout(observerTeardown);
      observer?.disconnect();
    };
  }, [src]);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      aria-label="Empower Your Core®"
      allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
      style={{
        width: '100%',
        height: '100dvh',
        minHeight: '100dvh',
        border: 'none',
        display: 'block',
        overflow: 'auto',
        touchAction: 'auto',
        position: 'fixed',
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
      }}
    />
  );
}
