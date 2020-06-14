const mongodb = require('mongodb')
const MongoClient=mongodb.MongoClient
const ObjectID=mongodb.ObjectID
const connetionURL='mongodb://127.0.0.1:27017'
const databaseName='task-manager'
//generating new ID
const id=new ObjectID()

MongoClient.connect(connetionURL,{useNewUrlParser:true,useUnifiedTopology:true},(error,client
)=>{
    if(error)
    {
       return console.log("Unable to connect to database")
    }
    const db=client.db(databaseName)
    db.collection('users').insertOne({
        name:'Debasis',
        age: 21
    },(error,result)=>{
        if(error)
        return console.log("Unable to insert user");

        console.log(result.ops);
    })
});

