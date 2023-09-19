const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.listen(
    PORT, 
    () => console.log(`it is running on http://localhost:${PORT}`)
)

taskList = [];

app.get('/', (req, res) =>{
    if(taskList.length == 0){
        res.status(200).send('No Tasks');
    }
    res.status(200).send(taskList);
})

app.get('/:id', (req, res) =>{
    const { id } = req.params;
    taskList.forEach((task)=>{
        if (task.id == id){
            res.status(200).send({
                tasks:`${task.content}`,
            })
        }
    })
    res.status(404).send();
})

app.post('/', (req, res) =>{

    const id = taskList.length;
    const {task} = req.body;

    if(!task){
        res.status(418).send({message:'We need a task!'});
    }

    taskList.push({"id":id, "content": task})

    res.send({
        tasks:`A task of ${task} and ID of ${id} was created`,
    });
});

app.delete('/:id',(req,res)=>{
    const {id} = req.params;
    taskList.forEach((task)=>{
        if(id == task.id){
            taskList.splice(id, 1);
            res.status(200).send(`${task.content} was removed from list`)
        }
    })

})