var App = App || {};

(function() {
	
	App.Qr = {
		
		unit: function(){
			QRScanner.destroy(function(status){
				console.log(status);
			});
		},
		init: function(){
			
			this.unit();
			
			QRScanner.prepare(onDone); // show the prompt
			
			function onDone(err, status){
				if (err) {
					// here we can handle errors and clean up any loose ends.
					console.error(err);
				}
				if (status.authorized) {
					
					QRScanner.scan(displayContents);
					
					function displayContents(err, text){
						
						
						if(err){
							// an error occurred, or the scan was canceled (error code `6`)
						} else {
							
							$("#loading").show();
							
							// The scan completed, display the contents of the QR code:
							
							var data = null;
							
							var xhr = new XMLHttpRequest();
							xhr.withCredentials = true;
							
							xhr.addEventListener("readystatechange", function () {
								
								var _self = this;
								
								if (_self.readyState === 4) {
									
									var resposta = JSON.parse(_self.responseText);
									
									if(resposta.texto){
										
										$('#alert-modal').find('.modal-body strong').text(resposta.nivelMensagem+': '+resposta.texto);
										$('#alert-modal').modal();
									}else{
										
										$('#alert-modal').find('.modal-body strong').text('Certidão não encontrada.');
										$('#alert-modal').modal();
									}
									
									App.Qr.unit();
									setTimeout(function(){
										App.Qr.init();
									},1000);
									
								}
								
								$("#loading").hide();
								
							});
							
							xhr.open("GET", "https://dev.appcordovajade.com.br/ws/consultaPublica/certidao/"+text);
							xhr.setRequestHeader("Client-Id", "86634720134");
							xhr.setRequestHeader("Authorization", "eyJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiZGlyIn0..Q6-Fgr_XwAKhE668.3aFqk3FSOHHJEmEVWL9r6LOnTzbvEwK91ZjZOY4rbVxgs4IRGIOGsTglpd5I-tJU6NKUuyEbdGQCtpSKxyrTBWasHy0JgdUuZaNsIATAfGB5MOUgot6-a0jMaSLJdIeMxZUduxnXK19tPRxmjjHs09k9ajP6xLI_lYZkT8FlXKyRC08WBuQWZp2rSR-_poCBaKfjyByJrcq8n56KBLU-0oLIRyiQ6VKQrHoNUxRFPMOTcCZPd-bDQyYoNFR2s5YOk_A_.sK0pW0oJ3annidlUfymTIg");
							xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
							
							xhr.send(data);
						}
					}
					
					// W00t, you have camera access and the scanner is initialized.
					QRscanner.show();
				} else if (status.denied) {
					// The video preview will remain black, and scanning is disabled. We can
					// try to ask the user to change their mind, but we'll have to send them
					QRScanner.openSettings();
				} else {
					// we didn't get permission, but we didn't get permanently denied. (On
					// Android, a denial isn't permanent unless the user checks the "Don't
					// ask again" box.) We can ask again at the next relevant opportunity.
				}
			}
		}
	}
})();