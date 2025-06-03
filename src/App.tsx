import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import { BackgroundProvider } from './components/BackgroundContext';
import AgentPage from './pages/AgentPage';

function App() {
  return (
    <BackgroundProvider>
      <BrowserRouter>
       <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="agent/:agentId" element={<AgentPage />} /> {/* <-- agregá esto */}
      </Route>
    </Routes>

      </BrowserRouter>
    </BackgroundProvider>
  );
}
export default App;
