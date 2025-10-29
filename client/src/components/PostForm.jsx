import { useState } from 'react';
import Button from '@/components/Button';

export default function PostForm({ onSubmit, categories = [], isSubmitting = false }) {
    const [form, setForm] = useState({
        title: '',
        content: '',
        category: '',
        status: 'draft',
        featuredImage: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    const handleFileChange = (e) => {
        setForm(prev => ({
            ...prev,
            featuredImage: e.target.files[0]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title) {
            return;
        }

        onSubmit(form);
        setForm({ title: '', content: '', category: '', status: 'draft', featuredImage: '' });
    }; 

    return (
        <form onSubmit={handleSubmit} className="rounded-2xl p-6 shadow-xl flex flex-col gap-4 mb-6">
            <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter post title"
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500"
                required
            />
            <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Enter post content"
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 h-40 placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
                type="file"
                name="featuredImage"
                onChange={handleFileChange}
                className="border border-gray-300 dark:border-gray-600 dark:text-gray-400 rounded-lg p-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="border border-gray-300 dark:border-gray-600 dark:text-gray-400 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
                required
            >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
            </select>
            <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="border border-gray-300 dark:border-gray-600 dark:text-gray-400 rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
            </select>
            <Button
                type="submit"
                variant="success"
                className="w-full"
                disabled={isSubmitting || !form.title}>
                {isSubmitting ? 'Adding...' : 'Add Post'}
            </Button>
        </form>
    );
}