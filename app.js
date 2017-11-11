const express=require('express');
const mysql=require('mysql');

var con=mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'n0m3l0',
	database:'node'
});
con.connect();
var app=express();
var bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:true
}));
app.use(express.static('public'));
app.listen(8080,()=>{
	console.log('servidor iniciado en el puerto 8080');
});
app.post('/agregarUsuario',(req,res)=>{
	let nombre=req.body.nombre;
	let mail=req.body.mail;
	let pass=req.body.pass;
	let ap=req.body.apellidos;
	con.query('insert into usuario values(1,"'+mail+'","'+pass+'","'+nombre+'","'+ap+'")',(err,respuesta,fields)=>{
		if (err) {
			console.log('ERROR: ',err);
			return;
		}
		return res.send('Usuario agregado');
	});
});
app.post('/consultarUsuario',(req,res)=>{
	let mail=req.body.mail;
	let pass=req.body.pass;
	con.query('SELECT mail, pass FROM usuario WHERE mail="'+mail+'" AND pass="'+pass+'"',(err,respuesta,fields)=>{
		var resp = JSON.stringify(respuesta);
		if (resp=='[]') {
			console.log('Error. No existe el usuario');
			return res.send('No existe el usuario');
		}else{
			var json = JSON.parse(resp);
			if (err) {
				console.log('Error: ',err);
				return;
			}
			if (mail===json[0].mail&&pass===json[0].pass) {
				return res.send('Sí existe el usuario');
			}else{
				return;
			}
		}
	});
});