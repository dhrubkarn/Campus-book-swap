// Common utility functions

// Format price in INR
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Get user's posted books
function getUserBooks() {
    if (!currentUser) return [];
    return books.filter(book => book.postedBy === currentUser.email);
}

// Delete book (only if user owns it)
function deleteBook(bookId) {
    if (!currentUser) return false;
    
    const bookIndex = books.findIndex(book => book.id === bookId && book.postedBy === currentUser.email);
    
    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        localStorage.setItem('books', JSON.stringify(books));
        return true;
    }
    
    return false;
}

// Update book
function updateBook(bookId, updatedData) {
    if (!currentUser) return false;
    
    const bookIndex = books.findIndex(book => book.id === bookId && book.postedBy === currentUser.email);
    
    if (bookIndex !== -1) {
        books[bookIndex] = { ...books[bookIndex], ...updatedData };
        localStorage.setItem('books', JSON.stringify(books));
        return true;
    }
    
    return false;
}

// Add search debouncing
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchBooks, 300));
    }
    
    // Initialize auth state on every page
    if (typeof initializeAuth === 'function') {
        initializeAuth();
    }
});

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatPrice,
        formatDate,
        isValidEmail,
        getUserBooks,
        deleteBook,
        updateBook
    };
}