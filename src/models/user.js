const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task=require('./task')
const userSchema=new mongoose.Schema({
    name : {
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        unique:true,
        require:true,
        trim:true,
        lowercase:true, 
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error('Email is invalid');
            }
        }
    },
    password:
    {
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value)
        {
            if(value.toLowerCase().includes('password'))
            throw new Error("Password cannot contain 'password'");
        }
    },
    age:
    {
        type:Number,
        default : 18,
        validate(value)
        {
            if(value<0)
            {
                throw new Error('Age must be a positive number');
            }
        }
    },
    tokens:
    [{
        token:{
            type:String,
            required:true,
        }
    }],
    avatar:{
        type:Buffer,
    }
},
{
    timestamps:true,
})
userSchema.virtual('task',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner' 
})
//Function to show what actually should be displayed
userSchema.methods.toJSON=function(){
    const user=this
    const userObject=user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}
//Json web token
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}
//login
userSchema.statics.findByCredentials = async(email,password)=>{
    user=await User.findOne({email})
    if(!user)
    {
        throw new Error ('Unable to login')
    }
    const isMatch =await bcrypt.compare(password,user.password)
    if(!isMatch)
    {
        throw new Error ('Unable to login')
    }
    return user
}
//Hash the plain text password
userSchema.pre('save',async function(next){
    const user=this
    if(user.isModified('password'))
    {
        user.password=await bcrypt.hash(user.password,8)
    }
    next()
})

//Delete user tasks when user account is deleted
userSchema.pre('remove',async function(next){
    const user=this
    Task.deleteMany({owner:user._id})
    next()
})
const User = mongoose.model('User',userSchema)

module.exports=User