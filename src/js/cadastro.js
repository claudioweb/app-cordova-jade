var App = App || {};

(function() {
	
	App.Cadastro = {
		
		init: function(){
			this.Login();
			this.Formulario();
		},
		Login: function(){
			$("#login_form").submit(function(){
				
				$("#loading").show();
				
				var usuario = $("#login_identificador").val();
				var senha = $("#senha_identificador").val();
				var data = "identificador="+usuario+"&senha="+senha+"&hash=";
				
				var xhr = new XMLHttpRequest();
				xhr.withCredentials = true;
				
				xhr.addEventListener("readystatechange", function () {
					
					$("#loading").hide();
					
					if (this.readyState === 4) {
						if(this.responseText){
							var response = JSON.parse(this.responseText);
							console.log(response);
							if(response.mensagens){
								$.cookie("response", response.mensagens[0].detalhe);
							}
							$.cookie("client_id", usuario);
							$.cookie("token", response.token);
							$.cookie("user_name", response.nome);
							$.cookie("user_perfis", response.perfis);
							$.cookie("idUsuarioOrganizacaoAtual", response.idUsuarioOrganizacaoAtual);
							$.cookie("tipoDeOrganizacao", response.tipoDeOrganizacao);
						}
						
						App.Cadastro.Formulario();
					}
				});
				
				xhr.open("POST", "https://dev.appcordovajade.com.br/ws/login");
				xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				
				xhr.send(data);
			});
		},
		Formulario: function(){
			
			if($.cookie("token")!=undefined){
				
				$(".set-back").show();
				$(".set-back").attr('href', '#login');
				
				$(".set-back").click(function(){
					
					if($(this).attr('href')=='#login'){
						
						$("#formulario").hide();
						$("#login").show();
						$(".set-back").hide();
						$.removeCookie('token');
						
						$("#login_identificador").val('');
						$("#senha_identificador").val('');
						
						$('a.navbar-brand').text("Cadastro");
						
					}else if($(this).attr('href')=='#cadastro'){
						
						$('section').hide();
						$($(this).attr('href')).show();
						
						$('a.navbar-brand').text("Cadastro");           						
					}
					
					if($(this).attr('href')=='#veiculo'){
						
						$('section').hide();
						$($(this).attr('href')).show();
						
						if($("#add_veiculo").hasClass('edit')){
							$('a.navbar-brand').text("Editar Veículo");                
						}else{
							$('a.navbar-brand').text("Novo Veículo");
						}       						
					}
				});
				
				App.Cadastro.Salvar();
				
				App.Cadastro.Documentos();
				
				$("#cadastro").find("#login").hide();
				$("#cadastro").find("#formulario").show();
				
				$("#uf_appcordovajade").change(function(){
					App.Cadastro.Cidades($(this).val());
				});
				
				$("#add_veiculo").click(function(){
					$('section').hide();
					$('#cadastro_veiculo').show();
					
					App.Veiculo.Novo();
				});
				
			}else if($.cookie("response")!=undefined){
				$('#alert-modal').find('.modal-body strong').text($.cookie("response"));
				$('#alert-modal').modal();
			}
		},
		Cidades: function(uf){
			var data = null;
			
			var xhr = new XMLHttpRequest();
			xhr.withCredentials = true;
			
			xhr.addEventListener("readystatechange", function () {
				if (this.readyState === 4) {
					
					var responseText = this.responseText;
					
					// responseText = '[{"id": 6080,"nome": "Abadia de Goiás"},{"id": 6081,"nome": "Abadiânia"}]';
					
					var response = JSON.parse(responseText);
					$("#cidades_appcordovajade").html('<option value="">Escolher</option>');
					for (var cidade = 0; cidade < response.length; cidade++) {
						$("#cidades_appcordovajade").append('<option value="'+response[cidade].id+'">'+response[cidade].nome+'</option>');
					}
				}else if(this.readyState === 0){
					
					$('#alert-modal').find('.modal-body strong').text('Cidades: Erro de comunicação com o Servidor!');
					$('#alert-modal').modal();
				}
			});
			
			xhr.open("GET", "https://dev.appcordovajade.com.br/ws/cidades/"+uf);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.setRequestHeader("Client-Id", $.cookie("client_id"));
			xhr.setRequestHeader("Authorization", $.cookie("token"));
			
			xhr.send(data);
		},
		Documentos: function(){
			var data = null;
			
			var xhr = new XMLHttpRequest();
			xhr.withCredentials = true;
			
			xhr.addEventListener("readystatechange", function () {
				if (this.readyState === 4) {
					
					var responseText = this.responseText;
					
					// responseText = '[{"id": 963468,"codigo": 3,"nome": "Alienação Fiduciária"},{"id": 963455,"codigo": 1,"nome": "Arrendamento Mercantil"},{"id": 963480,"codigo": 5,"nome": "Consórcio"},{"id": 963474,"codigo": 4,"nome": "Penhor"},{"id": 963462,"codigo": 2,"nome": "Reserva de Domínio"}]';
					
					var response = JSON.parse(responseText);
					$("#tipo_financiamento").html('<option value="">Escolher</option>');
					for (var documento = 0; documento < response.length; documento++) {
						$("#tipo_financiamento").append('<option value="'+response[documento].codigo+'">'+response[documento].nome+'</option>');
					}
				}else if(this.readyState === 0){
					
					$('#alert-modal').find('.modal-body strong').text('Documentos: Erro de comunicação com o Servidor!');
					$('#alert-modal').modal();
				}
			});
			
			xhr.open("GET", "https://dev.appcordovajade.com.br/ws/tiposDocumento");
			xhr.setRequestHeader("Client-Id", $.cookie("client_id"));
			xhr.setRequestHeader("Authorization", $.cookie("token"));
			
			xhr.send(data);
		},
		isJson: function(str){
			try {
				JSON.parse(str);
			} catch (e) {
				return false;
			}
			return true;
		},
		Salvar: function(){
			
			$("#concluir_cadastro").click(function(){
				
				$("#loading").show();
				
				var data = JSON.stringify({
					"devedor": {
						"tipo": $("#tipo_devedor").val(),
						"cpfCnpj": $("#cpf_devedor").val(),
						"nome": $("#nome_devedor").val(),
						"ddd": $("#telefone_ddd").val(),
						"numero": $("telefone_devedor").val()
					},
					"enderecoDevedor": {
						"cep": $("#cep_devedor").val(),
						"logradouro": $("#logradouro_devedor").val(),
						"numero": $("#numero_devedor").val(),
						"bairro": $("#bairro_devedor").val(),
						"complemento": $("#complemento_devedor").val(),
						"uf": $("#uf_appcordovajade").val(),
						"cidade": $("#cidades_appcordovajade").val()
					},
					"veiculos": [
						{
							"marca": $.cookie("marca_text"),
							"modelo": $.cookie("modelo_name"),
							"chassi": $.cookie("chassi_veiculo")
						}
					],
					"tipoDocumento": {
						"codigo": $("#tipo_financiamento").val()
					}
				});
				
				var xhr = new XMLHttpRequest();
				xhr.withCredentials = true;
				
				xhr.addEventListener("readystatechange", function () {
					
					var _self = this;
					
					setTimeout(function(){
						
						$("#loading").hide();
						
						if (_self.readyState === 4) {
				
							
							if(App.Cadastro.isJson(_self.responseText)){
								
								var response = JSON.parse(_self.responseText);
								
								$('#alert-modal').find('.modal-body strong').text(response.mensagens[0].valor);
								$('#alert-modal').modal();
							}else{

								$('#alert-modal').find('.modal-body strong').text("Token expirado, tente novamente!");
								$('#alert-modal').modal();
								$(".set-back").click();
							}
							
						}else if(_self.readyState === 0){
							
							$('#alert-modal').find('.modal-body strong').text('Cadastro: Erro de comunicação com o Servidor!');
							$('#alert-modal').modal();
							$(".set-back").click();
						}
					},1000);
				});
				
				xhr.open("POST", "https://dev.appcordovajade.com.br/ws/servicos/protocolarRegistro");
				xhr.setRequestHeader("Content-Type", "application/json");
				xhr.setRequestHeader("Client-Id", $.cookie("client_id"));
				xhr.setRequestHeader("Authorization", $.cookie("token"));
				
				xhr.send(data);
			});
		}
	}
})();