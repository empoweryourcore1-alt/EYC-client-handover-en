import FramerIframe from '../components/FramerIframe';

export default function WorksPage() {
  // There's no dedicated /works index export from Framer; default to a safe story.
  return <FramerIframe src="/works/lisa-pilates-injury-recovery-story.html" />;
}
