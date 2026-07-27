import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Companies from './Companies'; // Meka aniwaryen import wela thiyenna ona

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Meka thiyenawada kiyala confirm karaganna */}
                <Route path="/companies" element={<Companies />} />
            </Routes>
        </BrowserRouter>
    );
}