import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from './components/Layout';

export default function SalesDashboard() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSalesRecords();
    }, []);

    const fetchSalesRecords = async () => {
        try {
            const userString = localStorage.getItem('user');
            const user = userString ? JSON.parse(userString) : {};

            const response = await axios.get('http://localhost:5000/api/sales', {
                params: {
                    userType: user.userType,
                    operatorName: user.userName
                }
            });
            setSales(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching sales records", error);
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="space-y-8 max-w-full mx-auto pb-16 font-sans px-4">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-8 rounded-3xl shadow-sm text-white flex justify-between items-center border border-indigo-800/40">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Taxi Sales & Transactions</h2>
                        <p className="text-slate-400 text-xs mt-1">Complete record details of `tblsaleheader` from database.</p>
                    </div>
                    <div className="bg-white/10 px-5 py-2.5 rounded-2xl border border-white/10 text-center">
                        <p className="text-[10px] uppercase font-medium text-slate-300">Total Records</p>
                        <p className="text-xl font-bold text-emerald-400">{sales.length}</p>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-emerald-400">All Transaction Details</h3>
                        <button 
                            onClick={fetchSalesRecords}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                        >
                            🔄 Refresh Data
                        </button>
                    </div>

                    <div className="overflow-x-auto p-6">
                        {loading ? (
                            <p className="text-center py-8 text-slate-400 font-medium">Loading sales records...</p>
                        ) : sales.length === 0 ? (
                            <p className="text-center py-8 text-slate-400 font-medium">No sales records found in database.</p>
                        ) : (
                            <table className="w-full text-left border-collapse rounded-2xl overflow-hidden border border-slate-200 text-xs">
                                <thead>
                                    <tr className="bg-slate-100 text-slate-600 uppercase font-semibold tracking-wider">
                                        <th className="p-3">Header ID</th>
                                        <th className="p-3">Op. ID</th>
                                        <th className="p-3">Operator Name</th>
                                        <th className="p-3">Invoice No</th>
                                        <th className="p-3">Vehicle No</th>
                                        <th className="p-3">Model</th>
                                        <th className="p-3">Date / Time</th>
                                        <th className="p-3">Destination</th>
                                        <th className="p-3">Payment</th>
                                        <th className="p-3">Vehicles</th>
                                        <th className="p-3">Inv. Amount</th>
                                        <th className="p-3">Cancellation</th>
                                        <th className="p-3">Total Amount</th>
                                        <th className="p-3">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 font-normal text-slate-600">
                                    {sales.map((item) => (
                                        <tr key={item.headerId} className="hover:bg-slate-50/80 whitespace-nowrap">
                                            <td className="p-3 font-semibold text-slate-900">#{item.headerId}</td>
                                            <td className="p-3">{item.OperatorId}</td>
                                            <td className="p-3 font-medium text-slate-800">{item.OperatorName}</td>
                                            <td className="p-3 font-semibold text-indigo-600">{item.invoiceNumber}</td>
                                            <td className="p-3 font-medium text-slate-900">{item.vehicleNo}</td>
                                            <td className="p-3">{item.vehicleModel}</td>
                                            <td className="p-3 text-slate-500">{item.transactionDate} {item.transactionTime}</td>
                                            <td className="p-3">{item.destination}</td>
                                            <td className="p-3">
                                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-semibold">
                                                    {item.paymentType}
                                                </span>
                                            </td>
                                            <td className="p-3 text-center">{item.noOfVehicle}</td>
                                            <td className="p-3">Rs. {item.invoiceAmount}</td>
                                            <td className="p-3 text-rose-500">{item.cancellation || 'None'}</td>
                                            <td className="p-3 font-bold text-slate-900">Rs. {item.TotalAmount}</td>
                                            <td className="p-3 text-slate-400 text-[11px]">{item.DateTime}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

            </div>
        </Layout>
    );
}