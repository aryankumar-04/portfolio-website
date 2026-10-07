import React from 'react';
import { motion } from 'framer-motion';
import { ServiceCard } from '../components/ServiceCard';
import { serviceItems } from '../data/services';

export const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="w-full bg-cream py-24 md:py-32 scroll-mt-20">
      <div className="max-w-framer mx-auto px-6 md:px-12 flex flex-col gap-12 md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3"
        >
          <span className="font-sans text-xs tracking-widest uppercase font-semibold text-dark/40">
            What I Do
          </span>
          <h2 className="framer-h2 font-semibold text-dark">Services</h2>
        </motion.div>

        <div className="flex flex-col gap-4 md:gap-5">
          {serviceItems.map((service) => (
            <ServiceCard
              key={service.id}
              index={service.index}
              title={service.title}
              description={service.description}
              tags={service.tags}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
