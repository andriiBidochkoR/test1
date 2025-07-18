const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'demo-data.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read data from file
async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is empty, return empty array
    return [];
  }
}

// Helper function to write data to file
async function writeData(data) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data:', error);
    return false;
  }
}

// Routes

// GET /api/data - Retrieve all demo data
app.get('/api/data', async (req, res) => {
  try {
    const data = await readData();
    res.json({
      success: true,
      data: data,
      count: data.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve data'
    });
  }
});

// POST /api/data - Save new demo data
app.post('/api/data', async (req, res) => {
  try {
    const { name, value, description } = req.body;
    
    // Basic validation
    if (!name || value === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Name and value are required'
      });
    }

    const data = await readData();
    
    // Create new data entry
    const newEntry = {
      id: Date.now().toString(),
      name: name,
      value: value,
      description: description || '',
      timestamp: new Date().toISOString()
    };

    data.push(newEntry);
    
    const saved = await writeData(data);
    
    if (saved) {
      res.status(201).json({
        success: true,
        data: newEntry,
        message: 'Data saved successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to save data'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/data/:id - Retrieve specific data entry
app.get('/api/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readData();
    const entry = data.find(item => item.id === id);
    
    if (entry) {
      res.json({
        success: true,
        data: entry
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Data entry not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve data'
    });
  }
});

// DELETE /api/data/:id - Delete specific data entry
app.delete('/api/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readData();
    const index = data.findIndex(item => item.id === id);
    
    if (index !== -1) {
      const deletedEntry = data.splice(index, 1)[0];
      const saved = await writeData(data);
      
      if (saved) {
        res.json({
          success: true,
          data: deletedEntry,
          message: 'Data deleted successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to delete data'
        });
      }
    } else {
      res.status(404).json({
        success: false,
        error: 'Data entry not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete data'
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Demo Data Backend API',
    version: '1.0.0',
    endpoints: {
      'GET /api/data': 'Retrieve all demo data',
      'POST /api/data': 'Save new demo data',
      'GET /api/data/:id': 'Retrieve specific data entry',
      'DELETE /api/data/:id': 'Delete specific data entry'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Demo Data Backend running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} for API documentation`);
});

module.exports = app;