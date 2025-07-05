import dotenv from 'dotenv';

dotenv.config();

const mongoURI = process.env.NODE_ENV === 'production' ? process.env.MONGO_ATLAS_URI : process.env.MONGO_LOCAL_URI;

export default {mongoURI};