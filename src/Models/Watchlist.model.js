import mongoose from 'mongoose';

const watchListSchema = new mongoose.Schema({
    Content:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content',
        required: true
    },
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
    timestamps: true
});

const Watchlist = mongoose.model('Watchlist', watchListSchema);

export default Watchlist;
