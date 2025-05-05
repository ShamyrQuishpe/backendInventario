import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

let transporter  = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.HOST_MAILTTRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP,
    }
})

const sendMailToUser = (userMail, contrasenaTemporal, token, nombre) => {
    
    const link = `http://localhost:3000/gt/cambiar-contrasena/${token}`

    const html = `
    <html>
      <body>
        <h1>¡Hola ${nombre}!</h1>
        <p>Tu cuenta ha sido creada exitosamente. Aquí tienes tu contraseña temporal:</p>
        <p><strong>${contrasenaTemporal}</strong></p>
        <p>Es hora de cambiar tu contraseña para asegurar tu cuenta. Para hacerlo, haz clic en el siguiente enlace:</p>
        <p><a href="${link}" style="color: #007bff;">Es hora de cambiar tu contraseña</a></p>
        <p>Este enlace caduca en 1 hora.</p>
        <p>Saludos,<br>El equipo de soporte</p>
      </body>
    </html>
  `;
    
    let mailOptions = {
        from: process.env.USER_MAILTRAP,
        to: userMail,
        subject: "Bienvenido a la familia GrayThink",
        html
    }

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error)
        }else{
            console.log("Correo enviado: " + info.response)
        }
    })
}

export default sendMailToUser