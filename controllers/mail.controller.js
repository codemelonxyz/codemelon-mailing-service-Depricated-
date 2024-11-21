import nodeMailer from 'nodemailer';
import dotenv from 'dotenv';
// Remove import of 'bull'
// import Queue from 'bull';

dotenv.config();

class MailController {
    constructor() {
        this.transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIN_MAIL_ADDRESS,
                pass: process.env.MAIL_KEY
            }
        });
        this.emailQueue = [];
        this.isProcessing = false;
    }

    processQueue = async () => {
        if (this.isProcessing) return;
        this.isProcessing = true;
        while (this.emailQueue.length > 0) {
            const mailOptions = this.emailQueue.shift();
            try {
                await this.transporter.sendMail(mailOptions);
                console.log('Email sent successfully');
            } catch (error) {
                console.error('Error sending email:', error);
            }
        }
        this.isProcessing = false;
    }

    sendMail = (req, res) => {
        if (!req.body.to || !req.body.subject || !req.body.html) {
            res.status(400).send({
                success: false,
                message: 'Please provide all required fields'
            });
            return;
        }
        const mailOptions = {
            from: process.env.NO_REPLY_MAIL,
            to: req.body.to,
            subject: req.body.subject,
            html: req.body.html
        };

        this.emailQueue.push(mailOptions);
        this.processQueue();
        res.status(200).send({
            success: true,
            message: 'Mail queued successfully'
        });
    }

    sendMailToListOfUsers = async (messageList) => {
        const mailPromises = messageList.map(i => {
            const mailOptions = {
                from: process.env.NO_REPLY_MAIL,
                to: i.to,
                subject: i.subject,
                text: i.body,
                html: i.html
            };
            return this.transporter.sendMail(mailOptions);
        });

        try {
            const results = await Promise.all(mailPromises);
            return true;
        } catch (error) {
            console.error('Error sending emails:', error);
            return false;
        }
    }
}

const mailController = new MailController();

export default mailController;