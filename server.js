const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const User = require('./models/User')
const bcrypt = require('bcryptjs')

const app = express()
const PORT = 3000
app.use(express.json());

//Home page api
app.get('/', (req, res) =>
  res.send('Hello World')
)

//Registering page api
app.post('/register',async(req, res) => {
    const {username, email, password} = req.body
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({username,email, password: hashedPassword})
        await user.save()
        res.json({message: "User registered.."})
        console.log("User registration completed...")

    } catch (err) {
        console.log(err)
    }

})

//Login page api

app.post('/login',async(req,res)=>{
    const {email, password} = req.body
    try{
        const user = await User.findOne({email});
        if(!user || !(await bcrypt.compare(password, user.password)))
            {
            return res.status(400).json({message: "Invalid credentials"});
            }
        res.json({message: "Login successful..", username: user.username});

    }
    catch(err){
        console.log(err)
    }
}
)


mongoose.connect(process.env.MONGO_URL).then(
    () =>console.log("DB connected successfully..")
).catch(
    (err) => console.log(err))

app.listen(PORT, (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log("Server is running on port :"+PORT)
  }
})