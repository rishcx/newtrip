import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogById, getRecentBlogs } from '../blogs';
import BlogCard from '../components/BlogCard';
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const BlogDetail = () => {
  const { id } = useParams();
  const blog = getBlogById(id);
  const recentBlogs = getRecentBlogs(3).filter(b => b.id !== id);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Blog link copied to clipboard",
      });
    }
  };

  if (!blog) {
    return (
      <div className="min-h-screen pt-20 bg-black/60 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-2xl mb-4">Blog post not found</p>
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 via-pink-500 to-rose-500 text-white font-bold rounded-full hover:scale-105 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Trippy Tales</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-black/60 backdrop-blur-sm">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-2 text-sm">
          <Link to="/" className="text-gray-400 hover:text-amber-400 transition-colors">Home</Link>
          <span className="text-gray-600">/</span>
          <Link to="/blog" className="text-gray-400 hover:text-amber-400 transition-colors">Trippy Tales</Link>
          <span className="text-gray-600">/</span>
          <span className="text-white truncate max-w-xs">{blog.title}</span>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        
        {/* Category Badge */}
        <div className="absolute top-8 left-8">
          <span className="px-4 py-2 bg-black/70 backdrop-blur-sm text-amber-400 text-sm font-bold rounded-full border border-amber-500/30">
            {blog.category.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            {blog.title}
          </h1>
          
          {/* Meta Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-zinc-800">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(blog.date)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{blog.readTime}</span>
              </div>
              <span className="text-amber-400 font-medium">By {blog.author}</span>
            </div>
            
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-zinc-800/50 text-gray-300 text-sm rounded-full border border-zinc-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div 
          className="prose prose-invert prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Back Button */}
        <div className="mt-12 pt-8 border-t border-zinc-800">
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 via-pink-500 to-rose-500 text-white font-bold rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Trippy Tales</span>
          </Link>
        </div>
      </article>

      {/* Related Articles */}
      {recentBlogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-zinc-800">
          <h2 className="text-4xl font-black text-white mb-8 text-center">
            More <span className="trippy-text">Trippy Tales</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentBlogs.map((relatedBlog) => (
              <BlogCard key={relatedBlog.id} blog={relatedBlog} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogDetail;


