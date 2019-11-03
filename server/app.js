// Imports /////////////////////////////
const express = require("express");
const server = express();
const multer = require("multer");
const cors = require("cors");
const usCon = require("./controllers/users-controller");
const vacCon = require("./controllers/vacations-controller");
const folCon = require("./controllers/follows-controller");
const path = require("path");
const ejs = require("ejs");
const socketIO = require("socket.io");
const http = require("http");
const usLog = require("./bll/users-logic");
const vacLog = require("./bll/vacations-logic");

// Server use /////////////////////////////
server.use(express.json());
server.use(cors());
server.use("/api/users", usCon);
server.use("/api/vacations", vacCon);
server.use("/api/follows", folCon);

// Upload An Image ////////////////////////////////////
// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './assets/images',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage');
// Check File Type
function checkFileType(file, cb) {
    // Allowed and check extansions
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}
// EJS + Public folder
server.set('view engine', "ejs");
server.use(express.static('./assets/images'));

server.get('/', (request, response) => response.render('index'));
// Send request and response and upload the img
server.post('/upload', (request, response) => {
    upload(request, response, (err) => {
        if (err) {
            response.render('index', {
                msg: err
            });
        } else {
            if (request.file == undefined) {
                response.render('index', {
                    msg: 'Error: No File Selected!'
                });
            } else {
                response.render('index', {
                    msg: 'File Uploaded!',
                    file: `assets/images/${request.file.filename}`
                });
                console.log(request.file.filename)
                console.log("vac: ", JSON.parse(request.body.addedVacation));
                vacLog.addVacation(JSON.parse(request.body.addedVacation), request.file.filename);
            }
        }
    });
});


const httpServer = http.createServer(server).listen(3001, () => console.log('socketing...'))
const socketServer = socketIO.listen(httpServer);
const allSockets = [];
server.use(express.static(__dirname));

socketServer.sockets.on("connection", async socket => {
    allSockets.push(socket);

    socket.on("user-check", async user => {
        let isAvailable = "";
        user = user.replace("'", "''");
        isAvailable = await usLog.getOneUser(user);
        socketServer.sockets.emit('user-check', isAvailable < 1 ? false : true);
    });

    socket.on('admin-made-changes', async () => {
        socketServer.sockets.emit('admin-made-changes', await vacLog.getAllVacations());
    });

    socket.on('disconnect', () => {
        const index = allSockets.indexOf(socket);
        allSockets.splice(index, 1);
    });
});

server.listen(8080, () => console.log("Listening..."));