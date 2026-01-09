import { Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import './Breadcrumbs.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`breadcrumbs ${className}`}>
      <ol className="breadcrumbs__list">
        <li className="breadcrumbs__item">
          <Link to="/" className="breadcrumbs__link">
            <FiHome className="breadcrumbs__icon" />
            <span className="breadcrumbs__text">Inicio</span>
          </Link>
        </li>
        
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="breadcrumbs__item">
              <FiChevronRight className="breadcrumbs__separator" />
              {item.href && !isLast ? (
                <Link to={item.href} className="breadcrumbs__link">
                  <span className="breadcrumbs__text">{item.label}</span>
                </Link>
              ) : (
                <span className="breadcrumbs__current">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
