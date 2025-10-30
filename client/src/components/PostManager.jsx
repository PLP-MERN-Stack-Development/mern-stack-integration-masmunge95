import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import PostForm from '@/components/PostForm';
import PostCard from '@/components/PostCard';
import { postService } from '@/services/postService';
import { categoryService } from '@/services/categoryService';
import Button from '@/components/Button';
import { useSmoothScroll } from '../hooks/UseSmoothScroll';

/**
 * PostManager component for managing blog posts.
 */
const PostManager = () => {
  const [posts, setPosts] = useState([]);
  const { getToken } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isAddingPost, setIsAddingPost] = useState(false);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const scrollToTop = useSmoothScroll();
  // Refs for scrolling behavior
  const postManagerRef = useRef(null);
  const filterButtonsRef = useRef(null);
  const listContainerRef = useRef(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 5;

  // Fetch posts and categories from the API on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        const [postsData, categoriesData] = await Promise.all([
          postService.getAllPosts(),
          categoryService.getAllCategories(),      // Public call, no auth needed
        ]);
        setPosts(postsData.posts || []);
        setCategories(categoriesData.categories || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [getToken]);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const handleAddPost = async (postData) => {
    try {
      setIsAddingPost(true);
      setError(null); // Clear previous errors
      
      const formData = new FormData();
      formData.append('title', postData.title);
      formData.append('content', postData.content);
      formData.append('category', postData.category);
      formData.append('status', postData.status);
      if (postData.featuredImage) {
        formData.append('image', postData.featuredImage);
      }

      const newPost = await postService.createPost(formData);
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    } catch (err) {
      console.error("Error adding post:", err);
      setError(`Failed to add post: ${err.message}`);
    } finally {
      setIsAddingPost(false);
    }
  };

  const handleUpdatePost = async (id, updates) => {
    // Find the original post to get its current image path
    const originalPost = posts.find(p => p._id === id);
    const originalPosts = [...posts];
    setError(null); // Clear previous errors
  
    try {
      let imageUrl = originalPost.image; // Default to the existing image
      const postUpdateData = { ...updates }; // Create a mutable copy of the updates
  
      // Step 1: If a new image file is included in the updates, upload it first.
      if (updates.featuredImage && updates.featuredImage instanceof File) {
        const imageFormData = new FormData();
        imageFormData.append('image', updates.featuredImage);
  
        // Use the dedicated upload endpoint
        console.log('[PostManager] Uploading new image...');
        const uploadResponse = await postService.uploadImage(imageFormData);
        console.log('[PostManager] Image upload response:', uploadResponse);
        postUpdateData.image = uploadResponse.filePath; // Set the new image path for the final update
      }
  
      // The 'featuredImage' property is a client-side file object and should not be sent to the backend.
      delete postUpdateData.featuredImage;
  
      // Optimistically update the UI
      setPosts(posts.map(p => p._id === id ? { ...p, ...postUpdateData } : p));
  
      // Step 3: Send the final update request with JSON data.
      await postService.updatePost(id, postUpdateData);
    } catch (err) {
      console.error("Error updating post:", err);
      setError(`Failed to update post. Reverting changes: ${err.message}`);
      setPosts(originalPosts); // Revert on error
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    const originalPosts = [...posts];
    setPosts(posts.filter((post) => post._id !== id)); 
    try {
      setError(null); // Clear previous errors
      await postService.deletePost(id);
    } catch (err) {
      console.error("Error deleting post:", err);
      setError(`Failed to delete post: ${err.message}`);
      setPosts(originalPosts); // Revert on error
    }
  };

  const handlePageChange = (newPage) => {
    if (filterButtonsRef.current) {
      const buttonsTop = filterButtonsRef.current.getBoundingClientRect().top;
      const header = document.querySelector('header'); // Find the fixed header
      const headerHeight = header ? header.offsetHeight : 0;

      // Only scroll if the filter buttons are scrolled past the bottom of the header
      if (buttonsTop < headerHeight) {
        setIsTransitioning(true);
        scrollToTop(filterButtonsRef.current, 1500, () => {
          setCurrentPage(newPage);
          setIsTransitioning(false);
        }, headerHeight); // Pass header height as an offset
        return;
      }
    }
    // If no scroll is needed, just change the page.
    setCurrentPage(newPage);
  };


  const filteredPosts = posts.filter((post) => {
    if (filter === 'draft') return post.status === 'draft';
    if (filter === 'published') return post.status === 'published';
    if (filter === 'archived') return post.status === 'archived';
    return true;
  });

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + POSTS_PER_PAGE
  );

  return (
    <div className="max-w-4xl mx-auto p-4" ref={postManagerRef} id="posts">
      <h1 className="text-3xl font-bold text-center mb-4">Post Manager</h1>
      <p className="text-center mb-12">
        Manage your blog posts efficiently.
        To get started, add a new post using the form below.
        You can easily edit your current posts, update their status, or delete them as needed.
        Enjoy!
      </p>
      <h2 className="text-3xl font-bold text-center mb-8">My Posts</h2>
      <PostForm onSubmit={handleAddPost} categories={categories} isSubmitting={isAddingPost} />

      <div ref={filterButtonsRef} className="flex justify-center gap-2 mb-12">
        {['all', 'draft', 'published', 'archived'].map((f) => (
          <Button key={f} size="sm" variant={filter === f ? 'primary' : 'secondary'} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {loading && <p className="text-center">Loading posts...</p>}
      {error && <p className="text-center text-red-600 font-medium bg-red-100 p-2 rounded-md">{error}</p>}

      <ul ref={listContainerRef} className="space-y-2 min-h-[10rem] flex flex-col justify-center">
        {!loading && !isTransitioning && filteredPosts.length === 0 ? (
          <p className="text-center text-gray-500 mb-8">
            {{
              all: 'A clean slate — dangerously full of potential. What’s the first move? 🤔',
              draft: 'No drafts here. Time to start writing!',
              published: 'No published posts yet. Get writing and share your thoughts!',
              archived: 'Nothing in the archives.',
            }[filter]}
          </p>
        ) : (
          !loading && paginatedPosts.map((post) => (
            <PostCard key={post._id} post={post} categories={categories} onUpdate={handleUpdatePost} onDelete={handleDeletePost} />
          ))
        )}
      </ul>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-8">
          <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || isTransitioning}>
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || isTransitioning}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostManager; 