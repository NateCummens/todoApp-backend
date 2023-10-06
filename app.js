"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const app = express();
const PORT = 3000;
app.use(express.json());
const taskSchema = new mongoose.Schema({
    content: String,
    dateCreated: { type: Date, default: Date.now },
    completed: {
        type: Boolean,
        default: false
    }
});
const Task = mongoose.model('Task', taskSchema);
function connectToDb() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose.connect('mongodb://127.0.0.1:27017/TaskList');
    });
}
connectToDb().catch(err => console.log(err));
app.listen(PORT, () => console.log(`app is running on http://localhost:${PORT}`));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let tasks;
    try {
        tasks = yield Task.find();
    }
    catch (error) {
        console.log(error);
    }
    if (tasks) {
        res.status(200).json(tasks);
    }
    else {
        res.status(404).send({ status: 'failed to find tasks' });
    }
}));
app.get("/completed", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let tasks;
    try {
        tasks = yield Task.aggregate([
            { $match: { completed: true } }
        ]);
    }
    catch (error) {
        console.log(error);
    }
    if (tasks.length > 0) {
        res.status(200).send(tasks);
    }
    else {
        res.status(404).send({ status: 'no task found' });
    }
}));
app.get("/pending", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let tasks;
    try {
        tasks = yield Task.aggregate([
            { $match: { completed: false } }
        ]);
    }
    catch (error) {
        console.log(error);
    }
    if (tasks.length > 0) {
        res.status(200).send(tasks);
    }
    else {
        res.status(404).send({ status: 'no task found' });
    }
}));
app.get("/count", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let tasks;
    try {
        tasks = yield Task.aggregate([
            { $count: 'tasks' }
        ]);
    }
    catch (error) {
        console.log(error);
    }
    if (tasks.length > 0) {
        res.status(200).send(tasks);
    }
    else {
        res.status(404).send({ status: 'no task found' });
    }
}));
app.get("/bydate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let tasks;
    try {
        tasks = yield Task.aggregate([
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$dateCreated" } },
                    count: { $sum: 1 },
                    tasks: {
                        $push: {
                            _id: "$_id",
                            content: '$content',
                            completed: "$completed"
                        }
                    }
                } }
        ]);
    }
    catch (error) {
        console.log(error);
    }
    if (tasks) {
        res.status(200).send(tasks);
    }
    else {
        res.status(404).send({ status: 'no task found' });
    }
}));
app.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let task;
    if (ObjectId.isValid(req.params.id)) {
        try {
            task = yield Task.findById(req.params.id);
        }
        catch (error) {
            console.log(error);
        }
    }
    if (task) {
        res.status(200).send(task);
    }
    else {
        res.status(404).send({ status: 'no task found' });
    }
}));
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Task.create(req.body);
    }
    catch (error) {
        console.log(error);
    }
    res.status(201).send({ status: "Task Created" });
}));
app.patch('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let task;
    if (ObjectId.isValid(req.params.id)) {
        try {
            task = yield Task.findByIdAndUpdate(req.params.id, req.body);
        }
        catch (error) {
            console.log(error);
        }
    }
    if (task) {
        res.status(200).send({ status: 'task updated' });
    }
    else {
        res.status(404).send({ status: 'no task found' });
    }
}));
app.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let task;
    if (ObjectId.isValid(req.params.id)) {
        try {
            task = yield Task.findByIdAndDelete(req.params.id);
        }
        catch (error) {
            console.log(error);
        }
    }
    if (task) {
        res.status(200).send({ status: 'Task Deleted' });
    }
    else {
        res.status(404).send({ status: 'no task found' });
    }
}));
module.exports = app; // for testing
