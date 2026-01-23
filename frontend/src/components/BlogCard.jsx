import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const BlogCard = ({ blog }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <Link
      to={`/blog/${blog.id}`}
      className="group relative bg-zinc-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-zinc-800 hover:border-amber-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(251,191,36,0.3)]"
    >
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          style={{ willChange: 'transform', transform: 'translateZ(0)' }}
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-black/70 backdrop-blur-sm text-amber-400 text-xs font-bold rounded-full border border-amber-500/30">
            {blog.category.toUpperCase()}
          </span>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors line-clamp-2">
          {blog.title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
          {blog.excerpt}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(blog.date)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{blog.readTime}</span>
            </div>
          </div>
          <span className="text-amber-400 font-medium">{blog.author}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-zinc-800/50 text-gray-400 text-xs rounded-full border border-zinc-700"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Read More */}
        <div className="flex items-center text-amber-400 font-medium group-hover:text-amber-300 transition-colors">
          <span className="text-sm">Read More</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-pink-500 to-rose-500"></div>
      </div>
    </Link>
  );
};

export default BlogCard;


