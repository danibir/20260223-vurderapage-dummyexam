const mongoose = require("mongoose")
 
async function connectToMongoDb(dbName) {
    try{
        await mongoose.connect("mongodb://10.12.15.22:27017/?directConnection=true&appName=mongosh+2.7.0", {dbName})
        console.log("Connected to mondoDB on collection: ", mongoose.connection.name)

    }catch(err){
        console.log("Error on mongoDbHandler on path /handlers/mongoDbHandler.js. Error: ", err)
        throw err
    }
}

module.exports = 
{
    connectToMongoDb
}