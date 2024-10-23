import mongoose from "mongoose";
// import { initializeMasterAdmin } from "../Controllers/masterAdminInitialisation.js";

const mongodbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        // initializeMasterAdmin(); 
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("Error while connecting to MongoDB", error);
    }
};


export default mongodbConnect