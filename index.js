const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId =require('mongodb').ObjectId;

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

// connecting mongoDb with user and pass
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6xsao.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// connecting with async function 
async function run(){

try{
    await client.connect();
    const database = client.db('Mind_Fresher');
    const packagesCollection = database.collection('packages');
    const bookedPackagesCollection = database.collection('bookedpackages');

    // GET PACKAGES API 
    app.get('/packages' , async (req,res)=>{
        const cursor = packagesCollection.find({});
        const packages = await cursor.toArray();
        res.send(packages);
    })

    // POST NEW PACKAGES API 
    app.post('/newpackage', async (req,res)=>{
        const newPackage =req.body;
        const result = await packagesCollection.insertOne(newPackage);

        console.log('Got New Package',req.body);

        console.log('Added New Package',result);
        res.json(result);
    })

    // POST ALL BOOKED PACKAGES API 
    app.post('/allbookedpackage', async (req,res)=>{
        const newPackage =req.body;
        const result = await bookedPackagesCollection.insertOne(newPackage);

        console.log('Booked Package',req.body);

        console.log('Added New Package',result);
        res.json(result);
    })
    // GET ALL BOOKED PACKAGES API 
    app.get('/allbooked' , async (req,res)=>{
        const cursor = bookedPackagesCollection.find({});
        const packages = await cursor.toArray();
        res.send(packages);
    })

    // DELETE FROM ALL BOOKED 
    app.delete('/allbooked:id' , async (req,res)=>{
        const id = req.params.id;
        const query ={_id:ObjectId(id)}
        const result = await bookedPackagesCollection.deleteOne(query);
        console.log(result)
        console.log('Deleeting with ID',id)
        res.send(result);
    })

    app.get('/allbooked/:email', async (req,res)=>{
        console.log(req.params.email)
        const result = await bookedPackagesCollection.find({
            email:req.params.email}).toArray();
        console.log(result)
        res.send(result)
    })
}
// git remote add origin https://github.com/tourism-or-delivery-website-server-side-AnikBarua34.git
finally {
    // await client.close();
  }

}
run().catch(console.dir);





app.get('/', (req,res)=>{
    res.send('Mind Fresher')
});

app.listen(port,()=>{
    console.log('Listening to port', port)
});