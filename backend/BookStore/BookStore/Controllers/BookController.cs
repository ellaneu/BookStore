using BookStore.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookStore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    
    public class BookController : ControllerBase
    {
        private BookDbContext _bookContext;
        
        public BookController(BookDbContext temp)
        {
            _bookContext = temp;
        }
        
        [HttpGet(Name = "GetBooks")]
        public IActionResult Get(int pageSize = 5, int pageNum = 1, [FromQuery] List<string>? category = null)
        {
            var query = _bookContext.Books.AsQueryable();

            if (category != null && category.Any())
            {
                query = query.Where(b => category.Contains(b.Category));
            }
            
            var totalNumBooks = query.Count();
            
            var bookList = query
                .Skip((pageNum - 1) * pageSize)   
                .Take(pageSize)
                .ToList();

            return Ok(new
            {
                Books = bookList,
                TotalNumBooks = totalNumBooks
            });
        }

        [HttpGet("GetBookTypes")]
        public IActionResult GetBookTypes()
        {
            var bookTypes = _bookContext.Books.Select(b => b.Category).Distinct().ToList();
            
            return Ok(bookTypes);
            
        }
        
        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book newBook)
        {
            _bookContext.Books.Add(newBook);
            _bookContext.SaveChanges();
            return Ok(newBook);
        }
        
        [HttpPut("UpdateBook/{bookId}")]
        public IActionResult UpdateBook(int bookId, [FromBody] Book updatedBook)
        {
            var existingBook = _bookContext.Books.Find(bookId);
        
            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;
            
        
            _bookContext.Books.Update(existingBook);
            _bookContext.SaveChanges();
        
            return Ok(updatedBook);
        }
        
        [HttpDelete("DeleteBook/{bookId}")]
        public IActionResult DeleteBook(int bookId)
        {
            var book = _bookContext.Books.Find(bookId);

            if (book == null)
            {
                return NotFound(new { message = "Book not found." });
            }
        
            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();

            return NoContent();
        }
    
    }
}









