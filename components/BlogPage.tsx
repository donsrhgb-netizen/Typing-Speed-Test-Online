import React from 'react';
import { blogPosts } from '../utils/blogPosts';
import { useLanguage } from '../context/LanguageContext';

interface BlogPageProps {
  onSelectPost: (postId: string) => void;
}

const BlogCard: React.FC<{ title: string; summary: string; date: string; onClick: () => void }> = ({ title, summary, date, onClick }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg shadow-lg hover:shadow-[var(--color-shadow-primary)] transition-shadow duration-300 flex flex-col justify-between text-left">
      <div>
        <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">{title}</h3>
        <p className="text-sm text-[var(--color-text-tertiary)] mb-3">{date}</p>
        <p className="text-[var(--color-text-secondary)]">{summary}</p>
      </div>
      <button
        onClick={onClick}
        className="mt-6 text-left font-semibold text-[var(--color-accent-primary)] hover:text-[var(--color-accent-secondary)] transition-colors"
      >
        {t('blog.readMore')}
      </button>
    </div>
  );
};

const BlogPage: React.FC<BlogPageProps> = ({ onSelectPost }) => {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-5xl mx-auto text-center animate-fade-in flex flex-col items-center">
      <header className="w-full mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-accent-primary)] text-center">
          {t('blog.title')}
        </h1>
        <p className="text-center text-[var(--color-text-secondary)] mt-2">
          {t('blog.subtitle')}
        </p>
      </header>
      
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {blogPosts.map((post) => (
          <BlogCard
            key={post.id}
            title={t(post.titleKey)}
            summary={t(post.summaryKey)}
            date={post.date}
            onClick={() => onSelectPost(post.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
