import { useState } from 'react';
import { blogCategories, mockBlogPosts } from '../../features/blog/mockData';
import { BlogCard } from '../../components/blog/BlogCard';
import { FadeIn } from '../../components/ui/FadeIn';
import { FiSearch, FiFilter } from 'react-icons/fi';
import './BlogPage.css';

export function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredPosts = mockBlogPosts.filter((post) => post.featured);
  
  const filteredPosts = mockBlogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <section className="blog-hero">
        <div className="blog-hero__container">
          <FadeIn direction="up">
            <h1>Blog & Noticias</h1>
            <p>
              Mantente informado sobre las últimas tendencias, noticias y mejores prácticas
              en tecnología industrial y automatización
            </p>
          </FadeIn>
        </div>
      </section>

      <div className="blog-page__container">
        {/* Filters */}
        <FadeIn direction="up" delay={0.1}>
          <div className="blog-filters">
            <div className="blog-filters__search">
              <FiSearch />
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="blog-filters__categories">
              <FiFilter />
              <button
                className={selectedCategory === 'all' ? 'active' : ''}
                onClick={() => setSelectedCategory('all')}
              >
                Todos
              </button>
              {blogCategories.map((category) => (
                <button
                  key={category.id}
                  className={selectedCategory === category.slug ? 'active' : ''}
                  onClick={() => setSelectedCategory(category.slug)}
                >
                  <span>{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Featured Posts */}
        {selectedCategory === 'all' && !searchQuery && featuredPosts.length > 0 && (
          <section className="blog-featured">
            <FadeIn direction="up" delay={0.2}>
              <h2>Artículos Destacados</h2>
            </FadeIn>
            <div className="blog-featured__grid">
              {featuredPosts.map((post, index) => (
                <FadeIn key={post.id} direction="up" delay={0.3 + index * 0.1}>
                  <BlogCard post={post} featured />
                </FadeIn>
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        <section className="blog-posts">
          <FadeIn direction="up" delay={0.4}>
            <h2>
              {selectedCategory === 'all' ? 'Todos los Artículos' : 
               blogCategories.find(c => c.slug === selectedCategory)?.name}
            </h2>
          </FadeIn>

          {filteredPosts.length > 0 ? (
            <div className="blog-posts__grid">
              {filteredPosts.map((post, index) => (
                <FadeIn key={post.id} direction="up" delay={0.5 + index * 0.05}>
                  <BlogCard post={post} />
                </FadeIn>
              ))}
            </div>
          ) : (
            <div className="blog-posts__empty">
              <p>No se encontraron artículos</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
