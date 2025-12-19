// Global variables
let chart;
let filteredData = [...indicesData];
const riskFreeRate = 6.0; // Assuming 6% risk-free rate

// Calculate Sharpe Ratio
function calculateSharpe(returns, risk) {
    if (risk === 0) return 0;
    return ((returns - riskFreeRate) / risk).toFixed(2);
}

// Add Sharpe ratio to all data
indicesData.forEach(item => {
    item.sharpe = parseFloat(calculateSharpe(item.returns, item.risk));
});

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeStats();
    initializeChart();
    initializeControls();
    updateQuadrantCounts();
    updateTable('returns');
});

// Initialize statistics
function initializeStats() {
    const avgReturn = (indicesData.reduce((sum, item) => sum + item.returns, 0) / indicesData.length).toFixed(2);
    const avgRisk = (indicesData.reduce((sum, item) => sum + item.risk, 0) / indicesData.length).toFixed(2);
    const bestSharpe = Math.max(...indicesData.map(item => item.sharpe)).toFixed(2);

    document.getElementById('avgReturn').textContent = `${avgReturn}%`;
    document.getElementById('avgRisk').textContent = `${avgRisk}%`;
    document.getElementById('bestSharpe').textContent = bestSharpe;
}

// Initialize Chart
function initializeChart() {
    const ctx = document.getElementById('riskReturnChart').getContext('2d');
    
    // Calculate averages for quadrant lines
    const avgReturn = indicesData.reduce((sum, item) => sum + item.returns, 0) / indicesData.length;
    const avgRisk = indicesData.reduce((sum, item) => sum + item.risk, 0) / indicesData.length;

    chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Indices',
                data: indicesData.map(item => ({
                    x: item.risk,
                    y: item.returns,
                    index: item.index,
                    category: item.category,
                    sharpe: item.sharpe
                })),
                backgroundColor: function(context) {
                    const point = context.raw;
                    // Color by quadrant
                    if (point.y >= avgReturn && point.x < avgRisk) return 'rgba(16, 185, 129, 0.7)'; // Green - Best
                    if (point.y >= avgReturn && point.x >= avgRisk) return 'rgba(245, 158, 11, 0.7)'; // Orange
                    if (point.y < avgReturn && point.x < avgRisk) return 'rgba(99, 102, 241, 0.7)'; // Blue
                    return 'rgba(239, 68, 68, 0.7)'; // Red - Worst
                },
                borderColor: function(context) {
                    const point = context.raw;
                    if (point.y >= avgReturn && point.x < avgRisk) return 'rgb(16, 185, 129)';
                    if (point.y >= avgReturn && point.x >= avgRisk) return 'rgb(245, 158, 11)';
                    if (point.y < avgReturn && point.x < avgRisk) return 'rgb(99, 102, 241)';
                    return 'rgb(239, 68, 68)';
                },
                borderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#f1f5f9',
                    borderColor: '#6366f1',
                    borderWidth: 1,
                    padding: 15,
                    displayColors: false,
                    callbacks: {
                        title: function(context) {
                            return context[0].raw.index;
                        },
                        label: function(context) {
                            return [
                                `Return: ${context.parsed.y.toFixed(2)}%`,
                                `Risk: ${context.parsed.x.toFixed(2)}%`,
                                `Sharpe: ${context.raw.sharpe}`
                            ];
                        }
                    }
                },
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy',
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy',
                    }
                },
                annotation: {
                    annotations: {
                        verticalLine: {
                            type: 'line',
                            xMin: avgRisk,
                            xMax: avgRisk,
                            borderColor: 'rgba(139, 92, 246, 0.5)',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            label: {
                                content: 'Avg Risk',
                                enabled: true,
                                position: 'start'
                            }
                        },
                        horizontalLine: {
                            type: 'line',
                            yMin: avgReturn,
                            yMax: avgReturn,
                            borderColor: 'rgba(139, 92, 246, 0.5)',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            label: {
                                content: 'Avg Return',
                                enabled: true,
                                position: 'start'
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Risk (%)',
                        color: '#94a3b8',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(51, 65, 85, 0.3)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Returns (%)',
                        color: '#94a3b8',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(51, 65, 85, 0.3)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const data = chart.data.datasets[0].data[index];
                    showDetailPanel(data);
                }
            }
        }
    });
}

// Initialize controls
function initializeControls() {
    // Search functionality
    document.getElementById('searchIndex').addEventListener('input', (e) => {
        filterData();
    });

    // Category filter
    document.getElementById('filterCategory').addEventListener('change', () => {
        filterData();
    });

    // Risk filter
    document.getElementById('riskFilter').addEventListener('input', (e) => {
        document.getElementById('riskValue').textContent = `${e.target.value}%`;
        filterData();
    });

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', () => {
        document.getElementById('searchIndex').value = '';
        document.getElementById('filterCategory').value = 'all';
        document.getElementById('riskFilter').value = 30;
        document.getElementById('riskValue').textContent = '30%';
        chart.resetZoom();
        filterData();
    });

    // Table tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            updateTable(e.target.dataset.tab);
        });
    });

    // Close detail panel
    document.getElementById('closeDetail').addEventListener('click', () => {
        document.getElementById('detailPanel').classList.remove('active');
    });
}

// Filter data based on controls
function filterData() {
    const searchTerm = document.getElementById('searchIndex').value.toLowerCase();
    const category = document.getElementById('filterCategory').value;
    const maxRisk = parseFloat(document.getElementById('riskFilter').value);

    filteredData = indicesData.filter(item => {
        const matchesSearch = item.index.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || item.category === category;
        const matchesRisk = item.risk <= maxRisk;
        return matchesSearch && matchesCategory && matchesRisk;
    });

    updateChart();
    updateQuadrantCounts();
}

// Update chart with filtered data
function updateChart() {
    const avgReturn = filteredData.reduce((sum, item) => sum + item.returns, 0) / filteredData.length;
    const avgRisk = filteredData.reduce((sum, item) => sum + item.risk, 0) / filteredData.length;

    chart.data.datasets[0].data = filteredData.map(item => ({
        x: item.risk,
        y: item.returns,
        index: item.index,
        category: item.category,
        sharpe: item.sharpe
    }));

    chart.update();
}

// Update quadrant counts
function updateQuadrantCounts() {
    const avgReturn = filteredData.reduce((sum, item) => sum + item.returns, 0) / filteredData.length;
    const avgRisk = filteredData.reduce((sum, item) => sum + item.risk, 0) / filteredData.length;

    let q1 = 0, q2 = 0, q3 = 0, q4 = 0;

    filteredData.forEach(item => {
        if (item.returns >= avgReturn && item.risk < avgRisk) q1++;
        else if (item.returns >= avgReturn && item.risk >= avgRisk) q2++;
        else if (item.returns < avgReturn && item.risk < avgRisk) q3++;
        else q4++;
    });

    document.getElementById('q1Count').textContent = q1;
    document.getElementById('q2Count').textContent = q2;
    document.getElementById('q3Count').textContent = q3;
    document.getElementById('q4Count').textContent = q4;
}

// Update table based on tab
function updateTable(type) {
    let sortedData = [...filteredData];

    switch(type) {
        case 'returns':
            sortedData.sort((a, b) => b.returns - a.returns);
            break;
        case 'sharpe':
            sortedData.sort((a, b) => b.sharpe - a.sharpe);
            break;
        case 'low-risk':
            sortedData.sort((a, b) => a.risk - b.risk);
            break;
    }

    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    sortedData.slice(0, 10).forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${item.index}</strong></td>
            <td style="color: ${item.returns >= 0 ? '#10b981' : '#ef4444'}">${item.returns.toFixed(2)}%</td>
            <td style="color: #f59e0b">${item.risk.toFixed(2)}%</td>
            <td style="color: #6366f1">${item.sharpe}</td>
        `;
        row.addEventListener('click', () => showDetailPanel(item));
        tableBody.appendChild(row);
    });
}

// Show detail panel
function showDetailPanel(data) {
    const sortedByReturn = [...indicesData].sort((a, b) => b.returns - a.returns);
    const rank = sortedByReturn.findIndex(item => item.index === data.index) + 1;

    document.getElementById('detailIndex').textContent = data.index;
    document.getElementById('detailReturn').textContent = `${data.returns || data.y}%`;
    document.getElementById('detailRisk').textContent = `${data.risk || data.x}%`;
    document.getElementById('detailSharpe').textContent = data.sharpe;
    document.getElementById('detailRank').textContent = `#${rank} of 126`;

    document.getElementById('detailPanel').classList.add('active');
}
