import { Routes, Route } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import ChatPage from './Pages/ChatPage';
import './App.css'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/chats" element={<ChatPage />} />
    </Routes>
  );
};

export default App;