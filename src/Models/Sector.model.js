import mongoose from 'mongoose';

const sectorSchema = new mongoose.Schema({
    Sector_Name: {
        type:String,
        required: true
    },
    Content_id:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Content',
        required: true
    }],
},{
    timestamps: true
});

const Sector = mongoose.model('Sector', sectorSchema);

export default Sector;