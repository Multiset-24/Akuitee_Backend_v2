import mongoose from 'mongoose';

const industrySchema = new mongoose.Schema({
    Industry_Name: {
        type:String,
        required: true
    },
    Content_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Content',
        required: true
    },
},{
    timestamps: true
});

const Industry = mongoose.model('Industry', industrySchema);

export default Industry;
