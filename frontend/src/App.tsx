
import './App.css'
import BooksPage from './pages/BooksPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BuyPage from './pages/BuyPage';
import CartPage from './pages/CartPage';
import { CartProvider } from './context/CartContext';
import AdminPage from './pages/AdminPage';


function App() {

  return (
    <>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<BooksPage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/buy/:title/:bookID/:price" element={<BuyPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/adminpage" element={<AdminPage/>}/>
          </Routes>
        </Router>
      </CartProvider>
    </>
  );
}

export default App
