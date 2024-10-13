import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2'; // Example with Line chart

Chart.register(...registerables); // Register all necessary components

const App = () => {
    const chartRef = useRef(null);
    const [esgData, setEsgData] = useState([
        // Add your actual ESG data here or fetch it from your API
        { label: 'January', value: 10 },
        { label: 'February', value: 20 },
        { label: 'March', value: 15 },
        { label: 'April', value: 30 },
    ]);

    useEffect(() => {
        const chartInstance = chartRef.current;
        return () => {
            if (chartInstance) {
                chartInstance.destroy(); // Clean up the chart instance
            }
        };
    }, []);

    const handleDownload = async (format) => {
        const response = await fetch('http://localhost:5000/export_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                esg_data: esgData.map(item => ({ label: item.label, value: item.value })), // Prepare data for export
                format: format,
            }),
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `esg_data.${format}`; // Fix the filename
            document.body.appendChild(a);
            a.click();
            a.remove();
        } else {
            console.error('Download failed');
        }
    };

    const data = {
        labels: esgData.map(item => item.label), // Dynamic labels based on ESG data
        datasets: [
            {
                label: 'ESG Data',
                backgroundColor: 'rgba(255, 99, 132, 0.5)', // Customize colors
                borderColor: 'rgb(255, 99, 132)',
                data: esgData.map(item => item.value), // Dynamic data based on ESG data
            },
        ],
    };

    return (
        <div>
            <h1>ESG Dashboard</h1>
            <Line ref={chartRef} data={data} />
            <button onClick={() => handleDownload('csv')}>Download as CSV</button>
            <button onClick={() => handleDownload('xml')}>Download as XML</button>
            {/* Add a button for PDF if implemented */}
        </div>
    );
};

export default App;
