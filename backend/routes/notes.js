const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const Fetchuser = require('../middleware/Fetchuser');
const { body, validationResult } = require('express-validator');

//routes1:  get all notes of  User using: get"/api/auth/fetchalnotes"
router.get('/fetchallnotes',Fetchuser,async(req,res)=>{
    try {
        const notes = await Note.find({user: req.user.id});
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
    }

})
//routes2:  add a new notes of  User using: POST "/api/auth/addnote"
router.post('/addnote',Fetchuser,[
    body('title','enter a valid title').isLength({ min: 3 }),
    body('description','enter a valid descriptin').isLength({ min: 5 }),
],async(req,res)=>{
    try {
    const {title,description,tag}= req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const note = new Note({
        title,description,tag,user :req.user.id
    })
    const savedNote = await note.save()
   res.json(savedNote)      
} catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured"); 
}
})
//routes3:  update a new notes of  User using: POST "/api/auth/updatenote"
router.put('/updatenote/:id',Fetchuser, async(req,res)=>{
    const { title, description, tag }= req.body;
    // adding a new note
    const newNote = {};
    if (title) {newNote.title= title};
    if (description) {newNote.description= description};
    if (tag) {newNote.tag= tag};
    // find the note to be updated
    let note= await Note.findById(req.params.id);
    if(!note){return res.status(404).send("NOt found")}

    if(note.user.toString() !==req.user.id){
        return res.send(404).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(req.params.id,{$set:newNote}, {new:true})
    res.json({note}); 
})   
//routes4:  delete a existing notes of  User using: Delete "/api/auth/deletenote"
router.delete('/deletenote/:id',Fetchuser, async (req,res)=>{
    const {title,description,tag}= req.body;
   
  
    // find the note to be updated
    let note= await Note.findById(req.params.id);
    if(!note){return res.status(404).send("NOt found")}

    if(note.user.toString() !==req.user.id){
        return res.send(404).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id)
    res.json({"success":"noe deleted"}); 

})
 module.exports= router