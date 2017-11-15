$(document).ready(function () {
	var drp = false;
	var url = window.location.href;
	$('#modPer').on('click', ()=>{
		$(location).attr('href',url+'/../modificaDatosUsuario');
	});
	$('#myRef').on('click',()=>{
		$(location).attr('href',url+'/../referenciasUsuario');
	});
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
});
function validacion() {
	alert('aber');
	var aber = $('#navSearch').val().replace(' ','');
	if (aber.equals('')||aber.equals(' ')) {
		return false;
	} else{return true;}
}