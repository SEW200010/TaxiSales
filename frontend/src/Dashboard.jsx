import Layout from './components/Layout';

export default function Dashboard() {
    return (
        <Layout>
            <div className="space-y-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6">
                    <div className="flex justify-between items-center mb-6">
                    </div>
                    <div className="h-72 flex flex-col items-center justify-center bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-200">
                        
                    </div>
                </div>
            </div>
        </Layout>
    );
}