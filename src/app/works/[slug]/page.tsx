import FramerIframe from '../../components/FramerIframe';

const allowedSlugs = new Set([
  'about-us',
  'our-method',
  'personal-training',
  'teacher-training',
  'lisa-pilates-injury-recovery-story',
  'rolf-pilates-transformation',
  'chris-pilates-story',
  'pain-free-stride-pilates',
  'gym-burnout-pilates-story',
  'golfer-back-pain-pilates',
]);

type PageProps = {
  // Next.js 15 app router types expose `params` as a Promise.
  params: Promise<{ slug: string }>;
};

export default async function WorkPage({ params }: PageProps) {
  const { slug } = await params;
  const normalizedSlug = slug.replace(/\.html$/i, "");
  const safeSlug = allowedSlugs.has(normalizedSlug)
    ? normalizedSlug
    : "lisa-pilates-injury-recovery-story";
  return <FramerIframe src={`/works/${safeSlug}.html`} />;
}
