var App = App || {};

(function() {
	
	App.Veiculo = {
		
		Novo: function(){
            
            $(".set-back").attr('href', '#cadastro');
            
            if($("#add_veiculo").hasClass('edit')){
                $('a.navbar-brand').text("Editar Veículo");                
            }else{
                $('a.navbar-brand').text("Novo Veículo");
                $.removeCookie('chassi_veiculo');
                $.removeCookie('modelo_name');
                $.removeCookie('modelo_value');
                $.removeCookie('marca_text');
                $.removeCookie('marca_selecionada');
            }
            App.Veiculo.Marca();
            $("#veiculo_modelo").click(function(){
                App.Veiculo.Modelo($("#marcas_appcordovajade").val());
            });
            
            $("#veiculo_chassi").val($.cookie("chassi_veiculo"));
            
            $("#veiculo_modelo").text($.cookie("modelo_name"));
            
            $("#add_veiculo_form").click(function(){
                
                $(".set-back").attr('href', '#login');
                
                $.cookie("chassi_veiculo", $("#veiculo_chassi").val());
                $("section").hide();
                $("#cadastro").show();
                $("#add_veiculo").addClass('edit');
                $("#add_veiculo").text($.cookie("marca_text") +' - '+ $.cookie("modelo_name"));
                location.hash = '#cidades_appcordovajade';
            });
        },
        Marca: function(){
            var data = null;
            
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            
            xhr.addEventListener("readystatechange", function () {
				if (this.readyState === 4) {
                    
                    var responseText = this.responseText;
                    
                    // responseText = '[{"id": 957494,"descricao": "CHERY"},{"id": 955655,"descricao": "CHEVROLET"}]';
                    
                    var response = JSON.parse(responseText);
                    $("#marcas_appcordovajade").html('<option value="">Escolher</option>');
                    for (var modelo = 0; modelo < response.length; modelo++) {
                        $("#marcas_appcordovajade").append('<option value="'+response[modelo].id+'">'+response[modelo].descricao+'</option>');
                    }
                    
                    $("#marcas_appcordovajade").val($.cookie("marca_selecionada"));
                    
                    $("#marcas_appcordovajade").change(function(){
                        $.cookie("marca_selecionada", $(this).val());
                        $.cookie("marca_text", $("#marcas_appcordovajade option:selected").text());
                        $("#veiculo_modelo").text('Escolha um Modelo');
                    });
				}
			});
            
            xhr.open("GET", "https://dev.appcordovajade.com.br/ws/fabricantes");
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader("Client-Id", $.cookie("client_id"));
			xhr.setRequestHeader("Authorization", $.cookie("token"));
            
            xhr.send(data);
        },
        Modelo: function(marca_id){
            
            if(!marca_id){
                $('#alert-modal').find('.modal-body strong').text('Seleciona uma Marca/Frabricante');
                $('#alert-modal').modal();
            }else{
                
                $(".set-back").attr('href', '#veiculo');
                
                $('a.navbar-brand').text("Modelo");
                $("section").hide();
                $("#cadastro_modelo").show();
                
                var data = null;
                
                var xhr = new XMLHttpRequest();
                xhr.withCredentials = true;
                
                xhr.addEventListener("readystatechange", function () {
                    if (this.readyState === 4) {
                        var responseText = this.responseText;
                        
                        // responseText = '[{"id": 955656,"descricao": "11000 2p (diesel)"},{"id": 955657,"descricao": "11000 3-Eixos 2p (diesel)"},{"id": 955658,"descricao": "12000 2p (diesel)"},{"id": 955659,"descricao": "12000 3-Eixos 2p (diesel)"},{"id": 955660,"descricao": "13000 2p (diesel)"},{"id": 955661,"descricao": "13000 3-Eixos 2p (diesel)"},{"id": 955662,"descricao": "14000 Turbo 2p (diesel)"},{"id": 955663,"descricao": "14000 Turbo 3-Eixos 2p (diesel)"},{"id": 955664,"descricao": "19000 2p (diesel)"},{"id": 955665,"descricao": "19000 3-Eixos 2p (diesel)"},{"id": 955666,"descricao": "21000 2p (diesel)"},{"id": 955667,"descricao": "22000 2p (diesel)"},{"id": 955668,"descricao": "6000 2p (diesel)"},{"id": 955669,"descricao": "C-60 2p (Gas.)"},{"id": 955670,"descricao": "D-40 2p (diesel)"},{"id": 955671,"descricao": "D-60 2p (diesel)"},{"id": 955672,"descricao": "D-70 2p (diesel)"}]';
                        
                        var response = JSON.parse(responseText);
                        $("#modelos_appcordovajade").html('');
                        for (var modelo = 0; modelo < response.length; modelo++) {
                            $("#modelos_appcordovajade").append('<button class="add" style="margin: 0;" data-value="'+response[modelo].id+'">'+response[modelo].descricao+'</button>');
                        }
                        
                        location.hash = '#main';
                        
                        $("#modelos_appcordovajade").find('button').click(function(){

                            $(".set-back").attr('href', '#cadastro');
                            
                            $.cookie("modelo_value", $(this).data('value'));
                            $.cookie("modelo_name", $(this).text());
                            
                            $('section').hide();
                            $("#cadastro_veiculo").show();
                            
                            $("#veiculo_modelo").text($.cookie("modelo_name"));
                        });
                    }
                });
                
                xhr.open("GET", "https://dev.appcordovajade.com.br/ws/veiculos/"+marca_id);
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.setRequestHeader("Client-Id", $.cookie("client_id"));
                xhr.setRequestHeader("Authorization", $.cookie("token"));
                
                xhr.send(data);
            }
        }
    }
})();