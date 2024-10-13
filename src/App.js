// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { saveAs } from 'file-saver';

function App() {
  const [esgData, setEsgData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchESGData();
  }, []);

  const fetchESGData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get_esg_data');
      setEsgData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ESG data:', error);
      setLoading(false);
    }
  };

  const exportData = async (format) => {
    try {
      const response = await axios.post('http://localhost:5000/export_data', {
        esg_data: esgData,
        format: format,
      }, { responseType: 'blob' });
      
      let mimeType;
      let extension;

      switch (format) {
        case 'csv':
          mimeType = 'text/csv';
          extension = 'csv';
          break;
        case 'xml':
          mimeType = 'application/xml';
          extension = 'xml';
          break;
        case 'pdf':
          mimeType = 'application/pdf';
          extension = 'pdf';
          break;
        default:
          throw new Error('Unsupported format');
      }

      const blob = new Blob([response.data], { type: mimeType });
      saveAs(blob, `esg_data.${extension}`);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  // Function to save a text file (reintroduced `saveFile`)
  const saveFile = () => {
    const blob = new Blob(['Hello, ESG Dashboard!'], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'esg-dashboard.txt');
  };

  const chartData = {
    labels: esgData.map((item) => item.company),
    datasets: [
      {
        label: 'ESG Scores',
        data: esgData.map((item) => item.esgScore),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="App">
      <h1>ESG Metrics Dashboard</h1>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div>
          <Bar data={chartData} />
          <div>
            <button onClick={() => exportData('csv')}>Export CSV</button>
            <button onClick={() => exportData('xml')}>Export XML</button>
            <button onClick={() => exportData('pdf')}>Export PDF</button>
            <button onClick={saveFile}>Save Text File</button> {/* Save a simple text file */}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
