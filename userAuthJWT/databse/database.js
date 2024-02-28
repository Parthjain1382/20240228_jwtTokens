// External dependencies
const mongoose = require('mongoose');

// MongoDB connection URI
const uri = 'mongodb+srv://root:root@cluster0.ynjmeva.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB');
    // You can start defining your models and routes here
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define the schema for user details i.e, the collection in the mongoDB Atlas
const userDetailsSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  jwtToken: {
    type: String,
    required: true
  }
});

// Create the model for user details
const userDetails = mongoose.model('userdetails', userDetailsSchema);

// Export the modules
module.exports = {
  userDetails
};
