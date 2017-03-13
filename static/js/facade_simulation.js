/**
 * Facade JS : permet de charger une implementation de la simulation de crÃ©dit
 * soit en de mode full_ws ou en mode partial_ws. 
 * @author zbajaja
 */

// Definir le mode (ou partial_ws)
var mode = "full_ws";

var script =  document.getElementById("b2b_code");

// recuperer le nom du paramÃ¨tre
var b2b_code = script.getAttribute("b2b_code");

//url de la repo des implementation JS
var repo = script.src.substring(0, script.src.indexOf("/js/facade_simulation.js"));

// ENV INT
if(script.src.indexOf("subscription-ihm")>= 0){
	repo = script.src.substring(0, script.src.indexOf("/subscription-ihm/js/facade_simulation.js"));
}

//url de la repo des implementation JS
var repojs = script.src.substring(0, script.src.indexOf("facade_simulation.js")) + "imp/";

// str utils pour la construction de l'url
var extention = ".js";

// construire le contexte
var context_js = repojs + mode + extention;

$(document).ready(function() {
// definition de la fontion incude qui permet de charger le JS implementation
var include = function(url, callback) {
	/* creation de la balise<script type="text/javascript"></script> */
	var script = document.createElement('script');
	script.type = 'text/javascript';

	/* faire pointer la balise sur le script qu'on veut charger avec en prime un timestamp pour Ã©viter les problÃ¨mes de cache*/
	script.src = url + '?' + (new Date().getTime());

	/* Ã©xecuter la fonction une fois que le script est chargÃ© */
	if (callback) {
		script.onreadystatechange = callback;
		script.onload = script.onreadystatechange;
	}

	/*ajout de la balise script dans le head */
	document.getElementsByTagName('head')[0].appendChild(script);
}

// appel include JS
include(context_js, function() {
	// code a excutÃ© aprÃ©s l'include ...
})
});
// fonction polymorphe de simulation (interface)
function get_credit_simulation(amount,dateb, merchant_ref, product_id, callback) {

	// appel et sychnronisation de l'implementation
	var simule = dosimulate(b2b_code,dateb, amount, merchant_ref, product_id,
			function(data) {
				return callback(data);
			});

};
