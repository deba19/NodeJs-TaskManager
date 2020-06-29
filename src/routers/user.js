const express=require('express')
const router = new express.Router()
const User=require('../models/user')

router.post('/users',async(req,res)=> {
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
//Login to User Account
router.post('/users/login',async(req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email, req.body.password)
        res.send(user)
    }catch(e)
    {
        res.status(400).send()
    }
})
//reading all data
router.get('/users',async(req,res)=>{
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
router.get('/users/:id',async(req,res)=>{
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

//Updating user by ID
router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const user=await User.findById(req.params.id)
        updates.forEach((update)=>{
            user[update]=req.body[update]
        })
        await user.save()
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    
        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})
//Deleting User
router.delete('/users/:id',async(req,res)=>{
    try{
        const user=await User.findByIdAndDelete(req.params.id)
        if(!user)
        {
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send()
    }
})

  
module.exports=router