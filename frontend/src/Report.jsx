import React, { useState, useEffect } from 'react';
import axios from 'axios';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Layout from './components/Layout';

export default function Report() {
    const [activeTab, setActiveTab] = useState('daily');
    const [reportData, setReportData] = useState([]);
    const [dateInput, setDateInput] = useState('2026-07-30');
    const [monthInput, setMonthInput] = useState('2026-07');
    const [shopIdInput, setShopIdInput] = useState('1');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchReports();
    }, [activeTab]);

    const fetchReports = async () => {
        setLoading(true);
        try {
            let url = 'http://localhost:5000/api/';
            let params = {};

            if (activeTab === 'daily') {
                url += 'report';
                params = { date: dateInput };
            } else if (activeTab === 'monthly') {
                url += 'report-monthly';
                params = { month: monthInput };
            } else if (activeTab === 'shopSummary') {
                url += 'report-shop-monthly-summary';
                params = { shopId: shopIdInput, month: monthInput };
            } else if (activeTab === 'invoiceCount') {
                url += 'report-monthly-invoice-count';
                params = { month: monthInput };
            }

            const response = await axios.get(url, { params });
            setReportData(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching report data:", error);
            setReportData([]);
            setLoading(false);
        }
    };

    // --- DOWNLOAD EXCEL FUNCTION ---
    const downloadExcel = () => {
        if (reportData.length === 0) {
            alert("No data available to export!");
            return;
        }
        const worksheet = XLSX.utils.json_to_sheet(reportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "ReportData");
        XLSX.writeFile(workbook, `${activeTab}_report.xlsx`);
    };

    // --- DOWNLOAD PDF FUNCTION ---
    // --- DOWNLOAD PDF FUNCTION (Fixed) ---
    const downloadPDF = () => {
    if (reportData.length === 0) {
        alert("No data available to export!");
        return;
    }

    const doc = new jsPDF();
    
    // Title & Header info
    doc.setFontSize(16);
    doc.text(`System Report - ${activeTab.toUpperCase()}`, 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, 14, 28);

    // Prepare Table Columns & Rows dynamically from reportData
    const tableColumn = Object.keys(reportData[0]);
    const tableRows = reportData.map(row => 
        Object.values(row).map(val => (val !== null ? String(val) : 'N/A'))
    );

    // Call autoTable correctly using the imported function
    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [41, 128, 185] } // Blue header style
    });

    // Save the PDF file
    doc.save(`${activeTab}_report.pdf`);
};
    return (
        <Layout>
        <div className="min-h-screen bg-slate-100 p-8">
            <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
                
                {/* Header */}
                <div className="bg-slate-900 p-8 rounded-3xl text-white flex justify-between items-center shadow-sm">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">System Reports Dashboard</h2>
                        <p className="text-slate-400 text-xs mt-1">Generate, analyze, and export daily and monthly summaries.</p>
                    </div>
                </div>

                {/* Report Navigation Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {[
                        { id: 'daily', label: 'Daily Sales Report' },
                        { id: 'monthly', label: 'Monthly Summary' },
                        { id: 'shopSummary', label: 'Company Monthly Summary' },
                        { id: 'invoiceCount', label: 'Invoice Count Report' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-all whitespace-nowrap ${
                                activeTab === tab.id 
                                ? 'bg-indigo-600 text-white shadow-md' 
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Filter Inputs & Download Buttons Bar */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-wrap gap-4 items-center justify-between shadow-sm">
                    <div className="flex flex-wrap gap-4 items-center">
                        {(activeTab === 'daily') && (
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Select Date</label>
                                <input 
                                    type="date" 
                                    value={dateInput} 
                                    onChange={(e) => setDateInput(e.target.value)}
                                    className="border border-slate-300 rounded-xl px-3 py-2 text-sm"
                                />
                            </div>
                        )}

                        {(activeTab === 'monthly' || activeTab === 'invoiceCount') && (
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Select Month (YYYY-MM)</label>
                                <input 
                                    type="text" 
                                    value={monthInput} 
                                    onChange={(e) => setMonthInput(e.target.value)}
                                    className="border border-slate-300 rounded-xl px-3 py-2 text-sm"
                                />
                            </div>
                        )}

                        {activeTab === 'shopSummary' && (
                            <>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Operator/Company ID</label>
                                    <input 
                                        type="number" 
                                        value={shopIdInput} 
                                        onChange={(e) => setShopIdInput(e.target.value)}
                                        className="border border-slate-300 rounded-xl px-3 py-2 text-sm w-28"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Month (YYYY-MM)</label>
                                    <input 
                                        type="text" 
                                        value={monthInput} 
                                        onChange={(e) => setMonthInput(e.target.value)}
                                        className="border border-slate-300 rounded-xl px-3 py-2 text-sm"
                                    />
                                </div>
                            </>
                        )}

                        <button 
                            onClick={fetchReports}
                            className="mt-5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                        >
                            Generate Report
                        </button>
                    </div>

                    {/* Download Buttons */}
                    <div className="flex gap-2 mt-5">
                        <button 
                            onClick={downloadExcel}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                        >
                            📥 Download Excel
                        </button>
                        <button 
                            onClick={downloadPDF}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                        >
                            📄 Download PDF
                        </button>
                    </div>
                </div>

                {/* Report Data Table View */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden p-6">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <p className="text-center py-8 text-slate-400 text-sm font-medium">Loading report data...</p>
                        ) : reportData.length === 0 ? (
                            <p className="text-center py-8 text-slate-400 text-sm font-medium">No records found for selected criteria.</p>
                        ) : (
                            <table className="w-full text-left border-collapse rounded-xl overflow-hidden border border-slate-200 text-xs">
                                <thead>
                                    <tr className="bg-slate-100 text-slate-600 uppercase font-semibold">
                                        {Object.keys(reportData[0]).map((key) => (
                                            <th key={key} className="p-3">{key}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 text-slate-600 font-normal">
                                    {reportData.map((row, index) => (
                                        <tr key={index} className="hover:bg-slate-50">
                                            {Object.values(row).map((val, i) => (
                                                <td key={i} className="p-3 whitespace-nowrap">
                                                    {val !== null ? String(val) : 'N/A'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

            </div>
        </div>
        </Layout>
    );
}