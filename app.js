'use strict';

const express=require('express');
const mysql=require('mysql');
const bcrypt=require('bcrypt-nodejs');
var session = require('client-sessions');
const {Client} = require('pg');
/*
const client = new Client({
	connectionString: process.env.DATABASE_URL,
  	ssl: true,
});
*/
const client = new Client({
	user: 'postgres',
	host: 'localhost',
	database: 'node',
	password: 'n0m3l0',
	port: 5432,
});
/*
const client = new Client({
	user: 'fpooidqomjvwsp',
	host: 'ec2-107-22-167-179.compute-1.amazonaws.com',
	database: 'devk8p9unf7fku',
	password: '304f87e1b64f51b77777ef4bc76cfaaf2f033c9d9de50bfa30cd49cb9ffc0363',
	port: 5432,
});
*/

client.connect();
/*
var con=mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'n0m3l0',
	database:'node'
});

con.connect();
*/
var app=express();
app.set('view engine','pug');
var bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:true
}));
app.use(express.static('public'));
app.use(session({
  cookieName: 'session',
  secret: 'awadeuwu',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  mail:'',
  pass:'',
  httpOnly:true,
  secure:false,
  ephemeral:true
}));
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'),()=>{
	console.log('servidor iniciado en el puerto '+app.get('port'));
});

app.post('/agregarUsuario',(req,res)=>{
	let nombre=req.body.nombre;
	let mail=req.body.mail;
	let hashed = bcrypt.hashSync(req.body.pass);
	let pass=req.body.pass;
	let ap=req.body.apellidos;
	/*
	con.query('insert into usuario values(1,"'+mail+'","'+pass+'","'+nombre+'","'+ap+'")',(err,respuesta,fields)=>{
		if (err) {
			console.log('ERROR: ',err);
			return;
		}
		return res.send('Usuario agregado');
	});
	*/
	var text = 'INSERT INTO usuario(mail,pass,nombre,apellidos) VALUES($1,$2,$3,$4)';
	var values = [mail,hashed,nombre,ap];
	client.query(text,values,(err,respuesta)=>{
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
	var q = 'SELECT mail, pass FROM usuario WHERE mail=$1';
	var values =[mail];
	client.query(q, values,(err,respuesta)=>{
		if (err) {
			console.log('Error: ',err);
			return res.send('Error. Intente de nuevo más tarde');
		}else{
			var resp = JSON.stringify(respuesta.rows[0]);
			if (resp.toString() === 'undefined') {
				console.log('Error. No existe el usuario');
				return res.send('No existe el usuario');
			}else{
				try{
					var JSPAR = JSON.parse(resp);
					var ok = bcrypt.compareSync(pass,JSPAR.pass);
					console.log(ok);
					if (mail===JSPAR.mail&&ok) {
						req.session.mail=JSPAR.mail;
						req.session.pass=JSPAR.pass;
						return res.send('Sí existe el usuario');
					}else{
						res.send('Usuario no encontrado');
						return;
					}
				} catch(err){
					console.log('Error: '+err);
					res.send('Usuario no existente');
				}
			}
		}
	});
	/*
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
				req.session.mail=mail;
				req.session.pass=pass;
				return res.send('Sí existe el usuario');
			}else{
				return;
			}
		}
	});
	*/
});
app.get('/*',(req,res)=>{
	let busca = false;
	var mail = req.session.mail;
	console.log('//-------------------------------------------'+req.path+'---------------------------------------------//');
	if (req.path.toString().trim()=='/logout') {
		console.log('=======================Bye============================');
		req.session.reset();
		res.redirect('../');
		busca = true;
	}
	var pass = req.session.pass;
	if (req.session&&mail&&!busca) {
		var q = 'SELECT mail, pass FROM usuario WHERE mail=$1 AND pass=$2';
		var values =[mail,pass];
		client.query(q, values,(err,respuesta)=>{
			var isUser;
			try{
				var resp = JSON.stringify(respuesta.rows[0]);
			}catch(er){
				console.log('Error: '+er);
			}
			if (resp==='undefined') {
				isUser = false;
			}else{
				try{
					var JSPAR = JSON.parse(resp);
					if (err) {
						isUser=false;
					}
					if (mail===JSPAR.mail&&pass===JSPAR.pass) {
						isUser=true;
					}else{
						isUser=false;
					}
				}catch(err){
					console.log('Error: '+err);
					isUser=false;
				}
			}
			if (!isUser) {
				res.send('No existe el usuario');
				setTimeout(res.redirect('../registro.html'),3000);
			}else{
				var path = req.url;
				if (path.indexOf('css')!=-1) {
					res.send('vaia');
				}else if (path.indexOf('png')!=-1) {
					res.send('vaiax2');
				}else if (path.indexOf('jpg')!=-1) {
					res.send('vaiax3');
				}else if (path.indexOf('js')!=-1) {
					res.send('vaiax4');
				}else if(path.indexOf('ico')!=-1){
					res.send('vaiax5');
				}else{
					let route = path.replace('/','').toString();
					if (route==='perfilUsuario'||route==='modificaDatosUsuario'||route==='referenciasUsuario') {
						client.query('SELECT * FROM usuario WHERE mail=$1',[mail],(err, respuesta)=>{
							let name = respuesta.rows[0].nombre+' '+respuesta.rows[0].apellidos;
							let jso = {nombre:name.toString()}
							console.log(respuesta.rows[0]);
							res.render(route,jso);
						});
					}else{
						res.render(route);
					}
				}
			}
		});
	}else{
		res.redirect('/i_sesion.html');
	}
});
app.post('/buscaDato',function (req,res) {
		var values = ['%'+req.body.datos+'%'];
		let q = "SELECT nombre FROM usuario WHERE nombre ILIKE $1";
		client.query(q,values,(err,respuesta)=>{
			try{
				var jn = {rs:[]};
				let resul = respuesta.rows[0].nombre;
				for (var i = respuesta.rowCount - 1; i >= 0; i--) {
					jn.rs[i]=respuesta.rows[i].nombre;	
				}
				res.send(jn);
			} catch(err){
				console.log(err);
				res.send ('Error');
			}
		});
});
app.post('/busqueda',(req, res)=>{
	console.log(req.path+' aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
	let busq = ['%'+req.body.bus+'%'];
	let q = "SELECT * FROM usuario WHERE nombre ILIKE $1";
	client.query(q,busq,(err,respuesta)=>{
		try{
			var jn = {rs:[]};
			for (var i = respuesta.rowCount - 1; i >= 0; i--) {
				jn.rs[i]=respuesta.rows[i].nombre +' '+respuesta.rows[i].apellidos;	
			}
			res.render('busquedaTrabajadoresUsuario',jn);
		}catch(error){
			console.log('Error '+error);
		}
	});
});