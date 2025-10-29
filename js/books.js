// Sample book data with INR prices
let books = JSON.parse(localStorage.getItem('books')) || [
   
    {
        "id": 1,
        "title": "Introduction to Algorithms",
        "author": "Thomas H. Cormen",
        "course": "CS-301",
        "price": 450,
        "condition": "Like New",
        "type": "sell",
        "description": "Barely used. No highlights, underlines, or torn pages. Bought for Algorithm Analysis course.",
        "postedBy": "be.cs.2025@university.ac.in",
        "postedDate": "2024-02-10"
    },
    {
        "id": 2,
        "title": "Engineering Chemistry",
        "author": "Jain & Jain",
        "course": "UCH-102",
        "price": 300,
        "condition": "Good",
        "type": "exchange",
        "description": "Looking to exchange for 'Basic Electrical Engineering' by V.K. Mehta. Some notes in pencil, easily erasable.",
        "postedBy": "fe.chem.2026@university.ac.in",
        "postedDate": "2024-02-08"
    },
    {
        "id": 3,
        "title": "Basic Electrical Engineering",
        "author": "V.K. Mehta",
        "course": "BEE-101",
        "price": 150,
        "condition": "Fair",
        "type": "rent",
        "description": "Previous edition. Cover is slightly worn, but all pages intact. Rent for the semester.",
        "postedBy": "fe.ec.2026@university.ac.in",
        "postedDate": "2024-02-05"
    },
    {
        "id": 4,
        "title": "Higher Engineering Mathematics",
        "author": "B.S. Grewal",
        "course": "ASM-201",
        "price": 500,
        "condition": "Excellent",
        "type": "sell",
        "description": "No markings inside. Solved all previous year university problems from this book.",
        "postedBy": "be.mech.2025@university.ac.in",
        "postedDate": "2024-02-01"
    },
    {
        "id": 5,
        "title": "Let Us C",
        "author": "Yashavant Kanetkar",
        "course": "CSP-151",
        "price": 200,
        "condition": "Good",
        "type": "sell",
        "description": "Good condition for beginners. Perfect for first year C programming lab.",
        "postedBy": "fe.it.2027@university.ac.in",
        "postedDate": "2024-01-28"
    }
];

// Load books into the grid
function loadBooks(filteredBooks = null) {
    const booksGrid = document.getElementById('booksGrid');
    if (!booksGrid) return;
    
    booksGrid.innerHTML = '';
    
    const booksToDisplay = filteredBooks || books;
    
    if (booksToDisplay.length === 0) {
        booksGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 2rem;">No books found matching your search.</p>';
        return;
    }
    
    booksToDisplay.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        
        const typeIcon = book.type === 'sell' ? '💰' : book.type === 'exchange' ? '🔄' : '🏠';
        const typeText = book.type === 'sell' ? 'For Sale' : book.type === 'exchange' ? 'For Exchange' : 'For Rent';
        
        bookCard.innerHTML = `
            <div class="book-image">
                <span>📖</span>
            </div>
            <div class="book-details">
                <div class="book-title">${book.title}</div>
                <div class="book-info">by ${book.author}</div>
                <div class="book-info">Course: ${book.course}</div>
                <div class="book-price">${typeIcon} ₹${book.price.toLocaleString('en-IN')}</div>
                <div class="book-condition">${book.condition}</div>
                <div class="book-info"><small>${typeText}</small></div>
                <div class="book-actions">
                    <button class="btn btn-primary" onclick="viewBook(${book.id})">View Details</button>
                </div>
            </div>
        `;
        
        booksGrid.appendChild(bookCard);
    });
}

// Search books
function searchBooks() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        loadBooks();
        return;
    }
    
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.course.toLowerCase().includes(searchTerm) ||
        book.description.toLowerCase().includes(searchTerm)
    );
    
    loadBooks(filteredBooks);
}

// View book details
function viewBook(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        const typeText = book.type === 'sell' ? 'For Sale' : book.type === 'exchange' ? 'For Exchange' : 'For Rent';
        
        alert(`Book Details:\n\n` +
              `Title: ${book.title}\n` +
              `Author: ${book.author}\n` +
              `Course: ${book.course}\n` +
              `Edition: ${book.edition || 'Not specified'}\n` +
              `Price: ₹${book.price.toLocaleString('en-IN')}\n` +
              `Condition: ${book.condition}\n` +
              `Type: ${typeText}\n` +
              `Description: ${book.description}\n\n` +
              `Posted on: ${book.postedDate}`);
    }
}

// Handle book posting
function handleBookPost(e) {
    e.preventDefault();
    
    if (!isLoggedIn()) {
        alert('Please login to post a book.');
        window.location.href = 'login.html';
        return;
    }
    
    // Get form values
    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const course = document.getElementById('bookCourse').value;
    const edition = document.getElementById('bookEdition').value;
    const price = document.getElementById('bookPrice').value || 0;
    
    // Get selected exchange type
    const exchangeTypeElement = document.querySelector('.condition-options[data-type] .selected');
    const exchangeType = exchangeTypeElement ? exchangeTypeElement.getAttribute('data-value') : 'sell';
    
    // Get selected condition
    const conditionElement = document.querySelector('.condition-options:not([data-type]) .selected');
    const condition = conditionElement ? conditionElement.getAttribute('data-value') : 'good';
    
    const description = document.getElementById('bookDescription').value;
    
    // Validation
    if (!title || !author) {
        alert('Please fill in at least the title and author.');
        return;
    }
    
    // Create new book
    const newBook = {
        id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
        title: title,
        author: author,
        course: course,
        edition: edition,
        price: parseFloat(price),
        condition: condition.charAt(0).toUpperCase() + condition.slice(1),
        type: exchangeType,
        description: description,
        postedBy: currentUser.email,
        postedDate: new Date().toISOString().split('T')[0]
    };
    
    // Add to books array
    books.unshift(newBook);
    localStorage.setItem('books', JSON.stringify(books));
    
    // Reset form
    document.getElementById('bookForm').reset();
    
    // Reset condition options
    document.querySelectorAll('.condition-options .condition-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelectorAll('.condition-options .condition-option:first-child').forEach(option => {
        option.classList.add('selected');
    });
    
    // Show success message and redirect
    alert('Book posted successfully!');
    window.location.href = 'books.html';
}

// Setup condition options
function setupConditionOptions() {
    document.querySelectorAll('.condition-option').forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from siblings
            this.parentElement.querySelectorAll('.condition-option').forEach(sibling => {
                sibling.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            this.classList.add('selected');
        });
    });
}

// Initialize books in localStorage if not exists
if (!localStorage.getItem('books')) {
    localStorage.setItem('books', JSON.stringify(books));
}