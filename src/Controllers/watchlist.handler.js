import ApiError from '../Utils/ApiError.js';
import ApiResponse from '../Utils/ApiResponse.js';
import {AsyncHandler} from '../Utils/AsyncHandler.js';
import Watchlist from '../Models/Watchlist.model.js';
import Content from '../Models/Content.model.js';

/**
 * @desc Add a content to watchlist
 * @route POST /api/v2/profile/watchlist/add
 * @access Private
 */
const addToWatchlist = AsyncHandler(async (req, res) => {
    const content_path = await Content.findById(req.params.id);
    if(!content_path){
        throw new ApiError(404, 'Content not found');
    }

    const user = req.user;
    const watchlistExists = await Watchlist.findOne({Content: content_path._id, User: user.id});
    if(watchlistExists){
        res.status(400).json(new ApiResponse(400, 'Content already in watchlist'));
    }
    const watchlist = await Watchlist.create({
        Content: content_path._id,
        User: user.id
    });
    res.status(200).json(new ApiResponse(200, watchlist));
});

/**
    * @desc Remove a content from watchlist
    * @route DELETE /api/v2/profile/watchlist/remove
    * @access Private
 */
const removeFromWatchlist = AsyncHandler(async (req, res) => {
    const user = req.user;
    const x = await Watchlist.findById(req.params.id);
    if(!x){
        throw new ApiError(404, 'Content not found');
    }
    if(x.User != user.id){
        throw new ApiError(401, 'Unauthorized');
    }
    await x.deleteOne();
    res.status(200).json(new ApiResponse(200, "Content removed from watchlist"));
});

/**
 * @desc Get all the contents in the watchlist
 * @route GET /api/v2/profile/watchlist
 * @access Private
 */
const getWatchlist = AsyncHandler(async (req, res) => {
    const user = req.user;
    const watchlist = await Watchlist.find({User: user.id}).populate('Content','Company_Name Type'); 
    res.status(200).json(new ApiResponse(200, watchlist));
});

export {addToWatchlist, removeFromWatchlist, getWatchlist};
