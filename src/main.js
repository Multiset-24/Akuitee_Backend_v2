import dotenv from 'dotenv';
import cloudinaryConnection from './Config/Cloudinary.js';
import mongodbConnect from './Config/DbConnect.js';
dotenv.config({
    path:"../.env",// changes the dotenv format from require to import -- experimental feature
});
import app from './app.js';
import superAdminInitialisation from './Controllers/superAdminInitialisation.handler.js'


app.listen(process.env.port,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
    cloudinaryConnection();
    mongodbConnect();
    superAdminInitialisation();
})