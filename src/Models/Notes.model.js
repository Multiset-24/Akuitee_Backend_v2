import { time } from 'console';
import mongoose from 'mongoose';

const noteSchema = new mongoose.schema({
    Note:{
        type:string,
        required: true
    },
    User_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},{
    timestamps: true
});

const Note = mongoose.model('Note', noteSchema);

export default Note;