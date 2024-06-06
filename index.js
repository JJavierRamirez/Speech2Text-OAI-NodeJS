import express, { application } from 'express'; 
import axios from 'axios';
import multer from 'multer';
import path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import OpenAI from 'openai';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
})

const upload = multer({ storage: storage });

app.post('/audio/transcription', upload.single('audio'), async(req, res,)=> {
    try {
        if(req.file){
            // const audioFileBuffer = await fs.readFileSync(./public/uploads/${req.file.filename});
            // let blob = new Blob([audioFileBuffer]);
            // const formData = new FormData();
            // formData.append('model', 'whisper-1');
            // formData.append('file', audioFileBuffer, {
            //     filename: 'audio.mp3',
            //     contentType: 'audio/mpeg'
            // });
            // const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
            //     headers: {
            //         ...formData.getHeaders,
            //         'Authorization': Bearer ${process.env.OPENAI_API_KEY}
            //     }
            // });
            const transcription = await openai.audio.transcriptions.create({
                file: fs.createReadStream(`./public/uploads/${req.file.filename}`),
                model: "whisper-1",
                response_format: "json",
              });
            res.status(200).send(transcription);
        }
        else{
            res.status(400).json({ message: 'No file uploaded' });
        }
        
    } catch (error) {
        console.log('Error creating translation: ', error.message);
        throw error;
    }
});

app.listen(3000);
console.log('Server runing on port 3000');