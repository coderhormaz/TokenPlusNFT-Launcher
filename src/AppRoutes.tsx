import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Canvas from './pages/Canvas';
import MyCollection from './pages/MyCollection';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/canvas" element={<Canvas />} />
      <Route path="/collection" element={<MyCollection />} />
    </Routes>
  );
};

export default AppRoutes; 