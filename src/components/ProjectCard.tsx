import React from 'react';
import { Link } from 'react-router-dom';
import { WorkItem } from '../types/cms';

interface ProjectCardProps {
  item: WorkItem;
  index?: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ item, index = 0 }) => {
  return (
    <div
      data-card-index={index}
      className="work-project-card w-full"
    >
      <Link
        to={`/work/${item.slug}`}
        className="group flex flex-col gap-[var(--work-card-gap)] w-full cursor-pointer select-none text-decoration-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 rounded-[var(--work-card-radius)]"
      >
        {/* Image wrap: aspect-ratio 1.45, rounded 20px, overflow-hidden */}
        <div className="relative w-full overflow-hidden rounded-[var(--work-card-radius)] bg-[#E8E4DF] aspect-[1.45/1]">
          <img
            src={item.images.hero}
            alt={
              item.title === 'Arch'
                ? 'Arch dashboard preview'
                : item.title === 'Daily Email Digest'
                ? 'Daily Email Digest workflow preview'
                : item.title === 'AirMouse'
                ? 'AirMouse hand gesture control preview'
                : item.title === 'Cenivo'
                ? 'Cenivo movie and TV discovery platform preview'
                : item.title === 'Hill Climbing Race'
                ? 'Hill Climbing Race game preview'
                : item.title === 'Games & Gadgets Haven'
                ? 'Games & Gadgets Haven storefront preview'
                : item.title
            }
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover rounded-[var(--work-card-radius)] will-change-transform transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
            style={{ objectPosition: '50.3% 5.5%' }}
          />
        </div>

        {/* Text Block: Title (H3) & Category (P) */}
        <div className="flex flex-col gap-0 items-start text-left w-full">
          <h3
            className="text-[#111111] text-[var(--work-card-title-font-size)] font-[var(--work-card-title-font-weight)] leading-[1.2em] tracking-[-0.02em] m-0"
            style={{
              fontFamily: 'var(--work-font-family)',
              fontStyle: 'var(--work-font-style)',
              fontSize: 'var(--work-card-title-font-size)',
              fontWeight: 'var(--work-card-title-font-weight)',
            }}
          >
            {item.title}
          </h3>
          <p
            className="text-[#111111] text-[var(--work-card-sub-font-size)] font-[var(--work-card-sub-font-weight)] leading-[1.4em] tracking-[-0.04em] m-0"
            style={{
              fontFamily: 'var(--work-font-family)',
              fontStyle: 'var(--work-font-style)',
              fontSize: 'var(--work-card-sub-font-size)',
              fontWeight: 'var(--work-card-sub-font-weight)',
            }}
          >
            {item.shortDescription}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProjectCard;
