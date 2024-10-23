import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    Company_Name: {
        type:string,
        required: true,
        unique: true
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

const Article = mongoose.model('Article', articleSchema);

export default Article;