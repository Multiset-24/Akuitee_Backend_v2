import mongoose from 'mongoose';

const savedarticleSchema = new mongoose.Schema({
    Articles:[{//array of articles
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    }],
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
    timestamps: true
});


const SavedArticle = mongoose.model('SavedArticle', savedarticleSchema);

export default SavedArticle;