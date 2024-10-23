import mongoose from 'mongoose';

const stagedarticleSchema = new mongoose.Schema({
    Company_Name: {
        type:string,
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
    Content:{//delta format for using quilljs
        type:mongoose.Schema.Types.Mixed,//what does this mean?- it can be any type
        required: true
    },
    Author:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'UserSchema',
        required: true
    },
    View:{
        type:Number,
        default: 0
    },
    Status:{
        type:string,
        enum:['Draft','Published','Rejected'],
        default: 'Draft'
    }
},{
    timestamps: true
});

const StagedArticle = mongoose.model('StagedArticle', stagedarticleSchema);

export default StagedArticle;