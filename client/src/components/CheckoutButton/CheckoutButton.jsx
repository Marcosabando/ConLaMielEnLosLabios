import React, { useContext, useEffect } from 'react';
import { CartContext } from '../../context/CartContextProvider';
import { UserContext } from '../../context/UserContext';

export const CheckoutButton = () => {
  const { cart } = useContext(CartContext);
  const { token } = useContext(UserContext);

  useEffect(() => {
    // Guardar carrito en localStorage
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const handleCheckout = async () => {
    try {
      const formattedCart = cart.map((item) => ({
        title: item.title,
        sponsorship_type_id: item.sponsorship_type_id,
        price: parseFloat(item.price), // Convierte el precio a número
        quantity: item.quantity,
        isSubscription: item.isSubscription || false,
      }));

      const response = await fetch('http://localhost:4000/payment/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: formattedCart,
          email: 'cliente@email.com',
          type: 'cart',
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error: No se recibió URL de pago');
      }
    } catch (error) {
      console.error('Error en checkout:', error);
      alert(error.message || 'Error al procesar el pago');
    }
  };

  return <button onClick={handleCheckout}>Finalizar compra</button>;
};
