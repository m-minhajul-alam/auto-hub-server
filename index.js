const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eyhxp1w.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // await client.connect();

        const productCollection = client.db('autoHubDB').collection('products');
        const myCartCollection = client.db('autoHubDB').collection('myCart');

        // productCollection
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);
        })

        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        })

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const updateProduct = req.body;
            const product = {
                $set: {
                    productImage: updateProduct.productImage,
                    productName: updateProduct.productName,
                    brandName: updateProduct.brandName,
                    productType: updateProduct.productType,
                    productPrice: updateProduct.productPrice,
                    shortDesc: updateProduct.shortDesc,
                    rating: updateProduct.rating
                }
            };
            const result = await productCollection.updateOne(query, product, option);
            res.send(result);
        })



        // myCartCollection
        app.get('/myCart', async (req, res) => {
            const cursor = myCartCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/myCart/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await myCartCollection.findOne(query);
            res.send(result);
        })

        app.post('/myCart', async (req, res) => {
            const myCart = req.body;
            const result = await myCartCollection.insertOne(myCart);
            res.send(result);
        })

        app.delete('/myCart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await myCartCollection.deleteOne(query);
            res.send(result);
        })

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
    res.send("This is the root page of AutoHub server side");
});

app.listen(port, () => {
    console.log(`AutoHub runnig server on port: ${port}`);
})