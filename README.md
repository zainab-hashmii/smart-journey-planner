# Smart Journey Planner

A smart route-planning web application that calculates the most efficient journey between two locations using real-time routing APIs, fuel cost estimation, and an interactive map interface.

## Features

- **DSA-Based Route Optimization**: Uses min-heap (priority queue) data structure to find the shortest and most feasible path
- **Traffic-Aware Routing**: Considers real-time traffic conditions when calculating routes
- **Fuel Cost Calculation**: Estimates fuel costs based on distance, fuel price, and vehicle mileage
- **Multiple Route Visualization**: Displays all alternative routes with the best route highlighted
- **Interactive Map**: Google Maps integration for visual route representation

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Maps API Key with the following APIs enabled:
  - Maps JavaScript API (for frontend map display)
  - Directions API (for route calculation)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd smart-journey-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in `smart-journey-backend/`:
   ```env
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd smart-journey-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in `smart-journey-frontend/`:
   ```env
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   REACT_APP_BACKEND_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000` (or another port if 3000 is in use)

## How It Works

### Algorithm Overview

The application uses Data Structures and Algorithms (DSA) concepts to optimize route selection:

1. **Route Collection**: Fetches multiple route alternatives from Google Directions API
2. **Cost Calculation**: Computes a weighted cost function combining:
   - Traffic-adjusted travel time (weight: 1.0)
   - Fuel cost (weight: 0.2)
3. **Priority Queue (Min-Heap)**: Uses a min-heap data structure to efficiently select the route with the lowest combined cost
4. **Smart Score**: Normalizes route costs into a 5-10 score range for easy comparison
5. **Visualization**: Decodes polylines and renders all routes on an interactive map

### Data Structures Used

- **Min-Heap (Priority Queue)**: For efficient selection of the best route based on combined cost
- **Arrays**: For storing route alternatives and decoded polyline coordinates
- **Graph-like Structure**: Routes are represented as paths with nodes (waypoints) and edges (road segments)

## API Endpoints

### POST `/api/route`

Calculates the best route between origin and destination.

**Request Body:**
```json
{
  "origin": "Larkana, Sindh",
  "destination": "Karachi, Sindh",
  "fuelPrice": 280,
  "mileage": 14
}
```

**Response:**
```json
{
  "bestRoute": {
    "summary": "Origin → Destination",
    "distanceKm": 450.5,
    "durationTrafficMinutes": 360,
    "fuelCost": 9000,
    "smartScore": 9.1,
    "polyline": "encoded_polyline_string",
    "points": [{ "lat": 24.8607, "lng": 67.0011 }, ...]
  },
  "routes": [...]
}
```

## Troubleshooting

### "Failed to fetch route" Error

1. **Check Backend API Key**: Ensure `GOOGLE_MAPS_API_KEY` is set in `smart-journey-backend/.env`
2. **Verify API is Enabled**: Make sure Directions API is enabled in Google Cloud Console
3. **Check Billing**: Ensure billing is enabled for your Google Cloud project
4. **Restart Backend**: After changing `.env`, restart the backend server

### "This page can't load Google Maps correctly" Error

1. **Check Frontend API Key**: Ensure `REACT_APP_GOOGLE_MAPS_API_KEY` is set in `smart-journey-frontend/.env`
2. **Verify API is Enabled**: Make sure Maps JavaScript API is enabled in Google Cloud Console
3. **Check Restrictions**: If API key has HTTP referrer restrictions, add:
   - `http://localhost:3000/*`
   - `http://localhost:3001/*`
4. **Restart Frontend**: After changing `.env`, restart the frontend server (CRA only reads env vars at startup)

### Port Already in Use

If you see `EADDRINUSE` error:
- Backend: Change `PORT` in `smart-journey-backend/.env` or kill the process using port 5000
- Frontend: React will automatically use the next available port

## Project Structure

```
smart-journey-planner/
├── smart-journey-backend/
│   ├── index.js          # Express server with route calculation logic
│   ├── package.json
│   └── .env              # Backend environment variables (create this)
├── smart-journey-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── map/
│   │   │   │   └── RouteMap.jsx      # Map visualization component
│   │   │   └── journey/
│   │   │       ├── JourneyForm.jsx   # Input form component
│   │   │       └── StatsCard.jsx      # Route statistics display
│   │   ├── hooks/
│   │   │   └── useJourneyPlanner.js  # Route fetching hook
│   │   ├── services/
│   │   │   └── api.js                # API service layer
│   │   ├── utils/
│   │   │   └── polylineDecoder.js    # Polyline decoding utility
│   │   └── pages/
│   │       └── Home.jsx              # Main page component
│   ├── package.json
│   └── .env                          # Frontend environment variables (create this)
└── README.md
```

## Technologies Used

- **Backend**: Node.js, Express.js, Axios
- **Frontend**: React, Google Maps JavaScript API, Tailwind CSS
- **APIs**: Google Directions API, Google Maps JavaScript API

## License

MIT

