import Layout from './components/Layout';

export default function Dashboard() {
    return (
        <Layout>
            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Stat Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Today's Total Trips</h3>
                        <p className="text-3xl font-black text-slate-800">142</p>
                        <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold mt-3">
                            +12% Since yesterday
                        </span>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Uber Commission</h3>
                        <p className="text-3xl font-black text-indigo-600">LKR 45,200</p>
                        <p className="text-xs text-slate-400 mt-3 font-medium">Updated 10 mins ago</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">PickMe Commission</h3>
                        <p className="text-3xl font-black text-pink-600">LKR 38,450</p>
                        <p className="text-xs text-slate-400 mt-3 font-medium">Updated 15 mins ago</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Active Companies</h3>
                        <p className="text-3xl font-black text-slate-800">02</p>
                        <p className="text-xs text-indigo-600 font-bold mt-3">Uber, PickMe Partnered</p>
                    </div>
                </div>

                {/* Recent Transactions Section */}
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-800">Recent Transactions & Activity</h2>
                        <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl transition-colors">
                            View All
                        </button>
                    </div>
                    <div className="h-72 flex flex-col items-center justify-center bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-200">
                        <p className="text-sm font-semibold text-slate-400">Sales Data Table will be loaded here...</p>
                        <p className="text-xs text-slate-400 mt-1">Connect your database endpoints to stream live logs.</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}