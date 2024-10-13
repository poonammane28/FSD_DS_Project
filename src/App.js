import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2'; // Example with Line chart

Chart.register(...registerables); // Register all necessary components

const App = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        const chartInstance = chartRef.current;
        return () => {
            if (chartInstance) {
                chartInstance.destroy(); // Clean up the chart instance
            }
        };
    }, []);

    const data = {
        labels: ['January', 'February', 'March', 'April'], // Replace with your actual data
        datasets: [
            {
                label: 'ESG Data',
                backgroundColor: 'rgba(255, 99, 132, 0.5)', // Customize colors
                borderColor: 'rgb(255, 99, 132)',
                data: [0, 10, 5, 2, 20], // Replace with your actual data
            },
        ],
    };

    return (
        <div>
            <h1>ESG Dashboard</h1>
            <Line ref={chartRef} data={data} />
        </div>
    );
};

export default App;
