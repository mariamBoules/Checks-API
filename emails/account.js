const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const sendWelcomeMail = (email, name)=>{
    sgMail.send({
        to:email,
        from: 'mariamboules98@gmail.com',
        subject:'Welcome to the App !',
        text:`Welcome ${name}! Hope you love our App !`
    })
}

const sendURLup = (email,name, url)=>{
    sgMail.send({
        to: email,
        from: 'mariamboules98@gmail.com',
        subject: 'URL is up !',
        text: `Hi ${name}, this email is to inform you your url ${url} is currently up! Regards !`
    })
}

const sendURLdown = (email,name, url)=>{
    sgMail.send({
        to: email,
        from: 'mariamboules98@gmail.com',
        subject: 'URL is down !',
        text: `Hi ${name}, this email is to inform you your url ${url} is currently down! Regards !`
    })
}

const sendURLerror = (email,name, url)=>{
    sgMail.send({
        to: email,
        from: 'mariamboules98@gmail.com',
        subject: 'Facing some errors !',
        text: `Hi ${name}, this email is to inform you your url ${url} is facing some errors! Will keep you updated !`
    })
}



module.exports = {
    sendWelcomeMail,
    sendURLup,
    sendURLdown,
    sendURLerror
}