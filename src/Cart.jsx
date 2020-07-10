import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useFetchAll from "./services/useFetchAll";
import Spinner from "./Spinner";

export default function Cart({ cart, setCart }) {
  // Using ref since not rendered, and need to avoid re-allocating on each render.
  const uniqueIdsInCart = [...new Set(cart.map((i) => i.id))];
  const requests = uniqueIdsInCart.map((id) => ({ url: `products/${id}` }));
  const [products, loading, error] = useFetchAll(requests);
  const navigate = useNavigate();

  function updateCart(id, size, quantity) {
    setCart((cart) => {
      return quantity === 0
        ? cart.filter((i) => i.id !== id || (i.id === id && i.size !== size))
        : cart.map((i) =>
            i.id === id && i.size === size ? { ...i, quantity } : i
          );
    });
  }

  function renderItem(itemInCart) {
    const { price, id, name, image } = products.find(
      (s) => s.id === itemInCart.id
    );
    return (
      <div key={id + itemInCart.size} className="cart-item">
        <img src={`/images/${image}`} alt={name} />
        <div>
          <h3>{name}</h3>
          <p>${price}</p>
          <p>Size: {itemInCart.size}</p>
          <p>
            <select
              aria-label={`Select quantity for ${name} size ${itemInCart.size}`}
              onChange={(e) =>
                updateCart(id, itemInCart.size, parseInt(e.target.value))
              }
              value={itemInCart.quantity}
            >
              <option value="0">Remove</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </p>
        </div>
      </div>
    );
  }

  const totalQuantity = cart.reduce((total, item) => {
    total = total + item.quantity;
    return total;
  }, 0);

  if (loading) return <Spinner />;
  if (error) throw error;

  return (
    <section id="cart">
      <h1>
        {cart.length === 0
          ? "Your cart is empty."
          : `${totalQuantity} Item${totalQuantity > 1 ? "s" : ""} in My Cart`}
      </h1>
      <p>
        <Link to="/shoes">Continue Shopping</Link>
      </p>
      {cart.map(renderItem)}
      {cart.length > 0 && (
        <button
          className="btn btn-primary"
          onClick={() => navigate("/checkout")}
        >
          Checkout
        </button>
      )}
    </section>
  );
}
