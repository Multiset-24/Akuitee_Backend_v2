import StagedContent from '../Models/StagedContent.model.js';
import Content from '../Models/Content.model.js';
import Industry from '../Models/Industry.model.js';
import Sector from '../Models/Sector.model.js';
import ApiResponse from '../Utils/ApiResponse.js';
import ApiError from '../Utils/ApiError.js';
import { AsyncHandler } from '../Utils/AsyncHandler.js';
import sendMail from '../Utils/SendMessageMail.js';
import User from '../Models/User.model.js';

/**
 * @desc      Approve staged content
 * @route     POST /api/v2/staged-content/approve/:id
 * @access    Private (SuperAdmin only)
 */
const approveStagedContent = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const {Action}=req.body;
    const stagedContent = await StagedContent.findById({_id: id});
    if (!stagedContent) {
        throw new ApiError(404, "Staged content not found");
    }
    if(Action==="Rejected"){
        await stagedContent.deleteOne();
        res.status(200).json(new ApiResponse(200, "Content rejected successfully"));
    }
    const content = new Content({
        Company_Name: stagedContent.Company_Name,
        Type: stagedContent.Type,
        Sector: stagedContent.Sector,
        Industry: stagedContent.Industry,
        Content: stagedContent.Content,
        Author: stagedContent.Author,
        Start_date: stagedContent.Start_date,
        End_date: stagedContent.End_date,
        Listing_date: stagedContent.Listing_date,
        Category: stagedContent.Category
    });

    await content.save();

    // Create new industry and sector documents with the content ID
    const industryDoc = new Industry({
        Industry_Name: stagedContent.Industry,
        Content_id: content._id
    });
    const sectorDoc = new Sector({
        Sector_Name: stagedContent.Sector,
        Content_id: content._id
    });

    await industryDoc.save();
    await sectorDoc.save();
    
    const user = await User.findById(stagedContent.Author);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const message = `Your content has been approved and saved successfully`;
    const subject = `Content approval notification`;
    await sendMail(user.Email,user.Name, subject , message);

    // Send email to the author
    await stagedContent.deleteOne();

    res.status(201).json(new ApiResponse(201, "Content approved and saved successfully", content));
});


export { approveStagedContent };