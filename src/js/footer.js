var App = App || {};

(function() {

	App.Footer = {

		init: function() {
			this.Groups();
		},

		Groups: function(){
			$('#footer-appcordovajade').find('a').click(function(){
				
				$('#footer-appcordovajade').find('.button-footer').removeClass('active');
				$(this).parent().addClass('active');

				var group_id = $(this).data('group');
				$('.main-group > ').hide();
				$('.main-group > '+group_id).show();

				if(group_id=='#qr'){
					App.Qr.init();
				}else if(group_id=='#cadastro'){
					App.Cadastro.init();
				}else{
					App.Qr.unit();
				}

				var group_brand = $(this).data('brand');
				$('a.navbar-brand').text(group_brand);
			});
		}
	}
})();