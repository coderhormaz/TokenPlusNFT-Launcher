import React from 'react';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Canvas from './pages/Canvas';
import CreateToken from './pages/createtoken';
import MyCollection from './pages/MyCollection';
import theme from './theme';

function getLibrary(provider: any) {
  return new ethers.providers.Web3Provider(provider);
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <Web3ReactProvider getLibrary={getLibrary}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/canvas" element={<Canvas />} />
            <Route path="/createtoken" element={<CreateToken />} />
            <Route path="/collection" element={<MyCollection />} />
          </Routes>
        </Router>
      </Web3ReactProvider>
      </ChakraProvider>
  );
}

export default App; 