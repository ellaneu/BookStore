import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination';
import { fetchBooks } from '../api/BooksAPI';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  // State variables for book data, pagination, and sorting
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5); // Number of books per page
  const [pageNum, setPageNum] = useState<number>(1); // Current page number
  const [totalPages, setTotalPages] = useState<number>(0); // Total number of pages
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Sorting order: ascending or descending
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks(pageSize, pageNum, selectedCategories);

        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, [pageSize, pageNum, selectedCategories]);

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  
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
                <button
                  className="btn btn-success"
                  onClick={() =>
                    navigate(`/buy/${b.title}/${b.bookID}/${b.price}`)
                  }
                >
                  Buy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNum(1);
        }}
      />
    </div>
  );
}

export default BookList;
