import mongoose from 'mongoose';

const savedipoSchema = new mongoose.Schema({
    Ipos:[{//array of ipos
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Ipo',
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

const SavedIpo = mongoose.model('SavedIpo', savedipoSchema);

export default SavedIpo;
