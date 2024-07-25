const express = require("express");

const checkListDependentRoute = express.Router();
const simpleRouter = express.Router();

const Task = require("../models/Task");
const Checklist = require("../models/Checklists");

checkListDependentRoute.get("/:id/tasks/new", async (req, res) => {
    try {
        let task = Task();
        res.status(200).render("tasks/new", { checkListId: req.params.id, task: task });
    } catch (error) {
        res.status(422).render("pages/error", {errors: "Erro ao carregar o formulário."});
    }
});

simpleRouter.delete("/:id", async (req, res) => {
    try {
        let task = await Task.findByIdAndDelete(req.params.id);
        let checkList = await Checklist.findById(task.checkList);
        let taskToRemove = checkList.tasks.indexOf(task._id);
        checkList.tasks.slice(taskToRemove, 1);
        checkList.save();
        res.redirect(`/checklists/${checkList._id}`);
    } catch (error) {
        res.status(422).render("pages/error", { errors: "Erro ao remover uma tarefa" });
    }
});

simpleRouter.put("/:id", async (req, res) => {
    let task = await Task.findById(req.params.id);
    try {
        task.set(req.body.task);
        await task.save();
        res.status(200).json({ task });
    } catch (error) {
        let errors = error.errors;
        res.status(422).json({task: {...errors}});
    }
});

checkListDependentRoute.post("/:id/tasks", async (req, res) => {
    let {name} = req.body.task;
    let task = new Task({name, checkList: req.params.id});

    try {
        await task.save();
        let checkList = await Checklist.findById(req.params.id);
        checkList.tasks.push(task);
        await checkList.save();
        res.redirect(`/checklists/${req.params.id}`)
    } catch (error) {
        let errors = error.errors;
        res.status(422).render("tasks/new", { task: {...task, errors}, checkListId: req.params.id });
    }
})

module.exports = { 
    checkListDependent: checkListDependentRoute,
    simple: simpleRouter 
};