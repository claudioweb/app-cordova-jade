var App = App || {};

(function() {
	
	App.Qr = {
		
		unit: function(){
		
		},
		init: function(){
		
			const QRGen = window.tabrisJsPlugins.qrCode;
			QRGen.GenerateQRToCanvas();
		}
			
			
	}
})();