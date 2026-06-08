import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RiskRadarChart = () => {
    const data = {
        labels: ['Age', 'Tobacco', 'Alcohol', 'Diet', 'Genetics'],
        datasets: [{
            label: 'Risk Level',
            data: [80, 50, 20, 60, 40],
            backgroundColor: 'rgba(96, 165, 250, 0.2)',
            borderColor: '#60a5fa',
            borderWidth: 2,
            pointBackgroundColor: '#fff'
        }]
    };

    const options = {
        scales: {
            r: {
                angleLines: { color: 'rgba(255,255,255,0.1)' },
                grid: { color: 'rgba(255,255,255,0.1)' },
                pointLabels: { color: 'white' },
                ticks: { display: false }
            }
        },
        plugins: { legend: { display: false } }
    };

    return <Radar data={data} options={options} />;
};
export default RiskRadarChart;
