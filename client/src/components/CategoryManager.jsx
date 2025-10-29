import React, { useState, useEffect, useRef } from 'react';
import { categoryService } from '@/services/categoryService';
import CategoryForm from '@/components/CategoryForm';
import CategoryCard from '@/components/CategoryCard';
import Button from '@/components/Button';

/**
 * CategoryManager component for managing blog categories.
 */
const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const CATEGORIES_PER_PAGE = 5;
    const listContainerRef = useRef(null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                setError(null);
                const fetchedData = await categoryService.getAllCategories();
                setCategories(fetchedData.categories || []);
            } catch (err) {
                setError(`Failed to load categories: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);

    const handleAddCategory = async (categoryData) => {
        try {
            setIsAdding(true);
            setError(null);
            const newCategory = await categoryService.createCategory(categoryData);
            setCategories((prev) => [newCategory, ...prev]);
        } catch (err) {
            setError(`Failed to add category: ${err.message}`);
        } finally {
            setIsAdding(false);
        }
    };

    const handleUpdateCategory = async (id, updates) => {
        try {
            setError(null);
            const updatedCategory = await categoryService.updateCategory(id, updates);
            setCategories((prev) => prev.map((cat) => (cat._id === id ? updatedCategory : cat)));
        } catch (err) {
            setError(`Failed to update category: ${err.message}`);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category? This might affect existing posts.')) return;
        try {
            setError(null);
            await categoryService.deleteCategory(id);
            setCategories((prev) => prev.filter((cat) => cat._id !== id));
        } catch (err) {
            setError(`Failed to delete category: ${err.message}`);
        }
    };

    // --- Pagination Logic ---
    const totalPages = Math.ceil(categories.length / CATEGORIES_PER_PAGE);
    const startIndex = (currentPage - 1) * CATEGORIES_PER_PAGE;
    const paginatedCategories = categories.slice(
        startIndex,
        startIndex + CATEGORIES_PER_PAGE
    );

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="max-w-4xl mx-auto p-4" id="categories">
            <h2 className="text-3xl font-bold text-center mb-8">Manage Categories</h2>
            <CategoryForm onSubmit={handleAddCategory} isSubmitting={isAdding} />

            {loading && <p className="text-center">Loading categories...</p>}
            {error && <p className="text-center text-red-600 font-medium bg-red-100 p-2 rounded-md">{error}</p>}

            <div ref={listContainerRef} className="space-y-4 min-h-[10rem]">
                {!loading && paginatedCategories.map((cat) => (
                    <CategoryCard key={cat._id} category={cat} onUpdate={handleUpdateCategory} onDelete={handleDeleteCategory} />
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-8">
                    <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        Previous
                    </Button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CategoryManager;