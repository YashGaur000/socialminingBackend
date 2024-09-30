process.env.NODE_OPTIONS = '--tls-min-v1.2';
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const URI = process.env.MONGODB_URI || "";
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    tls: true,                      
    tlsAllowInvalidCertificates: false, 
  },
});
async function getDatabase(){
  try {
    
   await client.connect();
   console.log("Pinged your deployment. You successfully connected to MongoDB!");
   return  client.db("socialmining");
   
  } catch (err) {
    console.error(err);
  }

}

module.exports = { getDatabase };

