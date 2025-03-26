import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';
import { useState } from 'react';

function BuyPage() {
  const navigate = useNavigate();
  const { title, bookID, price } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddtoCart = () => {
    const newItem: CartItem = {
      bookID: Number(bookID),
      title: title || 'No book found',
      quantity,
      price: Number(price),
    };
    addToCart(newItem);
    navigate('/cart');
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">
        <strong>Book:</strong> {title}
      </h2>
      <h3 className="text-center mb-4">
        <strong>Price:</strong> ${price}
      </h3>

      <div className="mb-4">
        <label className="form-label">
          <h3>
            <strong>Quantity:</strong>
          </h3>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(x) => setQuantity(Number(x.target.value))}
            className="form-control"
          />
        </label>
      </div>

      <div className="d-flex justify-content-center mt-3">
        <button
          onClick={handleAddtoCart}
          className="btn btn-primary btn-lg mx-2"
        >
          Add to Cart
        </button>
      </div>

      <div className="d-flex justify-content-center mt-3">
        <button
          onClick={() => navigate('/books')}
          className="btn btn-secondary btn-lg mx-2"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default BuyPage;
