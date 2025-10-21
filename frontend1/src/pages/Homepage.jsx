
import { useEffect, useState, useMemo, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { BrainCircuit, Code, Search, Trophy, Users, Filter } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import Header from '../components/dashboard/Header';


const BackgroundStyles = () => (
    <style>
        {`
        .homepage-background {
            background: linear-gradient(-45deg, #020617, #0f172a, #1e293b, #334155);
            background-size: 400% 400%;
            animation: gradient 15s ease infinite;
            position: relative;
            overflow-x: hidden;
        }

        @keyframes gradient {
            0% {
                background-position: 0% 50%;
            }
            50% {
                background-position: 100% 50%;
            }
            100% {
                background-position: 0% 50%;
            }
        }
        `}
    </style>
);


const StatCard = ({ icon, label, value }) => (
    <motion.div 
        className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl flex items-center gap-4 backdrop-blur-sm"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }}
        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
        viewport={{ once: true, amount: 0.5 }}
    >
        <div className="bg-slate-800 p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-sm text-slate-400">{label}</p>
        </div>
    </motion.div>
);


const ProblemCard = ({ problem }) => {
    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy': return 'border-emerald-500/50 text-emerald-400';
            case 'medium': return 'border-amber-500/50 text-amber-400';
            case 'hard': return 'border-red-500/50 text-red-400';
            default: return 'border-slate-700/50 text-slate-400';
        }
    };

    const tagsArray = useMemo(() => {
        if (Array.isArray(problem.tags)) return problem.tags;
        if (typeof problem.tags === 'string') return problem.tags.split(',').map(t => t.trim());
        return [];
    }, [problem.tags]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md hover:border-cyan-400/50 transition-colors duration-300"
        >
            <NavLink 
                to={`/problem/${problem._id}`} 
                className="block"
                onClick={() => console.log('Problem clicked:', problem._id)}
            >
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400">{problem.title}</h3>
                    <span className={`text-xs font-semibold capitalize px-3 py-1 rounded-full border ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                    </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                    {tagsArray.slice(0, 3).map(tag => (
                        <span key={tag} className="badge badge-outline badge-info capitalize">{tag}</span>
                    ))}
                </div>
            </NavLink>
        </motion.div>
    );
};



function Homepage() {
    const { user } = useSelector(state => state.auth); 
    const location = useLocation();
    const navigate = useNavigate();
    const heroRef = useRef(null);

    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ 
        difficulty: 'all', 
        tag: location.state?.filterTag || 'all',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

   
    useEffect(() => {
        if (location.state?.filterTag) {
            setFilters(prev => ({ ...prev, tag: location.state.filterTag }));
            document.getElementById('problem-list')?.scrollIntoView({ behavior: 'smooth' });
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const probRes = await axiosClient.get('/problem/getallproblem');
                setProblems(probRes.data || []);
            } catch (e) {
                console.error('Homepage fetch failed:', e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    
    useEffect(() => {
        const ctx = gsap.context(() => {
            if (heroRef.current) {
                gsap.fromTo(heroRef.current.children, 
                    { y: 50, opacity: 0, filter: 'blur(10px)' },
                    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, stagger: 0.15, ease: 'power3.out' }
                );
            }
        }, heroRef);
        return () => ctx.revert();
    }, []);

    const filteredProblems = useMemo(() => {
        return problems.filter(p => {
            const matchSearch = searchTerm === '' || p.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchDifficulty = filters.difficulty === 'all' || p.difficulty.toLowerCase() === filters.difficulty;
            let problemTags = [];
            if (Array.isArray(p.tags)) {
                problemTags = p.tags.map(t => t.toLowerCase());
            } else if (typeof p.tags === 'string') {
                problemTags = p.tags.split(',').map(t => t.trim().toLowerCase());
            }
            const matchTag = filters.tag === 'all' || problemTags.includes(filters.tag);
            return matchSearch && matchDifficulty && matchTag;
        });
    }, [problems, searchTerm, filters]);

    const uniqueTags = useMemo(() => {
        const tags = new Set();
        problems.forEach(p => {
            if (Array.isArray(p.tags)) {
                p.tags.forEach(tag => tags.add(tag.toLowerCase()));
            } else if (typeof p.tags === 'string') {
                p.tags.split(',').forEach(tag => tags.add(tag.trim().toLowerCase()));
            }
        });
        return Array.from(tags).sort();
    }, [problems]);
    
    return (
        <div className="min-h-screen homepage-background text-slate-200 font-sans">
            <BackgroundStyles /> 
            <Header />
            
            <main className="container mx-auto px-4 sm:px-6 py-8">
              
                <section ref={heroRef} className="text-center py-20 lg:py-32 min-h-[70vh] flex flex-col justify-center">
                   
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col items-center mb-8"
                    >
                      
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/25 border border-cyan-400/20 mb-4"
                        >
                            <motion.div
                                animate={{ 
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{ 
                                    duration: 2, 
                                    repeat: Infinity, 
                                    ease: "easeInOut" 
                                }}
                                className="w-12 h-12 lg:w-14 lg:h-14"
                            >
                                <img 
                                    src="/src/pages/2896418.png" 
                                    alt="CoderWorld Logo" 
                                    className="w-full h-full object-contain"
                                />
                            </motion.div>
                        </motion.div>
                        
                      
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="text-5xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2"
                            style={{ fontFamily: "'Orbitron', sans-serif" }}
                        >
                            CoderWorld
                        </motion.h1>
                        
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.6 }}
                            className="text-lg text-slate-400"
                            style={{ fontFamily: "'Source Code Pro', monospace" }}
                        >
                            Code • Learn • Solve
                        </motion.p>
                    </motion.div>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
                        Sharpen your skills, solve challenging problems, and compete with a global community of developers.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => document.getElementById('problem-list').scrollIntoView({ behavior: 'smooth' })} className="btn btn-primary">
                            Explore Problems
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/dashboard')} className="btn btn-ghost">
                            View Dashboard
                        </motion.button>
                    </div>
                </section>

                <section className="py-16">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard icon={<BrainCircuit size={24} className="text-cyan-400" />} label="Total Problems" value={problems.length} />
                        <StatCard icon={<Trophy size={24} className="text-amber-400" />} label="Contests Held" value="120+" />
                        <StatCard icon={<Users size={24} className="text-purple-400" />} label="Active Users" value="10,000+" />
                        <StatCard icon={<Code size={24} className="text-emerald-400" />} label="Submissions" value="1M+" />
                    </div>
                </section>

                
                <section id="problem-list" className="py-16">
                    <motion.h2 className="text-3xl font-bold text-white mb-8 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5 } }} viewport={{ once: true }}>
                        Problem Set
                    </motion.h2>

                   
                    <motion.div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl backdrop-blur-md mb-8 space-y-4 max-w-4xl mx-auto" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5 } }} viewport={{ once: true }}>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                <input type="text" placeholder="Search by title..." className="input input-bordered w-full bg-slate-800 pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                            <button className="btn btn-outline btn-info md:hidden" onClick={() => setIsFilterOpen(!isFilterOpen)}><Filter size={18} /> Filters</button>
                        </div>
                        <div className={`grid sm:grid-cols-2 gap-4 ${isFilterOpen ? 'grid' : 'hidden'} md:grid`}>
                            <select className="select select-bordered w-full bg-slate-800" value={filters.difficulty} onChange={e => setFilters({...filters, difficulty: e.target.value})}>
                                <option value="all">All Difficulties</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                            <select className="select select-bordered w-full bg-slate-800" value={filters.tag} onChange={e => setFilters({...filters, tag: e.target.value})}>
                                <option value="all">All Tags</option>
                                {uniqueTags.map(tag => <option key={tag} value={tag} className="capitalize">{tag}</option>)}
                            </select>
                        </div>
                    </motion.div>

                    
                    {loading ? (
                        <div className="text-center p-8"><span className="loading loading-dots loading-lg text-primary"></span></div>
                    ) : (
                        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {filteredProblems.map(p => (
                                    <ProblemCard key={p._id} problem={p} />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                    
                    {!loading && filteredProblems.length === 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-slate-400">
                            <h3 className="text-2xl font-bold text-white mb-2">No Problems Found</h3>
                            <p>Try adjusting your search or filter criteria.</p>
                        </motion.div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Homepage;