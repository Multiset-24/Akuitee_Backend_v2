import mongoose from 'mongoose';

const sectorSchema = new mongoose.Schema({
    Sector_Name: {
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

const Sector = mongoose.model('Sector', sectorSchema);

export default Sector;