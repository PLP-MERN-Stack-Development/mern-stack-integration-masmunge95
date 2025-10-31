import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '@/services/postService';
import { categoryService } from '@/services/categoryService';
import { getFullImageUrl } from '@/services/api';

const PublicPostCard = ({ post }) => {
  const imageUrl = getFullImageUrl(post.featuredImage);
  return (
    <Link to={`/posts/${post.slug || post._id}`} className="block p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      {imageUrl && <img src={imageUrl} alt={post.title} className="w-full h-48 object-cover rounded-md mb-4" />}
      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">By {post.author} on {new Date(post.createdAt).toLocaleDateString()}</p>
      <p className="text-gray-600 dark:text-gray-400">{post.excerpt}</p>
    </Link>
  );
};

export default function PublicPostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tagSearch, setTagSearch] = useState('');

  useEffect(() => {
    const fetchPublishedPosts = async () => {
      try {
        setLoading(true);
        // Fetch both posts and categories
        const [postData, categoryData] = await Promise.all([
          postService.getAllPosts(1, 100, selectedCategory, tagSearch), // Fetch a large number for client-side filtering
          categoryService.getAllCategories(),
        ]);
        const data = postData;
        const publishedPosts = data.posts.filter(p => p.status === 'published');
        setPosts(publishedPosts);
        setCategories(categoryData.categories || []);
      } catch (err) {
        setError('Failed to load posts. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublishedPosts(); // Refetch when filters change
  }, [selectedCategory, tagSearch]);

  if (loading) return <p className="text-center p-12">Loading posts...</p>;
  if (error) return <p className="text-center p-12 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Latest Posts</h1>
      
      {/* Filter and Search Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 rounded-lg shadow-md">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 bg-transparent rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 flex-1"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <input
          type="text"
          value={tagSearch}
          onChange={(e) => setTagSearch(e.target.value)}
          placeholder="Search by tag..."
          className="border border-gray-300 dark:border-gray-600 bg-transparent rounded-lg p-2 placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500 flex-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.length > 0 ? posts.map(post => (
          <PublicPostCard key={post._id} post={post} />
        )) : <p className="col-span-full text-center text-gray-500">No published posts yet. Check back soon!</p>}
      </div>
    </div>
  );
}