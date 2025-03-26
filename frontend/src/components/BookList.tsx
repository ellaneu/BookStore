import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  // State variables for book data, pagination, and sorting
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5); // Number of books per page
  const [pageNum, setPageNum] = useState<number>(1); // Current page number
  const [totalItems, setTotalItems] = useState<number>(0); // Total number of books
  const [totalPages, setTotalPages] = useState<number>(0); // Total number of pages
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Sorting order: ascending or descending
  const navigate = useNavigate();

  // Fetch book data whenever pagination or total items change
  useEffect(() => {
    const fetchBook = async () => {
      const categoryParams = selectedCategories
        .map((cat) => `category=${encodeURIComponent(cat)}`)
        .join('&');
      try {
        const response = await fetch(
          `https://localhost:5000/Book?pageSize=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ''}`
        );
        const data = await response.json();
        setBooks(data.books);
        setTotalItems(data.totalNumBooks);
        setTotalPages(Math.ceil(totalItems / pageSize));
      } catch (error) {
        console.error('Error fetching book data:', error);
      }
    };
    fetchBook();
  }, [pageSize, pageNum, totalItems, selectedCategories]);

  // Toggle sorting order between ascending and descending
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Sort books based on the selected sorting order
  const sortedBooks = [...books].sort((a, b) => {
    return sortOrder === 'asc'
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title);
  });

  return (
    <div className="container mt-4">
      {/* Sort Button */}
      <button className="btn btn-primary mb-3" onClick={toggleSortOrder}>
        Sort by Title ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
      </button>

      {/* Book Cards */}
      <div className="row">
        {sortedBooks.map((b) => (
          <div key={b.bookID} className="col-md-4">
            <div className="card mb-3 shadow-sm border-primary">
              <div className="card-body">
                {/* Book Title */}
                <h5 className="card-title text-primary">{b.title}</h5>
                {/* Book Details */}
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Author:</strong> {b.author}
                  </li>
                  <li className="list-group-item">
                    <strong>Publisher:</strong> {b.publisher}
                  </li>
                  <li className="list-group-item">
                    <strong>ISBN:</strong> {b.isbn}
                  </li>
                  <li className="list-group-item">
                    <strong>Classification:</strong> {b.classification}
                  </li>
                  <li className="list-group-item">
                    <strong>Category:</strong> {b.category}
                  </li>
                  <li className="list-group-item">
                    <strong>Page Count:</strong> {b.pageCount}
                  </li>
                  <li className="list-group-item">
                    <strong>Price:</strong> ${b.price}
                  </li>
                </ul>
                <button className='btn btn-success' onClick={() => navigate(`/buy/${b.title}/${b.bookID}/${b.price}`)}>Buy</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center mt-3">
        <div className="btn-group">
          {/* Previous Button */}
          <button
            className="btn btn-outline-secondary"
            disabled={pageNum === 1}
            onClick={() => setPageNum(pageNum - 1)}
          >
            Previous
          </button>

          {/* Page Number Buttons */}
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`btn ${pageNum === index + 1 ? 'btn-secondary' : 'btn-outline-secondary'}`}
              onClick={() => setPageNum(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          {/* Next Button */}
          <button
            className="btn btn-outline-secondary"
            disabled={pageNum === totalPages}
            onClick={() => setPageNum(pageNum + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Results per Page Selector */}
      <div className="mt-3">
        <label className="form-label">Results per page:</label>
        <select
          className="form-select"
          value={pageSize}
          onChange={(b) => {
            setPageSize(Number(b.target.value));
            setPageNum(1); // Reset to first page when changing page size
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  );
}

export default BookList;
