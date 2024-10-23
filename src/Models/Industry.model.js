import mongoose from 'mongoose';

const industrySchema = new mongoose.Schema({
    Industry_Name: {
        type:string,
        required: true
    },
    Articles:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }],
    Ipo:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Ipo'
    }]
},{
    timestamps: true
});

const Industry = mongoose.model('Industry', industrySchema);

export default Industry;
