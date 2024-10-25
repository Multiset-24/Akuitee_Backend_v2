import StagedContent from '../Models/StagedContent.model.js';
import ApiResponse from '../Utils/ApiResponse.js';
import ApiError from '../Utils/ApiError.js';
import { AsyncHandler } from '../Utils/AsyncHandler.js';

/**
 * @desc      Create new staged content
 * @route     POST /api/v2/staged-content/create
 * @access    Private (Admin only)
 */
const createStagedContent = AsyncHandler(async (req, res) => {
    const { Company_name, Type, sector, industry, Content: contentData } = req.body;

    if (Type === "IPO") {
        const { Start_date, End_date, Listing_date, Category } = req.body;
        if (!Start_date || !End_date || !Listing_date || !Category) {
            throw new ApiError(400, "Start date, End date, Listing date, and Category are required for IPO");
        }
    }
    if (!Company_name || !Type || !sector || !industry || !contentData) {
        throw new ApiError(400, "Company name, Type, Sector, Industry, and Content are required");
    }
    const Author = req.user.id;
    const stagedContent = new StagedContent({
        Company_Name: Company_name,
        Type,
        Sector: sector,
        Industry: industry,
        Content: contentData,
        Author: Author
    });

    if (Type === "IPO") {
        const { Start_date, End_date, Listing_date, Category } = req.body;
        stagedContent.Start_date = Start_date;
        stagedContent.End_date = End_date;
        stagedContent.Listing_date = Listing_date;
        stagedContent.Category = Category;
    }

    await stagedContent.save();

    res.status(201).json(new ApiResponse(201, "Staged content created successfully", stagedContent));
});

/**
 * @desc      Update existing staged content
 * @route     PUT /api/v2/staged-content/update/:id
 * @access    Private (Admin only)
 */
const updateStagedContent = AsyncHandler(async (req, res) => {
    const { Company_name, Type, sector, industry, Content: contentData } = req.body;
    const { id } = req.params;

    const stagedContent = await StagedContent.findById(id);
    if (!stagedContent) {
        throw new ApiError(404, "Staged content not found");
    }

    if (Type === "IPO") {
        const { Start_date, End_date, Listing_date, Category } = req.body;
        if (!Start_date || !End_date || !Listing_date || !Category) {
            throw new ApiError(400, "Start date, End date, Listing date, and Category are required for IPO");
        }
        stagedContent.Start_date = Start_date;
        stagedContent.End_date = End_date;
        stagedContent.Listing_date = Listing_date;
        stagedContent.Category = Category;
    }

    stagedContent.Company_Name = Company_name;
    stagedContent.Type = Type;
    stagedContent.Sector = sector;
    stagedContent.Industry = industry;
    stagedContent.Content = contentData;

    await stagedContent.save();
    res.status(200).json(new ApiResponse(200, "Staged content updated successfully", stagedContent));
});

/**
 * @desc      Delete staged content
 * @route     DELETE /api/v2/staged-content/delete/:id
 * @access    Private (Admin only)
 */
const deleteStagedContent = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    const stagedContent = await StagedContent.findById(id);
    if (!stagedContent) {
        throw new ApiError(404, "Staged content not found");
    }

    await stagedContent.deleteOne();

    res.status(200).json(new ApiResponse(200, "Staged content deleted successfully"));
});

export { createStagedContent, updateStagedContent, deleteStagedContent };