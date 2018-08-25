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

/*
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

*/
function remplissage(ingredient) {

    $("#id_detail_ingredient_form")[0].reset();
    
    current_no_ingredient = ingredient.idloop;
    $('#id_delete_ingredient_id').text(ingredient.id);
    $("#id_detail_ingredient_id").val(ingredient.id)
    
    $('#id_detail_ingredient_code').val(ingredient.code);
    $('#id_detail_ingredient_id').text(ingredient.id);
    $("#id_detail_ingredient_description").text(ingredient.description);
    $("#id_detail_ingredient_bonasavoir").text(ingredient.bonasavoir);
    $("#id_detail_ingredient_owner").text(ingredient.owner)

    $("#id_detail_ingredient_kcalories").val(ingredient.kcalories);
    $("#id_detail_ingredient_kjoules").val(ingredient.kjoules);


    $("#id_detail_ingredient_matieres_grasses").val(ingredient.matieres_grasses);
    $("#id_detail_ingredient_matieres_grasses_saturees").val(ingredient.matieres_grasses_saturees);
    $("#id_detail_ingredient_matieges_grasses_inf").text(ingredient.matieres_grasses_inferieures);
    
    $("#id_detail_ingredient_glucides").val(ingredient.glucides);
    $("#id_detail_ingredient_glucides_dont_sucres").val(ingredient.glucides_dont_sucres);
    $("#id_detail_ingredient_glucides_inf").text(ingredient.glucides_inferieures);

    $("#id_detail_ingredient_fibres").val(ingredient.fibres_alimentaires);
    $("#id_detail_ingredient_fibres_inf").text(ingredient.fibres_alimentaires_inferieures);
    
    $("#id_detail_ingredient_proteines_inf").text(ingredient.proteines_inferieures);
    $("#id_detail_ingredient_proteines").val(ingredient.proteines);
    $("#id_detail_ingredient_sel_inf").text(ingredient.sel_inferieur);
    $("#id_detail_ingredient_sel").val(ingredient.sel);
    $("#id_detail_ingredient_date_creation").text(ingredient.date_creation);
    $("#id_detail_ingredient_date_modification").text(ingredient.date_modification);
    $("#id_detail_ingredient_categorie_description").val(ingredient.categorie_description);
    $("#id_detail_ingredient_prix_unitaire").val(ingredient.pu);
    $("#id_detail_ingredient_prix_poids").val(ingredient.pp);

    var dummy = $('#id_ingredient_img_'.concat(ingredient.id)).attr('src');
    if (dummy && dummy != "NONE") {
        $('#id_detail_ingredient_img').attr('src', dummy);
    }

    if (ingredient.allergene == "True")
        $('#id_detail_ingredient_allergene').attr('checked', true)
    else
        $('#id_detail_ingredient_allergene').attr('checked', false)

    if (ingredient.acces == "PUB") {
        $('#id_detail_ingredient_acces option[value="PUB"]').prop('selected', true)
        // $('#id_detail_ingredient_acces option[value="PRIV"]').prop('selected', false)
        //$('#id_detail_ingredient_acces').val("PUB")
    }
    else {
        $('#id_detail_ingredient_acces option[value="PRIV"]').prop('selected', true)
        //$('#id_detail_ingredient_acces option[value="PUB"]').prop('selected', false)
        //$('#id_detail_ingredient_acces').val("PRIV")
    }
    $('#id_detail_ingredient_acces').change()

    // remplissage Categorie Photo
    var categorie_photo = $("#id_detail_categorie_photo");
    categorie_photo.empty();
    for (i=0; i < categories_photos.length; i++) {
        categorie_photo.append('<option selected value="' + categories_photos[i].value + '">' + categories_photos[i].description + '</option>');
    }

    // selection categorie
    $('#id_detail_id_photo').empty();
    $('#id_detail_id_photo').append('<option selected value="NONE">Choisir..</option>');

    if (ingredient.photo_groupe == null ||
        ingredient.photo_id == null) {
        $('#id_detail_categorie_photo OPTION[value="NONE"]').prop('selected', true);
        $('#id_detail_id_photo OPTION[value="NONE"]').prop('selected', true);
    }
    else {
        $('#id_detail_categorie_photo OPTION[value="'.concat(ingredient.photo_categorie_id).concat('"]')).prop('selected', true);
        loadPhotosDescriptionAtWork(ingredient.photo_categorie_id,
                                             $('#id_edit_ingredient_message'),
                                             $('#id_detail_id_photo'),
                                    ingredient.photo_id);
    }    
}

function remplissage_vide() {
    // ne marche pas pour les textareas
    //$("#id_detail_ingredient_form")[0].reset();
    $('#id_detail_ingredient_form').find('input:text, input:password, select, textarea').val('');
    $('#id_detail_ingredient_form').find('input:radio, input:checkbox').prop('checked', false);
}

function detail_ingredient(id) {
    var ingredient = getIngredient(id);
    remplissage(ingredient);
    $('#id_detail_ingredient_form input').prop("disabled", true);
    $('#id_detail_ingredient_form textarea').prop("disabled", true);
    $('#id_detail_ingredient_form select').prop("disabled", true);

    var categorie = $("#id_detail_categorie");
    categorie.empty();
    categorie.append('<option selected value="' + ingredient.categorie_categorie + '">' + ingredient.categorie_description + '</option>');
    categorie.change();
    
    $("#id_detail_ingredient_modal_view_footer").css("display", "block");
    $("#id_detail_ingredient_modal_view_header").css("display", "block");
    $('#id_detail_ingredient_modal_delete_footer').css("display", "none");
    $('#id_detail_ingredient_modal_delete_header').css("display", "none");
    $('#id_detail_ingredient_modal_edit_footer').css("display", "none");
    $('#id_detail_ingredient_modal_edit_header').css("display", "none");
    $('#id_detail_ingredient_modal_new_header').css("display", "none");


    
    $('#id_detail_ingredient_modal').modal('show');
}

function ask_new_ingredient() {

    $('#id_detail_ingredient_form input').prop("disabled", false);
    $('#id_detail_ingredient_form textarea').prop("disabled", false);
    $('#id_detail_ingredient_form select').prop("disabled", false);

    remplissage_vide();

    $('#id_delete_ingredient_id').text(-1);
    $("#id_detail_ingredient_id").val(-1)
    
    $("#id_detail_ingredient_modal_view_footer").css("display", "none");
    $("#id_detail_ingredient_modal_view_header").css("display", "none");
    $('#id_detail_ingredient_modal_delete_footer').css("display", "none");
    $('#id_detail_ingredient_modal_delete_header').css("display", "none");
    $('#id_detail_ingredient_modal_edit_header').css("display", "none");
    $('#id_detail_ingredient_modal_edit_footer').css("display", "block");
    $('#id_detail_ingredient_modal_new_header').css("display", "block");

    loadCategoriesAtWork("ING",
                         $("#id_edit_ingredient_message"),
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

    $('#id_detail_ingredient_form input').prop("disabled", false);
    $('#id_detail_ingredient_form textarea').prop("disabled", false);
    $('#id_detail_ingredient_form select').prop("disabled", false);

    $("#id_detail_ingredient_img").attr("src",
                                        "/mesrecettes/photos/".concat("?" + new Date().getTime()));
    
    
    $('#id_detail_ingredient_modal').modal('show');
}


//
// Suppression d'un ingredient
//
function ask_delete_ingredient(id) {
    var ingredient = getIngredient(id);
    remplissage(ingredient);

    $("#id_detail_ingredient_modal_view_footer").css("display", "none");
    $("#id_detail_ingredient_modal_view_header").css("display", "none");
    $('#id_detail_ingredient_modal_delete_footer').css("display", "block");
    $('#id_detail_ingredient_modal_delete_header').css("display", "block");
    $('#id_detail_ingredient_modal_edit_footer').css("display", "none");
    $('#id_detail_ingredient_modal_edit_header').css("display", "none");
    $('#id_detail_ingredient_modal_new_header').css("display", "none");
    $('#id_detail_ingredient_modal_new_footer').css("display", "none");
    $('#id_detail_ingredient_modal_new_header').css("display", "none");

    $('#id_detail_ingredient_form input').prop("disabled", true);
    $('#id_detail_ingredient_form textarea').prop("disabled", true);
    $('#id_detail_ingredient_form select').prop("disabled", true);

    
    $('#id_detail_ingredient_modal').modal('show');
    
};


//
// Modification d'un ingredient
//
function ask_edit_ingredient(id) {
    var ingredient = getIngredient(id);
    remplissage(ingredient);

    $("#id_detail_ingredient_modal_view_footer").css("display", "none");
    $("#id_detail_ingredient_modal_view_header").css("display", "none");
    $('#id_detail_ingredient_modal_delete_footer').css("display", "none");
    $('#id_detail_ingredient_modal_delete_header').css("display", "none");
    $('#id_detail_ingredient_modal_edit_footer').css("display", "block");
    $('#id_detail_ingredient_modal_edit_header').css("display", "block");

    $('#id_detail_ingredient_modal_new_header').css("display", "none");

    loadCategoriesAtWork("ING",
                         $("#id_edit_ingredient_message"),
                         $("#id_detail_categorie"),
                         ingredient.categorie_categorie
                        );
    
    $('#id_detail_ingredient_form input').prop("disabled", false);
    $('#id_detail_ingredient_form textarea').prop("disabled", false);
    $('#id_detail_ingredient_form select').prop("disabled", false);
    $('#id_detail_ingredient_modal').modal('show');

};


function handleFileSelect(inp) {
    var files = inp.get(0).files; // FileList object

    var msg_id = '#id_edit_photo_message';
    var img_target_id = "#id_detail_ingredient_img"

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



$(document).ready(
    function () {

        $(':file').on('fileselect', function(event, numFiles, label) {
            var input = $(this).parents('.input-group').find(':text');
            if ( input.length ) {
                var log = numFiles > 1 ? numFiles + ' files selected' : label;
                input.val(log);
            }
        });
        
        $('#id_detail_categorie_photo').change(function(event) {
            $('#id_detail_id_photo').empty();
            $('#id_detail_id_photo').append('<option selected value="NONE">Choisir..</option>');

            loadPhotosDescriptionAtWork($('#id_detail_categorie_photo').val(),
                                        $('#id_edit_ingredient_message'),
                                        $('#id_detail_id_photo'),
                                        "NONE");
            $("#id_detail_ingredient_img").attr("src",
                                                "/mesrecettes/photos/".concat("?" + new Date().getTime()));

            // reset selection image locale
            $('#id_import_photo').val('');
            $('#toto').val('');
        });

        $('#id_detail_id_photo').change(function(event) {
            $("#id_detail_ingredient_img").attr("src",
                                                "/mesrecettes/photos/".concat($('#id_detail_id_photo').val()).concat("?" + new Date().getTime()));
            
        });
        
        
        $('#id_detail_ingredient_previous').click( function(event) {
            var nb = getNbIngredient();
            var next_idx  = current_no_ingredient - 1;
            if (next_idx < 0) {
                next_idx  = nb - 1;
            }
            var new_ingredient = getIngredient(next_idx);
            var categorie = $("#id_detail_categorie");
            categorie.empty();
            categorie.append('<option selected value="' + new_ingredient.categorie_categorie + '">' + new_ingredient.categorie_description + '</option>');
            categorie.change();
            
            remplissage(new_ingredient);
        });
        
        $('#id_detail_ingredient_next').click( function(event) {
            var nb = getNbIngredient();
            next_idx  = current_no_ingredient + 1;
            if (next_idx >= nb) {
                next_idx  = 0;
            }
            var new_ingredient = getIngredient(next_idx);
            var categorie = $("#id_detail_categorie");
            categorie.empty();
            categorie.append('<option selected value="' + new_ingredient.categorie_categorie + '">' + new_ingredient.categorie_description + '</option>');
            categorie.change();
            
            remplissage(new_ingredient);
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
        $("#id_edit_ingredient").click(
            function(){
                //event.preventDefault();
                $("#id_edit_ingredient_message").text("");
                var formdata = new FormData($("#id_detail_ingredient_form")[0]);
                $("#id_loader").css("display","block");
                var csrftoken = getCookie('csrftoken');
                var u = "/mesrecettes/ingredient/";;
                // création ou modification celon valeur id
                if ($("#id_detail_ingredient_id").val() == -1) {
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
                        console.log('Error on modifying ingredient:', jqXHR, textStatus, errorThrown);
	                $("#id_loader").css("display","none");
                        $("#id_edit_ingredient_message").text(JSON.parse(jqXHR.responseText).message);
                    }
                });    
            });
                
	
        $("#id_delete_ingredient").click(
	    function(){
	        $("#id_delete_ingredient").attr("disabled", true);
	        $("#id_delete_ingredient_abandon").attr("disabled", true);
	        $("#id_delete_ingredient_message").text("");
                $("#id_loader").css("display","block");
                var u = getGetIngredientUrl().concat($('#id_delete_ingredient_id').text());
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
                        console.log('Error on deleting ingredient:', jqXHR, textStatus, errorThrown);
	                $("#id_loader").css("display","none");
	                $("#id_delete_ingredient").removeAttr("disabled");
	                $("#id_delete_ingredient_abandon").removeAttr("disabled");
                        $("#id_delete_ingredient_message").text(JSON.parse(jqXHR.responseText).message);
                    }
                });    
            });
        
        
    }); // fin document ready
