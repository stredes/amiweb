import { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Rating } from './Rating';
import './Testimonials.css';

export interface Testimonial {
  author: string;
  role: string;
  company?: string;
  avatar?: string;
  rating: number;
  comment: string;
  date?: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

export function Testimonials({
  testimonials,
  autoPlay = true,
  interval = 5000,
  className = '',
}: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && testimonials.length > 1) {
      const timer = setInterval(next, interval);
      return () => clearInterval(timer);
    }
    return undefined;
  }, [autoPlay, interval, testimonials.length]);

  if (testimonials.length === 0) return null;

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className={`testimonials ${className}`}>
      <div className="testimonials__container">
        <button
          className="testimonials__nav testimonials__nav--prev"
          onClick={prev}
          aria-label="Previous testimonial"
          disabled={testimonials.length <= 1}
        >
          <FiChevronLeft />
        </button>

        <div className="testimonials__content">
          <div className="testimonials__quote">"</div>
          
          <div className="testimonials__card">
            <Rating value={currentTestimonial.rating} readonly size="md" />
            
            <p className="testimonials__comment">{currentTestimonial.comment}</p>
            
            <div className="testimonials__author">
              {currentTestimonial.avatar ? (
                <img
                  src={currentTestimonial.avatar}
                  alt={currentTestimonial.author}
                  className="testimonials__avatar"
                />
              ) : (
                <div className="testimonials__avatar testimonials__avatar--placeholder">
                  {currentTestimonial.author.charAt(0).toUpperCase()}
                </div>
              )}
              
              <div className="testimonials__author-info">
                <div className="testimonials__author-name">{currentTestimonial.author}</div>
                <div className="testimonials__author-role">
                  {currentTestimonial.role}
                  {currentTestimonial.company && ` • ${currentTestimonial.company}`}
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          className="testimonials__nav testimonials__nav--next"
          onClick={next}
          aria-label="Next testimonial"
          disabled={testimonials.length <= 1}
        >
          <FiChevronRight />
        </button>
      </div>

      {testimonials.length > 1 && (
        <div className="testimonials__indicators">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`testimonials__indicator ${
                index === currentIndex ? 'testimonials__indicator--active' : ''
              }`}
              onClick={() => goTo(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface TestimonialsGridProps {
  testimonials: Testimonial[];
  columns?: number;
  className?: string;
}

export function TestimonialsGrid({
  testimonials,
  columns = 3,
  className = '',
}: TestimonialsGridProps) {
  return (
    <div
      className={`testimonials-grid ${className}`}
      style={{ '--columns': columns } as React.CSSProperties}
    >
      {testimonials.map((testimonial, index) => (
        <div key={index} className="testimonials-grid__card">
          <Rating value={testimonial.rating} readonly size="sm" />
          <p className="testimonials-grid__comment">"{testimonial.comment}"</p>
          <div className="testimonials-grid__author">
            {testimonial.avatar ? (
              <img
                src={testimonial.avatar}
                alt={testimonial.author}
                className="testimonials-grid__avatar"
              />
            ) : (
              <div className="testimonials-grid__avatar testimonials-grid__avatar--placeholder">
                {testimonial.author.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="testimonials-grid__author-name">{testimonial.author}</div>
              <div className="testimonials-grid__author-role">{testimonial.role}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
