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
    
    }
}









