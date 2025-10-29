import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api, { getFullImageUrl } from '@/services/api';
import { postService } from '@/services/postService';

/**
 * A page component to display a single blog post.
 */
export default function PostPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const data = await postService.getPost(id);
                setPost(data);
            } catch (err) {
                setError('Failed to load the post. It might not exist or there was a network issue.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) {
        return <div className="text-center p-12">Loading post...</div>;
    }

    if (error) {
        return <div className="text-center p-12 text-red-500">{error}</div>;
    }

    if (!post) {
        return <div className="text-center p-12">Post not found.</div>;
    }

    return (
        <article className="max-w-4xl mx-auto p-8  rounded-lg shadow-xl">
            {post.featuredImage && post.featuredImage !== 'default-post.jpg' && (
                <img src={getFullImageUrl(post.featuredImage)} alt={post.title} className="w-full h-auto max-h-96 object-cover rounded-lg mb-6" />
            )}
            <h1 className="text-4xl font-extrabold mb-4 ">{post.title}</h1>
            <div className="prose dark:prose-invert max-w-none text-lg" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
            <Link to="/" className="inline-block mt-8 text-blue-600 hover:underline">&larr; Back to Dashboard</Link>
        </article>
    );
}