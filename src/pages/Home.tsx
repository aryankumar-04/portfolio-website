import React, { useEffect } from 'react';
import { Hero } from '../Hero';
import { QuoteSection } from '../sections/QuoteSection';
import { TechStackSection } from '../sections/TechStackSection';
// Services section detached - code kept intentionally
// import { Services } from '../Services';
import { EducationSection } from '../sections/EducationSection';
import { CertificationsSection } from '../sections/CertificationsSection';
import { ProjectsSection } from '../sections/ProjectsSection';
import { Testimonials } from '../Testimonials';
import { Thoughts } from '../Thoughts';
import { Contact } from '../Contact';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { ROUTE_TITLES } from '../config/site';
import { useRestoreHomeScroll } from '../hooks/useRestoreHomeScroll';
import { homeScroll } from '../utils/homeScroll';

export const Home: React.FC = () => {
  useDocumentTitle(ROUTE_TITLES.home);
  useRestoreHomeScroll();

  useEffect(() => {
    return () => {
      homeScroll.save();
    };
  }, []);

  return (
    <main className="w-full overflow-clip">
      <Hero />
      <QuoteSection />
      <TechStackSection />
      {/* Services section detached - code kept intentionally */}
      <EducationSection />
      <CertificationsSection />
      <ProjectsSection />
      <Testimonials />
      <Thoughts />
      <Contact />
    </main>
  );
};
