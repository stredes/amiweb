import { Link } from 'react-router-dom';
import { FiClock, FiEye, FiArrowRight } from 'react-icons/fi';
import type { BlogPost } from '../../features/blog/types';
import './BlogCard.css';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className={`blog-card ${featured ? 'blog-card--featured' : ''}`}>
      <Link to={`/blog/${post.slug}`} className="blog-card__image-link">
        <img src={post.coverImage} alt={post.title} className="blog-card__image" />
        {featured && <span className="blog-card__featured-badge">Destacado</span>}
      </Link>

      <div className="blog-card__content">
        <div className="blog-card__meta">
          <span className="blog-card__category">{post.category}</span>
          <div className="blog-card__stats">
            <span>
              <FiClock /> {post.readingTime} min
            </span>
            {post.views && (
              <span>
                <FiEye /> {post.views}
              </span>
            )}
          </div>
        </div>

        <Link to={`/blog/${post.slug}`}>
          <h3 className="blog-card__title">{post.title}</h3>
        </Link>

        <p className="blog-card__excerpt">{post.excerpt}</p>

        <div className="blog-card__footer">
          <div className="blog-card__author">
            <img src={post.author.avatar} alt={post.author.name} />
            <div>
              <span className="blog-card__author-name">{post.author.name}</span>
              <span className="blog-card__date">{formattedDate}</span>
            </div>
          </div>

          <Link to={`/blog/${post.slug}`} className="blog-card__read-more">
            Leer más <FiArrowRight />
          </Link>
        </div>
      </div>
    </article>
  );
}
