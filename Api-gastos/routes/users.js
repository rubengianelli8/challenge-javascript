const express = require ('express');
const route = express.Router(); //routes
const joi = require('@hapi/joi'); //validator






//middlewares


//routes------------------------
route.get('/', (req, res) =>{
    res.send('hola')
});
//register
route.post('/register',(req, res) => {
    req.getConnection((err, conn) =>{
        if(err) return res.send(err);
        conn.query('use db_billetera');
        conn.query(`SELECT * FROM usuarios WHERE correo= '${req.body.correo}'`, (err, rows) =>{
            if(err) return res.send(err);
            if(rows.length > 0){
                res.send('the user already exists');
            }else{
                const {error} = validateEmail(req.body.correo);//validate email format
                if(error){
                    const message = error.details[0].message;
                    res.status(400).send(message);
                    return;
                }
                //register user
                conn.query('INSERT INTO usuarios set ?',[req.body] ,(err, rows) => {
                    if(err) return res.send(err)
                    res.send('the user has been registered');
                });
            }
        });
    });
});

//LOGIN
route.post('/login', (req, res) => {
    req.getConnection((err, conn) =>{
        if(err) return res.send(err);
        conn.query('use db_billetera');
        conn.query(`SELECT * FROM usuarios WHERE correo= '${req.body.correo}'`, (err, rows) => {
            if(err) return res.send(err);
            if(rows.length > 0){
                if(rows[0].password === req.body.password){
                    res.json(rows[0])
                }else{
                    res.send('la contraseña ingresada es incorrecta');
                }
            }else{
                res.status(400).send('The user entered does not exist or the password is not valid');
            }
        })

    })
})

//validate email for users
const validateEmail = (email) =>{
    const schema = joi.object({
        correo: joi.string()
            .min(3)
            .max(30)
            .required()
            .email()
    });
    return (schema.validate({correo: email}));
}

module.exports = route;

