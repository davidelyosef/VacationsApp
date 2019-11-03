const usLog = require("../bll/users-logic");
const express = require("express");

const router = express.Router();

router.get("/", async (request, response) => {
    try {
        const users = await usLog.getAllUsers()
        response.json(users);
    }
    catch (err) {
        alert("Error: " + err.message);
    }
});

router.get("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        const user = await usLog.getUser(id);
        response.json(user);
    }
    catch (err) {
        alert("Error: " + err.message);
    }
});

router.post("/", async (request, response) => {
    try {
        const body = request.body;
        const newUser = await usLog.addUser(body);
        response.json(newUser);
    }
    catch (err) {
        alert("Error: " + err.message);
    }
});

module.exports = router;