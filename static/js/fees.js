/*
$(document).ready(function () {
	console.log("document ready");
    $('#searchButton').click(function (event) {
        event.preventDefault();
        // var myForm = $("<form id=\"formSearch\" />").attr("method", "POST").attr("action", "/mesrecettes/search");
	myForm = $("#myForm");
	/*
        $("<input type='hidden' />")
                .attr("name", "WHAT")
                .val(souscription.reforder)
                .appendTo(myForm);
        $("#divForm").append(myForm);
	*/
	console.log('FAT')
	myForm.action = "/recettes/search";
        myForm.submit();
        return false;
    });
    //var current_page = 'recettes';
    //var element = $('#' + current_page);
    //if (element) {
	//console.log("recette menu actif");
	//element.addClass('active');
    //}

});
*/
