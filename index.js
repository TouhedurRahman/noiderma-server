const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fxqg8by.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // Select the database and collection
        const reviewsCollection = client.db('noiderma_db').collection('reviews');

        // add or update a review api
        app.post('/reviews', async (req, res) => {
            const {
                pid,
                pname,
                title,
                description,
                rating,
                ratingLabel,
                photos,
                nickname,
                location,
                email,
                mobile,
                age,
                gender,
                skinType,
                likeMost,
                primaryReason,
                usageFrequency,
                usageDuration,
                buyAgain
            } = req.body;

            try {
                // Check if a product with the same pname and email exists
                const filter = { pname, email };
                const update = {
                    $set: {
                        pid,
                        pname,
                        title,
                        description,
                        rating,
                        ratingLabel,
                        photos,
                        nickname,
                        location,
                        email,
                        mobile,
                        age,
                        gender,
                        skinType,
                        likeMost,
                        primaryReason,
                        usageFrequency,
                        usageDuration,
                        buyAgain
                    },
                };
                const options = { upsert: true }; // Create the document if it doesn't exist

                const result = await reviewsCollection.updateOne(filter, update, options);

                if (result.matchedCount > 0) {
                    res.status(200).json({ message: 'Product updated successfully' });
                } else {
                    res.status(201).json({ message: 'New product created successfully' });
                }
            } catch (err) {
                res.status(500).json({ message: 'Error saving product', error: err.message });
            }
        });

        //get all reviews api
        app.get('/reviews', async (req, res) => {
            const result = await reviewsCollection.find().sort({ _id: -1 }).toArray();
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("✅ Database Successfully Connected!");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});