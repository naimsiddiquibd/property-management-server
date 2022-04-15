const express = require('express');
const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const { MongoClient, ServerApiVersion  } = require('mongodb');
const fileUpload = require('express-fileupload');



const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fphq6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const database = client.db('property_management');
        const usersCollection = database.collection('users');
        const listingsCollection = database.collection('listings');
        console.log('Database connected successfully');

        // app.post('/users', async (req, res) => {
        //     const user = req.body;
        //     const result = await usersCollection.insertOne(user);
        //     console.log(result);
        //     res.json(result)
        // });

        app.get('/users', async (req, res) => {
          const cursor = usersCollection.find({});
          const users = await cursor.toArray();
          res.json(users);
        });

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await usersCollection.findOne(query);
            res.json(result);
        })

        //UPDATE API
        app.put('/users/:email', async (req, res) => {
          // const email = req.params.email;
          const updatedUser = req.body;
          const {title, firstName, lastName, email, phone, location} = updatedUser;
          console.log(title, firstName, lastName, email, phone, location);
          const filter = { email: email };
          const options = { upsert: true };
          const pic = req.files.image;
          const picData = pic.data;
          const encodedPic = picData.toString('base64');
          const imageBuffer = Buffer.from(encodedPic, 'base64');
          console.log(imageBuffer);
          console.log(updatedUser);
          const updateDoc = {
              $set: {
                title,
                firstName,
                lastName,
                email,
                phone,
                location,
                image: imageBuffer
              },
          };
          const result = await usersCollection.updateOne(filter, updateDoc, options)
          console.log('updating', email)
          res.json(result)
      })

    //   app.post('/listings', async (req, res) => {
    //     const listing = req.body;
    //     const result = await listingsCollection.insertOne(listing);
    //     console.log(result);
    //     res.json(result)
    // });

    app.post('/listings', async (req, res) => {
      const email = req.body.email;
      const location = req.body.location;
      const postalCode = req.body.postalCode;
      const propertyType = req.body.propertyType;
      const commissionStructure = req.body.commissionStructure;
      const commissionPercentage = req.body.commissionPercentage;
      const listingType = req.body.listingType;
      const price = req.body.price;
      const maintenanceFee = req.body.maintenanceFee;
      const rooms = req.body.rooms;
      const bathroom = req.body.bathroom;
      const floorSize = req.body.floorSize;
      const floorLavel = req.body.floorLavel;
      const currentlyTenanted = req.body.currentlyTenanted;
      const furnishing = req.body.furnishing;
      const title = req.body.title;
      const headline = req.body.headline;
      const description = req.body.description;
      const agentName = req.body.agentName;
      const agentContactNumber = req.body.agentContactNumber;
      const airCondition = req.body.airCondition;
      const balcony = req.body.balcony;
      const cookerHood = req.body.cookerHood;
      const cornerUnit = req.body.cornerUnit;
      const highFloor = req.body.highFloor;
      const parkView = req.body.parkView;
      const waterHeater = req.body.waterHeater;
      const bathTub = req.body.bathTub;
      const MaidsRoom = req.body.MaidsRoom;
      const bombSheilter = req.body.bombSheilter;
      const cityView = req.body.cityView;
      const garage = req.body.garage;
      const groundFloor = req.body.groundFloor;
      const outdoorPatio = req.body.outdoorPatio;
      const roofTerrace = req.body.roofTerrace;
      const seaView = req.body.seaView;
      const jacuzzi = req.body.jacuzzi;
      const lakeView = req.body.lakeView;
      
      const pic1 = req.files.image1;
      const pic2 = req.files.image2;
      const pic3 = req.files.image3;
      const picData1 = pic1.data;
      const picData2 = pic2.data;
      const picData3 = pic3.data;
      const encodedPic1 = picData1.toString('base64');
      const encodedPic2 = picData2.toString('base64');
      const encodedPic3 = picData3.toString('base64');
      const imageBuffer1 = Buffer.from(encodedPic1, 'base64');
      const imageBuffer2 = Buffer.from(encodedPic2, 'base64');
      const imageBuffer3 = Buffer.from(encodedPic3, 'base64');
      const list = {
        email,
        location,
        postalCode,
        propertyType,
        commissionStructure,
        listingType,
        price,
        maintenanceFee,
        rooms,
        bathroom,
        floorSize,
        floorLavel,
        currentlyTenanted,
        furnishing,
        title,
        headline,
        description,
        agentName,
        agentContactNumber,
        airCondition,
        balcony,
        cookerHood,
        cornerUnit,
        highFloor,
        parkView,
        waterHeater,
        bathTub,
        MaidsRoom,
        bombSheilter,
        cityView,
        garage,
        groundFloor,
        outdoorPatio,
        roofTerrace,
        seaView,
        jacuzzi,
        lakeView,
        image1: imageBuffer1,
        image2: imageBuffer2,
        image3: imageBuffer3,
      }
      const result = await listingsCollection.insertOne(list);
      res.json(result);
  })

      

    app.get('/listings', async (req, res) => {
      const cursor = listingsCollection.find({});
      const listings = await cursor.toArray();
      res.json(listings);
    });

    app.get('/AllListings/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = listingsCollection.find(query);
      const result = await cursor.toArray();
      res.json(result);
  })

     // GET Single listing
     app.get('/listings/:id', async (req, res) => {
      const id = req.params.id;
      console.log('getting specific service', id);
      const query = { _id: ObjectId(id) };
      const service = await listingsCollection.findOne(query);
      res.json(service);
  })

  app.post('/users', async (req, res) => {
    const title = req.body.title;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const phone = req.body.phone;
    const location = req.body.location;
    const pic = req.files.image;
    const picData = pic.data;
    const encodedPic = picData.toString('base64');
    const imageBuffer = Buffer.from(encodedPic, 'base64');
    const doctor = {
        title,
        firstName,
        lastName,
        email,
        phone,
        location,
        image: imageBuffer
    }
    const result = await usersCollection.insertOne(doctor);
    res.json(result);
})


    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Property App listening on port ${port}`)
})