import React from 'react';
import { blogPosts } from '../utils/blogPosts';
import { useLanguage } from '../context/LanguageContext';

interface BlogPostProps {
  postId: string;
  onGoBack: () => void;
}

const BlogPost: React.FC<BlogPostProps> = ({ postId, onGoBack }) => {
  const { t } = useLanguage();
  const post = blogPosts.find(p => p.id === postId);

  if (!post) {
    return (
      <div className="w-full max-w-3xl mx-auto text-center">
        <p>Post not found.</p>
        <button onClick={onGoBack} className="mt-4 text-[var(--color-accent-primary)] hover:underline">
          {t('blog.backToBlog')}
        </button>
      </div>
    );
  }
  
  const contentParagraphs = t(post.contentKey).split('\n\n');

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in p-4 md:p-0">
       <button
        onClick={onGoBack}
        className="flex items-center gap-1 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)] focus:ring-[var(--color-accent-primary)] rounded-lg px-3 py-1 text-sm mb-6"
      >
        <svg xmlns="http://www.w.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {t('blog.backToBlog')}
      </button>
      <article className="bg-[var(--color-bg-secondary)] p-6 md:p-8 rounded-xl shadow-lg">
        <header>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] leading-tight">{t(post.titleKey)}</h1>
            <p className="mt-2 text-sm text-[var(--color-text-tertiary)]">
                By {post.author} on {post.date}
            </p>
        </header>
        <div className="mt-6 border-t border-[var(--color-bg-tertiary)] pt-6 text-[var(--color-text-secondary)] leading-relaxed space-y-4">
            {contentParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
