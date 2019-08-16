var App = App || {};

(function() {
	
	App.Consulta = {
		
		init: function() {
			this.Forms();
		},
		
		Forms: function(){
			$('.menu-consulta').find('a').click(function(){
				
				$('.menu-consulta .button-all').removeClass('active');
				$(this).parent().addClass('active');
				
				var form_click = $(this).attr('href');
				$('.forms-consulta > div').hide();
				$('.forms-consulta > '+form_click).show();
			});
			
			$(".form_consulta").submit(function(){
				$("#loading").show();
				var _self = $(this);
				setTimeout(function(){
					
					App.Consulta.GET(_self);
				},1000);
			});
		},
		GET: function(this_form){
			var data = null;
			
			var xhr = new XMLHttpRequest();
			xhr.withCredentials = true;
			
			xhr.addEventListener("readystatechange", function () {
				
				$("#loading").hide();
				
				if (this.readyState === 4) {
					console.log(this.responseText);
					var response = JSON.parse(this.responseText);
					if(response.nivelMensagem!=undefined){
						
						$('#alert-modal').find('.modal-body strong').text(response.nivelMensagem+': '+response.texto);
						$('#alert-modal').modal();
					}else{
						
						$('#alert-modal').find('.modal-body strong').text('Preencha todos os campos corretamente!');
						$('#alert-modal').modal();
					}
				}
			});
			
			var chassi = this_form.find('.consulta_chassi').val();
			if(chassi==undefined){
				chassi='';
			}
			var cpf = this_form.find('.consulta_cpf').val();
			if(cpf==undefined){
				cpf='';
			}
			var credora = this_form.find('.consulta_credora').val();
			if(credora==undefined){
				credora='';
			}
			
			xhr.open("GET", "https://dev.appcordovajade.com.br/ws/consultaPublica?chassi="+chassi+"&cnpjCredor="+credora+"&cpfCnpjDevedor="+cpf);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			
			xhr.send(data);
		}
	}
})();