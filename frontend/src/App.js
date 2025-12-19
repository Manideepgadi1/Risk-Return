import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Target, BarChart3, Search, Filter, RefreshCw } from 'lucide-react';
import './App.css';

// API Base URL - automatically switches between development and production
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/risk-return/api' 
  : 'http://localhost:5002/api';

// Category color mapping
const CATEGORY_COLORS = {
  'thematic': '#3b82f6',    // Blue
  'strategy': '#10b981',    // Green
  'broad': '#64748b',       // Gray
  'sector': '#f97316'       // Orange
};

function App() {
  const [indices, setIndices] = useState([]);
  const [filteredIndices, setFilteredIndices] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [quadrants, setQuadrants] = useState({});
  const [topPerformers, setTopPerformers] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [maxRisk, setMaxRisk] = useState(30);
  const [activeTab, setActiveTab] = useState('returns');
  
  // Loading state
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [indicesRes, statsRes, quadrantsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/indices`),
        axios.get(`${API_BASE_URL}/statistics`),
        axios.get(`${API_BASE_URL}/quadrants`)
      ]);
      
      setIndices(indicesRes.data.data);
      setFilteredIndices(indicesRes.data.data);
      setStatistics(statsRes.data.data);
      setQuadrants(quadrantsRes.data.data);
      
      fetchTopPerformers('returns');
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopPerformers = async (metric) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/top-performers?metric=${metric}&limit=10`);
      setTopPerformers(response.data.data);
    } catch (error) {
      console.error('Error fetching top performers:', error);
    }
  };

  // Filter indices
  useEffect(() => {
    applyFilters();
  }, [searchTerm, categoryFilter, maxRisk, indices]);

  const applyFilters = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/indices/filter`, {
        search: searchTerm,
        category: categoryFilter,
        maxRisk: maxRisk
      });
      setFilteredIndices(response.data.data);
    } catch (error) {
      console.error('Error filtering:', error);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setMaxRisk(30);
    setFilteredIndices(indices);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    fetchTopPerformers(tab);
  };

  const getQuadrantColor = (returns, risk) => {
    const avgReturn = statistics.avgReturn || 0;
    const avgRisk = statistics.avgRisk || 0;
    
    if (returns >= avgReturn && risk < avgRisk) return '#10b981'; // Green
    if (returns >= avgReturn && risk >= avgRisk) return '#f59e0b'; // Orange
    if (returns < avgReturn && risk < avgRisk) return '#6366f1'; // Blue
    return '#ef4444'; // Red
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Risk-Return Analysis...</p>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>📊 Risk-Return Analysis Dashboard</h1>
          <p className="subtitle">Interactive analysis of {indices.length} market indices</p>
        </div>
      </header>

      {/* Statistics Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon green">
            <TrendingUp size={32} />
          </div>
          <div className="stat-content">
            <h3>{statistics.avgReturn}%</h3>
            <p>Average Return</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon orange">
            <TrendingDown size={32} />
          </div>
          <div className="stat-content">
            <h3>{statistics.avgRisk}%</h3>
            <p>Average Risk</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon blue">
            <Target size={32} />
          </div>
          <div className="stat-content">
            <h3>{statistics.bestSharpe}</h3>
            <p>Best Sharpe Ratio</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon purple">
            <BarChart3 size={32} />
          </div>
          <div className="stat-content">
            <h3>{statistics.totalIndices}</h3>
            <p>Total Indices</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-panel">
        <div className="control-group">
          <label>
            <Search size={18} />
            Search Index
          </label>
          <input
            type="text"
            placeholder="Type index name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="control-group">
          <label>
            <Filter size={18} />
            Category
          </label>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="broad">Broad Market</option>
            <option value="sector">Sectoral</option>
            <option value="thematic">Thematic</option>
            <option value="strategy">Strategy</option>
          </select>
        </div>
        
        <div className="control-group">
          <label>Max Risk: {maxRisk}%</label>
          <input
            type="range"
            min="0"
            max="30"
            step="0.5"
            value={maxRisk}
            onChange={(e) => setMaxRisk(parseFloat(e.target.value))}
          />
        </div>
        
        <button className="reset-btn" onClick={handleReset}>
          <RefreshCw size={18} />
          Reset
        </button>
      </div>

      {/* Chart */}
      <div className="chart-container">
        <h2>Risk Return Analysis</h2>
        
        {/* Quadrant Labels */}
        <div className="quadrant-labels">
          <div className="quadrant-label top-left">Low Return, High Risk</div>
          <div className="quadrant-label top-right">High Return, High Risk</div>
          <div className="quadrant-label bottom-left">Low Returns, Low Risk</div>
          <div className="quadrant-label bottom-right">High Returns, Low Risk</div>
        </div>

        <ResponsiveContainer width="100%" height={700}>
          <ScatterChart 
            margin={{ top: 20, right: 60, bottom: 80, left: 80 }}
            onMouseMove={(e) => {
              if (e && e.activePayload && e.activePayload[0]) {
                setHoveredIndex(e.activePayload[0].payload);
              }
            }}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <CartesianGrid stroke="#cbd5e1" strokeWidth={1} />
            <XAxis 
              type="number" 
              dataKey="returns" 
              name="Returns" 
              domain={[-5, 32]}
              stroke="#1e293b"
              strokeWidth={2}
              tick={{ fill: '#1e293b', fontSize: 11 }}
              tickLine={{ stroke: '#1e293b' }}
              axisLine={{ stroke: '#1e293b', strokeWidth: 2 }}
              label={{ 
                value: 'Returns', 
                position: 'insideBottom', 
                offset: -15, 
                fill: '#1e293b', 
                fontWeight: 600,
                fontSize: 13
              }}
            />
            <YAxis 
              type="number" 
              dataKey="risk" 
              name="Risk" 
              domain={[0, 32]}
              stroke="#1e293b"
              strokeWidth={2}
              tick={{ fill: '#1e293b', fontSize: 11 }}
              tickLine={{ stroke: '#1e293b' }}
              axisLine={{ stroke: '#1e293b', strokeWidth: 2 }}
              label={{ 
                value: 'Risk', 
                angle: -90, 
                position: 'insideLeft', 
                fill: '#1e293b', 
                fontWeight: 600,
                fontSize: 13,
                offset: 10
              }}
            />
            <Tooltip 
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload[0]) {
                  const data = payload[0].payload;
                  return (
                    <div style={{
                      backgroundColor: 'white',
                      border: '2px solid #1e293b',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '6px', color: '#1e293b' }}>
                        {data.index}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        <div>Volatility: <strong>{data.risk.toFixed(2)}%</strong></div>
                        <div>Return: <strong>{data.returns.toFixed(2)}%</strong></div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine 
              x={statistics.avgReturn} 
              stroke="#8b5cf6" 
              strokeWidth={1.5}
            />
            <ReferenceLine 
              y={statistics.avgRisk} 
              stroke="#8b5cf6" 
              strokeWidth={1.5}
            />
            <Scatter 
              data={filteredIndices} 
              shape={(props) => {
                const { cx, cy, payload } = props;
                if (!cx || !cy || !payload) return null;
                
                const isHovered = hoveredIndex && hoveredIndex.index === payload.index;
                const color = CATEGORY_COLORS[payload.category] || '#64748b';
                
                return (
                  <g>
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r={isHovered ? 6 : 4} 
                      fill={color} 
                      fillOpacity={isHovered ? 1 : 0.7}
                      stroke={isHovered ? '#1e293b' : 'none'}
                      strokeWidth={isHovered ? 2 : 0}
                      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                      onClick={() => setSelectedIndex(payload)}
                    />
                  </g>
                );
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>
        
        {/* Category Legend */}
        <div className="category-legend">
          <div className="legend-item">
            <div className="legend-dot thematic"></div>
            <span>Thematic</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot strategy"></div>
            <span>Strategy</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot broad"></div>
            <span>Broad Market</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot sector"></div>
            <span>Sectoral</span>
          </div>
        </div>
      </div>

      {/* Quadrant Analysis */}
      <div className="quadrant-info">
        <div className="quadrant green-border">
          <h4>🌟 High Return - Low Risk</h4>
          <p>{quadrants.high_return_low_risk?.length || 0}</p>
          <small>Ideal Investment Zone</small>
        </div>
        
        <div className="quadrant orange-border">
          <h4>⚡ High Return - High Risk</h4>
          <p>{quadrants.high_return_high_risk?.length || 0}</p>
          <small>Aggressive Growth</small>
        </div>
        
        <div className="quadrant blue-border">
          <h4>🛡️ Low Return - Low Risk</h4>
          <p>{quadrants.low_return_low_risk?.length || 0}</p>
          <small>Conservative Zone</small>
        </div>
        
        <div className="quadrant red-border">
          <h4>⚠️ Low Return - High Risk</h4>
          <p>{quadrants.low_return_high_risk?.length || 0}</p>
          <small>Avoid Zone</small>
        </div>
      </div>

      {/* Top Performers Table */}
      <div className="table-section">
        <h2>🏆 Top Performers</h2>
        <div className="table-tabs">
          <button 
            className={`tab-btn ${activeTab === 'returns' ? 'active' : ''}`}
            onClick={() => handleTabChange('returns')}
          >
            Highest Returns
          </button>
          <button 
            className={`tab-btn ${activeTab === 'sharpe' ? 'active' : ''}`}
            onClick={() => handleTabChange('sharpe')}
          >
            Best Sharpe Ratio
          </button>
          <button 
            className={`tab-btn ${activeTab === 'low_risk' ? 'active' : ''}`}
            onClick={() => handleTabChange('low_risk')}
          >
            Lowest Risk
          </button>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Index</th>
                <th>Return (%)</th>
                <th>Risk (%)</th>
                <th>Sharpe Ratio</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {topPerformers.map((item, index) => (
                <tr key={item.index} onClick={() => setSelectedIndex(item)}>
                  <td>{index + 1}</td>
                  <td><strong>{item.index}</strong></td>
                  <td style={{ color: item.returns >= 0 ? '#10b981' : '#ef4444' }}>
                    {item.returns.toFixed(2)}%
                  </td>
                  <td style={{ color: '#f59e0b' }}>{item.risk.toFixed(2)}%</td>
                  <td style={{ color: '#6366f1' }}>{item.sharpe}</td>
                  <td>
                    <span className={`category-badge ${item.category}`}>
                      {item.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedIndex && (
        <div className="modal-overlay" onClick={() => setSelectedIndex(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedIndex(null)}>✕</button>
            <h3>{selectedIndex.index}</h3>
            <div className="detail-stats">
              <div className="detail-item">
                <span className="detail-label">Return:</span>
                <span className="detail-value" style={{ color: '#10b981' }}>
                  {selectedIndex.returns}%
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Risk:</span>
                <span className="detail-value" style={{ color: '#f59e0b' }}>
                  {selectedIndex.risk}%
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Sharpe Ratio:</span>
                <span className="detail-value" style={{ color: '#6366f1' }}>
                  {selectedIndex.sharpe}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Category:</span>
                <span className={`category-badge ${selectedIndex.category}`}>
                  {selectedIndex.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Risk-Return Analysis Dashboard | Powered by React + Flask</p>
      </footer>
    </div>
  );
}

export default App;
