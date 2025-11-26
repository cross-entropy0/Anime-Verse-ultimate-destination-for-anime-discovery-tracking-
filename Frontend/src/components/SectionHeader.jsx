import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const SectionHeader = ({ title, subtitle, linkTo, linkText = 'View All' }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{title}</h2>
        {subtitle && <p className="text-gray-400 text-sm md:text-base">{subtitle}</p>}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors duration-200 font-medium group"
        >
          <span>{linkText}</span>
          <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
