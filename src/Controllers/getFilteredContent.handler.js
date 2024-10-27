import ApiResponse from '../Utils/ApiResponse.js';
import {AsyncHandler} from '../Utils/AsyncHandler.js';
import Content from '../Models/Content.model.js';
import Sector from '../Models/Sector.model.js';
import Industry from '../Models/Industry.model.js';

/**
 * @desc      Get all IPOs
 * @route     GET /api/v2/content/ipos
 * @access    Public
 */
const getAllIpos = AsyncHandler(async (req, res) => {
    const ipos = await Content.find({Type: "IPO"}).populate('Author', 'Name');
    res.status(200).json(new ApiResponse(200, ipos));
});

/**
 * @desc      Get all Articles
 * @route     GET /api/v2/content/articles
 * @access    Public
 */
const getAllArtciles = AsyncHandler(async (req, res) => {
    const articles = await Content.find({Type: "ARTICLE"}).populate('Author', 'Name');
    res.status(200).json(new ApiResponse(200, articles));
});

/**
 * @desc      Get all sectors
 * @route     GET /api/v2/content/sectors
 * @access    Public
 */
const getAllsectors = AsyncHandler(async (req, res) => {
    //this gets all unique sectors
    const sectors = await Sector.find().distinct('Sector_Name');
    res.status(200).json(new ApiResponse(200, sectors));
});

/**
 * @desc      Get all industries
 * @route     GET /api/v2/content/industries
 * @access    Public
 */
const getAllIndustries = AsyncHandler(async (req, res) => {
    //this gets all unique industries
    const industries = await Industry.find().distinct('Industry_Name');
    res.status(200).json(new ApiResponse(200, industries));
});

/**
 * @desc      Get filtered content
 * @route     POST /api/v2/content/filter
 * @access    Public
 */
const getFilteredContent = AsyncHandler(async (req, res) => {
    const {Sector ,Industry , Type , Open,Closed,Listing,Category,Size} = req.body;
    const filter = {};
    if(Sector) filter.Sector = Sector;
    if(Industry) filter.Industry = Industry;
    if(Type) filter.Type = Type;
    if(Open) filter.End_date = {$gte:new Date()};
    if(Closed) filter.End_date = {$lte:new Date()};
    if(Size) filter.Size = Size;
    //get all ipos that are listing on the day of the request
    if (Listing) {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        filter.Listing_date = { $gte: startOfDay, $lt: endOfDay };
    }
    if(Category) filter.Category = Category;
    const content = await Content.find(filter).populate('Author', 'Name');
    res.status(200).json(new ApiResponse(200, content));
});

/**
 * @desc      Get specific content
 * @route     GET /api/v2/content/specific/:id
 * @access    Public
 */
const getSpecificContent = AsyncHandler(async (req, res) => {
    const {id} = req.params;
    const content = await Content.findById(id).populate('Author', 'Name');
    res.status(200).json(new ApiResponse(200, content));
});




export {getAllIpos, getAllArtciles, getAllsectors, getAllIndustries, getFilteredContent,getSpecificContent};


