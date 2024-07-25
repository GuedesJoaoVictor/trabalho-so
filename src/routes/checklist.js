const express = require("express");

const router = express.Router();

const Checklist = require("../models/Checklists");

router.get("/", async (req, res) => { 
    try {
        let checkLists = await Checklist.find({}); //a variavel checkLists recebe todas as Checklists do banco de dados
        res.status(200).render("checklists/index", { checkLists: checkLists });//e renderiza a pagina checklists/index passando para a pagina todas as checklists
    } catch (error) {
        res.status(500).render("pages/error", {error: "Erro ao exibir as listas."});//caso dê erro, manda para a página de erro
    }
});

router.get("/new", async (req, res) => {
    try {
        let checkList = new Checklist();//caso entre na rota new, ele cria uma variavel do tipo Checklist
        res.status(200).render("checklists/new", { checkList: checkList });//e mnada para a página a página de criação de novas checklist com formulario(frontend)
    } catch (error) {
        res.status(500).render("pages/error", {error: "Erro ao carregar formulário."});//caso dê algum erro, redireciona para a página de erro.
    }
});

router.get("/:id/edit", async (req, res) => {
    try {
        let checkList = await Checklist.findById(req.params.id);
        res.status(200).render("checklists/edit", { checkList: checkList });
    } catch (error) {
        res.status(500).render("pages/error", { error: "Erro ao exibir a edição de Lista de Tarefas." });
    }
});

router.post("/", async (req, res) => {
    let { name } = req.body.checkList;
    let checkList = new Checklist({name});

    try {
        await checkList.save();
        res.redirect("/checklists");
    } catch (error) {
        res.status(422).render("checklists/new", { checkLists: {...checkList}, error });
    }
});

router.get("/:id", async (req, res) => {
    try {
        let checkList = await Checklist.findById(req.params.id).populate("tasks");
        res.status(200).render("checklists/show", { checkList: checkList });
    } catch (error) {
        res.status(500).render("pages/error", {error: "Erro ao exibir as listas de tarefas."});
    }
});

router.put("/:id", async (req, res) => {
    let { name } = req.body.checkList
    let checkList = await Checklist.findById(req.params.id); 
    try {
        await checkList.updateOne({name});
        res.redirect("/checklists");
    } catch (error) {
        let errors = error.errors;
        res.status(422).render("checklists/edit", {checkList: {...checkList, error}});
    }
});


router.delete("/:id", async (req, res) => {
    try {
        let checkList = await Checklist.findByIdAndDelete(req.params.id);
        res.redirect("/checklists");
    } catch (error) {
        res.status(500).render("pages/error", {error: "Erro ao deletar a lista de tarefas."});
    }
});

module.exports = router;