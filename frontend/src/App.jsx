import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Companies from './Companies';
import SalesTable from './SalesTable';
import Report from './Report';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 1. Login Page (Default Route) */}
                <Route path="/" element={<Login />} />

                {/* 2. Dashboard Page */}
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* 3. Companies Management Page */}
                <Route path="/companies" element={<Companies />} />

<Route path="/companies/Report" element={<Report />} />                <Route path="/salestable" element={<SalesTable />} />
                    <Route path="/salestable/Report" element={<Report />} />
                {/* 5. Reports Page */}
                <Route path="/reports" element={<Report />} />
            </Routes>
        </BrowserRouter>
    );
}