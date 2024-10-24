import mongoose from 'mongoose';

const savedContentSchema = new mongoose.Schema({
    Content:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StagedContent',
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

const SavedContent = mongoose.model('SavedContent', savedContentSchema);

export default SavedIpo;
