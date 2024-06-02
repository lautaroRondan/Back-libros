import mongoose, { ConnectOptions } from 'mongoose';

const MONGO_URI = 'mongodb+srv://lautarorondan96:uB899QM8iYudW0H7@cluster0.wuaxupj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectDB  = async () => {
  try {
    const options: ConnectOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    };

    await mongoose.connect(MONGO_URI, options);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;




