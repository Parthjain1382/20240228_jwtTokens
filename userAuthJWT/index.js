//external dependencies
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
require('dotenv').config()

//encrypting the password
const bcrypt = require('bcrypt')

// Middleware to parse JSON bodies
app.use(bodyParser.json());
// Middleware to parse incoming requests with JSON payloads
app.use(express.json());
// Middleware to parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));


//port number
const port = 4000

//databse requirement
const { userDetails } = require('./databse/database.js');

//This is the api Call to get the user detail from the database
app.get('/user', async (req, res) => {
  try {
    const username = req.query.username;
    //finding the specific user
    const user = await userDetails.findOne({ username: username })

    //If user found
    if (user) {
      res.status(200).json(user);
    }
    //if user not found 
    else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).send('Internal Server Error');
  }
});


//To add a new user to the database with hashing the password
app.post('/signup', async (req, res) => {
  try {
    //salt generation
    const salt = await bcrypt.genSalt();
    //adding the salt to the password
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    console.log('Salt:', salt);
    console.log('Hashed Password:', hashPassword);

    // Create a new user document using the userDetails model
    const newUser = new userDetails({
      username: req.body.username,
      password: hashPassword,
      jwtToken:" "
    });
    // Save the new user to the database
    await newUser.save();
    //printing the new user
    console.log('New User:', newUser);
    res.status(200).send('User created successfully');
  }
  catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Internal Server Error');
  }
});

//To login after the signUp process
app.post('/login', async (req, res) => {
  try {
    // Find user in userDetails collection by username
    const user = await userDetails.findOne({ username: req.body.username });

    // If the user is not found
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Compare the given password with the user's hashed password
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);

    if (passwordMatch) {
      // Generate JWT token
      const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET);

      // Update the JWT token in the database
      await userDetails.findOneAndUpdate({ username: user.username }, { jwtToken: accessToken });
      res.json({ accessToken: accessToken });
    } else {
      res.status(401).send('Invalid password');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(404).send('Internal Server Error');
  }
});


//Getting the useername from the jwt token 
app.post('/details', async (req, res) => {
  const jwtToken = req.body.jwt;

  if (!jwtToken) {
    return res.status(400).send('Token not provided');
  }

  try {
    // Decode the JWT token to get the payload
    const decodedToken = jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET);
   
    // Extract the username from the decoded payload
    const username = decodedToken.username;
    
    // Fetch user details from the database based on the username
    const user = await userDetails.findOne({ username: username });
//if user not found
    if (!user) {
      return res.status(404).send('User not found');
    }
//printing the useraname
    res.status(200).send(user.username)
  } catch (error) {
    console.error('Error decoding JWT:', error);
    res.status(500).send('Error decoding JWT');
  }
});


//listening port
app.listen(port, () => {
  console.log(`This app listening on port ${port}`)
})