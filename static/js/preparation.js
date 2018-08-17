var current_no_ingredient;

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
               message.text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
           }
          });    
}

function displayNutrition(preparation) {
       $("#id_detail_preparation_kcalories").text(preparation.nutrition.kcalories);
        $("#id_detail_preparation_kjoules").text(preparation.nutrition.kjoules);
        
        $("#id_detail_preparation_matieres_grasses").text(preparation.nutrition.matieres_grasses);
        $("#id_detail_preparation_matieres_grasses_saturees").text(preparation.nutrition.matieres_grasses_saturees);
        
        $("#id_detail_preparation_glucides").text(preparation.nutrition.glucides);
        $("#id_detail_preparation_glucides_dont_sucres").text(preparation.nutrition.glucides_dont_sucres);
        
        $("#id_detail_preparation_fibres").text(preparation.nutrition.fibres_alimentaires);
        
        $("#id_detail_preparation_proteines").text(preparation.nutrition.proteines);
        $("#id_detail_preparation_sel").text(preparation.nutrition.sel);
        
        $("#id_detail_preparation_prix_ingredients").text(preparation.nutrition.cout);
        $("#id_detail_preparation_prix_poids").text(preparation.nutrition.pp);    
}

function loadNutrition(preparation) {
    // déjà chargées ?
    if (preparation.nutrition) {
        displayNutrition(preparation);
        return;
    }
    
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
                displayNutrition(preparation);
            }
           },
           'error': function(jqXHR, textStatus, errorThrown)
           {
               message.text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
           }
          });    
    
}

function loadCategoriesAtWork(groupe, message, select, current) {
    
    var csrftoken = getCookie('csrftoken');
    var u = "/mesrecettes/categories";
    message.text(" ");    
    $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
    $.ajax({
        'type' : 'post',
        'url' : u,
        'data' : "groupe=".concat(groupe),
           'success' : function(response)
           {
               select.empty();
               var res = JSON.parse(response).message;
               select.append('<option value="NONE" selected>Choisir..</option>');
               for (var idx=0; idx < res.length; idx++) { 
                   var element = res[idx];
                   if (element.categorie == current) {
                       select.append('<option selected value=' + element.categorie + '>' + element.description + '</option>');
                       select.val(current);
                   } else {
                       select.append('<option value=' + element.categorie + '>' + element.description + '</option>');
                   }
               }
               select.change();
           },
           'error': function(jqXHR, textStatus, errorThrown)
           {
               message.text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
           }
          });    
}


function remplissage(preparation) {

    $("#id_detail_preparation_form")[0].reset();
    
    current_no_preparation = preparation.idloop;
    $('#id_delete_preparation_id').text(preparation.id);
    $("#id_detail_preparation_id").val(preparation.id)
    
    $('#id_detail_preparation_code').val(preparation.code);
    $('#id_detail_preparation_id').text(preparation.id);
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
    $("#id_detail_preparation_form")[0].reset();    
}

function detail_preparation(id) {
    var preparation = getPreparation(id);
    remplissage(preparation);
    $('#id_detail_preparation_form input').prop("disabled", true);
    $('#id_detail_preparation_form textarea').prop("disabled", true);
    $('#id_detail_preparation_form select').prop("disabled", true);
    //TODO: un peut brutal!
    $('#id_detail_preparation_form .btn').addClass("disabled");
    
    var categorie = $("#id_detail_categorie");
    categorie.empty();
    categorie.append('<option selected value="' + preparation.categorie_categorie + '">' + preparation.categorie_description + '</option>');
    categorie.change();
    
    $("#id_detail_preparation_modal_view_footer").css("display", "block");
    $("#id_detail_preparation_modal_view_header").css("display", "block");
    $('#id_detail_preparation_modal_delete_footer').css("display", "none");
    $('#id_detail_preparation_modal_delete_header').css("display", "none");
    $('#id_detail_preparation_modal_edit_footer').css("display", "none");
    $('#id_detail_preparation_modal_edit_header').css("display", "none");
    $('#id_detail_preparation_modal_new_header').css("display", "none");


    loadNutrition(preparation);
    $('.nav-tabs a[href="#id_nutrition_tab"]').tab('show')
    $('#id_detail_preparation_modal').modal('show');
}

function ask_new_preparation() {
    // FAT
    return;
     
    remplissage_vide();
    $('#id_delete_preparation_id').text(-1);
    $("#id_detail_preparation_id").val(-1)
    
    $("#id_detail_preparation_modal_view_footer").css("display", "none");
    $("#id_detail_preparation_modal_view_header").css("display", "none");
    $('#id_detail_preparation_modal_delete_footer').css("display", "none");
    $('#id_detail_preparation_modal_delete_header').css("display", "none");
    $('#id_detail_preparation_modal_edit_header').css("display", "none");
    $('#id_detail_preparation_modal_edit_footer').css("display", "block");
    $('#id_detail_preparation_modal_new_header').css("display", "block");

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
    
    
    $('#id_detail_preparation_modal').modal('show');
}


//
// Suppression d'un preparation
//
function ask_delete_preparation(id) {
    // FAT ///////////////////////////////////////////////
    return;
    
    var preparation = getPreparation(id);
    remplissage(preparation);

    $("#id_detail_preparation_modal_view_footer").css("display", "none");
    $("#id_detail_preparation_modal_view_header").css("display", "none");
    $('#id_detail_preparation_modal_delete_footer').css("display", "block");
    $('#id_detail_preparation_modal_delete_header').css("display", "block");
    $('#id_detail_preparation_modal_edit_footer').css("display", "none");
    $('#id_detail_preparation_modal_edit_header').css("display", "none");
    $('#id_detail_preparation_modal_new_header').css("display", "none");
    $('#id_detail_preparation_modal_new_footer').css("display", "none");
    $('#id_detail_preparation_modal_new_header').css("display", "none");

    $('#id_detail_preparation_form input').prop("disabled", true);
    $('#id_detail_preparation_form textarea').prop("disabled", true);
    $('#id_detail_preparation_form select').prop("disabled", true);
    
    $('#id_detail_preparation_modal').modal('show');
    
};


//
// Modification d'un preparation
//
function ask_edit_preparation(id) {
    // FAT /////////////////////////:
    return;
    var preparation = getPreparation(id);
    remplissage(preparation);

    $("#id_detail_preparation_modal_view_footer").css("display", "none");
    $("#id_detail_preparation_modal_view_header").css("display", "none");
    $('#id_detail_preparation_modal_delete_footer').css("display", "none");
    $('#id_detail_preparation_modal_delete_header').css("display", "none");
    $('#id_detail_preparation_modal_edit_footer').css("display", "block");
    $('#id_detail_preparation_modal_edit_header').css("display", "block");

    $('#id_detail_preparation_modal_new_header').css("display", "none");

    loadCategoriesAtWork("PREP",
                         $("#id_edit_preparation_message"),
                         $("#id_detail_categorie"),
                         preparation.categorie_categorie
                        );
    
    $('#id_detail_preparation_form input').prop("disabled", false);
    $('#id_detail_preparation_form textarea').prop("disabled", false);
    $('#id_detail_preparation_form select').prop("disabled", false);
    $('#id_detail_preparation_form .btn').prop("disabled", false);
    $('#id_detail_preparation_modal').modal('show');

};


function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    var msg_id = '#id_edit_photo_message';
    var img_target_id = '#id_edit_photo_img'

    if (evt.target.id.match(/import/)) {
        msg_id = '#id_import_photo_message';
        img_target_id = '#id_import_photo_img'
    }
    
    if (files.length !=1) {
        $(msg_id).text("Il faut sélectionner un fichier");
        return false;
    }


    // files is a FileList of File objects. List some properties.
    var f = files[0];
    // output.push(escape(f.name), ' ', f.type || 'n/a', ' - ',
    //            f.size, ' bytes, last modified: ',
    //            f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',

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

function displayEconomat(e) {
    var economat=$("#id_economat_tab");
    economat.empty();
    var d1 = $("<div class=\"no-margin row font-weight-bold text-center text-uppercase\"</div>");
    d1.append("<div class=\"col-lg-2 col-xs-2 col-md-3 col-sm-2\"><span>code</span></div>");
    d1.append("<div class=\"colprep col-lg-6 col-xs-6 col-md-3 col-sm-6\"><span>ingredient</span></div>");
    d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"><span>quantité (g)</span></div>");
    d1.append("<div class=\"colprep col-lg-2 col-xs-2 col-md-2 col-sm-2\"><span>coût (&euro;)</span></div>");
    economat.append(d1);
    var preparation = getPreparation(current_no_preparation);
    preparation.nutrition.ingredients.forEach(function(element) {
        d1 = $("<div class=\"no-margin row\"></div>");
        d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"><span>" + element.code + "</span></div>");
        d1.append("<div class=\"colprep col-lg-6 col-xs-6 col-md-6 col-sm-6\"><span>" + element.description + "</span></div>");
        d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"><span>" + element.quantite + "</span></div>");
        d1.append("<div class=\"colprep col-lg-2 col-xs-2 col-md-2 col-sm-2\"><span>" + element.cout + "</span></div>");
        economat.append(d1);
    });
}

function removeElement(href, message) {
    var element_id = $(href).data('elem');
    var csrftoken = getCookie('csrftoken');
    var preparation = getPreparation(current_no_preparation);
    var u = "/mesrecettes/preparation/".concat(preparation.id).concat("/ingredient/").concat(element_id);
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
                preparation.nutrition = undef;
                preparation.ingredients = undef;
            }
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            message.text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
        }
    });    
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
            if (response.status == 0) {
                var element_id = response.element_id;
                var ingredients=$("#id_add_ingredients_div");
                var d1 = $("<div class=\"no-margin row\" ></div>");
                d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"><span>" + ingredient.code + "</span></div>");
                d1.append("<div class=\"col-lg-6 col-xs-6 col-md-6 col-sm-6\"><span>" + ingredient.description + "</span></div>");
                d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"><input disabled class=\"form-control input-sm \" value=\""
                          + quantite + "\"></div>");
                d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"><a href=\"#\" class=\"text-danger add_ingredient_remove\" data-elem=\"" + element_id +"\"><span class=\"glyphicon glyphicon-remove-sign\"></span> supprimer</a></div>");
                
                $(d1).insertBefore("#id_add_ingredients_div");
        
                //TODO:optimiser
                $('.add_ingredient_remove').on('click', function (e) {
                    removeElement(this, message); 
                });
                    
                // reset des select
                $("#id_add_ingredient_categorie option[value='NONE']").prop("selected", true);
                var select = $("#id_add_ingredient_id").empty();
                select.append("<option selected value=\"NONE\">Choisir..</option></select>");
                
                // reset valeur
                $("#id_add_ingredient_quantite").val(0);
                
                preparation.nutrition = undef;
                preparation.ingredients = undef;

            }
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            message.text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
        }
    });    
}

function addIngredient() {
    var categorie = $("#id_add_ingredient_categorie").val();
    var quantite = $("#id_add_ingredient_quantite").val();
    
    var ingredient_id = $("#id_add_ingredient_id").val();
    var text = $("#id_add_ingredient_id option[value='" + ingredient_id + "'").text();
    var message = $("#id_edit_preparation_message");
    
    if (categorie != "NONE" && ingredient_id != "NONE") {

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
                message.text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
            }
        });    
    }
}

//
// Affichage des ingrédients
// Ajout Suppression 
function displayIngredients() {
    var preparation = getPreparation(current_no_preparation);
    // déjà chargées ?
    if (!preparation.ingredients) {
        loadIngredients(preparation);
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
    
    preparation.ingredients.forEach(function(element) {
        d1 = $("<div class=\"no-margin row\" ></div>");
        d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"><span>" + element.code + "</span></div>");
        d1.append("<div class=\"col-lg-6 col-xs-6 col-md-6 col-sm-6\"><span>" + element.description + "</span></div>");
        d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"><input disabled class=\"form-control input-sm \" value=\""
                  + element.quantite + "\"></div>");
        // d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"><a href=\"#\" class=\"text-danger add_ingredient_remove\"><span class=\"glyphicon glyphicon-remove-sign\"></span> supprimer</a></div>");

        d1.append("<div class=\"col-lg-2 col-xs-2 col-md-2 col-sm-2\"><a href=\"#\" class=\"text-danger add_ingredient_remove\" data-elem=\"" + element.element_id +"\"><span class=\"glyphicon glyphicon-remove-sign\"></span> supprimer</a></div>");
        

        
        ingredients.append(d1);
    });

    d1 = $("<div class=\"no-margin row\" id=\"id_add_ingredients_div\"></div>");
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
    s1 = $("<a href=\"#\" class=\"text-success\" id=\"id_add_ingredient_button\"><span class=\"glyphicon glyphicon-plus-sign\"></span> ajouter</a>");
    d2.append(s1);
    d1.append(d2);

    ingredients.append(d1);

    $("#id_add_ingredient_button").click(addIngredient);
    
    $('.add_ingredient_remove').on('click', function (e) {
        //$(this).parent().parent().remove();
        //alert($(this).data("elem"));
        removeElement(this); 
    });
    
    $('#id_add_ingredient_categorie').on('change', function (e) {
        var optionSelected = $("option:selected", this);
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
                message.text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
            }
        });    
        
        //
    });
}



function loadIngredients(preparation) {
    
    var csrftoken = getCookie('csrftoken');
    var u = "/mesrecettes/preparation/".concat(preparation.id).concat("/ingredient/all");

    $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
    $.ajax({
        'type' : 'get',
        'url' : u,
        'success' : function(json_response)
        {
            var reponse = JSON.parse(json_response);
            if (reponse.status == 0 ) {
                preparation.ingredients = reponse.elements;
                displayIngredients();
            }
            else {
                preparation.ingredients = [];
            }
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            message.text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
        }
          });    
}


$(document).ready(
    function () {
        $('a[href="#id_economat_tab"]').on('show.bs.tab', displayEconomat);
        $('a[href="#id_ingredients_tab"]').on('show.bs.tab', displayIngredients);


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
            categorie.append('<option selected value="' + new_preparation.categorie_categorie + '">' + new_preparation.categorie_description + '</option>');
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
            categorie.append('<option selected value="' + new_preparation.categorie_categorie + '">' + new_preparation.categorie_description + '</option>');
            categorie.change();
            
            remplissage(new_preparation);
        });
                
        
        $('#id_owner_sel').on('change', function (e) {
            var optionSelected = $("option:selected", this);
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
            var optionSelected = $("option:selected", this);
            var valueSelected = this.value;
            var myForm = $("<form id=\"selectForm\" />").attr("method", "GET").attr("action", valueSelected);

            $("<input type='hidden' />")
                .attr("name", "detail")
                .val(getDetailValue())
                .appendTo(myForm);

            $('#id_loader').append(myForm);
            $('#selectForm').submit();
        });
        

        // soumission modification
        $("#id_edit_preparation").click(
            function(){
                //event.preventDefault();
                $("#id_edit_preparation_message").text("");
                var formdata = new FormData($("#id_detail_preparation_form")[0]);
                $("#id_loader").css("display","block");
                var csrftoken = getCookie('csrftoken');
                var u = "/mesrecettes/preparation/";;
                if ($("#id_detail_preparation_id").val() == -1) {
                    t = 'put';
                }
                else {
                    t  = 'post';
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
                        window.location.reload();
                    },
                    'error': function(jqXHR, textStatus, errorThrown)
                    {
                        console.log('Error on modifying preparation:', jqXHR, textStatus, errorThrown);
	                $("#id_loader").css("display","none");
                        $("#id_edit_preparation_message").text(JSON.parse(jqXHR.responseText).message);
                    }
                });    
            });
                
	
        $("#id_delete_preparation").click(
	    function(){
	        $("#id_delete_preparation").attr("disabled", true);
	        $("#id_delete_preparation_abandon").attr("disabled", true);
	        $("#id_delete_preparation_message").text("");
                $("#id_loader").css("display","block");
                var u = getGetPreparationUrl().concat($('#id_delete_preparation_id').text());
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
                        console.log('Error on deleting preparation:', jqXHR, textStatus, errorThrown);
	                $("#id_loader").css("display","none");
	                $("#id_delete_preparation").removeAttr("disabled");
	                $("#id_delete_preparation_abandon").removeAttr("disabled");
                        $("#id_delete_preparation_message").text(JSON.parse(jqXHR.responseText).message);
                    }
                });    
            });
        
        
    }); // fin document ready
