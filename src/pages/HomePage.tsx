import Hero from '../components/Hero';
import AuthorityProof from '../components/AuthorityProof';
import Differentials from '../components/Differentials';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import FinalCTA from '../components/FinalCTA';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div>
      <Hero onNavigate={onNavigate} />
      <AuthorityProof />
      <Differentials />
      <Testimonials />
      <FAQ category="general" />
      <FinalCTA onNavigate={onNavigate} />
    </div>
  );
}
