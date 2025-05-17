const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2t9ng6r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const uri = "mongodb+srv://<db_username>LJ0QieKHDMBerY3E:<db_password>@cluster0.2t9ng6r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

        const coffeesCollection = client.db('coffeesDB').collection('coffees');
        app.get('/coffees', async (req, res) => {
            const result = await coffeesCollection.find().toArray();
            res.send(result);
        })

        app.get(`/coffees/:id`, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeesCollection.findOne(query);
            res.send(result);
        })


        app.post('/coffees', async (req, res) => {
            const data = req.body;
            const result = await coffeesCollection.insertOne(data);
            res.send(result);
        });

        app.delete('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeesCollection.deleteOne(query);
            res.send(result);

        });

        app.put('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateData = req.body;
            const updateddoc = {
                $set: updateData
            }
            const result = await coffeesCollection.updateOne(filter, updateddoc, options);
            res.send(result);

        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.c?lose();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hellow i am a server');
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});





