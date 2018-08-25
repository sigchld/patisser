var current_no_preparation;
var VIEW_PREP='detail'
var EDIT_PREP='edit'
var NEW_PREP='new'
var DEL_PREP='del'
var current_mode = VIEW_PREP;

function loadPhotosDescriptionAtWork(categorie, message, select, current) {
    
    var csrftoken = getCookie('csrftoken');
    var u = "/mesrecettes/photos/categorie/".concat(categorie);
    message.text(" ");    
    $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
    $.ajax({
        'type' : 'get',
        'url' : u,
        'success' : function(response)
           {
               select.empty();
               select.append('<option value="NONE" selected>Choisir..</option>');
               var res = JSON.parse(response).message;
               for (var idx=0; idx < res.length; idx++) { 
                   var element = res[idx];
                   if (element.id == current) {
                       select.append('<option selected value=' + element.id + '>' + element.description.substring(0, 40) + '</option>');
                       select.val(current);
                   } else {
                       select.append('<option value=' + element.id + '>' + element.description.substring(0, 40) + '</option>');
                   }
               }
    

               //select.change();
           },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            try {
                message.text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
            }
            catch(error) {
                message.text("erreur interne");
            }
            
        }
    });    
}

function formatNumber(len, number) {
    var s = number.toString();
    var l = s.length;
    if (l >= len) return s;
    return s.padStart(len, ' '); 
}

function displayNutrition() {
    // déjà chargées ?
    var preparation = getPreparation(current_no_preparation);
    
    if (!preparation.nutrition) {
        loadNutrition(preparation, displayNutrition);
        return;
    }
    
    $("#id_detail_preparation_kcalories").text(formatNumber(10, preparation.nutrition.kcalories));
    $("#id_detail_preparation_kjoules").text(formatNumber(10, preparation.nutrition.kjoules));
    
    $("#id_detail_preparation_matieres_grasses").text(formatNumber(10, preparation.nutrition.matieres_grasses));
    $("#id_detail_preparation_matieres_grasses_saturees").text(formatNumber(10, preparation.nutrition.matieres_grasses_saturees));
        
    $("#id_detail_preparation_glucides").text(formatNumber(10, preparation.nutrition.glucides));
    $("#id_detail_preparation_glucides_dont_sucres").text(formatNumber(10, preparation.nutrition.glucides_dont_sucres));
        
    $("#id_detail_preparation_fibres").text(formatNumber(10, preparation.nutrition.fibres_alimentaires));
    
    $("#id_detail_preparation_proteines").text(formatNumber(10, preparation.nutrition.proteines));
    $("#id_detail_preparation_sel").text(formatNumber(10, preparation.nutrition.sel));
        
    $("#id_detail_preparation_prix_ingredients").text(preparation.nutrition.cout);
}

function loadNutrition(preparation, affichage) {
    var message = $("#id_edit_preparation_message");    
    var csrftoken = getCookie('csrftoken');
    var u = "/mesrecettes/preparation/".concat(preparation.id).concat("/nutrition");

    $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
    $.ajax({
        'type' : 'get',
        'url' : u,
        'success' : function(response)
        {
            var reponse = JSON.parse(response);
            if (reponse.status == 0 ) {
                var valeurs = reponse.valeurs;
                preparation.nutrition = valeurs;
                affichage(preparation);
            }
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            try {
                message.text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
            }
            catch(error) {
                message.text("erreur interne");
            }
        }
    });    
    
}
/*
function loadCategoriesAtWork(groupe, message, select, current) {
    
    var csrftoken = getCookie('csrftoken');
    var u = "/mesrecettes/categorie/".concat(groupe).concat("/");
    message.text(" ");    
    $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
    $.ajax({
        'type' : 'get',
        'url' : u,
        'dataType': 'json',
        'success' : function(res)
        {
            select.empty();
            if (res.status == 0) {            
                select.append('<option value="NONE" selected>Choisir..</option>');
                for (var idx=0; idx < res.categories.length; idx++) { 
                    var element = res.categories[idx];
                    if (element.categorie == current) {
                        select.append('<option selected value=' + element.categorie + '>' + element.description + '</option>');
                        select.val(current);
                    } else {
                        select.append('<option value=' + element.categorie + '>' + element.description + '</option>');
                    }
                }
            }
            select.change();
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            try {
                message.text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
            }
            catch(error) {
                message.text("erreur interne");
            }
        }
    });    
}

*/
function remplissage(preparation) {

    $("#id_detail_preparation_form")[0].reset();
    
    current_no_preparation = preparation.idloop;
    $("#id_detail_preparation_id").val(preparation.id)    
    $('#id_detail_preparation_code').val(preparation.code);
    $("#id_detail_preparation_description").text(preparation.description);
    $("#id_detail_preparation_bonasavoir").text(preparation.bonasavoir);
    $("#id_detail_preparation_owner").text(preparation.owner)

    $("#id_detail_preparation_date_creation").text(preparation.date_creation);
    $("#id_detail_preparation_date_modification").text(preparation.date_modification)

    var dummy = $('#id_preparation_img_'.concat(preparation.id)).attr('src');
    if (dummy && dummy != "NONE") {
        $('#id_detail_preparation_img').attr('src', dummy);
    }

    if (preparation.acces == "PUB") {
        $('#id_detail_preparation_acces option[value="PUB"]').prop('selected', true)
    }
    else {
        $('#id_detail_preparation_acces option[value="PRIV"]').prop('selected', true)
    }
    $('#id_detail_preparation_acces').change()

    // remplissage Categorie Photo
    var categorie_photo = $("#id_detail_categorie_photo");
    categorie_photo.empty();
    for (i=0; i < categories_photos.length; i++) {
        categorie_photo.append('<option selected value="' + categories_photos[i].value + '">' + categories_photos[i].description + '</option>');
    }

    // selection categorie
    $('#id_detail_id_photo').empty();
    $('#id_detail_id_photo').append('<option selected value="NONE">Choisir..</option>');

    if (preparation.photo_groupe == null ||
        preparation.photo_id == null) {
        $('#id_detail_categorie_photo OPTION[value="NONE"]').prop('selected', true);
        $('#id_detail_id_photo OPTION[value="NONE"]').prop('selected', true);
    }
    else {
        $('#id_detail_categorie_photo OPTION[value="'.concat(preparation.photo_categorie_id).concat('"]')).prop('selected', true);
        loadPhotosDescriptionAtWork(preparation.photo_categorie_id,
                                             $('#id_edit_preparation_message'),
                                             $('#id_detail_id_photo'),
                                    preparation.photo_id);
    }    
}

function remplissage_vide() {
    $('#id_detail_preparation_form').find('input:text, input:password, select, textarea').val('');
    $('#id_detail_preparation_form').find('input:radio, input:checkbox').prop('checked', false);
    $("#id_detail_preparation_prix_ingredients").text("");
    current_no_preparation = -1;
}

function enable_disable_edit_mode() {
    $('#id_detail_preparation_allergene').prop("disabled", true);
    
    if (current_mode == VIEW_PREP) {
        $('#id_prep_tabs input').prop("disabled", true);
        $('#id_prep_tabs textarea').prop("disabled", true);
        $('#id_prep_tabs select').prop("disabled", true);
        $('.add-remove').hide();
        $('#id_prep_tabs').show();
    }
    else if (current_mode == EDIT_PREP) {
        $('#id_prep_tabs input').prop("disabled", false);
        $('#id_prep_tabs textarea').prop("disabled", false);
        $('#id_prep_tabs select').prop("disabled", false);
        $('.add-remove').show();
        $('#id_prep_tabs').show();
    }

    else if (current_mode == NEW_PREP) {
        $('#id_prep_tabs').hide();
    }
    else if (current_mode == DEL_PREP) {
        $('#id_prep_tabs input').prop("disabled", true);
        $('#id_prep_tabs textarea').prop("disabled", true);
        $('#id_prep_tabs select').prop("disabled", true);
        $('.add-remove').hide();
        $('#id_detail_preparation_form textarea').prop("disabled", true);
        $('#id_detail_preparation_form select').prop("disabled", true);
        $('#id_detail_preparation_form input').prop("disabled", true);
        $('#id_prep_tabs').hide();
    }
}

function ask_detail_preparation(id) {
    current_mode = VIEW_PREP;
    var preparation = getPreparation(id);
    remplissage(preparation);
    // pour le DEV    $('#id_detail_preparation_form input').prop("disabled", true);
    $('#id_detail_preparation_form textarea').prop("disabled", true);
    $('#id_detail_preparation_form select').prop("disabled", true);
    //TODO: un peut brutal!
    $('#id_detail_preparation_form .btn').addClass("disabled");
    
    var categorie = $("#id_detail_categorie");
    categorie.empty();
    categorie.append('<option selected value="' + preparation.categorie + '">' + preparation.categorie_description + '</option>');
    categorie.change();

    $("#id_preparation_modal_nav_footer").show();
    $("#id_preparation_modal_view_header").show();
    
    $('#id_preparation_modal_delete_footer').hide();
    $('#id_preparation_modal_edit_footer').hide();

    $('#id_preparation_modal_new_header').hide();
    $('#id_preparation_modal_delete_header').hide();
    $('#id_preparation_modal_edit_header').hide();
    

    $('#id_detail_preparation_form input').prop("disabled", true);
    $('#id_detail_preparation_form textarea').prop("disabled", true);
    $('#id_detail_preparation_form select').prop("disabled", true);

    enable_disable_edit_mode();
    
    $('#id_detail_preparation_modal').modal('show');
    $('.nav-tabs a[href="#id_nutrition_tab"]').tab('show')
}

function ask_new_preparation() {
    current_mode = NEW_PREP;
     
    remplissage_vide();
    $("#id_detail_preparation_id").val(-1)
    
    $("#id_preparation_modal_view_footer").css("display", "none");
    $("#id_preparation_modal_view_header").css("display", "none");
    $('#id_preparation_modal_delete_footer').css("display", "none");
    $('#id_preparation_modal_delete_header').css("display", "none");
    $('#id_preparation_modal_edit_header').css("display", "none");
    $('#id_preparation_modal_edit_footer').css("display", "block");
    $('#id_preparation_modal_new_header').css("display", "block");
    $("#id_preparation_modal_nav_footer").hide();

    loadCategoriesAtWork("PREP",
                         $("#id_edit_preparation_message"),
                         $("#id_detail_categorie"),
                         ''
                        );
    // remplissage Categorie Photo
    var categorie_photo = $("#id_detail_categorie_photo");
    categorie_photo.empty();
    for (i=0; i < categories_photos.length; i++) {
        categorie_photo.append('<option selected value="' + categories_photos[i].value + '">' + categories_photos[i].description + '</option>');
    }

    // selection categorie
    $('#id_detail_id_photo').empty();
    $('#id_detail_id_photo').append('<option selected value="NONE">Choisir</option>');

    $('#id_detail_categorie_photo OPTION[value="NONE"]').prop('selected', true);
    $('#id_detail_id_photo OPTION[value="NONE"]').prop('selected', true);

    $('#id_detail_preparation_form input').prop("disabled", false);
    $('#id_detail_preparation_form textarea').prop("disabled", false);
    $('#id_detail_preparation_form select').prop("disabled", false);

    $("#id_detail_preparation_img").attr("src",
                                        "/mesrecettes/photos/".concat("?" + new Date().getTime()));
    
    enable_disable_edit_mode();
    $('#id_detail_preparation_modal').modal('show');
}


//
// Suppression d'un preparation
//
function ask_delete_preparation(id) {
    current_mode = DEL_PREP;    
    var preparation = getPreparation(id);
    
    remplissage(preparation);

    $("#id_preparation_modal_nav_footer").css("display", "none");
    $('#id_preparation_modal_delete_footer').css("display", "block");
    $('#id_preparation_modal_edit_footer').css("display", "none");

    $('#id_preparation_modal_delete_header').css("display", "block");
    $('#id_preparation_modal_new_header').css("display", "none");
    $('#id_preparation_modal_edit_header').css("display", "none");
    $("#id_preparation_modal_view_header").css("display", "none");
    $('#id_preparation_modal_new_header').css("display", "none");

    $('#id_preparation_form input').prop("disabled", true);
    $('#id_preparation_form textarea').prop("disabled", true);
    $('#id_preparation_form select').prop("disabled", true);

    enable_disable_edit_mode();
    $('#id_detail_preparation_modal').modal('show');
    
};


//
// Modification d'un preparation
//
function ask_edit_preparation(id) {
    do_ask_edit_preparation(id);
    $('#id_detail_preparation_modal').modal('show');
}

function do_ask_edit_preparation(id) {
    var preparation = getPreparation(id);
    current_mode = EDIT_PREP;    
    remplissage(preparation);

    $("#id_preparation_modal_view_footer").hide();
    $("#id_preparation_modal_view_header").hide();
    $('#id_preparation_modal_delete_footer').hide();
    $('#id_preparation_modal_delete_header').hide();
    $('#id_preparation_modal_edit_footer').show();
    $('#id_preparation_modal_edit_header').show();
    $("#id_preparation_modal_nav_footer").hide();
    $('#id_preparation_modal_new_header').hide();

    loadCategoriesAtWork("PREP",
                         $("#id_edit_preparation_message"),
                         $("#id_detail_categorie"),
                         preparation.categorie
                        );

    enable_disable_edit_mode();
    
    $('#id_detail_preparation_form input').prop("disabled", false);
    $('#id_detail_preparation_form textarea').prop("disabled", false);
    $('#id_detail_preparation_form select').prop("disabled", false);
    $('#id_detail_preparation_allergene').prop("disabled", true);
    $('#id_detail_preparation_form .btn').removeClass("disabled");
    $('#id-span-button-file').removeClass('disabled')
    $('.nav-tabs a[href="#id_nutrition_tab"]').tab('show')
};


function handleFileSelect(inp) {
    var files = inp.get(0).files; // FileList object

    var msg_id = '#id_edit_photo_message';
    var img_target_id = "#id_detail_preparation_img"

    if (files.length !=1) {
        $(msg_id).text("Il faut sélectionner un fichier");
        return false;
    }


    var f = files[0];
    var error = "";
    if (f.size == 0 || f.size > 300000) {
           error = f.name.concat(", fichier trop gros 300000 caractères au maximum");
        $( this ).val('');
    }
    else if ((f.type != "image/png" && f.type != "image/jpeg")) {
        error = f.name.concat(", n'est pas une image jpeg ou png");
        $( this ).val('');
        //$(this).get(0).reset();
        //$(this).wrap('<form>').closest('form').get(0).reset();
        //$(this).unwrap();
    }
    else {
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                // Render thumbnail.
                $(img_target_id).attr('src', e.target.result);
            };
        })(f);
        
        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }
   
    $(msg_id).text(error);
    return false;
}

function displayEconomat() {

    var preparation = getPreparation(current_no_preparation);
    // déjà chargé ?
    if (!preparation.nutrition) {
        loadNutrition(preparation, displayEconomat);
        return;
    }

    var economat=$("#id_economat_tab");
    economat.empty();
    var d1 = $("<div class=\"no-margin row font-weight-bold text-center text-uppercase\"</div>");
    d1.append("<div class=\"col-lg-2 col-xs-2 col-md-3 col-sm-2\"><span>code</span></div>");
    d1.append("<div class=\"colprep col-lg-6 col-xs-6 col-md-3 col-sm-6\"><span>ingredient</span></div>");
    d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"><span>quantité (g)</span></div>");
    d1.append("<div class=\"colprep col-lg-2 col-xs-2 col-md-2 col-sm-2\"><span>prix (&euro;)</span></div>");
    economat.append(d1);

    preparation.nutrition.ingredients.forEach(function(element) {
        var d1 = $("<div class=\"no-margin row\"></div>");
        d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"><span >" + element.code + "</span></div>");
        d1.append("<div class=\"colprep col-lg-6 col-xs-6 col-md-6 col-sm-6\"><span>" + element.description + "</span></div>");
        d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2 economat\"><span >" + formatNumber(10, element.quantite) + "</span></div>");
        d1.append("<div class=\"colprep col-lg-2 col-xs-2 col-md-2 col-sm-2 economat\"><span>" + formatNumber(10, element.cout) + "</span></div>");
        economat.append(d1);
    });
}


///////////////////////////////////////////////////////////////////////////////
//                    Gestion TAB Ingredients
///////////////////////////////////////////////////////////////////////////////


function removeElement(href, message) {
    var element_id = $(href).data('elem');
    var csrftoken = getCookie('csrftoken');
    var preparation = getPreparation(current_no_preparation);
    var u = "/mesrecettes/preparation/".concat(preparation.id).concat("/ingredient/").concat(element_id).concat("/");
    var message = $("#id_edit_preparation_message");
    message.text(" ");    
    $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
    $.ajax({
        'type' : 'delete',
        'dataType': 'json',
        'contentType': "application/json;charset=utf-8",
        'url' : u,
        'data' : JSON.stringify({ ingredient_id : element_id}),
        'success' : function(response)
        {
            if (response.status == 0) {
                $(href).parent().parent().remove();
                preparation.nutrition = undefined;
                preparation.ingredients = preparation.ingredients.filter(function(element) {
                    return element.element_id != element_id;
                });
                displayNutrition();
            }
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            try {
                message.text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
            }
            catch(error) {
                message.text("erreur interne");
            }
        }
    });    
}


function addEventListenerIngredients() {
    var message = $("#id_edit_preparation_message");
    
    $('.add-ingredient-remove').on('click', function (e) {
        removeElement(this, message); 
    });

    $('.auto-save-ingredient').blur(function(e){
        var myinput = $(this);
        var timer = $(this).data("timer");
        if (timer) {
            clearTimeout(timer);
            $(this).removeData("timer");
            updateQTIngredient( $(myinput).data("elem"), $(myinput).val());
        }
    });

    $('.auto-save-ingredient').on('input', function(e) {
        var myinput = $(this);
        var oldtimer = $(this).data("timer");
        if (oldtimer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function(){
            $(myinput).removeData("timer");
            updateQTIngredient( $(myinput).data("elem"), $(myinput).val());
        }, 1000); 
        $(this).data("timer", timer);
    });

}

function buildIngredientDiv(code, description, element_id, quantite) {
    var d1 = $("<div class=\"no-margin row\" ></div>");
    d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"><span>" + code + "</span></div>");
    d1.append("<div class=\"col-lg-6 col-xs-6 col-md-6 col-sm-6\"><span>" + description + "</span></div>");
    d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"><input  class=\"form-control input-sm auto-save-ingredient\" value=\""
              + quantite + "\" data-elem=\"" + element_id +"\" ></div>");
    d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"><a href=\"#\" class=\"text-danger add-remove add-ingredient-remove\" data-elem=\"" + element_id +"\"><span class=\"glyphicon glyphicon-remove-sign\"></span></a></div>");
    return d1;
}

function addIngredientSave(message, ingredient, quantite) {
    var csrftoken = getCookie('csrftoken');
    var preparation = getPreparation(current_no_preparation);
    var u = "/mesrecettes/preparation/".concat(preparation.id).concat("/ingredient/");

    message.text(" ");    
    $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
    $.ajax({
        'type' : 'put',
        'dataType': 'json',
        'contentType': "application/json;charset=utf-8",
        'url' : u,
        'data' : JSON.stringify({ ingredient_id : ingredient.id, quantite : quantite }),
        'success' : function(response)
        {
            if (response.status != 0) {
                $(message).text(response.message);
            }
            else {
                var element_id = response.element_id;
                var ingredients=$("#id_add_ingredients_div");
                var d1 = buildIngredientDiv(ingredient.code, ingredient.description, element_id, quantite);
                $(d1).insertBefore("#id_add_ingredients_div");
                            
                // reset des select
                $("#id_add_ingredient_categorie option[value='NONE']").prop("selected", true);
                var select = $("#id_add_ingredient_id").empty();
                select.append("<option selected value=\"NONE\">Choisir..</option></select>");
                
                // reset valeur
                $("#id_add_ingredient_quantite").val(0);

                // forcer le recalcul energie et nutrition
                preparation.nutrition = undefined;
                displayNutrition();

                // ajouter le nouvel ingredient à la structure
                preparation.ingredients.push({'code':ingredient.code,
                                              'description':ingredient.description,
                                              'ingredient_id':ingredient.id,
                                              'preparation_id':preparation.id,
                                              'element_id':element_id,
                                              'quantite':quantite});

                addEventListenerIngredients();
            }
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            try {
                message.text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
            }
            catch(error) {
                message.text("erreur interne");
            }
        }
    });    
}

function addIngredient() {
    var categorie = $("#id_add_ingredient_categorie").val();
    var quantite = $("#id_add_ingredient_quantite").val();
    
    var ingredient_id = $("#id_add_ingredient_id").val();
    var text = $("#id_add_ingredient_id option[value='" + ingredient_id + "'").text();
    var message = $("#id_edit_preparation_message");
    
    if (categorie != "NONE" && ingredient_id != "NONE" && /^[0-9]+([.][0-9]+)?$/.test(quantite)) {

        var csrftoken = getCookie('csrftoken');
        var u = "/mesrecettes/ingredient/".concat(ingredient_id);
        message.text(" ");    
        $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
        $.ajax({
            'type' : 'get',
            'url' : u,
            'dataType': 'json',
            'data' : "",
            'success' : function(response)
            {
                //var reponse = JSON.parse(response);
                if (response.status == 0) {
                    addIngredientSave(message, response.ingredient, quantite);
                }
            },
            'error': function(jqXHR, textStatus, errorThrown)
            {
                try {
                    message.text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
                }
                catch(error) {
                    message.text("erreur interne");
                }
            }
        });    
    }
    else {
        $(message).text("saisie erronée");
    }
}


//
// MAJ Qt ingredient
function updateQTIngredient(elem_id, quantite) {
    var message = $("#id_edit_preparation_message");

    if (! /^[0-9]+([.][0-9]+)?$/.test(quantite)) {
        console.log("erreur");
        $(message).text("saisie erronée").fadeOut(2000, function() { $(message).text("").show(); });
        return;
    }
    
    var csrftoken = getCookie('csrftoken');
    var preparation = getPreparation(current_no_preparation);
    var u = "/mesrecettes/preparation/".concat(preparation.id).concat("/ingredient/").concat(elem_id).concat("/");
    
    message.text(" ");    
    $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
    $.ajax({
        'type' : 'post',
        'dataType': 'json',
        'contentType': "application/json;charset=utf-8",
        'url' : u,
        'data' : JSON.stringify({ quantite : quantite }),
        'success' : function(response)
        {
            if (response.status != 0) {
                $(message).text(response.message);
            }
            else {
                preparation.ingredients.forEach(function(element) {
                    if (element.element_id == elem_id) {
                        element.quantite = quantite;
                    }
                });

                // forcer le recalcul energie et nutrition
                preparation.nutrition = undefined;
                displayNutrition();
                
            }
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            try {
                message.text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
            }
            catch(error) {
                message.text("erreur interne");
            }
        }
    });
    
}

//
// Affichage des ingrédients
//
function displayIngredients() {
    var preparation = getPreparation(current_no_preparation);
    
    // déjà chargées ?
    if (!preparation.ingredients) {
        loadIngredients(preparation, displayIngredients);
        return;
    }
    var message = $("#id_edit_preparation_message");
    var ingredients=$("#id_ingredients_tab");
    ingredients.empty();
    var d1 = $("<div class=\"no-margin row font-weight-bold text-center text-uppercase\"</div>");
    d1.append("<div class=\"col-lg-2 col-xs-2 col-md-3 col-sm-2\"><span>code</span></div>");
    d1.append("<div class=\"col-lg-6 col-xs-6 col-md-3 col-sm-6\"><span>ingredient</span></div>");
    d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"><span>quantité (g)</span></div>");
    d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"></div>");
    ingredients.append(d1);
    
    preparation.ingredients.forEach(function(ingredient) {
	var d1 = buildIngredientDiv(ingredient.code, ingredient.description, ingredient.element_id, ingredient.quantite);
        ingredients.append(d1);
    });

    d1 = $("<div class=\"no-margin row add-remove\" id=\"id_add_ingredients_div\"></div>");
    var d2 = $("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"></div>");
    var s1 = $("<select style=\"width:140px;\" id=\"id_add_ingredient_categorie\"></select>");
    for (i=0; i < categories_ingredients.length; i++) {
        s1.append('<option value="' + categories_ingredients[i].value + '">' + categories_ingredients[i].description + '</option>');
    }

    d2.append(s1);
    d1.append(d2);
    
    d2 = $("<div class=\"col-lg-6 col-xs-6 col-md-6 col-sm-6\"></div>");
    s1 = $("<select style=\"width:350px;\" id=\"id_add_ingredient_id\"><option selected value=\"NONE\">Choisir..</option></select>");
    d2.append(s1);
    d1.append(d2);

    d2 = $("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"></div>");
    s1 = $("<input id=\"id_add_ingredient_quantite\" type=\"text\" class=\"form-control input-sm\" value=\"0\" >");
    d2.append(s1);
    d1.append(d2);

    d2 = $("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"></div>");
    s1 = $("<a href=\"#\" class=\"text-success add-remove\" id=\"id_add_ingredient_button\"><span class=\"glyphicon glyphicon-plus-sign\"></span> ajouter</a>");
    d2.append(s1);
    d1.append(d2);

    ingredients.append(d1);

    $("#id_add_ingredient_button").click(addIngredient);
    
    addEventListenerIngredients();
    
    $('#id_add_ingredient_categorie').on('change', function (e) {
        //var optionSelected = $("option:selected", this);
        var valueSelected = this.value;        
        var csrftoken = getCookie('csrftoken');
        var u = "/mesrecettes/ingredient/all/categorie/".concat(valueSelected);
        message.text(" ");    
        $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
        $.ajax({
            'type' : 'get',
            'url' : u,
            'data' : "",
            'success' : function(response)
            {
                var select = $("#id_add_ingredient_id");
                select.empty();
                var res = JSON.parse(response);
                if (res.status == 0) {
                    select.append('<option value="NONE" selected>Choisir..</option>');
                    for (var idx=0; idx < res.ingredients.length; idx++) { 
                        var ingredient = res.ingredients[idx];
                        select.append('<option value=' + ingredient.id + '>' + ingredient.description + '</option>');
                    }
                    select.change();
                }
            },
            'error': function(jqXHR, textStatus, errorThrown)
            {
                try {
                    message.text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
                }
                catch(error) {
                    message.text("erreur interne");
                }
            }
        });    
    });
    
    // activation des inputs
    enable_disable_edit_mode();
}


function loadIngredients(preparation, affichage) {
    
    var csrftoken = getCookie('csrftoken');
    var u = "/mesrecettes/preparation/".concat(preparation.id).concat("/ingredient/all/");

    $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
    $.ajax({
        'type' : 'get',
        'url' : u,
        'success' : function(json_response)
        {
            var reponse = JSON.parse(json_response);
            if (reponse.status == 0 ) {
                preparation.ingredients = reponse.elements;
                affichage();
            }
            else {
                preparation.ingredients = [];
            }
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            try {
                message.text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
            }
            catch(error) {
                message.text("erreur interne");
            }
        }
    });    
}


///////////////////////////////////////////////////////////////////////////////
//                    Gestion TAB Bases
///////////////////////////////////////////////////////////////////////////////


function removeBase(href, message) {
    var base_id = $(href).data('base');
    var csrftoken = getCookie('csrftoken');
    var preparation = getPreparation(current_no_preparation);
    var u = "/mesrecettes/preparation/".concat(preparation.id).concat("/base/").concat(base_id).concat("/");
    var message = $("#id_edit_preparation_message");
    
    message.text(" ");    
    $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
    $.ajax({
        'type' : 'delete',
        'dataType': 'json',
        'contentType': "application/json;charset=utf-8",
        'url' : u,
        'data' : JSON.stringify({ base_id : base_id}),
        'success' : function(response)
        {
            if (response.status == 0) {
                $(href).parent().parent().remove();
                preparation.nutrition = undefined;
                preparation.bases = preparation.bases.filter(function(base) {
                    return base.bases_id != base_id;
                });
            }
            else {
                message.text(response.message);
            }
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            try {
                message.text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
            }
            catch(error) {
                message.text("erreur interne");
            }
        }
    });    
}


function addEventListenerBases() {
    var message = $("#id_edit_preparation_message");
    
    $('.add-base-remove').on('click', function (e) {
        removeBase(this, message); 
    });

    $('.auto-save-base').blur(function(e){
        var myinput = $(this);
        var timer = $(this).data("timer");
        if (timer) {
            clearTimeout(timer);
            $(this).removeData("timer");
            updateQTBase( $(myinput).data("base"), $(myinput).val());
        }
    });

    $('.auto-save-base').on('input', function(e) {
        var myinput = $(this);
        var oldtimer = $(this).data("timer");
        if (oldtimer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function(){
            $(myinput).removeData("timer");
            updateQTBase( $(myinput).data("base"), $(myinput).val());
        }, 1000); 
        $(this).data("timer", timer);
    });

}

function buildBaseDiv(code, description, quantite, base_id) {
    var d1 = $("<div class=\"no-margin row\" ></div>");
    d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"><span>" + code + "</span></div>");
    d1.append("<div class=\"col-lg-6 col-xs-6 col-md-6 col-sm-6\"><span>" + description + "</span></div>");
    d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"><input  class=\"form-control input-sm auto-save-base\" value=\""
              + quantite + "\" data-base=\"" + base_id +"\"></div>");
    
    d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"><a href=\"#\" title=\"supprimer\" class=\"text-danger add-base-remove  add-remove\" data-base=\"" + base_id +"\"><span class=\"glyphicon glyphicon-remove-sign\"></span></a></div>");
    return d1;
}

function addBase() {
    var categorie = $("#id_add_base_categorie").val();
    var quantite = $("#id_add_base_quantite").val();    
    var preparation_id = $("#id_add_base_id").val();
    var message = $("#id_edit_preparation_message");
    var preparation = getPreparation(current_no_preparation);
    
    if (categorie && preparation_id && quantite && categorie != "NONE" && preparation_id != "NONE" && /^[0-9]+$/.test(quantite)) {

        var csrftoken = getCookie('csrftoken');
        var u = "/mesrecettes/preparation/".concat(preparation.id).concat("/base/");
        message.text(" ");    
        $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
        $.ajax({
            'type' : 'put',
            'url' : u,
            'dataType': 'json',
            'data' : JSON.stringify({ preparation_id:  preparation_id, quantite: quantite }),
            'success' : function(response)
            {
                if (response.status == 0) {
                    var base_id = response.base_id;
                    d1 = buildBaseDiv(response.code, response.description, response.quantite, response.base_id);
                    $(d1).insertBefore("#id_add_bases_div");
                                        
                    // reset valeurs
                    $("#id_add_base_quantite").val("100");

                    // reset des select
                    $("#id_add_base_categorie option[value='NONE']").prop("selected", true);
                    var select = $("#id_add_base_id").empty();
                    select.append("<option selected value=\"NONE\">Choisir..</option></select>");
                    
                    
                    // ajouter le nouvel ingredient à la structure
                    preparation.bases.push({'quantite': quantite,
                                            'description': response.description,
                                            'preparation_id': preparation.id,
                                            'base_id': base_id,
                                            'code': response.code});

                    addEventListenerBases();
                }
                else {
                    message.text(response.message);
                }
            },
            'error': function(jqXHR, textStatus, errorThrown)
            {
                try {
                    message.text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
                }
                catch(error) {
                    message.text("erreur interne");
                }
            }
        });    
    }
    else {
        $(message).text("saisie erronée");
    }
}


//
// MAJ Qt ingredient
function updateQTBase(elem_id, quantite) {
    var message = $("#id_edit_preparation_message");

    if (! /^[0-9]+([.][0-9]+)?$/.test(quantite)) {
        console.log("erreur");
        $(message).text("saisie erronée").fadeOut(2000, function() { $(message).text("").show(); });
        return;
    }
    
    var csrftoken = getCookie('csrftoken');
    var preparation = getPreparation(current_no_preparation);
    var u = "/mesrecettes/preparation/".concat(preparation.id).concat("/ingredient/").concat(elem_id).concat("/");
    
    message.text(" ");    
    $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
    $.ajax({
        'type' : 'post',
        'dataType': 'json',
        'contentType': "application/json;charset=utf-8",
        'url' : u,
        'data' : JSON.stringify({ quantite : quantite }),
        'success' : function(response)
        {
            if (response.status != 0) {
                $(message).text(response.message);
            }
            else {
                preparation.ingredients.forEach(function(element) {
                    if (element.element_id == elem_id) {
                        element.quantite = quantite;
                    }
                });

                // forcer le recalcul energie et nutrition
                preparation.nutrition = undefined;
                displayNutrition();
                
            }
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            try {
                message.text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
            }
            catch(error) {
                message.text("erreur interne");
            }
        }
    });
    
}

//
// Affichage des bases
//
function displayBases() {
    var preparation = getPreparation(current_no_preparation);
    // déjà chargées ?
    if (!preparation.bases) {
        loadBases(preparation, displayBases);
        return;
    }
    
    var message = $("#id_edit_preparation_message");
    var bases=$("#id_bases_tab");
    bases.empty();
    
    var d1 = $("<div class=\"no-margin row font-weight-bold text-center text-uppercase\"</div>");
    d1.append("<div class=\"col-lg-2 col-xs-2 col-md-3 col-sm-2\"><span>code</span></div>");
    d1.append("<div class=\"col-lg-6 col-xs-6 col-md-3 col-sm-6\"><span>préparation</span></div>");
    d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"><span>quantité (%)</span></div>");
    d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"></div>");
    bases.append(d1);
    
    preparation.bases.forEach(function(base) {
        var d1 = buildBaseDiv(base.code, base.description, base.quantite, base.base_id);               
        bases.append(d1);
    });

    d1 = $("<div class=\"no-margin row add-remove\" id=\"id_add_bases_div\"></div>");
    var d2 = $("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"></div>");
    var s1 = $("<select style=\"width:140px;\" id=\"id_add_base_categorie\"></select>");

    d2.append(s1);
    d1.append(d2);
    
    d2 = $("<div class=\"col-lg-6 col-xs-6 col-md-6 col-sm-6\"></div>");
    s1 = $("<select style=\"width:350px;\" id=\"id_add_base_id\"><option selected value=\"NONE\">Choisir..</option></select>");
    d2.append(s1);
    d1.append(d2);

    d2 = $("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"></div>");
    s1 = $("<input id=\"id_add_base_quantite\" type=\"text\" class=\"form-control input-sm\" value=\"100\" >");
    d2.append(s1);
    d1.append(d2);

    d2 = $("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"></div>");
    s1 = $("<a href=\"#\" class=\"text-success\" id=\"id_add_base_button\"><span class=\"glyphicon glyphicon-plus-sign\"></span> ajouter</a>");
    d2.append(s1);
    d1.append(d2);

    bases.append(d1);

    loadCategoriesAtWork("PREP",
                         $("#id_edit_preparation_message"),
                         $("#id_add_base_categorie"),
                         ''
                        );

    $("#id_add_base_button").click(addBase);
    
    addEventListenerBases();
    
    $('#id_add_base_categorie').on('change', function (e) {
        //var optionSelected = $("option:selected", this);
        var valueSelected = this.value;
        var csrftoken = getCookie('csrftoken');
        var u = "/mesrecettes/preparation/all/categorie/".concat(valueSelected);

        if (valueSelected == "NONE") {
            console.log("add_ingredient_categorie NONE!");
            return ;
        }

        message.text(" ");    
        $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
        $.ajax({
            'type' : 'get',
            'url' : u,
            'data' : "",
            'success' : function(response)
            {
                var select = $("#id_add_base_id");
                $(select).empty();
                var res = JSON.parse(response);
                if (res.status == 0) {
                    $(select).append('<option value="NONE" selected>Choisir..</option>');
                    for (var idx=0; idx < res.preparations.length; idx++) { 
                        var preparation = res.preparations[idx];
                        $(select).append('<option value=' + preparation.preparation_id + '>' + preparation.description + '</option>');
                    }
                    $(select).change();
                }
            },
            'error': function(jqXHR, textStatus, errorThrown)
            {
                try {
                    message.text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
                }
                catch(error) {
                    message.text("erreur interne");
                }
            }
        });    
    });
        
    // activation des inputs
    enable_disable_edit_mode();
}


function loadBases(preparation, affichage) {
    
    var csrftoken = getCookie('csrftoken');
    var u = "/mesrecettes/preparation/".concat(preparation.id).concat("/base/all/");

    $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
    $.ajax({
        'type' : 'get',
        'url' : u,
        'dataType': 'json',
        'success' : function(response)
        {
            if (response.status == 0 ) {
                preparation.bases = response.bases;
                affichage();
            }
            else {
                preparation.bases = [];
            }
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            try {
                message.text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
            }
            catch(error) {
                message.text("erreur interne");
            }
        }
    });    
}



///////////////////////////////////////////////////////////////////////////////
//                    Gestion TAB Etapes
///////////////////////////////////////////////////////////////////////////////

//
// MAJ Etape
function updateEtape(etape_id, name, val) {
    var message = $("#id_edit_preparation_message");

    if (name == "ordre" && ! /^[0-9]+$/.test(val)) {
        console.log("erreur");
        $(message).text("saisie erronée").fadeOut(2000, function() { $(message).text("").show(); });
        return;
    }
    
    var csrftoken = getCookie('csrftoken');
    var preparation = getPreparation(current_no_preparation);
    var u = "/mesrecettes/preparation/".concat(preparation.id).concat("/etape/").concat(etape_id).concat("/");
    
    message.text(" ");    
    $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
    $.ajax({
        'type' : 'post',
        'dataType': 'json',
        'contentType': "application/json;charset=utf-8",
        'url' : u,
        'data' : "{\"" + name + "\":" + JSON.stringify(val) + "}", 
        'success' : function(response)
        {
            if (response.status != 0) {
                $(message).text(response.message);
            }
            else {
                preparation.etapes.forEach(function(etape) {
                    if (etape.etape_id == etape_id) {
                        etape.nom = nom;
                    }
                });
            }
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            try {
                message.text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
            }
            catch(error) {
                message.text("erreur interne");
            }
        }
    });
    
}

function removeEtape(href, message) {
    var etape_id = $(href).data('etape');
    var csrftoken = getCookie('csrftoken');
    var preparation = getPreparation(current_no_preparation);
    var u = "/mesrecettes/preparation/".concat(preparation.id).concat("/etape/").concat(etape_id).concat("/");
    var message = $("#id_edit_preparation_message");
    message.text(" ");
    
    $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
    $.ajax({
        'type' : 'delete',
        'dataType': 'json',
        'contentType': "application/json;charset=utf-8",
        'url' : u,
        'data' : JSON.stringify({ etape_id : etape_id}),
        'success' : function(response)
        {
            if (response.status == 0) {
                $(href).parent().parent().remove();
                preparation.etapes = preparation.etapes.filter(function(etape) {
                    return etape.etape_id != etape_id;
                });
            }
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            try {
                message.text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
            }
            catch(error) {
                message.text("erreur interne");
            }
        }
    });    
}

function buildEtapeDiv(nom, description, ordre, etape_id) {
    var d1 = $("<div class=\"no-margin row\" ></div>");
    d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"><input type=\"text\" class=\"form-control\ auto-save-etape\" data-name=\"nom\" data-etape=\"" + etape_id +"\"value=\"" + nom + "\"></span></div>");
    if (current_mode == VIEW_PREP) {
        var converter = new showdown.Converter();
       //converter.makeHtml(text);

        var d2 = $("<div class=\"\more\">"+ description + "</div>");
        var d3 = $("<div class=\"col-lg-6 col-xs-6 col-md-6 col-sm-6 etape-description\"></div>");

        var showChar = 50,
	    moretext = "&hellip;",
	    lessText = "--";
        
	if(description.length > showChar) {
	    var c = description.substr(0, showChar);
	    var h = description.substr(showChar-1, description.length - showChar);
            
	    var html = "<span class=\"startcontent\">" + converter.makeHtml(c) + "</span>" + '<span class="morecontent"><span>'
                + converter.makeHtml(description) + '</span>&nbsp;&nbsp;<a href="" class="morelink">'
                + moretext + '</a></span>';

            $(d2).html(html);
        }
        d3.append(d2);
        d1.append(d3); 
    }
    else {
        d1.append("<div class=\"col-lg-6 col-xs-6 col-md-6 col-sm-6\"><textarea class=\"form-control auto-save-etape auto-size-textarea\" rows=\"1\" data-name=\"description\" data-etape=\"" + etape_id +"\">" + description + "</textarea></div>");
    }
    d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"><input type=\"text\" class=\"form-control auto-save-etape\" data-name=\"ordre\" data-etape=\"" + etape_id +"\"value=\"" + ordre + "\"></span></div>");
    
    d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2 t\"><a href=\"#\" title=\"supprimer\" class=\"text-danger add-etape-remove add-remove\" data-etape=\"" + etape_id +"\"><span class=\"glyphicon glyphicon-remove-sign\"></span></a></div>");
    return d1;           
}

function displayEtapes() {
    var preparation = getPreparation(current_no_preparation);
    // déjà chargées ?
    if (!preparation.etapes) {
        loadEtapes(preparation, displayEtapes);
        return;
    }
    var message = $("#id_edit_preparation_message");
    var etapes=$("#id_etapes_tab");
    etapes.empty();
    var d1 = $("<div class=\"no-margin row font-weight-bold text-center text-uppercase\"</div>");
    d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"><span>nom</span></div>");
    d1.append("<div class=\"col-lg-6 col-xs-6 col-md-6 col-sm-6\"><span>description</span></div>");
    d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"><span>ordre</span></div>");
    d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"></div>");
    etapes.append(d1);
    
    preparation.etapes.forEach(function(element) {
        d1 = buildEtapeDiv(element.nom, element.description, element.ordre, element.etape_id);
        etapes.append(d1);
    });

    d1 = $("<div class=\"no-margin row add-remove\" style=\"margin-top:10px; margin-botom:5px;\" id=\"id_add_etapes_div\"></div>");
    var d2 = $("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"><input id=\"id_add_etape_nom\"  class=\"form-control\" type=\"text\"></div>");
    d1.append(d2);
    
    d2 = $("<div class=\"col-lg-6 col-xs-6 col-md-6 col-sm-6\"></div>");
    s1 = $("<textarea id=\"id_add_etape_description\"  class=\"form-control auto-size-textarea\" rows=\"1\"></textarea>");
    d2.append(s1);
    d1.append(d2);

    d2 = $("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"></div>");
    s1 = $("<input id=\"id_add_etape_ordre\" type=\"text\" class=\"form-control input-sm\" value=\"0\" >");
    d2.append(s1);
    d1.append(d2);

    d2 = $("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"></div>");
    s1 = $("<a href=\"#\" class=\"text-success\" id=\"id_add_etape_button\"><span class=\"glyphicon glyphicon-plus-sign\"></span> ajouter</a>");
    d2.append(s1);
    d1.append(d2);

    etapes.append(d1);

    $("#id_add_etape_button").click(addEtape);
    
    addEventListenerEtapes();
    
    // activation des inputs
    enable_disable_edit_mode();
    enableShortenText();          
}

function addEventListenerEtapes() {
    var message = $("#id_edit_preparation_message");
    
    $('.add-etape-remove').on('click', function (e) {
        removeEtape(this, message); 
    });
    
    $('.auto-save-etape').blur(function(e){
        var myinput = $(this);
        var timer = $(this).data("timer");
        if (timer) {
            clearTimeout(timer);
            $(this).removeData("timer");
            updateEtape( $(myinput).data("etape"), $(myinput).data("name"), $(myinput).val());
        }
    });

    $('.auto-save-etape').on('input', function(e) {
        var myinput = $(this);
        var oldtimer = $(this).data("timer");
        if (oldtimer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function(){
            $(myinput).removeData("timer");
            updateEtape( $(myinput).data("etape"), $(myinput).data("name"), $(myinput).val());
        }, 1000); 
        $(this).data("timer", timer);
    });

    $('.auto-size-textarea').on('focus', function(e) {
        var myinput = $(this);
        if ($(myinput).attr('rows')) {
            $(myinput).attr('rows', 15);
        }
    });

    $('.auto-size-textarea').on('blur', function(e) {
        var myinput = $(this);
        if ($(myinput).attr('rows')) {
            $(myinput).attr('rows', 1);
        }
    });

}


function addEtape() {
    var nom = $("#id_add_etape_nom").val();
    var description = $("#id_add_etape_description").val();
    var ordre = $("#id_add_etape_ordre").val();
    var preparation = getPreparation(current_no_preparation);    
    var message = $("#id_edit_preparation_message");
    
    if (/^[0-9]+$/.test(ordre)) {
        var u = "/mesrecettes/preparation/".concat(preparation.id).concat("/etape/");
        var csrftoken = getCookie('csrftoken');
        message.text("");
        
        $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
        $.ajax({
            'type' : 'put',
            'dataType': 'json',
            'contentType': "application/json;charset=utf-8",
            'url' : u,
            'data' : JSON.stringify({ nom: nom, ordre: ordre, description: description }),
            'success' : function(response)
            {
                if (response.status != 0) {
                    $(message).text(response.message);
                }
                else {
                    var etape_id = response.etape_id;
                    d1 = buildEtapeDiv(nom, description, ordre, etape_id);
                    $(d1).insertBefore("#id_add_etapes_div");
                                        
                    // reset valeurs
                    $("#id_add_etape_ordre").val(0);
                    $("#id_add_etape_nom").val("");
                    $("#id_add_etape_description").val("");
                    
                    
                    // ajouter le nouvel ingredient à la structure
                    preparation.etapes.push({'ordre':ordre,
                                              'description':description,
                                              'preparation_id':preparation.id,
                                              'etape_id':etape_id,
                                              'nom':nom});
                    
                    addEventListenerEtapes();
                }
            },
            'error': function(jqXHR, textStatus, errorThrown)
            {
                try {
                    message.text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
                }
                catch(error) {
                    message.text("erreur interne");
                }
            }
        });
    }
    else {
        $(message).text("saisie erronée");
    }
}

function loadEtapes(preparation, affichage) {
    
    var csrftoken = getCookie('csrftoken');
    var u = "/mesrecettes/preparation/".concat(preparation.id).concat("/etape/all/");

    $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
    $.ajax({
        'type' : 'get',
        'url' : u,
        'success' : function(json_response)
        {
            var reponse = JSON.parse(json_response);
            if (reponse.status == 0 ) {
                preparation.etapes = reponse.etapes;
                affichage();
            }
            else {
                preparation.etapes = [];
            }
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            try {
                message.text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
            }
            catch(error) {
                message.text("erreur interne");
            }
        }
    });    
}

//
// Sauvegarde preparation
//
function savePreparation(){
    //event.preventDefault();
    $("#id_edit_preparation_message").text("");
    var formdata = new FormData($("#id_detail_preparation_form")[0]);
    $("#id_loader").css("display","block");
    var csrftoken = getCookie('csrftoken');
    var u = "/mesrecettes/preparation/";
    var prep_id = $("#id_detail_preparation_id").val();
    if (prep_id == -1) {
        t = 'put';
    }
    else {
        t  = 'post';
        u = u.concat(prep_id).concat("/");
    }
    
    $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
    $.ajax({
        //https://stackoverflow.com/questions/13240664/how-to-set-a-boundary-on-a-multipart-form-data-request-while-using-jquery-ajax-
        processData: false,
        contentType: false,
        'type': t,
        'url': u,
        data: formdata,
        
        'success': function(response)
        {
            $("#id_loader").css("display","none");
		try {
		    response = JSON.parse(response);
		    if (prep_id == -1) {
			// on passe dans le mode modification ssi on est en création
			//window.location.reload();
			var id;
			var prep = response.preparation;
			var preparation_id = prep.preparation_id;
			current_mode = EDIT_PREP;
			current_no_preparation = id;
			prep.ingredients = [];
			prep.bases = [];
			prep.etapes = [];
			prep.nutrition = {};
			prep.nutrition.cout = "0.00";
			prep.id = preparation_id;
			id = addObjPreparation(prep);
			$("#id_detail_preparation_id").val(preparation_id)
			do_ask_edit_preparation(id);
		    }
		}
		catch(error) {
                    $("#id_edit_preparation_message").text("erreur interne");
		}

        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            try {
                console.log('Error on modifying preparation:', jqXHR, textStatus, errorThrown);
	        $("#id_loader").css("display","none");
                $("#id_edit_preparation_message").text(JSON.parse(jqXHR.responseText).message);
            }
            catch(error) {
                $("#id_edit_preparation_message").text("erreur interne");
            }
        }
    });
}

function deletePreparation(){
    var preparation = getPreparation(current_no_preparation);    
    $("#id_delete_preparation").attr("disabled", true);
    $("#id_delete_preparation_abandon").attr("disabled", true);
    $("#id_edit_preparation_message").text("");
    $("#id_loader").css("display","block");
    var u = '/mesrecettes/preparation/'.concat(preparation.id).concat('/');
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({   headers: {  "X-CSRFToken": csrftoken  }  });
    $.ajax({
        'type': 'delete',
        'url': u,
        
        'success': function(response)
        {
	    window.location.reload()
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            try {
                console.log('Error on deleting preparation:', jqXHR, textStatus, errorThrown);
	        $("#id_loader").css("display","none");
	        $("#id_delete_preparation").removeAttr("disabled");
	        $("#id_delete_preparation_abandon").removeAttr("disabled");
                $("#id_edit_preparation_message").text(JSON.parse(jqXHR.responseText).message);
            }
            catch(error) {
                $("#id_edit_preparation_message").text("erreur interne");
            }
            
        }
    });    
}

// gestion choix photo
$(document).on('change', ':file', function() {
    var input = $(this);
    var numFiles = input.get(0).files ? input.get(0).files.length : 1;
    var label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [numFiles, label]);
    handleFileSelect(input);
    
    // remplissage Categorie Photo
    var categorie_photo = $("#id_detail_categorie_photo");
    categorie_photo.empty();
    for (i=0; i < categories_photos.length; i++) {
        categorie_photo.append('<option selected value="' + categories_photos[i].value + '">' + categories_photos[i].description + '</option>');
    }

    // selection categorie
    $('#id_detail_id_photo').empty();
    $('#id_detail_id_photo').append('<option selected value="NONE">Choisir</option>');

    $('#id_detail_categorie_photo OPTION[value="NONE"]').prop('selected', true);
    $('#id_detail_id_photo OPTION[value="NONE"]').prop('selected', true);
    
});

function enableShortenText() {
	var moretext = "&hellip;";
	var lesstext = "--";

	$(".morelink").click(function(){
		if($(this).hasClass("less")) {
			$(this).removeClass("less");
			$(this).html(moretext);
		} else {
			$(this).addClass("less");
			$(this).html(lesstext);
		}
	    //$(this).parent().prev().toggle();
            //$(this).parent().prev().prev().toggle();
            $(this).parent().prev().toggle();
		$(this).prev().toggle();
		return false;
	});
}

//
// Au Chargement.......
//
$(document).ready(
    function () {
        // activation tooltip bootstrap
        $('[data-toggle="tooltip"]').tooltip();

        // affichage non photo
        $(':file').on('fileselect', function(event, numFiles, label) {
            var input = $(this).parents('.input-group').find(':text');
            if ( input.length ) {
                var log = numFiles > 1 ? numFiles + ' files selected' : label;
                input.val(log);
            }
        });

        // activation affichage des tabs
        $('a[href="#id_nutrition_tab"]').on('show.bs.tab', displayNutrition);
        $('a[href="#id_ingredients_tab"]').on('show.bs.tab', displayIngredients);
        $('a[href="#id_etapes_tab"]').on('show.bs.tab', displayEtapes);
        $('a[href="#id_bases_tab"]').on('show.bs.tab', displayBases);
        $('a[href="#id_economat_tab"]').on('show.bs.tab', displayEconomat);

        $('#id_edit_photo').change(handleFileSelect);
        $('#id_import_photo').change(handleFileSelect);
        $('#id_detail_categorie_photo').change(function(event) {
            $('#id_detail_id_photo').empty();
            $('#id_detail_id_photo').append('<option selected value="NONE">Choisir..</option>');

            loadPhotosDescriptionAtWork($('#id_detail_categorie_photo').val(),
                                        $('#id_edit_preparation_message'),
                                        $('#id_detail_id_photo'),
                                        "NONE");
            $("#id_detail_preparation_img").attr("src",
                                                "/mesrecettes/photos/".concat("?" + new Date().getTime()));

        });

	// pour eviter la mise en cache ajout d'un param à la fin
        $('#id_detail_id_photo').change(function(event) {
            $("#id_detail_preparation_img").attr("src",
                                                "/mesrecettes/photos/".concat($('#id_detail_id_photo').val()).concat("?" + new Date().getTime()));
            
        });
        
        
        $('#id_detail_preparation_previous').click( function(event) {
            var nb = getNbPreparation();
            var next_idx  = current_no_preparation - 1;
            if (next_idx < 0) {
                next_idx  = nb - 1;
            }
            var new_preparation = getPreparation(next_idx);
            var categorie = $("#id_detail_categorie");
            categorie.empty();
            categorie.append('<option selected value="' + new_preparation.categorie + '">' + new_preparation.categorie_description + '</option>');
            categorie.change();
            
            remplissage(new_preparation);
        });
        
        $('#id_detail_preparation_next').click( function(event) {
            var nb = getNbPreparation();
            next_idx  = current_no_preparation + 1;
            if (next_idx >= nb) {
                next_idx  = 0;
            }
            var new_preparation = getPreparation(next_idx);
            var categorie = $("#id_detail_categorie");
            categorie.empty();
            categorie.append('<option selected value="' + new_preparation.categorie + '">' + new_preparation.categorie_description + '</option>');
            categorie.change();
            
            remplissage(new_preparation);
        });
                
        
        $('#id_owner_sel').on('change', function (e) {
            //var optionSelected = $("option:selected", this);
            var valueSelected = this.value;
            var myForm = $("<form id=\"selectForm\" />").attr("method", "GET").attr("action", valueSelected);
            
            $("<input type='hidden' />")
                .attr("name", "detail")
                .val(getDetailValue())
                .appendTo(myForm);
            
            $('#id_loader').append(myForm);
            $('#selectForm').submit();

        });

        $('#id_acces_sel').on('change', function (e) {
            //var optionSelected = $("option:selected", this);
            var valueSelected = this.value;
            var myForm = $("<form id=\"selectForm\" />").attr("method", "GET").attr("action", valueSelected);

            $("<input type='hidden' />")
                .attr("name", "detail")
                .val(getDetailValue())
                .appendTo(myForm);

            $('#id_loader').append(myForm);
            $('#selectForm').submit();
        });
        

        // soumission modification preparation du serveur
        $("#id_edit_preparation").click(savePreparation);

	// suppresstion préparation du serveur
        $("#id_delete_preparation").click(deletePreparation);
                
    }); // fin document ready
