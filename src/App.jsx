import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { OrderList } from './components/orders/OrderList';
import { OrderDetails } from './components/orders/OrderDetails';

function App() {
  return (
    <Routes>
      <Route path="/order" element={<OrderList />} />
      <Route path="/order/:id" element={<OrderDetails />} /> {/* Expecting :id */}
    </Routes>
  );
}

export default App;
