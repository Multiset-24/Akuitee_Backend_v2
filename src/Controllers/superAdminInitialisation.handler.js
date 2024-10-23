import User from "../Models/User.model.js";
import sendMail from "../Utils/SendMessageMail.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";

const superAdminInitialisation =async () => {
  const SuperAdminExists = await User.findOne({ Role: "SuperAdmin" });
  if (!SuperAdminExists) {
    try {
        const IsSuperAdminAlreadyInitialsedAsUser = await User.findOne({ Email: process.env.SUPER_ADMIN_EMAIL });

        if (IsSuperAdminAlreadyInitialsedAsUser ) {
            IsSuperAdminAlreadyInitialsedAsUser.Role = "SuperAdmin";
            IsSuperAdminAlreadyInitialsedAsUser.save();
            const data = IsSuperAdminAlreadyInitialsedAsUser.toObject();
            delete data.Password;
            delete data.RefreshToken;
        
       
            console.log("Super Admin Initialised Successfully");

            await sendMail(
                data.Email,
                data.Name,
                "Super Admin Initialisation",
                `Hello ${data.Name}, you have been successfully initialised as the super admin of the application`
            );

            return new ApiResponse(200, IsSuperAdminAlreadyInitialsedAsUser, "Super Admin Initialised Successfully");
        }

      const SuperAdmin = await User.create({
        Name: process.env.SUPER_ADMIN_NAME,
        Email: process.env.SUPER_ADMIN_EMAIL,
        Password: process.env.SUPER_ADMIN_PASSWORD,
        Role: "SuperAdmin",
      });

      SuperAdmin.save();

      const data = SuperAdmin.toObject();
      delete data.Password;
      delete data.RefreshToken;
      console.log("Super Admin Initialised Successfully");
      await sendMail(
        data.Email,
        data.Name,
        "Super Admin Initialisation",
        `Hello ${data.Name}, you have been successfully initialised as the super admin of the application`
      );
      return new ApiResponse(200, data, "Super Admin Initialised Successfully");
    } catch (error) {
      throw new ApiError(500, "Failed to initialise super admin", error.message);
    }
  }
  else{
    console.log("Super Admin Already Exists");
    return new ApiResponse(200, SuperAdminExists, "Super Admin Already Exists");
  }
};

export default superAdminInitialisation;
