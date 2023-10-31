const express = require('express');
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion ,ObjectId} = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

app.get('/',(req,res) =>{
    res.send('Doctor Running')
})






const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.4ievbno.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    
    await client.connect();

    const carDataBase = client.db('carDataBase').collection('services');
    const orderDataBase = client.db("carDataBase").collection('orders');


    app.get('/services',async(req,res) => {
        const resilt = await carDataBase.find().toArray();
        res.send(resilt)
    })

    app.get('/services/:id',async(req,res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await carDataBase.findOne(query);
        res.send(result);
    })




    app.get("/checkout/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = {
        projection: { title: 1, img: 1,price : 1 },
      };
      const result = await carDataBase.findOne(query ,options);
      res.send(result);
    });

    


    app.post('/postorder',async(req,res) =>{
      const order = req.body;
      const result = await orderDataBase.insertOne(order);
      res.send(result);
    })

    app.delete('/deleteorders/:id',async (req,res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await orderDataBase.deleteOne(query);
      res.send(result);
    })

    app.put('/updateorders/:id',async(req,res) => {
      const updateOrder = req.body;
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}

      const updateDoc = {
        $set: {
          status: updateOrder.status,
        },
      };


      const result = await orderDataBase.updateOne(query,updateDoc);
      res.send(result);

      // console.log(id)
      // console.log(updateOrder)
    })
    

    app.get('/getorders',async(req,res) => {
 
      let dataQuery = {};

      if(req.query?.email){
        dataQuery = {email : req.query?.email}
      }

      const result = await orderDataBase.find(dataQuery).toArray();

      res.send(result)
      
      
    })

   
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    
  }
}
run().catch(console.dir);




app.listen(port,() => {
    console.log('the server is running.')
})