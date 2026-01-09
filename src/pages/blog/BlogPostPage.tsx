import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockBlogPosts } from '../../features/blog/mockData';
import { FadeIn } from '../../components/ui/FadeIn';
import { FiClock, FiEye, FiArrowLeft, FiShare2 } from 'react-icons/fi';
import { toast } from '../../components/ui/Toast';
import './BlogPostPage.css';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const post = mockBlogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="blog-post-error">
        <h2>Artículo no encontrado</h2>
        <Link to="/blog">Volver al blog</Link>
      </div>
    );
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Enlace copiado al portapapeles');
    }
  };

  const relatedPosts = mockBlogPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  return (
    <div className="blog-post-page">
      {/* Header */}
      <div className="blog-post-header">
        <div className="blog-post-header__container">
          <button onClick={() => navigate('/blog')} className="blog-post-back">
            <FiArrowLeft /> Volver al blog
          </button>

          <FadeIn direction="up">
            <div className="blog-post-meta">
              <span className="blog-post-category">{post.category}</span>
              <span className="blog-post-date">{formattedDate}</span>
            </div>

            <h1 className="blog-post-title">{post.title}</h1>

            <div className="blog-post-stats">
              <span>
                <FiClock /> {post.readingTime} min de lectura
              </span>
              {post.views && (
                <span>
                  <FiEye /> {post.views} vistas
                </span>
              )}
            </div>

            <div className="blog-post-author">
              <img src={post.author.avatar} alt={post.author.name} />
              <div>
                <span className="blog-post-author__name">{post.author.name}</span>
                <span className="blog-post-author__role">{post.author.role}</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Cover Image */}
      <FadeIn direction="up" delay={0.2}>
        <div className="blog-post-cover">
          <img src={post.coverImage} alt={post.title} />
        </div>
      </FadeIn>

      {/* Content */}
      <div className="blog-post-container">
        <article className="blog-post-content">
          <FadeIn direction="up" delay={0.3}>
            <div className="blog-post-excerpt">{post.excerpt}</div>
            <div className="blog-post-body">{post.content}</div>
          </FadeIn>

          {/* Tags */}
          <div className="blog-post-tags">
            {post.tags.map((tag) => (
              <span key={tag} className="blog-post-tag">
                #{tag}
              </span>
            ))}
          </div>

          {/* Share */}
          <div className="blog-post-actions">
            <button onClick={handleShare} className="blog-post-share">
              <FiShare2 /> Compartir artículo
            </button>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="blog-post-sidebar">
          {/* Author Card */}
          <FadeIn direction="left" delay={0.4}>
            <div className="author-card">
              <img src={post.author.avatar} alt={post.author.name} />
              <h3>{post.author.name}</h3>
              <p>{post.author.role}</p>
            </div>
          </FadeIn>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <FadeIn direction="left" delay={0.5}>
              <div className="related-posts">
                <h3>Artículos Relacionados</h3>
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="related-post"
                  >
                    <img src={relatedPost.coverImage} alt={relatedPost.title} />
                    <div>
                      <h4>{relatedPost.title}</h4>
                      <span>{relatedPost.readingTime} min de lectura</span>
                    </div>
                  </Link>
                ))}
              </div>
            </FadeIn>
          )}
        </aside>
      </div>
    </div>
  );
}
