/**
 * Single source of truth for vertical section spacing across breakpoints.
 * Measured directly from Framer MCP desktop layout and responsive variants.
 *
 * Breakpoints:
 * - Desktop: >= 1280px (Framer primary variant)
 * - Tablet:  810px - 1279px
 * - Mobile:  < 810px
 *
 * Spacing model:
 * Each section owns its top padding, with zero bottom padding.
 * Contact section owns top padding and bottom padding before the Footer.
 * Pinned wrappers (Hero, Quote) maintain unpinned transitions with zero excess margin.
 */

export const SECTION_SPACING = {
  // Hero to Text Reveal ("From idea to launch...")
  heroToQuote: {
    desktop: 0,
    tablet: 0,
    mobile: 0,
  },
  // Text Reveal to Services (Framer ServicesSection padding="0px 0px 0px 0px")
  quoteToServices: {
    desktop: 0,
    tablet: 0,
    mobile: 0,
  },
  // Services to Featured Projects (Framer ProjectsSection padding="120px 0px 0px 0px")
  servicesToProjects: {
    desktop: 120,
    tablet: 100,
    mobile: 80,
  },
  // Featured Projects to Testimonials (Framer TestimonialsSection padding="120px 0px 0px 0px")
  projectsToTestimonials: {
    desktop: 120,
    tablet: 100,
    mobile: 80,
  },
  // Testimonials to Thoughts (Framer ThoughtsSection padding="120px 0px 0px 0px")
  testimonialsToThoughts: {
    desktop: 120,
    tablet: 100,
    mobile: 80,
  },
  // Thoughts to Contact (Framer ContactSection padding="120px 0px 120px 0px")
  thoughtsToContact: {
    desktop: 120,
    tablet: 100,
    mobile: 80,
  },
  // Contact to Footer (Framer ContactSection bottom padding 120px)
  contactToFooter: {
    desktop: 120,
    tablet: 100,
    mobile: 80,
  },
};

export default SECTION_SPACING;
