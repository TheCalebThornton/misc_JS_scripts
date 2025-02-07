# HubSpot Code Assessment

## Overview
This project is a code assessment for HubSpot (Gather HubSpot API data. Modify. Post back to HubSpot).

## Prerequisites
- Node.js installed on your system
- API key for HubSpot integration

## Installation
1. Clone this repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd hubspot
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
   The application will be available at http://localhost:8080 (see server.js to adjust port)

## Usage

1. Open your web browser and navigate to http://localhost:8080

2. Click the "Get Data" button to fetch data from the API
   - The GET response will be processed (according to HubSpot rules, TBD).
   - The processed data will be sent via POST to HubSpot and printed below the button.
