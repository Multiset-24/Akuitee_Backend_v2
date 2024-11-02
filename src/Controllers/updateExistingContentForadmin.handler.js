import User from "../Models/User.model.js";
import sendMail from "../Utils/SendMessageMail.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendOtpMail from "../Utils/SendOtpMail.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import Content from "../Models/Content.model.js";
import StagedContent from "../Models/StagedContent.model.js";


/**
 * @desc      Update existing content for admin
 * @route     PUT /api/v2/content/admin/update-content/:id
 * @access    Private (Admin only)
 * @note      This is for updating existing content like articles, IPOs, etc.which are already on the platform this is for admin only. In this case ,the first admin update the content then it goes to staging area for the super admin to approve or reject
 */
const updateExistingContentForadmin = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { Type, Company_name,Content: contentData, sector, industry} = req.body;
    const content = await Content.findById(id);
    if (!content) {
        throw new ApiError(404, "Content not found");
    }

    if(Type==="Article"){
        const {size} = req.body;
        if(!size){
            throw new ApiError(400, "Size is required for Article");
        }
    }
    if(Type==="IPO"){
        const {Start_date,End_date,Listing_date,Category} = req.body;
        if(!Start_date || !End_date || !Listing_date || !Category){
            throw new ApiError(400, "Start date, End date, Listing date, and Category are required for IPO");
        }
    }
    const stagedContent = new StagedContent({
        Company_Name: Company_name,
        Type: Type,
        Sector: sector,
        Industry: industry,
        Content: contentData,
    });

    if(Type==="Article"){
        stagedContent.Size = size;
    }

    if(Type==="IPO"){
        stagedContent.Start_date = Start_date;
        stagedContent.End_date = End_date;
        stagedContent.Listing_date = Listing_date;
        stagedContent.Category = Category;
    }

    stagedContent.OriginalContentId = id;
    stagedContent.Action = "Update";
    stagedContent.Author = req.user.id;
    await stagedContent.save();
    res.status(200).json(new ApiResponse(200, "Content updation request sent to super admin for approval"));
});


export { updateExistingContentForadmin };
