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
        public IActionResult Get(int pageSize = 5, int pageNum = 1)
        {
            var bookList = _bookContext.Books
                .Skip((pageNum - 1) * pageSize)   
                .Take(pageSize)
                .ToList();
            
            var totalNumBooks = _bookContext.Books.Count();

            return Ok(new
            {
                Books = bookList,
                TotalNumBooks = totalNumBooks
            });
        }
    
    }
}









