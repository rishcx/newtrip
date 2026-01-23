import React, { useState } from 'react';
import BlogCard from '../components/BlogCard';
import { blogs, getBlogsByCategory } from '../blogs';
import { BookOpen, Filter } from 'lucide-react';

const TrippyTales = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(blogs.map(blog => blog.category))];

  const filteredBlogs = selectedCategory === 'all' 
    ? blogs 
    : getBlogsByCategory(selectedCategory);

  const sortedBlogs = [...filteredBlogs].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="min-h-screen pt-20 bg-black/60 backdrop-blur-sm">
      {/* Header */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-6 inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 backdrop-blur-sm">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">Trippy Tales</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-4">
            <span className="trippy-text">Trippy</span> Tales
          </h1>
          <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Dive into stories, insights, and cosmic wisdom from the world of psychedelic streetwear. 
            Where fashion meets consciousness, and style becomes art.
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-amber-400" />
            <span className="text-white font-medium mr-2">Category:</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-amber-500 via-pink-500 to-rose-500 text-white shadow-[0_0_20px_rgba(251,191,36,0.5)]'
                      : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="text-gray-400 text-sm">
            {filteredBlogs.length} article{filteredBlogs.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {sortedBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">No articles found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrippyTales;


