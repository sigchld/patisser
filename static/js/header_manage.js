/*script de gestion du header*/
jQuery(document).ready(function($){
	// Verifier si le header est en mode banner
	if($('.banner').css('display') !=="none"){
		///Recuperation URL depuis le div helper [work around])
		desktop_img_url = $('.url_img_full').css('background-image').replace(/.*\s?url\([\'\"]?/,'').replace(/[\'\"]?\).*/, '');
		mobile_img_url = $('.url_img_mobile').css('background-image').replace(/.*\s?url\([\'\"]?/,'').replace(/[\'\"]?\).*/, '');
		$(".image_full").attr("src",desktop_img_url);
		$(".image_mobile").attr("src",mobile_img_url);
	}
	
	/** Traitement logo2*/
	// recuperer la repo des images
	var full_path = $('.logo1').css('background-image');
	var path = full_path.substring(0,full_path.lastIndexOf("/")+1);
	if(nbecheances==3){
		$('.logo2').css('background-image',path+'logo_3X_CB.png")');
	}else if(nbecheances==4){
		$('.logo2').css('background-image',path+'logo_4X_CB.png")');
	}
	
});


