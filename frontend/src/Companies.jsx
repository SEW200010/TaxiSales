import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from './components/Layout';

export default function Companies() {
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    
    const [formData, setFormData] = useState({
        companyId: '',
        fileCount: '',
        lastDocCount: '',
        companyname: '',
        address: '',
        contact: '',
        email: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/companies');
            setCompanies(response.data);
            if (response.data.length > 0 && !selectedCompany) {
                setSelectedCompany(response.data[0]); 
            }
        } catch (error) {
            console.error("Error fetching companies", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/api/companies/${formData.companyId}`, formData);
                alert("Company updated successfully!");
            } else {
                await axios.post('http://localhost:5000/api/companies', formData);
                alert("Company added successfully!");
            }
            
            setFormData({
                companyId: '',
                fileCount: '',
                lastDocCount: '',
                companyname: '',
                address: '',
                contact: '',
                email: ''
            });
            setIsEditing(false);
            fetchCompanies();
        } catch (error) {
            console.error("Error saving company", error);
            alert("Error saving data.");
        }
    };

    const handleEdit = (company) => {
        setFormData({
            companyId: company.companyId || '',
            fileCount: company.fileCount !== null && company.fileCount !== undefined ? company.fileCount : '',
            lastDocCount: company.lastDocCount !== null && company.lastDocCount !== undefined ? company.lastDocCount : '',
            companyname: company.companyname || '',
            address: company.address || '',
            contact: company.contact || '',
            email: company.email || ''
        });
        setIsEditing(true);
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    const handleDelete = async (companyId) => {
        if (!companyId) return;
        if (window.confirm("Are you sure you want to delete this company?")) {
            try {
                await axios.delete(`http://localhost:5000/api/companies/${companyId}`);
                fetchCompanies();
            } catch (error) {
                console.error("Error deleting company", error);
            }
        }
    };

    return (
        <Layout>
            <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
                
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-8 rounded-3xl shadow-sm text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-indigo-800/40">
                    <div>
                        <div className="flex items-center gap-2">
                        </div>
                        <h2 className="text-3xl font-black mt-2 tracking-tight">Service Provider Directory</h2>                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 text-center">
                        <p className="text-[10px] uppercase font-medium text-slate-300">Total Partners</p>
                        <p className="text-xl font-bold text-emerald-400">{companies.length}</p>
                    </div>
                </div>

                {/* Company Tabs / Selector Bar */}
                <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-none">
                    {companies.map((comp) => {
                        const cid = comp.companyId;
                        const isSelected = selectedCompany && (selectedCompany.companyId === cid);
                        return (
                            <button
                                key={cid}
                                onClick={() => setSelectedCompany(comp)}
                                className={`px-6 py-3 rounded-2xl font-semibold text-sm transition-all whitespace-nowrap flex items-center gap-3 shadow-xs ${
                                    isSelected 
                                    ? 'bg-indigo-600 text-white shadow-indigo-600/20 scale-102 ring-2 ring-indigo-400/50' 
                                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
                                }`}
                            >
                                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-400 animate-ping' : 'bg-slate-300'}`}></span>
                                {comp.companyname || `Company #${cid}`}
                            </button>
                        );
                    })}
                </div>

                {/* Selected Company Details View */}
                {selectedCompany ? (
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden transition-all">
                        
                        <div className="p-6 md:px-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 text-white">
                            <div>
                                <h3 className="text-xl font-semibold text-white mt-2">{selectedCompany.companyname}</h3>
                            </div>
                            <div className="flex gap-2.5">
                                <button 
                                    onClick={() => handleEdit(selectedCompany)} 
                                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5"
                                >
                                    <span> Edit Profile</span>
                                </button>
                                <button 
                                    onClick={() => handleDelete(selectedCompany.companyId)} 
                                    className="bg-red-700 hover:bg-red text-white px-4 py-2 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5"
                                >
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>

                        {/* Quick Metrics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-slate-50/50 border-b border-slate-100">
                            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-slate-400 uppercase">Total Files Managed</p>
                                    <p className="text-xl font-semibold text-slate-800 mt-1">{selectedCompany.fileCount ?? 0}</p>
                                </div>
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-medium text-lg">📁</div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-slate-400 uppercase">Last Document Count</p>
                                    <p className="text-xl font-semibold text-slate-800 mt-1">{selectedCompany.lastDocCount ?? '-'}</p>
                                </div>
                                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-medium text-lg">📄</div>
                            </div>
                        </div>

                        {/* Detailed Table */}
                        <div className="p-6 md:p-8 overflow-x-auto">
                            <table className="w-full text-left border-collapse rounded-2xl overflow-hidden border border-slate-200">
                                <thead>
                                    <tr className="bg-slate-100 text-slate-500 text-xs uppercase font-semibold tracking-wider">
                                        <th className="p-4">Attribute Field</th>
                                        <th className="p-4">Registered Record Data</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 text-sm font-normal text-slate-600">
                                    <tr className="hover:bg-slate-50/80">
                                        <td className="p-4 text-slate-800 font-medium">Company ID</td>
                                        <td className="p-4 font-semibold text-indigo-600">{selectedCompany.companyId}</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/80">
                                        <td className="p-4 text-slate-800 font-medium">Company Name</td>
                                        <td className="p-4 text-slate-700">{selectedCompany.companyname || '-'}</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/80">
                                        <td className="p-4 text-slate-800 font-medium">Email Address</td>
                                        <td className="p-4 text-slate-500">{selectedCompany.email || '-'}</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/80">
                                        <td className="p-4 text-slate-800 font-medium">Contact Number</td>
                                        <td className="p-4 text-slate-500">{selectedCompany.contact || '-'}</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/80">
                                        <td className="p-4 text-slate-800 font-medium">Physical Address</td>
                                        <td className="p-4 text-slate-500">{selectedCompany.address || '-'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="py-16 bg-white rounded-3xl border border-slate-200 text-center shadow-xs">
                    </div>
                )}

                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border-2 border-emerald-500/30 mt-12">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mt-2">
                                {isEditing ? `Modify Company Profile (#${formData.companyId})` : 'Register New Partner Company'}
                            </h3>
                        </div>
                        {isEditing && (
                            <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-xl text-xs font-semibold border border-amber-200">
                                Editing Active
                            </span>
                        )}
                    </div>
                    
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Company ID</label>
                            <input 
                                type="number" 
                                placeholder="e.g. 1" 
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                                required
                                disabled={isEditing}
                                value={formData.companyId} 
                                onChange={(e) => setFormData({...formData, companyId: e.target.value})} 
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Company Name</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Uber / PickMe" 
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                                value={formData.companyname} 
                                onChange={(e) => setFormData({...formData, companyname: e.target.value})} 
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Email Address</label>
                            <input 
                                type="email" 
                                placeholder="company@domain.com" 
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                                value={formData.email} 
                                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Contact Number</label>
                            <input 
                                type="text" 
                                placeholder="+94 77 ..." 
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                                value={formData.contact} 
                                onChange={(e) => setFormData({...formData, contact: e.target.value})} 
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Physical Address</label>
                            <input 
                                type="text" 
                                placeholder="City location" 
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                                value={formData.address} 
                                onChange={(e) => setFormData({...formData, address: e.target.value})} 
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">File Count</label>
                            <input 
                                type="number" 
                                placeholder="0" 
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                                value={formData.fileCount} 
                                onChange={(e) => setFormData({...formData, fileCount: e.target.value})} 
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Last Document Count</label>
                            <input 
                                type="number" 
                                placeholder="0" 
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all" 
                                value={formData.lastDocCount} 
                                onChange={(e) => setFormData({...formData, lastDocCount: e.target.value})} 
                            />
                        </div>
                        
                        <div className="col-span-1 md:col-span-3 flex gap-4 pt-4 border-t border-slate-100">
                            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2">
                                <span>{isEditing ? 'Save Profile Updates' : 'Register Partner Company'}</span>
                            </button>
                            {isEditing && (
                                <button 
                                    type="button" 
                                    onClick={() => { 
                                        setIsEditing(false); 
                                        setFormData({ companyId: '', fileCount: '', lastDocCount: '', companyname: '', address: '', contact: '', email: '' }); 
                                    }} 
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3.5 rounded-2xl text-sm font-semibold transition-all border border-slate-200"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

            </div>
        </Layout>
    );
}