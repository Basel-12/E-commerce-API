import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT,10),
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})

export const sendMail = async(options)=>{
    const mailoptions = {
        from: "E-commerce <ecommerce@noreply.com>",
        to: options.email,
        subject: options.subject,
        text: options.message
        //html
    }
    await transport.sendMail(mailoptions)
}