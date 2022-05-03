// server.js
import express from "express";
import multer from "multer";
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import { classifyText, trainModel } from "./src/ContentAnalysisFunctions.js";
import { LoadPhishtank, ClassifyURLs } from "./src/URLAnalysisFunctions.js";


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
    res.send(await classifyText(req.body.data))
})

app.post("/URLClassify", async (req,res)=>{
    let content = req.body.data
    res.send(await ClassifyURLs(content))
})

app.post("/delete", async (req,res)=>{
    fs.unlink('./uploads/uploadedMbox.mbox', function (err) {
        if (err){
            console.log("Delete Error: "+ err)
            res.send("Unable to Delete Data")
        }
        else{
            res.send("Data Successfully Deleted")
        }
    })
})

app.post("/train", async (req,res)=>{
    res.send(await trainModel())
})

app.listen(5000, () => {
    LoadPhishtank();
    console.log(`Server started...`);
});