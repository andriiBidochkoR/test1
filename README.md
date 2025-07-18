# test1

Simple Backend for Demo Data Storage

## Overview

This is a lightweight Node.js backend service that provides RESTful API endpoints for storing and retrieving demo data. The data is persisted in a JSON file for simplicity.

## Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

The server will start on port 3000 by default. You can change this by setting the `PORT` environment variable.

## API Endpoints

### Base URL
`http://localhost:3000`

### Endpoints

#### GET /
Returns API documentation and available endpoints.

#### GET /health
Health check endpoint that returns server status.

#### GET /api/data
Retrieve all demo data entries.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1642123456789",
      "name": "Sample Data",
      "value": "example value",
      "description": "This is a sample entry",
      "timestamp": "2024-01-01T12:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### POST /api/data
Save a new demo data entry.

**Request Body:**
```json
{
  "name": "Data Name",
  "value": "Data Value",
  "description": "Optional description"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1642123456789",
    "name": "Data Name",
    "value": "Data Value",
    "description": "Optional description",
    "timestamp": "2024-01-01T12:00:00.000Z"
  },
  "message": "Data saved successfully"
}
```

#### GET /api/data/:id
Retrieve a specific data entry by ID.

#### DELETE /api/data/:id
Delete a specific data entry by ID.

## Data Storage

Data is stored in a `demo-data.json` file in the project root. Each entry has the following structure:

- `id`: Unique identifier (timestamp-based)
- `name`: Name of the data entry (required)
- `value`: Value of the data entry (required)
- `description`: Optional description
- `timestamp`: ISO string of when the entry was created

## Example Usage

### Using curl

Save data:
```bash
curl -X POST http://localhost:3000/api/data \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Entry", "value": "Test Value", "description": "This is a test"}'
```

Retrieve all data:
```bash
curl http://localhost:3000/api/data
```

## Development

To run in development mode:
```bash
npm run dev
```

## License

ISC