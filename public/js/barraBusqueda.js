$(document).ready(function () {
	var drp = false;
	var url = window.location.href;
	$('#modPer').on('click', ()=>{
		$(location).attr('href',url+'/../modificaDatosUsuario');
	});/*
	$('#navSearch').focus(function(){
		$('#navSearch').on('keyup', function(key){
			if (key.keyCode!=8&&$('#navSearch').val()!='') {
				$.ajax({
					url:'/buscaDato',
					type:'POST',
					cache: false,
					data:{'datos':$('#navSearch').val()},
					success:function(data){
						var resultado = data;
						if (resultado!=''&&resultado!='Error') {
							let str = '';
							for (var i = resultado.rs.length-1; i>=0;i--) {
								str+= '<a href="#" class="dropdown-item">'+data.rs[i]+'</a>';
							}
							$('#resSearch').html(str);
						}else if (resultado=='Error') {
							$('#resSearch').html('<a href="#" class="dropdown-item">No hay coincidencias</a>');
						}else{
							$('#navSearch').dropdown('toggle');
							drp = false;
						}
					},
					error:function (jqXHR, txtStatus,err) {
						$('#resSearch').html('<a href="#" class="dropdown-item"><b>Error. Intente de nuevo más tarde</b></a>');
					}
				});
				$('#navSearch').attr('data-toggle','dropdown');
				if (!drp) {
					$('#navSearch').dropdown('toggle');
					drp = true;
				}
			}else if (key.keyCode==8&&$('#navSearch').val()==''){
				if (drp) {
					$('#navSearch').dropdown('toggle');	
					drp=false;
				}
			}
		});
	});
	$('#navSearch').blur(()=>{

	});
¨*/
	$('#pubready').click(()=>{
		let formData = {
			'pubType':$('#pubtype').val(),
			'desc':$('#desc').val()
		};
		$.ajax({
			url:'/guardaPublicacion',
			type:'POST',
			cache: false,
			data:formData,
			success:function(data){
				$('#ewe')[0].reset();
				$('#snackbar').addClass("show").html("<strong>Publicacion creada con éxito</strong>");
				setTimeout(function(){$('#snackbar').removeClass("show");},3000);
			},
			error:function (jqXHR, txtStatus,err) {
				$('#snackbar').addClass("show").html("<strong>Error. Intente de nuevo más tarde. <br> Si el problema persiste, contacte a un administrador</strong>");
				setTimeout(function(){$('#snackbar').removeClass("show");},3000);
			}
		});
	});
	$('#actualizaDatos').click(()=>{
		let formData={
			mail:$('#mail').val(),
			pass: $('#pass').val(),
			nombre: $('#nombre').val(),
			apellido: $('#apellidos').val(),
			direccion: $('#direccion').val(),
			noInt: $('#noInt').val()
		};
		$.ajax({
			url:'/actualizaDatos',
			type:'POST',
			cache: false,
			data:formData,
			success: (data)=>{
				$('#formDat')[0].reset();
				$('#snackbar').addClass("show").html("<strong>"+data+"</strong>");
				setTimeout(function(){$('#snackbar').removeClass("show");},3000);
			},
			error: ()=>{
				$('#snackbar').addClass("show").html("<strong>Ocurrió un error</strong>");
				setTimeout(function(){$('#snackbar').removeClass("show");},3000);
			}
		});
	});
	$('#btnA').click(()=>{
		let formData = {
			idCalifica : $('#myId').val(),
			idUsu : $('#hisId').val(),
			calif : $('#myRange').val(),
			coment : $('#txtA').val()
		};
		$.ajax({
			url:'/calificaUsuario',
			type: 'POST',
			cache: false,
			data: formData,
			success:(data)=>{
				$('#myForm')[0].reset();
				$('#snackbar').addClass("show").html("<strong>"+data+"</strong>");
				setTimeout(function(){$('#snackbar').removeClass("show");},3000);
			},
			error:()=>{
				$('#snackbar').addClass("show").html("<strong>Ocurrió un error</strong>");
				setTimeout(function(){$('#snackbar').removeClass("show");},3000);
			}
		});
	});
});

function validacion() {
	alert('aber');
	var aber = $('#navSearch').val().replace(' ','');
	if (aber.equals('')||aber.equals(' ')) {
		return false;
	} else{return true;}
}