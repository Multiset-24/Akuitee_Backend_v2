import User from '../Models/User.model.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendOtpMail from '../Utils/SendOtpMail.js';
import ApiError from '../Utils/ApiError.js';
import ApiResponse from '../Utils/ApiResponse.js';
import { AsyncHandler } from '../Utils/AsyncHandler.js';
import Content from '../Models/Content.model.js';
import Industry from '../Models/Industry.model.js';
import Sector from '../Models/Sector.model.js';

/**
 * @desc      Create new content
 * @route     POST /api/v2/content/create
 * @access    Private (SuperAdmin only)
 * 
 */
const createContent = AsyncHandler(async (req, res) => {
    const { Company_name, Type, sector, industry, Content: contentData } = req.body;

    if (Type === "IPO") {
        const { Start_date, End_date, Listing_date, Category } = req.body;
        if (!Start_date || !End_date || !Listing_date || !Category) {
            throw new ApiError(400, "Start date, End date, Listing date, and Category are required for IPO");
        }
    }
    if(!Company_name || !Type || !sector || !industry || !contentData){
        throw new ApiError(400, "Company name, Type, Sector, Industry, and Content are required");
    }
    const Author = req.user.id;
    const content = new Content({
        Company_Name: Company_name,
        Type,
        Sector:sector,
        Industry:industry,
        Content: contentData,
        Author
    });

    if (Type === "IPO") {
        const { Start_date, End_date, Listing_date, Category } = req.body;
        content.Start_date = Start_date;
        content.End_date = End_date;
        content.Listing_date = Listing_date;
        content.Category = Category;
    }

    await content.save();

    // Create new industry and sector documents with the content ID
    const industryDoc = new Industry({
        Industry_Name: industry,
        Content_id: content._id
    });
    const sectorDoc = new Sector({
        Sector_Name: sector,
        Content_id: content._id
    });

    await industryDoc.save();
    await sectorDoc.save();

    res.status(201).json(new ApiResponse(201, "Content created successfully", content));
});

/**
 * @desc      Update existing content
 * @route     PUT /api/v2/content/update/:id
 * @access    Private (SuperAdmin only)
 */
const updateContent = AsyncHandler(async (req, res) => {
    const { Company_name, Type, Sector, Industry, Content: contentData } = req.body;
    const { id } = req.params;

    const content = await Content.findById(id);
    if (!content) {
        throw new ApiError(404, "Content not found");
    }

    if (Type === "IPO") {
        const { Start_date, End_date, Listing_date, Category } = req.body;
        if (!Start_date || !End_date || !Listing_date || !Category) {
            throw new ApiError(400, "Start date, End date, Listing date, and Category are required for IPO");
        }
        content.Start_date = Start_date;
        content.End_date = End_date;
        content.Listing_date = Listing_date;
        content.Category = Category;
    }

    content.Company_Name = Company_name;
    content.Type = Type;
    content.Sector = Sector;
    content.Industry = Industry;
    content.Content = contentData;

    await content.save();
    res.status(200).json(new ApiResponse(200, "Content updated successfully", content));
});

/**
 * @desc      Delete content
 * @route     DELETE /api/v2/content/delete/:id
 * @access    Private (SuperAdmin only)
 */
const deleteContent = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    const content = await Content.findById(id);
    if (!content) {
        throw new ApiError(404, "Content not found");
    }

    //first delete the industry and sector documents
    const industry = await Industry.findOne({ Content_id: content._id, Industry_Name: content.Industry });
    const sector = await Sector.findOne({ Content_id: content._id, Sector_Name: content.Sector });

    await industry.deleteOne();
    await sector.deleteOne();

    await content.deleteOne();

    res.status(200).json(new ApiResponse(200, "Content deleted successfully"));
});



export { createContent, updateContent ,deleteContent};