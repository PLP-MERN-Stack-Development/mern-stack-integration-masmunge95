import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import { Link } from 'react-router-dom';

export default function PostCard({ post, categories = [], onUpdate, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState({ ...post });

    // When the post prop changes, reset the draft state to prevent stale data
    useEffect(() => {
        setDraft({ ...post });
    }, [post]);

    const handleEditClick = () => {
        // Reset draft to current post state when starting to edit
        // This ensures any changes from other cards don't leak over
        setDraft({ ...post });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleSave = (e) => {
        e.preventDefault();
        onUpdate(post._id, draft);
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDraft(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setDraft({ ...draft, featuredImage: e.target.files[0] });
    };

    return (
        <div className="rounded-lg shadow-md p-6">
            {!isEditing ? (
                <div className="flex flex-col justify-between h-full gap-4">
                    <div className="flex-grow">
                        <div className="flex justify-between items-start">
                            <Link to={`/posts/${post._id}`}>
                                <h3 className="text-lg font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    {post.title}
                                </h3>
                            </Link>
                            <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
                               { draft: 'bg-blue-600', published: 'bg-green-600', archived: 'bg-gray-500' }[post.status] || 'bg-gray-400'
                            } text-white`}>
                                {post.status}
                            </span>
                        </div>
                        {post.featuredImage && <img src={post.featuredImage} alt={post.title} className="mt-4 w-full h-48 object-cover rounded-md" />}
                        {post.content && <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{post.content}</p>}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {post.status !== 'published' && <Button onClick={() => onUpdate(post._id, { status: 'published' })} variant="success" size="sm">Publish</Button>}
                        {post.status !== 'draft' && <Button onClick={() => onUpdate(post._id, { status: 'draft' })} variant="primary" size="sm">Set to Draft</Button>}
                        {post.status !== 'archived' && <Button onClick={() => onUpdate(post._id, { status: 'archived' })} variant="warning" size="sm">Archive</Button>}
                        <Button onClick={handleEditClick} variant="secondary" size="sm">
                            Edit
                        </Button>
                        <Button onClick={() => onDelete(post._id)} variant="danger" size="sm">
                            Delete
                        </Button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSave} className="flex flex-col gap-4">
                    <input
                        name="title"
                        className="border border-gray-300 dark:border-gray-600 bg-transparent rounded-lg p-2 placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500"
                        value={draft.title}
                        onChange={handleInputChange}
                        placeholder="Enter post title"
                        required
                    />
                    <textarea
                        name="content"
                        className="border border-gray-300 dark:border-gray-600 bg-transparent rounded-lg p-2 placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500"
                        value={draft.content}
                        onChange={handleInputChange}
                        placeholder="Enter post content"
                    />
                    <input
                        type="file"
                        name="featuredImage"
                        onChange={handleFileChange}
                        className="border border-gray-300 dark:border-gray-600 bg-transparent rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <select
                        name="category"
                        className="border border-gray-300 dark:border-gray-600 bg-transparent rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                        value={draft.category}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                    <select name="status" value={draft.status || post.status} onChange={handleInputChange} className="border border-gray-300 dark:border-gray-600 bg-transparent rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                    </select>
                    <div className="flex gap-2">
                        <Button type="submit" variant="success" size="sm">
                            Save
                        </Button>
                        <Button type="button" onClick={handleCancel} variant="secondary" size="sm">
                            Cancel
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}