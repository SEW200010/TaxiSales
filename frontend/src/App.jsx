import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Companies from './Companies';
import SalesTable from './SalesTable'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route path="/dashboard" element={<Dashboard />} />
                
                <Route path="/companies" element={<Companies />} />

                <Route path="/salestable"
                element={<SalesTable />} />
            </Routes>
        </BrowserRouter>
    );
}