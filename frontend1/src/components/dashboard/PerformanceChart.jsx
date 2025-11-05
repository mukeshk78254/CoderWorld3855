import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Label } from 'recharts';
import { BarChart3 } from 'lucide-react';

const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 15 } }
};

// Custom Tooltip for the chart for a more branded look
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        // Debug: Log what we're receiving
        console.log('Tooltip payload:', payload[0]);
        console.log('Label:', label);
        console.log('Value:', payload[0]?.value);
        console.log('Payload data:', payload[0]?.payload);
        
        // Ensure we get the submissions value correctly
        const submissions = payload[0]?.payload?.submissions || payload[0]?.value || 0;
        return (
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 backdrop-blur-md shadow-lg">
                <p className="label text-sm text-cyan-400">{`${label}`}</p>
                <p className="intro text-sm text-white font-bold">{`Submissions: ${submissions}`}</p>
            </div>
        );
    }
    return null;
};

// Custom label to show values on the chart
const CustomLabel = (props) => {
    const { x, y, value } = props;
    if (value > 0) {
        return (
            <text 
                x={x} 
                y={y - 10} 
                fill="#22d3ee" 
                fontSize={11} 
                fontWeight="bold"
                textAnchor="middle"
            >
                {value}
            </text>
        );
    }
    return null;
};

function PerformanceChart({ data }) {
    const period = data.length > 0 ? data.length : 30;

    if (!data || data.length === 0) {
        return (
            <motion.div
                variants={cardVariants}
                className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/50 backdrop-blur-xl h-full flex flex-col justify-center items-center text-center"
            >
                <BarChart3 className="text-cyan-400 mb-2" size={24} />
                <h3 className="font-black text-white text-lg mb-1">📈 30-Day Performance</h3>
                <p className="text-gray-500 text-sm">No submission data available for the last 30 days.</p>
            </motion.div>
        );
    }

    // Generate a key based on total submissions to force chart redraw when data changes
    const chartKey = `chart-${data.reduce((sum, day) => sum + day.submissions, 0)}-${data.length}`;

    return (
        <motion.div
            variants={cardVariants}
            className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/50 backdrop-blur-xl h-full"
            whileHover={{ y: -5, boxShadow: "0px 20px 40px rgba(0,0,0,0.4)" }}
        >
            <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="text-cyan-400" size={20} />
                <h3 className="font-black text-white text-lg">📈 {period}-Day Performance Trend</h3> 
            </div>
            <div style={{ width: '100%', height: 200 }}>
                {/* Add key to force remount when data changes */}
                <ResponsiveContainer key={chartKey}> 
                    <AreaChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis 
                            dataKey="name" 
                            stroke="#64748b" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                        />
                        <YAxis 
                            stroke="#64748b" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                            width={30}
                            allowDecimals={false}
                            domain={[0, 'dataMax + 1']}
                            tickFormatter={(value) => value === 0 ? '' : value}
                        />
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                            type="monotone" 
                            dataKey="submissions" 
                            stroke="#22d3ee" 
                            strokeWidth={2} 
                            fillOpacity={1} 
                            fill="url(#chartGradient)"
                            dot={{ fill: '#22d3ee', strokeWidth: 2, r: 3 }}
                            activeDot={{ r: 5, fill: '#06b6d4' }}
                            label={<CustomLabel />}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}

export default PerformanceChart;