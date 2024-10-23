import mongoose from 'mongoose';

const ipoSchema = new mongoose.Schema({
    Company_Name: {
        type:string,
        required: true
    },
    Start_date:{
        type:Date,
        required: true
    },
    End_date:{
        type:Date,
        required: true
    },
    Listing_date:{
        type:Date,
        required: true
    },
    Content:{
        type:mongoose.Schema.Types.Mixed,
        required: true
    },
    Type:{
        type:string,
        enum:['SME','NON-SME'],
        required: true
    },
    Sector:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Sector',
        required: true
    },
    Industry:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Industry',
        required: true
    },
    Author:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    View:{
        type:Number,
        default: 0
    }
},{
    timestamps: true
});

const Ipo = mongoose.model('Ipo', ipoSchema);

export default Ipo;