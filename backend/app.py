from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Load data
def load_indices_data():
    """Load and prepare indices data"""
    data = [
        {"index": "N50", "returns": 13.50, "risk": 12.90, "category": "broad"},
        {"index": "NN50", "returns": 14.80, "risk": 15.70, "category": "broad"},
        {"index": "N100", "returns": 13.60, "risk": 13.10, "category": "broad"},
        {"index": "N200", "returns": 14.20, "risk": 13.40, "category": "broad"},
        {"index": "NTOTLM", "returns": 14.60, "risk": 13.80, "category": "broad"},
        {"index": "N500", "returns": 14.40, "risk": 13.70, "category": "broad"},
        {"index": "NMC5025", "returns": 15.60, "risk": 15.10, "category": "broad"},
        {"index": "N500EQ", "returns": 15.70, "risk": 17.90, "category": "broad"},
        {"index": "NMC150", "returns": 18.30, "risk": 16.40, "category": "broad"},
        {"index": "NMC50", "returns": 18.90, "risk": 18.00, "category": "broad"},
        {"index": "NMIDSEL", "returns": 17.60, "risk": 17.80, "category": "broad"},
        {"index": "NMC100", "returns": 17.40, "risk": 17.20, "category": "broad"},
        {"index": "NSC250", "returns": 16.60, "risk": 19.90, "category": "broad"},
        {"index": "NSC50", "returns": 14.40, "risk": 22.60, "category": "broad"},
        {"index": "NSC100", "returns": 15.50, "risk": 21.40, "category": "broad"},
        {"index": "NMICRO", "returns": 21.40, "risk": 22.60, "category": "broad"},
        {"index": "NLMC250", "returns": 16.00, "risk": 14.40, "category": "broad"},
        {"index": "NMSC400", "returns": 17.70, "risk": 17.40, "category": "broad"},
        {"index": "NQUANT", "returns": 8.60, "risk": 11.00, "category": "thematic"},
        {"index": "NELSS", "returns": 15.90, "risk": 13.80, "category": "thematic"},
        {"index": "NSILVER", "returns": 9.10, "risk": 12.80, "category": "thematic"},
        {"index": "NBCYCLE", "returns": 6.40, "risk": 3.30, "category": "thematic"},
        {"index": "NCONTRA", "returns": 15.70, "risk": 13.40, "category": "strategy"},
        {"index": "NGOLD", "returns": 14.40, "risk": 11.00, "category": "thematic"},
        {"index": "NFLEXI", "returns": 12.50, "risk": 13.70, "category": "strategy"},
        {"index": "NINNOV", "returns": 6.80, "risk": 8.40, "category": "thematic"},
        {"index": "NAUTO", "returns": 14.80, "risk": 18.80, "category": "sector"},
        {"index": "NBANK", "returns": 14.10, "risk": 17.80, "category": "sector"},
        {"index": "NCHEM", "returns": 20.40, "risk": 15.50, "category": "sector"},
        {"index": "NFINSERV", "returns": 15.50, "risk": 16.70, "category": "sector"},
        {"index": "NFINS25", "returns": 16.40, "risk": 17.20, "category": "sector"},
        {"index": "NFINSEXB", "returns": 17.40, "risk": 19.40, "category": "sector"},
        {"index": "NFMCG", "returns": 12.40, "risk": 12.60, "category": "sector"},
        {"index": "NHEALTH", "returns": 9.00, "risk": 14.70, "category": "sector"},
        {"index": "NTECH", "returns": 14.80, "risk": 17.50, "category": "sector"},
        {"index": "NMEDIA", "returns": -1.30, "risk": 23.40, "category": "sector"},
        {"index": "NMETAL", "returns": 22.60, "risk": 24.20, "category": "sector"},
        {"index": "NPHARMA", "returns": 7.20, "risk": 16.10, "category": "sector"},
        {"index": "NPVTBANK", "returns": 12.90, "risk": 17.80, "category": "sector"},
        {"index": "NPSUBANK", "returns": 14.70, "risk": 29.60, "category": "sector"},
        {"index": "NREALTY", "returns": 20.80, "risk": 27.40, "category": "sector"},
        {"index": "NCONDUR", "returns": 18.10, "risk": 17.70, "category": "sector"},
        {"index": "NOILGAS", "returns": 18.10, "risk": 18.60, "category": "sector"},
        {"index": "NMSFINS", "returns": 15.70, "risk": 22.10, "category": "sector"},
        {"index": "NMSHC", "returns": 17.10, "risk": 14.40, "category": "sector"},
        {"index": "NMSITT", "returns": 20.40, "risk": 21.30, "category": "sector"},
        {"index": "N100EQWT", "returns": 14.20, "risk": 14.60, "category": "strategy"},
        {"index": "N100LV30", "returns": 14.10, "risk": 11.00, "category": "strategy"},
        {"index": "N5ARB", "returns": 6.40, "risk": 3.30, "category": "strategy"},
        {"index": "N200M30", "returns": 17.70, "risk": 15.40, "category": "strategy"},
        {"index": "N200AL30", "returns": 19.60, "risk": 16.80, "category": "strategy"},
        {"index": "N100AL30", "returns": 16.50, "risk": 16.00, "category": "strategy"},
        {"index": "NAL50", "returns": 19.70, "risk": 19.30, "category": "strategy"},
        {"index": "NALV30", "returns": 14.70, "risk": 12.30, "category": "strategy"},
        {"index": "NAQLV30", "returns": 16.10, "risk": 11.70, "category": "strategy"},
        {"index": "NAQVLV30", "returns": 16.30, "risk": 11.60, "category": "strategy"},
        {"index": "NDIVOP50", "returns": 15.00, "risk": 12.50, "category": "strategy"},
        {"index": "NGROW15", "returns": 10.40, "risk": 13.30, "category": "strategy"},
        {"index": "NHBETA50", "returns": 13.50, "risk": 24.60, "category": "strategy"},
        {"index": "NLV50", "returns": 14.20, "risk": 11.20, "category": "strategy"},
        {"index": "NT10EQWT", "returns": 14.60, "risk": 13.40, "category": "strategy"},
        {"index": "NT15EW", "returns": 14.10, "risk": 13.90, "category": "strategy"},
        {"index": "NT20EW", "returns": 14.30, "risk": 13.60, "category": "strategy"},
        {"index": "N100QLT30", "returns": 12.00, "risk": 12.10, "category": "strategy"},
        {"index": "NM150M50", "returns": 21.10, "risk": 16.90, "category": "strategy"},
        {"index": "N5FCQ3", "returns": 16.90, "risk": 14.70, "category": "strategy"},
        {"index": "N5LV5", "returns": 15.40, "risk": 10.90, "category": "strategy"},
        {"index": "N500M50", "returns": 19.00, "risk": 17.30, "category": "strategy"},
        {"index": "N500QLT50", "returns": 14.00, "risk": 13.40, "category": "strategy"},
        {"index": "NMQLV", "returns": 16.50, "risk": 13.20, "category": "strategy"},
        {"index": "NMC150Q", "returns": 15.10, "risk": 14.20, "category": "strategy"},
        {"index": "NSC250Q", "returns": 18.00, "risk": 18.00, "category": "strategy"},
        {"index": "N5MCMQ5", "returns": 17.70, "risk": 15.50, "category": "strategy"},
        {"index": "NMSCMQ", "returns": 18.10, "risk": 16.50, "category": "strategy"},
        {"index": "NSC250MQ", "returns": 18.50, "risk": 19.40, "category": "strategy"},
        {"index": "NQLV30", "returns": 11.70, "risk": 11.20, "category": "strategy"},
        {"index": "N50EQWGT", "returns": 14.30, "risk": 13.90, "category": "strategy"},
        {"index": "N50V20", "returns": 15.50, "risk": 12.20, "category": "strategy"},
        {"index": "N200V30", "returns": 18.90, "risk": 19.80, "category": "strategy"},
        {"index": "N500V50", "returns": 19.00, "risk": 21.00, "category": "strategy"},
        {"index": "N500EQWT", "returns": 15.70, "risk": 18.00, "category": "strategy"},
        {"index": "N200Q30", "returns": 13.10, "risk": 11.70, "category": "strategy"},
        {"index": "NBIRLA", "returns": 12.40, "risk": 20.00, "category": "thematic"},
        {"index": "NCM", "returns": 18.40, "risk": 20.60, "category": "thematic"},
        {"index": "NCOMM", "returns": 16.80, "risk": 16.70, "category": "thematic"},
        {"index": "NCHOUS", "returns": 14.20, "risk": 17.10, "category": "thematic"},
        {"index": "NCPSE", "returns": 16.50, "risk": 18.60, "category": "thematic"},
        {"index": "NENERGY", "returns": 18.70, "risk": 17.90, "category": "thematic"},
        {"index": "NEVNAA", "returns": 13.20, "risk": 16.90, "category": "thematic"},
        {"index": "NHOUSING", "returns": 15.90, "risk": 16.10, "category": "thematic"},
        {"index": "N100ESG", "returns": 14.30, "risk": 13.20, "category": "thematic"},
        {"index": "N100ESGE", "returns": 14.30, "risk": 13.20, "category": "thematic"},
        {"index": "N100ESGSL", "returns": 13.40, "risk": 12.40, "category": "thematic"},
        {"index": "NICON", "returns": 14.40, "risk": 12.90, "category": "thematic"},
        {"index": "NIDEF", "returns": 24.70, "risk": 24.70, "category": "sector"},
        {"index": "NIDIGI", "returns": 12.80, "risk": 17.00, "category": "thematic"},
        {"index": "NIFSL", "returns": 16.80, "risk": 17.80, "category": "sector"},
        {"index": "NIINT", "returns": 4.60, "risk": 12.80, "category": "sector"},
        {"index": "NIMFG", "returns": 14.80, "risk": 15.00, "category": "sector"},
        {"index": "NTOUR", "returns": 17.10, "risk": 21.40, "category": "sector"},
        {"index": "NINFRA", "returns": 14.30, "risk": 15.30, "category": "thematic"},
        {"index": "NMAHIN", "returns": 17.30, "risk": 19.50, "category": "thematic"},
        {"index": "NIPO", "returns": 9.20, "risk": 16.40, "category": "thematic"},
        {"index": "NMIDLIQ15", "returns": 19.70, "risk": 18.50, "category": "strategy"},
        {"index": "NMSICON", "returns": 17.20, "risk": 16.10, "category": "thematic"},
        {"index": "NMNC", "returns": 13.60, "risk": 12.60, "category": "broad"},
        {"index": "NMOBIL", "returns": 16.90, "risk": 17.50, "category": "thematic"},
        {"index": "NPSE", "returns": 16.50, "risk": 18.50, "category": "thematic"},
        {"index": "NREiT", "returns": 7.90, "risk": 8.10, "category": "thematic"},
        {"index": "NRRL", "returns": 13.80, "risk": 14.50, "category": "thematic"},
        {"index": "NNCCON", "returns": 14.90, "risk": 13.00, "category": "sector"},
        {"index": "NSERVSEC", "returns": 13.70, "risk": 14.20, "category": "sector"},
        {"index": "NSH25", "returns": 11.30, "risk": 11.90, "category": "strategy"},
        {"index": "NTATA", "returns": 15.20, "risk": 14.90, "category": "thematic"},
        {"index": "NTATA25C", "returns": 17.30, "risk": 17.50, "category": "thematic"},
        {"index": "NTRANS", "returns": 15.90, "risk": 17.90, "category": "sector"},
        {"index": "NLCLIQ15", "returns": 11.30, "risk": 18.10, "category": "strategy"},
        {"index": "N50SH", "returns": 11.70, "risk": 12.60, "category": "strategy"},
        {"index": "N500SH", "returns": 13.90, "risk": 12.80, "category": "strategy"},
        {"index": "NMFG532", "returns": 15.20, "risk": 15.70, "category": "sector"},
        {"index": "NINFRA532", "returns": 16.80, "risk": 16.20, "category": "thematic"},
        {"index": "NSMEE", "returns": 29.30, "risk": 19.10, "category": "thematic"},
        {"index": "NRPSU", "returns": 15.00, "risk": 17.20, "category": "thematic"},
        {"index": "NMAATR", "returns": 19.50, "risk": 18.00, "category": "thematic"},
        {"index": "NNACON", "returns": 14.80, "risk": 18.10, "category": "sector"},
        {"index": "NWVS", "returns": 2.00, "risk": 23.60, "category": "thematic"}
    ]
    return data

# Calculate analytics
def calculate_sharpe_ratio(returns, risk, risk_free_rate=6.0):
    """Calculate Sharpe ratio"""
    if risk == 0:
        return 0
    return round((returns - risk_free_rate) / risk, 2)

def add_analytics(data):
    """Add calculated metrics to data"""
    for item in data:
        item['sharpe'] = calculate_sharpe_ratio(item['returns'], item['risk'])
    return data

# API Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/indices', methods=['GET'])
def get_all_indices():
    """Get all indices data"""
    data = load_indices_data()
    data = add_analytics(data)
    return jsonify({
        'success': True,
        'data': data,
        'count': len(data)
    })

@app.route('/api/indices/filter', methods=['POST'])
def filter_indices():
    """Filter indices based on criteria"""
    filters = request.json
    data = load_indices_data()
    data = add_analytics(data)
    
    # Apply filters
    if 'search' in filters and filters['search']:
        search_term = filters['search'].lower()
        data = [d for d in data if search_term in d['index'].lower()]
    
    if 'category' in filters and filters['category'] != 'all':
        data = [d for d in data if d['category'] == filters['category']]
    
    if 'maxRisk' in filters:
        data = [d for d in data if d['risk'] <= filters['maxRisk']]
    
    if 'minReturn' in filters:
        data = [d for d in data if d['returns'] >= filters['minReturn']]
    
    return jsonify({
        'success': True,
        'data': data,
        'count': len(data)
    })

@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """Get overall statistics"""
    data = load_indices_data()
    data = add_analytics(data)
    
    df = pd.DataFrame(data)
    
    stats = {
        'avgReturn': round(df['returns'].mean(), 2),
        'avgRisk': round(df['risk'].mean(), 2),
        'maxReturn': round(df['returns'].max(), 2),
        'minReturn': round(df['returns'].min(), 2),
        'maxRisk': round(df['risk'].max(), 2),
        'minRisk': round(df['risk'].min(), 2),
        'bestSharpe': round(df['sharpe'].max(), 2),
        'worstSharpe': round(df['sharpe'].min(), 2),
        'totalIndices': len(data),
        'correlation': round(df['returns'].corr(df['risk']), 2)
    }
    
    return jsonify({
        'success': True,
        'data': stats
    })

@app.route('/api/quadrants', methods=['GET'])
def get_quadrant_analysis():
    """Get quadrant analysis"""
    data = load_indices_data()
    data = add_analytics(data)
    
    df = pd.DataFrame(data)
    avg_return = df['returns'].mean()
    avg_risk = df['risk'].mean()
    
    quadrants = {
        'high_return_low_risk': [],
        'high_return_high_risk': [],
        'low_return_low_risk': [],
        'low_return_high_risk': []
    }
    
    for item in data:
        if item['returns'] >= avg_return and item['risk'] < avg_risk:
            quadrants['high_return_low_risk'].append(item)
        elif item['returns'] >= avg_return and item['risk'] >= avg_risk:
            quadrants['high_return_high_risk'].append(item)
        elif item['returns'] < avg_return and item['risk'] < avg_risk:
            quadrants['low_return_low_risk'].append(item)
        else:
            quadrants['low_return_high_risk'].append(item)
    
    return jsonify({
        'success': True,
        'data': quadrants,
        'averages': {
            'avgReturn': round(avg_return, 2),
            'avgRisk': round(avg_risk, 2)
        }
    })

@app.route('/api/top-performers', methods=['GET'])
def get_top_performers():
    """Get top performing indices"""
    metric = request.args.get('metric', 'returns')
    limit = int(request.args.get('limit', 10))
    
    data = load_indices_data()
    data = add_analytics(data)
    
    df = pd.DataFrame(data)
    
    if metric == 'returns':
        sorted_data = df.sort_values('returns', ascending=False)
    elif metric == 'sharpe':
        sorted_data = df.sort_values('sharpe', ascending=False)
    elif metric == 'low_risk':
        sorted_data = df.sort_values('risk', ascending=True)
    else:
        sorted_data = df
    
    top_performers = sorted_data.head(limit).to_dict('records')
    
    return jsonify({
        'success': True,
        'data': top_performers,
        'metric': metric
    })

@app.route('/api/index/<index_name>', methods=['GET'])
def get_index_details(index_name):
    """Get details for a specific index"""
    data = load_indices_data()
    data = add_analytics(data)
    
    index_data = next((item for item in data if item['index'] == index_name), None)
    
    if not index_data:
        return jsonify({
            'success': False,
            'message': 'Index not found'
        }), 404
    
    # Calculate rank
    all_returns = sorted([item['returns'] for item in data], reverse=True)
    rank = all_returns.index(index_data['returns']) + 1
    
    index_data['rank'] = rank
    index_data['totalIndices'] = len(data)
    
    return jsonify({
        'success': True,
        'data': index_data
    })

@app.route('/api/compare', methods=['POST'])
def compare_indices():
    """Compare multiple indices"""
    indices = request.json.get('indices', [])
    
    if not indices:
        return jsonify({
            'success': False,
            'message': 'No indices provided'
        }), 400
    
    data = load_indices_data()
    data = add_analytics(data)
    
    comparison = [item for item in data if item['index'] in indices]
    
    return jsonify({
        'success': True,
        'data': comparison
    })

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all unique categories"""
    data = load_indices_data()
    categories = list(set([item['category'] for item in data]))
    
    return jsonify({
        'success': True,
        'data': categories
    })

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5002))
    debug = os.environ.get('FLASK_ENV') != 'production'
    app.run(debug=debug, host='0.0.0.0', port=port)
