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


function loadKalories(preparation_id) {
    var csrftoken = getCookie('csrftoken');
    var u = "/mesrecettes/preparation/energie/".concat(preparation_id);

    $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
    $.ajax({
        'type' : 'get',
        'url' : u,
           'success' : function(response)
        {
            var reponse = JSON.parse(response);
            if (reponse.status == 0 ) {
                var valeurs = reponse.valeurs;
                $("#id_detail_preparation_kcalories").val(valeurs.kcalories);
                $("#id_detail_preparation_kjoules").val(valeurs.kjoules);

                $("#id_detail_preparation_matieres_grasses").val(valeurs.matieres_grasses);
                $("#id_detail_preparation_matieres_grasses_saturees").val(valeurs.matieres_grasses_saturees);
    
                $("#id_detail_preparation_glucides").val(valeurs.glucides);
                $("#id_detail_preparation_glucides_dont_sucres").val(valeurs.glucides_dont_sucres);
           
                $("#id_detail_preparation_fibres").val(valeurs.fibres_alimentaires);
    
                $("#id_detail_preparation_proteines").val(valeurs.proteines);
                $("#id_detail_preparation_sel").val(valeurs.sel);
                
                $("#id_detail_preparation_prix_unitaire").val(valeurs.cout);
                $("#id_detail_preparation_prix_poids").val(valeurs.pp);
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


    loadKalories(preparation.id);    
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

$(document).ready(
    function () {
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
