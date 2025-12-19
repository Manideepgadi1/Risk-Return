# Risk-Return Analysis Dashboard

A full-stack interactive web application for analyzing risk-return profiles of 126 market indices.

## 🎯 Features

- **Interactive Scatter Plot**: Visualize risk vs return with color-coded quadrants
- **Real-time Filtering**: Search, filter by category, and adjust risk thresholds
- **Quadrant Analysis**: Identify indices in high-return/low-risk zones
- **Top Performers**: View rankings by returns, Sharpe ratio, or risk
- **Detailed Analytics**: Click any index for comprehensive statistics
- **Modern UI/UX**: Dark theme, smooth animations, fully responsive

## 🏗️ Tech Stack

### Backend
- **Python 3.x** with Flask
- **pandas** for data analysis
- **numpy** for calculations
- **Flask-CORS** for cross-origin requests

### Frontend
- **React 18** for UI
- **Recharts** for interactive charts
- **Axios** for API calls
- **Lucide React** for icons
- **Modern CSS** with dark theme

## 📦 Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend
python app.py
```

Backend will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm start
```

Frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### GET Endpoints

- `GET /api/health` - Health check
- `GET /api/indices` - Get all indices data
- `GET /api/statistics` - Get overall statistics
- `GET /api/quadrants` - Get quadrant analysis
- `GET /api/top-performers?metric=returns&limit=10` - Get top performers
- `GET /api/index/<index_name>` - Get specific index details
- `GET /api/categories` - Get all categories

### POST Endpoints

- `POST /api/indices/filter` - Filter indices
  ```json
  {
    "search": "N50",
    "category": "broad",
    "maxRisk": 15,
    "minReturn": 10
  }
  ```

- `POST /api/compare` - Compare multiple indices
  ```json
  {
    "indices": ["N50", "N100", "N200"]
  }
  ```

## 📊 Data Structure

Each index contains:
- **index**: Index name
- **returns**: Return percentage
- **risk**: Risk percentage
- **category**: broad/sector/thematic/strategy
- **sharpe**: Calculated Sharpe ratio

## 🎨 UI Features

### Dashboard Sections

1. **Header**: Title and total indices count
2. **Statistics Cards**: 
   - Average Return
   - Average Risk
   - Best Sharpe Ratio
   - Total Indices
3. **Control Panel**: Search, filter, and risk slider
4. **Interactive Chart**: Scatter plot with zoom/pan
5. **Quadrant Analysis**: Shows distribution across zones
6. **Top Performers Table**: Switchable rankings
7. **Detail Modal**: Click any index for full details

### Quadrant System

- 🌟 **High Return - Low Risk**: Ideal investment zone (Green)
- ⚡ **High Return - High Risk**: Aggressive growth (Orange)
- 🛡️ **Low Return - Low Risk**: Conservative zone (Blue)
- ⚠️ **Low Return - High Risk**: Avoid zone (Red)

## 🔧 Configuration

### Backend (.env)
```
FLASK_APP=app.py
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5000
```

### Frontend
Update API base URL in `src/App.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints at 768px
- Touch-friendly controls
- Adaptive charts

## 🔒 CORS Configuration

Backend is configured to allow requests from frontend:
```python
CORS(app)  # Enable CORS for React frontend
```

For production, restrict to specific origins:
```python
CORS(app, origins=['https://your-domain.com'])
```

## 🚢 Production Deployment

### Backend
```bash
# Use gunicorn for production
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend
```bash
# Build optimized production bundle
npm run build

# Serve with your preferred web server
```

## 📈 Future Enhancements

- [ ] User authentication
- [ ] Save custom portfolios
- [ ] Historical data trends
- [ ] Export to PDF/Excel
- [ ] Advanced filtering options
- [ ] Comparison charts
- [ ] Real-time data updates

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📄 License

MIT License - feel free to use for any purpose

## 🐛 Troubleshooting

### Backend won't start
- Ensure Python 3.8+ is installed
- Check all dependencies are installed
- Verify port 5000 is available

### Frontend won't connect to backend
- Ensure backend is running on port 5000
- Check CORS configuration
- Verify API_BASE_URL is correct

### Charts not rendering
- Clear browser cache
- Check console for errors
- Ensure recharts is installed

## 📞 Support

For issues or questions, please open an issue in the repository.

---

Built with ❤️ using React + Flask
