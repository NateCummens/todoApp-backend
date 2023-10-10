const express = require('express');
const mongoose = require('mongoose');
const {ObjectId} = require('mongodb');
const app = express();
const PORT = 8080;
const URI = process.env.DatabaseUrl
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
        await mongoose.connect(URI);
   }

connectToDb().catch(err => console.log(err));

app.listen(
    PORT, 
    () => console.log(`app is running on http://localhost:${PORT}`)
)

app.get('/', async (req:any, res:any) =>{
    let tasks;
    try {
        tasks = await Task.find()
    } catch (error) {
        console.log(error)
    }

    if(tasks){
        res.status(200).json(tasks)
    }else{
        res.status(404).send({status:'failed to find tasks'});

    }
    
})


app.get("/completed", async (req:any, res:any) =>{

    let tasks;

    try {
        tasks = await Task.aggregate([
            {$match:{completed:true}}
        ])
    } catch (error) {
        console.log(error)
    }

    if(tasks.length > 0){
        res.status(200).send(tasks)
    }else{
        res.status(404).send({status:'no task found'});
    }
})

app.get("/pending", async (req:any, res:any) =>{

    let tasks;

    try {
        tasks = await Task.aggregate([
            {$match:{completed:false}}
        ])
    } catch (error) {
        console.log(error)
    }

    if(tasks.length > 0){
        res.status(200).send(tasks)
    }else{
        res.status(404).send({status:'no task found'});
    }
})

app.get("/count", async (req:any, res:any) =>{

    let tasks;

    try {
        tasks = await Task.aggregate([
            {$count:'tasks'}
        ])
    } catch (error) {
        console.log(error)
    }

    if(tasks.length > 0){
        res.status(200).send(tasks)
    }else{
        res.status(404).send({status:'no task found'});
    }
})

app.get("/bydate", async (req:any, res:any) =>{

    let tasks;

    try {
        tasks = await Task.aggregate([
            {$group:{ _id:{$dateToString:{format: "%Y-%m-%d", date: "$dateCreated"}},
            count:{$sum:1},
            tasks:{
                $push:{
                    _id:"$_id",
                    content:'$content',
                    completed:"$completed"
                }
            }
        }}
        ])

    } catch (error) {
        console.log(error)
    }

    if(tasks){
        res.status(200).send(tasks)
    }else{
        res.status(404).send({status:'no task found'});
    }
})

app.get('/:id', async (req:any, res:any) =>{
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
        res.status(404).send({status:'no task found'})
    }
    
})

app.post('/', async (req:any, res:any) =>{
    try {
        await Task.create(req.body);
    } catch (error) {
        console.log(error)
    }
    res.status(201).send({status:"Task Created"})

});

app.patch('/:id', async (req:any, res:any) =>{
    let task;

    if(ObjectId.isValid(req.params.id)){
    try {
        task = await Task.findByIdAndUpdate(req.params.id, req.body)
    } catch (error) {
        console.log(error);
    }
    }

    if(task){
        res.status(200).send({status:'task updated'})
    } else{
        res.status(404).send({status:'no task found'})
    }
})


app.delete('/:id', async (req:any, res:any)=>{
    let task;

    if(ObjectId.isValid(req.params.id)){
    try {
        task = await Task.findByIdAndDelete(req.params.id)
    } catch (error) {
        console.log(error);
    }
    }

    if(task){
        res.status(200).send({status:'Task Deleted'})
    } else{
        res.status(404).send({status:'no task found'})
    }

})


module.exports = app; // for testing