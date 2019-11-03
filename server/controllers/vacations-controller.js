const vacLog = require("../bll/vacations-logic");
const folLog = require("../bll/followers-logic");
const express = require("express");

const router = express.Router();

router.get("/", async (request, response) => {
    try {
        const vacations = await vacLog.getAllVacations()
        response.json(vacations);
    }
    catch (err) {
        alert("Error: " + err.message);
    }
});

router.get("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        const vacation = await vacLog.getVacation(id);
        response.json(vacation);
    }
    catch (err) {
        alert("Error: " + err.message);
    }
});

router.post("/", async (request, response) => {
    try {
        const v = request.body;
        const addedVacation = await vacLog.addVacation(v);
        response.status(201).json(addedVacation);
    }
    catch (err) {
        alert("Error: " + err.message);
    }
});

router.put("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        const vacation = request.body;
        // Sanitizing
        vacation.destination = vacation.destination.replace("'", "’");
        vacation.describePlace = vacation.describePlace.replace("'", "’");
        vacation.image = vacation.image.replace("'", "’");
        
        vacation.vacationID = id;
        const updatedVacation = await vacLog.updateVacation(vacation);
        response.json(updatedVacation);
    }
    catch (err) {
        alert("Error: " + err.message);
    }
});

router.delete("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        await vacLog.deleteVacation(id);
        await folLog.deleteFollowByVacation(id);
        response.sendStatus(204);
    }
    catch (err) {
        alert("Error: " + err.message);
    }
})

module.exports = router;
