const express = require('express');
const mongoose = require('mongoose');
const {ObjectId} = require('mongodb');
const app = express();
const PORT = 3000;

app.use(express.json());

const taskSchema = new mongoose.Schema({
    content:String,
    dateCreated:{ type: Date, default: Date.now },
    completed:{
        type:Boolean,
        default:false
    }
})

const Task = mongoose.model('Task', taskSchema);

async function connectToDb() {
        await mongoose.connect('mongodb://127.0.0.1:27017/TaskList');
   }

connectToDb().catch(err => console.log(err));

app.listen(
    PORT, 
    () => console.log(`it is running on http://localhost:${PORT}`)
)

app.get('/', async (req, res) =>{
    let tasks;
    try {
        tasks = await Task.find()
    } catch (error) {
        console.log(error)
    }

    if(tasks){
        res.status(200).json(tasks)
    }else{
        res.status(404).send('failed to find tasks');

    }
    
})

app.get('/:id', async (req, res) =>{
    let task;

    if(ObjectId.isValid(req.params.id)){
    try {
        task = await Task.findById(req.params.id)
    } catch (error) {
        console.log(error);
    }
    }

    if(task){
        res.status(200).send(task)
    } else{
        res.status(404).send('no task found')
    }
    
})

app.post('/', async (req, res) =>{
    try {
        await Task.create(req.body);
    } catch (error) {
        console.log(error)
    }
    res.status(201).send("Task Created")

});

app.patch('/:id', async (req, res) =>{
    let task;

    if(ObjectId.isValid(req.params.id)){
    try {
        task = await Task.findByIdAndUpdate(req.params.id, req.body)
    } catch (error) {
        console.log(error);
    }
    }

    if(task){
        res.status(200).send('task updated')
    } else{
        res.status(404).send('no task found')
    }
})


app.delete('/:id', async (req,res)=>{
    let task;

    if(ObjectId.isValid(req.params.id)){
    try {
        task = await Task.findByIdAndDelete(req.params.id)
    } catch (error) {
        console.log(error);
    }
    }

    if(task){
        res.status(200).send('task Deleted')
    } else{
        res.status(404).send('no task found')
    }

})