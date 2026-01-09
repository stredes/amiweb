import { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import './Rating.css';

interface RatingProps {
  value: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  onChange?: (rating: number) => void;
  showValue?: boolean;
  className?: string;
}

export function Rating({
  value,
  maxStars = 5,
  size = 'md',
  readonly = false,
  onChange,
  showValue = false,
  className = '',
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readonly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const displayValue = hoverValue !== null ? hoverValue : value;

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const filled = starValue <= displayValue;
    const halfFilled = !filled && starValue - 0.5 <= displayValue;

    return (
      <button
        key={index}
        type="button"
        className={`rating__star ${filled ? 'rating__star--filled' : ''} ${
          halfFilled ? 'rating__star--half' : ''
        }`}
        onClick={() => handleClick(starValue)}
        onMouseEnter={() => handleMouseEnter(starValue)}
        onMouseLeave={handleMouseLeave}
        disabled={readonly}
        aria-label={`${starValue} stars`}
      >
        {filled ? (
          <FaStar className="rating__star-icon rating__star-icon--filled" />
        ) : halfFilled ? (
          <FaStarHalfAlt className="rating__star-icon rating__star-icon--half" />
        ) : (
          <FiStar className="rating__star-icon" />
        )}
      </button>
    );
  };

  return (
    <div className={`rating rating--${size} ${readonly ? 'rating--readonly' : ''} ${className}`}>
      <div className="rating__stars">
        {Array.from({ length: maxStars }).map((_, index) => renderStar(index))}
      </div>
      {showValue && (
        <span className="rating__value">
          {value.toFixed(1)} / {maxStars}
        </span>
      )}
    </div>
  );
}

interface ReviewProps {
  author: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export function Review({ author, rating, comment, date, avatar }: ReviewProps) {
  return (
    <div className="review">
      <div className="review__header">
        <div className="review__author">
          {avatar ? (
            <img src={avatar} alt={author} className="review__avatar" />
          ) : (
            <div className="review__avatar review__avatar--placeholder">
              {author.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="review__author-info">
            <div className="review__author-name">{author}</div>
            <div className="review__date">{date}</div>
          </div>
        </div>
        <Rating value={rating} readonly size="sm" />
      </div>
      <p className="review__comment">{comment}</p>
    </div>
  );
}
