import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CartItem } from "../types/CartItem";

function CartPage() {

    const navigate = useNavigate();
    const { cart, removeFromCart } = useCart();

    const total = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    return (
      <div className="container mt-5">
        <h2 className="text-center mb-4">Your Cart</h2>
        <div className="card shadow-sm">
          <div className="card-body">
            {cart.length === 0 ? (
              <p className="text-center">Your cart is empty.</p>
            ) : (
              <ul className="list-group list-group-flush">
                {cart.map((item: CartItem) => (
                  <li
                    key={item.bookID}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{item.title}</strong>
                      <br />${(item.price * item.quantity).toFixed(2)}
                      <br />
                      Quantity: {item.quantity}
                    </div>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFromCart(item.bookID)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="text-center mt-4">
          <h3>Total: ${total.toFixed(2)}</h3>
          <div className="mt-3">
            <button className="btn btn-primary btn-lg mx-2">Checkout</button>
            <button
              className="btn btn-secondary btn-lg mx-2"
              onClick={() => navigate('/books')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
        
      </div>
    );
}

export default CartPage;
