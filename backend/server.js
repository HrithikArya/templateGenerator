const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');


const allowedOrigins = [
    'http://localhost:3000', // Your local development URL
    'http://localhost:5500', // Your local development URL
    'https://hrithikarya.github.io/templateGenerator/' // Your GitHub Pages URL
];

const app = express();
//const PORT = 3000;

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
app.use(express.json());
//app.use(bodyParser.urlencoded({ extended: true }));

const uri = "mongodb+srv://template_local:BTCmKGZiSa546T@templatebrandsnames.5c8mu.mongodb.net/?retryWrites=true&w=majority&appName=TemplateBrandsNames";

// MongoDB connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((error) => {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit the process if the connection fails
    });

// Define Mongoose schema and model
const brandSchema = new mongoose.Schema({ name: String });
const Brand = mongoose.model('Brand', brandSchema);

// Load brands from MongoDB
app.get('/api/brands', async (req, res) => {
    try {
        const brands = await Brand.find();
        res.json(brands.map(brand => brand.name));
    } catch (error) {
        res.status(500).json({ error: 'Failed to load brands' });
    }
});

// Save brands to MongoDB
app.post('/api/brands', async (req, res) => {
    try {
        // Clear existing brands and add new ones
        await Brand.deleteMany({});
        const newBrands = req.body.brands.map(name => ({ name }));
        await Brand.insertMany(newBrands);
        res.json({ message: 'Brands saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save brands' });
    }
});

// Start the server
// Start the server (not needed on Vercel)
const PORT = process.env.PORT || 3000; // For local testing only
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
/* // Load brands from JSON file
app.get('/api/brands', (req, res) => {
    fs.readFile('brands.json', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data' });
        }
        res.json(JSON.parse(data));
    });
}); 
// Save brands to JSON file
app.post('/api/brands', (req, res) => {
    const brands = req.body.brands;
    fs.writeFile('brands.json', JSON.stringify(brands, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to save data' });
        }
        res.json({ message: 'Brands saved successfully' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); */
