import { Router, Request, Response } from "express";
import Task from "../models/taskSchema"
// import {client} from "../app"

const router: Router = Router();

const {ObjectId} = require('mongodb');

router.get('/', async (req:any, res:Response) =>{
    let tasks;
    try {
        tasks = await Task.find()


        if(tasks){
            // await client.setEx(process.env.REDIS_KEY, 3600, JSON.stringify(tasks));
            res.status(200).json(tasks)
        }else{
            res.status(404).send({status:'failed to find tasks'});

        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/completed", async (req:Request, res:Response) =>{
 
    let tasks;

    try {
        tasks = await Task.aggregate([
            {$match:{completed:true}}
        ])
   

        if(tasks.length > 0){
            res.status(200).send(tasks)
        }else{
            res.status(404).send({status:'no task found'});
        }

    } catch (error) {
        console.log(error)
    }
})

router.get("/pending", async (req:Request, res:Response) =>{

    let tasks;

    try {
        tasks = await Task.aggregate([
            {$match:{completed:false}}
        ])
    

        if(tasks.length > 0){
            res.status(200).send(tasks)
        }else{
            res.status(404).send({status:'no task found'});
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/count", async (req:Request, res:Response) =>{

    let tasks;

    try {
        tasks = await Task.aggregate([
            {$count:'tasks'}
        ])


        if(tasks.length > 0){
            res.status(200).send(tasks)
        }else{
            res.status(404).send({status:'no task found'});
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/bydate", async (req:Request, res:Response) =>{

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

router.get('/:id', async (req:Request, res:Response) =>{
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

router.post('/', async (req:Request, res:Response) =>{
    try {
        await Task.create(req.body);
    } catch (error) {
        console.log(error)
    }
    res.status(201).send({status:"Task Created"})

});

router.patch('/:id', async (req:Request, res:Response) =>{
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


router.delete('/:id', async (req:Request, res:Response)=>{
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

export default router;