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


function remplissage(recette) {

    $("#id_detail_recette_form")[0].reset();
    
    current_no_recette = recette.idloop;
    $('#id_delete_recette_id').text(recette.id);
    $("#id_detail_recette_id").val(recette.id)
    
    $('#id_detail_recette_code').val(recette.code);
    $('#id_detail_recette_id').text(recette.id);
    $("#id_detail_recette_description").text(recette.description);
    $("#id_detail_recette_bonasavoir").text(recette.bonasavoir);
    $("#id_detail_recette_owner").text(recette.owner)

    var dummy = $('#id_recette_img_'.concat(recette.id)).attr('src');
    if (dummy && dummy != "NONE") {
        $('#id_detail_recette_img').attr('src', dummy);
    }

    if (recette.acces == "PUB") {
        $('#id_detail_recette_acces option[value="PUB"]').prop('selected', true)
    }
    else {
        $('#id_detail_recette_acces option[value="PRIV"]').prop('selected', true)
    }
    $('#id_detail_recette_acces').change()

    // remplissage Categorie Photo
    var categorie_photo = $("#id_detail_categorie_photo");
    categorie_photo.empty();
    for (i=0; i < categories_photos.length; i++) {
        categorie_photo.append('<option selected value="' + categories_photos[i].value + '">' + categories_photos[i].description + '</option>');
    }

    // selection categorie
    $('#id_detail_id_photo').empty();
    $('#id_detail_id_photo').append('<option selected value="NONE">Choisir..</option>');

    if (recette.photo_groupe == null ||
        recette.photo_id == null) {
        $('#id_detail_categorie_photo OPTION[value="NONE"]').prop('selected', true);
        $('#id_detail_id_photo OPTION[value="NONE"]').prop('selected', true);
    }
    else {
        $('#id_detail_categorie_photo OPTION[value="'.concat(recette.photo_categorie_id).concat('"]')).prop('selected', true);
        loadPhotosDescriptionAtWork(recette.photo_categorie_id,
                                             $('#id_edit_recette_message'),
                                             $('#id_detail_id_photo'),
                                    recette.photo_id);
    }    
}

function remplissage_vide() {
    $("#id_detail_recette_form")[0].reset();    
}

function detail_recette(id) {
    var recette = getRecette(id);
    remplissage(recette);
    $('#id_detail_recette_form input').prop("disabled", true);
    $('#id_detail_recette_form textarea').prop("disabled", true);
    $('#id_detail_recette_form select').prop("disabled", true);

    var categorie = $("#id_detail_categorie");
    categorie.empty();
    categorie.append('<option selected value="' + recette.categorie_categorie + '">' + recette.categorie_description + '</option>');
    categorie.change();
    
    $("#id_detail_recette_modal_view_footer").css("display", "block");
    $("#id_detail_recette_modal_view_header").css("display", "block");
    $('#id_detail_recette_modal_delete_footer').css("display", "none");
    $('#id_detail_recette_modal_delete_header').css("display", "none");
    $('#id_detail_recette_modal_edit_footer').css("display", "none");
    $('#id_detail_recette_modal_edit_header').css("display", "none");
    $('#id_detail_recette_modal_new_header').css("display", "none");


    
    $('#id_detail_recette_modal').modal('show');
}

function ask_new_recette() {
    // FAT
    return;
     
    remplissage_vide();
    $('#id_delete_recette_id').text(-1);
    $("#id_detail_recette_id").val(-1)
    
    $("#id_detail_recette_modal_view_footer").css("display", "none");
    $("#id_detail_recette_modal_view_header").css("display", "none");
    $('#id_detail_recette_modal_delete_footer').css("display", "none");
    $('#id_detail_recette_modal_delete_header').css("display", "none");
    $('#id_detail_recette_modal_edit_header').css("display", "none");
    $('#id_detail_recette_modal_edit_footer').css("display", "block");
    $('#id_detail_recette_modal_new_header').css("display", "block");

    loadCategoriesAtWork("PREP",
                         $("#id_edit_recette_message"),
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

    $('#id_detail_recette_form input').prop("disabled", false);
    $('#id_detail_recette_form textarea').prop("disabled", false);
    $('#id_detail_recette_form select').prop("disabled", false);

    $("#id_detail_recette_img").attr("src",
                                        "/mesrecettes/photos/".concat("?" + new Date().getTime()));
    
    
    $('#id_detail_recette_modal').modal('show');
}


//
// Suppression d'un recette
//
function ask_delete_recette(id) {
    // FAT ///////////////////////////////////////////////
    return;
    
    var recette = getRecette(id);
    remplissage(recette);

    $("#id_detail_recette_modal_view_footer").css("display", "none");
    $("#id_detail_recette_modal_view_header").css("display", "none");
    $('#id_detail_recette_modal_delete_footer').css("display", "block");
    $('#id_detail_recette_modal_delete_header').css("display", "block");
    $('#id_detail_recette_modal_edit_footer').css("display", "none");
    $('#id_detail_recette_modal_edit_header').css("display", "none");
    $('#id_detail_recette_modal_new_header').css("display", "none");
    $('#id_detail_recette_modal_new_footer').css("display", "none");
    $('#id_detail_recette_modal_new_header').css("display", "none");

    $('#id_detail_recette_form input').prop("disabled", true);
    $('#id_detail_recette_form textarea').prop("disabled", true);
    $('#id_detail_recette_form select').prop("disabled", true);

    
    $('#id_detail_recette_modal').modal('show');
    
};


//
// Modification d'un recette
//
function ask_edit_recette(id) {
    // FAT /////////////////////////:
    return;
    var recette = getRecette(id);
    remplissage(recette);

    $("#id_detail_recette_modal_view_footer").css("display", "none");
    $("#id_detail_recette_modal_view_header").css("display", "none");
    $('#id_detail_recette_modal_delete_footer').css("display", "none");
    $('#id_detail_recette_modal_delete_header').css("display", "none");
    $('#id_detail_recette_modal_edit_footer').css("display", "block");
    $('#id_detail_recette_modal_edit_header').css("display", "block");

    $('#id_detail_recette_modal_new_header').css("display", "none");

    loadCategoriesAtWork("PREP",
                         $("#id_edit_recette_message"),
                         $("#id_detail_categorie"),
                         recette.categorie_categorie
                        );
    
    $('#id_detail_recette_form input').prop("disabled", false);
    $('#id_detail_recette_form textarea').prop("disabled", false);
    $('#id_detail_recette_form select').prop("disabled", false);
    $('#id_detail_recette_modal').modal('show');

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
                                        $('#id_edit_recette_message'),
                                        $('#id_detail_id_photo'),
                                        "NONE");
            $("#id_detail_recette_img").attr("src",
                                                "/mesrecettes/photos/".concat("?" + new Date().getTime()));

        });

        $('#id_detail_id_photo').change(function(event) {
            $("#id_detail_recette_img").attr("src",
                                                "/mesrecettes/photos/".concat($('#id_detail_id_photo').val()).concat("?" + new Date().getTime()));
            
        });
        
        
        $('#id_detail_recette_previous').click( function(event) {
            var nb = getNbRecette();
            var next_idx  = current_no_recette - 1;
            if (next_idx < 0) {
                next_idx  = nb - 1;
            }
            var new_recette = getRecette(next_idx);
            var categorie = $("#id_detail_categorie");
            categorie.empty();
            categorie.append('<option selected value="' + new_recette.categorie_categorie + '">' + new_recette.categorie_description + '</option>');
            categorie.change();
            
            remplissage(new_recette);
        });
        
        $('#id_detail_recette_next').click( function(event) {
            var nb = getNbRecette();
            next_idx  = current_no_recette + 1;
            if (next_idx >= nb) {
                next_idx  = 0;
            }
            var new_recette = getRecette(next_idx);
            var categorie = $("#id_detail_categorie");
            categorie.empty();
            categorie.append('<option selected value="' + new_recette.categorie_categorie + '">' + new_recette.categorie_description + '</option>');
            categorie.change();
            
            remplissage(new_recette);
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
        $("#id_edit_recette").click(
            function(){
                //event.preventDefault();
                $("#id_edit_recette_message").text("");
                var formdata = new FormData($("#id_detail_recette_form")[0]);
                $("#id_loader").css("display","block");
                var csrftoken = getCookie('csrftoken');
                var u = "/mesrecettes/recette/";;
                if ($("#id_detail_recette_id").val() == -1) {
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
                        console.log('Error on modifying recette:', jqXHR, textStatus, errorThrown);
	                $("#id_loader").css("display","none");
                        $("#id_edit_recette_message").text(JSON.parse(jqXHR.responseText).message);
                    }
                });    
            });
                
	
        $("#id_delete_recette").click(
	    function(){
	        $("#id_delete_recette").attr("disabled", true);
	        $("#id_delete_recette_abandon").attr("disabled", true);
	        $("#id_delete_recette_message").text("");
                $("#id_loader").css("display","block");
                var u = getGetRecetteUrl().concat($('#id_delete_recette_id').text());
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
                        console.log('Error on deleting recette:', jqXHR, textStatus, errorThrown);
	                $("#id_loader").css("display","none");
	                $("#id_delete_recette").removeAttr("disabled");
	                $("#id_delete_recette_abandon").removeAttr("disabled");
                        $("#id_delete_recette_message").text(JSON.parse(jqXHR.responseText).message);
                    }
                });    
            });
        
        
    }); // fin document ready
