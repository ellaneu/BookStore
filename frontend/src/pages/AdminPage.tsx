import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { Book } from "../types/Book";
import { deleteBook, fetchBooks } from "../api/BooksAPI";
import NewBookForm from "../components/NewBookForm";
import EditBookForm from "../components/EditBookForm";

function AdminPage() {

    const [books, setBooks] = useState<Book[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [showForm, setShowForm] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);

    useEffect(() => {
      const loadProjects = async () => {
        try {
          const data = await fetchBooks(pageSize, pageNum, []);
          setBooks(data.books);
          setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
        } catch (error) {
          setError((error as Error).message);
        } finally {
          setLoading(false);
        }
      };

      loadProjects();
    }, [pageSize, pageNum]);


    const handleDelete = async (bookId: number) => {
      const confirmDelete = window.confirm(
        'Are you sure you want to delete this project?'
      );
      if (!confirmDelete) return;

      try {
        await deleteBook(bookId);
        setBooks(books.filter((b) => b.bookID !== bookId));
      } catch (error) {
        alert('Failed to delete book. Please try again.');
      }
    };

    if (loading)
      return <p className="text-center text-muted">Loading projects...</p>;
    if (error)
      return <p className="text-center text-danger fw-bold">Error: {error}</p>;


    return (
      <div className="container mt-4">
        <h1 className="text-center mb-4">Admin - Boooks</h1>

        {!showForm && (
          <button
            className="btn btn-success mb-3"
            onClick={() => setShowForm(true)}
          >
            Add New Boook
          </button>
        )}

        {showForm && (
          <div className="card p-4 mb-3">
            <NewBookForm
              onSuccess={() => {
                setShowForm(false);
                fetchBooks(pageSize, pageNum, []).then((data) =>
                  setBooks(data.books)
                );
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {editingBook && (
          <EditBookForm
            book={editingBook}
            onSuccess={() => {
              setEditingBook(null);
              fetchBooks(pageSize, pageNum, []).then((data) =>
                setBooks(data.books)
              );
            }}
            onCancel={() => setEditingBook(null)}
          />
        )}

        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Publisher</th>
                <th>ISBN</th>
                <th>Classification</th>
                <th>Category</th>
                <th>Page Count</th>
                <th>Price</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b.bookID}>
                  <td>{b.bookID}</td>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>{b.publisher}</td>
                  <td>{b.isbn}</td>
                  <td>{b.classification}</td>
                  <td>{b.category}</td>
                  <td>{b.pageCount}</td>
                  <td>${b.price}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => setEditingBook(b)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(b.bookID)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default AdminPage;