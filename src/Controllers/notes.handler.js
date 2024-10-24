import ApiError from '../Utils/ApiError.js';
import ApiResponse from '../Utils/ApiResponse.js';
import { AsyncHandler } from '../Utils/AsyncHandler.js';
import Note from '../Models/Note.model.js';

/**
 * @desc      Create a new note
 * @route     POST /api/v2/profile/notes
 * @access    Private
 */
const notesCreation = AsyncHandler(async (req, res) => {
    const { noteContent } = req.body; // Renamed to avoid confusion
    const User_id = req.user.id;

    const note = new Note({
        Note: noteContent,
        User_id
    });

    await note.save();
    res.json(new ApiResponse(201, 'Note created successfully'));
});

/**
 * @desc      Get all notes of a particular user
 * @route     GET /api/v2/profile/notes
 * @access    Private
 */
const notesList = AsyncHandler(async (req, res) => {
    const User_id = req.user.id;
    const notes = await Note.find({ User_id }).populate('User_id', 'Name').sort({ createdAt: -1 });
    const list=notes.map((note)=>{return {id:note._id,note:note.Note}});

    res.json(new ApiResponse(200, 'Notes fetched successfully', list));
});

/**
 * @desc      Update a note
 * @route     PUT /api/v2/profile/notes/:id
 * @access    Private
 */
const notesUpdate = AsyncHandler(async (req, res) => {
    const { noteContent } = req.body; // Renamed to avoid confusion
    const User_id = req.user.id;
    const note = await Note.findOne({ User_id, _id: req.params.id });

    if (!note) {
        throw new ApiError(404, 'Note not found');
    }

    note.Note = noteContent;
    await note.save();

    res.json(new ApiResponse(200, 'Note updated successfully'));
});

/**
 * @desc      Delete a note
 * @route     DELETE /api/v2/profile/notes/:id
 * @access    Private
 */
const notesDelete = AsyncHandler(async (req, res) => {
    const User_id = req.user.id;
    const note = await Note.findOne({ User_id, _id: req.params.id });

    if (!note) {
        throw new ApiError(404, 'Note not found');
    }

    await note.deleteOne();
    res.json(new ApiResponse(200, 'Note deleted successfully'));
});

export { notesCreation, notesList, notesUpdate, notesDelete };