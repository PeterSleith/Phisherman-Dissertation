// server.js
import express, { json, urlencoded } from "express";
import multer from "multer";
import path from 'path';
import cors from 'cors';
import { classifyText } from "./src/ContentAnalysisFunctions.js";
import { LoadPhishtank, CheckPhishTank } from "./src/URLAnalysisFunctions.js";


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },

    filename: function(req, file, cb) {
        cb(null, "uploadedMbox" + path.extname(file.originalname));
    }
});

const app = express();
app.use(
    cors(),
    express.json()
);

app.post('/upload', (req, res) => {
    let upload = multer({ storage: storage}).single('mboxfile');

    upload(req, res, function(err) {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
        res.json({ message: "Successfully uploaded files" });
    })
});

app.post("/CAClassify", async (req,res)=>{
    //console.log(req.body)
    res.send(await classifyText(req.body.data))
})

app.post("/URLClassify", async (req,res)=>{
    urls = req.body.data
    if (urls = ''){
        res.send('0')
    }
    else
    {

    }

})

app.listen(4000, () => {
    LoadPhishtank();
    console.log(`Server started...`);
});