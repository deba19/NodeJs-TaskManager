const express =require('express')
require('./db/mongoose')
const User=require('./models/user')
const Task = require('./models/task')
const { response } = require('express')
const { ObjectId } = require('mongodb')
const app =express()
const port =process.env.PORT || 3000

app.use(express.json())

app.post('/users',async(req,res)=> {
    const user=new User(req.body)
    //await user.save()
    try
    {
        await user.save()
        res.status(201).send(user)
    }catch(e)
    {
        res.status(400).send(e)
    }
    /* user.save().then(()=>{
        res.send(user);
    }).catch(() => {
        res.status(400).send(e);
    })*/
})
//reading all data
app.get('/users',async(req,res)=>{
    try{
        const users=await User.find({})
        res.send(users)
    }catch(e){
        res.status(500).send()
    }
    /*User.find({}).then((users)=>{
        res.send(users)
    }).catch((e)=>{

    })*/
})
//reading data by id
app.get('/users/:id',async(req,res)=>{
    const _id=req.params._id
    try
    {
        const user = await User.findById(_id)
        if(!user)
        {
            return res.status(404).send()
        }
        res.send(user)
    }catch(e)
    {
        res.status(500).send()
    }
    /*  User.findById(_id).then((user)=>{
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }).catch((e)=>{
        res.status(400).send()
    })*/
})
app.post('/tasks',async(req,res)=>{
    const task=new Task(req.body)
    try
    {
        await task.save()
        res.status(201).send(task)
    }catch(e)
    {
        res.status(400).send(e)
    }
})
//reading all data
app.get('/tasks',async(req,res)=>{
    try{
        const users=await Task.find({})
        res.send(users)
    }catch(e){
        res.status(500).send()
    }
})
//reading data by id
app.get('/tasks/:id',async(req,res)=>{
    const _id=req.params._id
    try
    {
        const task = await Task.findById(_id)
        if(!task)
        {
            return res.status(404).send()
        }
        res.send(task)
    }catch(e)
    {
        res.status(500).send()
    }
})
app.listen(port,()=>{
    console.log("Server is up on port "+port);
})