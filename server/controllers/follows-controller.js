const folLog = require("../bll/followers-logic");
const express = require("express");

const router = express.Router();

router.get("/", async (request, response) => {
    try {
        const follows = await folLog.getAllFollows();
        response.json(follows);
    }
    catch (err) {
        alert("Error: " + err.message);
    }
});


router.get("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        const follow = await folLog.getFollowsFromOneUser(id);
        response.json(follow);
    }
    catch (err) {
        alert("Error: " + err.message);
    }
});

router.get("/:uid/:vid", async (request, response) => {
    try {
        const uid = +request.params.uid;
        const vid = +request.params.vid;
        const follows = await folLog.getFollow(uid, vid);
        response.json(follows);
    }
    catch (err) {
        alert("Error: " + err.message);
    }
});

router.post("/", async (request, response) => {
    try {
        const body = request.body;
        const addedFollow = await folLog.addFollow(body);
        response.status(201).json(addedFollow);
    }
    catch (err) {
        console.log("Error: " + err.message);
    }
});

router.delete("/:uid/:vid", async (request, response) => {
    try {
        const uid = +request.params.uid;
        const vid = +request.params.vid;
        await folLog.deleteFollow(uid, vid);
        response.sendStatus(204);
    }
    catch (err) {
        alert("Error: " + err.message);
    }
});

module.exports = router;