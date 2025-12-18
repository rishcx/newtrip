import React from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import { blogs, getBlogsByCategory } from '../blogs';
import { BookOpen, Filter, ArrowLeft } from 'lucide-react';

const TrippyTalesPage = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const categories = ['all', ...new Set(blogs.map(blog => blog.category))];

  const filteredBlogs = selectedCategory === 'all' 
    ? blogs 
    : getBlogsByCategory(selectedCategory);

  const sortedBlogs = [...filteredBlogs].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="min-h-screen bg-black/60 backdrop-blur-sm">
      {/* Header Banner */}
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-rose-500/20 backdrop-blur-sm border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-white">
                  <span className="trippy-text">Trippy Tales</span>
                </h1>
                <p className="text-gray-300 mt-1">Stories, insights, and cosmic wisdom</p>
              </div>
            </div>
            <Link
              to="/"
              className="flex items-center space-x-2 px-4 py-2 bg-zinc-900/50 hover:bg-zinc-800 text-white rounded-full transition-colors border border-zinc-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 mt-12">
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

export default TrippyTalesPage;

