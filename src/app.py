# app.py
from flask import Flask, jsonify, request
import requests
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Replace this with the actual ESG API URL and key
ESG_API_URL = 'https://api.example.com/esg'
API_KEY = 'your_esg_api_key'

@app.route('/get_esg_data', methods=['GET'])
def get_esg_data():
    # Fetching ESG data from an API
    try:
        headers = {'Authorization': f'Bearer {API_KEY}'}
        response = requests.get(ESG_API_URL, headers=headers)
        data = response.json()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/export_data', methods=['POST'])
def export_data():
    data = request.json
    format_type = data.get("format")

    df = pd.DataFrame(data['esg_data'])

    if format_type == 'csv':
        csv_data = df.to_csv(index=False)
        return csv_data, {'Content-Disposition': 'attachment;filename=esg_data.csv'}
    elif format_type == 'xml':
        xml_data = df.to_xml()
        return xml_data, {'Content-Disposition': 'attachment;filename=esg_data.xml'}
    elif format_type == 'pdf':
        # You can use a tool like ReportLab or similar to export as PDF
        # For brevity, return a simple message here
        return jsonify({"message": "PDF export not implemented yet"})
    return jsonify({"error": "Invalid format"}), 400

if __name__ == '__main__':
    app.run(debug=True)
# app.py - continue from previous code
import openai

# Add a new route for the LLM integration
@app.route('/ask_esg', methods=['POST'])
def ask_esg():
    question = request.json.get('question')

    try:
        openai.api_key = 'your_openai_api_key'
        response = openai.Completion.create(
            engine="text-davinci-003",  # Or GPT-4 if available
            prompt=f"Answer the following question about ESG metrics: {question}",
            max_tokens=100
        )
        return jsonify({"response": response['choices'][0]['text']})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
