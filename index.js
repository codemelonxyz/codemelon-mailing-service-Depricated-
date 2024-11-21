import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mailController from './controllers/mail.controller.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8025;
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the Codemelon mail service",
        instruction: "Please refer to codemelon.xyz/developers for more information"
    });
})

app.post('/api/v1/mail/send', mailController.sendMail);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});