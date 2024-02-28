
//Build node.js user Authetication 
// Here we have used bcrypt to crypt the password while storing for more safety
const express = require('express')
const app = express()
app.use(express.json())

//encrypting the password
const bcrypt = require('bcrypt')

//port number
port = 4000;

const post = [
  {
    userName: 'pranayjain1382',
    password: 'pjain@123'
  }
]



app.post('/user', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt()
    const hashpassword = await bcrypt.hash(req.body.password, salt)
    console.log(salt);
    console.log(hashpassword);
    const user = { name: req.body.username, password: hashpassword }
    post.push(user)
    console.log(post)
    res.status(200).send()
  }
  catch {
    res.status(404).send()
  }
})

app.post('/user/login',async(req,res)=>{
  const user= post.find(user=>user.name=req.body.name)
  if(user===null){
    return res.status(500).send('no object paseed')
  }
  try{
    if(await bcrypt.compare(req.body.password,user.password)){
      res.status(200).send('success ')
    }
  }
  catch{
  res.status(404).send("Something wrong happened")
  }
})

/**Listen Port */
app.listen(port)