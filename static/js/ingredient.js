var current_no_ingredient;
function remplissage(no_ingredient) {
    var ingredient = getIngredient(no_ingredient);
    //alert(no_ingredient);
    //$('#id_detail_ingredient_no').text(no_ingredient.toString());
    current_no_ingredient = no_ingredient;
    $('#id_delete_ingredient_id').text(ingredient.id);
    
    $('#id_detail_ingredient_code').text(ingredient.code);
    $('#id_detail_ingredient_id').text(ingredient.id);
    $("#id_detail_ingredient_description").text(ingredient.description);
    $("#id_detail_ingredient_bonasavoir").text(ingredient.bonasavoir);
    $("#id_detail_ingredient_owner").text(ingredient.owner)
    $("#id_detail_ingredient_acces").text(ingredient.acces);

    $("#id_detail_ingredient_kcalories").text(ingredient.kcalories);
    $("#id_detail_ingredient_kjoules").text(ingredient.kjoules);


    $("#id_detail_ingredient_matieres_grasses").text(ingredient.matieres_grasses);
    $("#id_detail_ingredient_matieres_grasses_saturees").text(ingredient.matieres_grasses_saturees);
    $("#id_detail_ingredient_matieges_grasses_inf").text(ingredient.matieres_grasses_inferieures);
    
    $("#id_detail_ingredient_glucides").text(ingredient.glucides);
    $("#id_detail_ingredient_glucides_dont_sucres").text(ingredient.glucides_dont_sucres);
    $("#id_detail_ingredient_glucides_inf").text(ingredient.glucides_inferieures);

    $("#id_detail_ingredient_fibres").text(ingredient.fibres_alimentaires);
    $("#id_detail_ingredient_fibres_inf").text(ingredient.fibres_alimentaires_inferieures);
    
    $("#id_detail_ingredient_proteines_inf").text(ingredient.proteines_inferieures);
    $("#id_detail_ingredient_proteines").text(ingredient.proteines);
    $("#id_detail_ingredient_sel_inf").text(ingredient.sel_inferieur);
    $("#id_detail_ingredient_sel").text(ingredient.sel);
    $("#id_detail_ingredient_date_creation").text(ingredient.date_creation);
    $("#id_detail_ingredient_date_modification").text(ingredient.date_modification);
    $("#id_detail_ingredient_categorie_description").val(ingredient.categorie_description);
    $("#id_detail_ingredient_prix_unitaire").text(ingredient.pu);
    $("#id_detail_ingredient_prix_poids").text(ingredient.pp);
    $('#id_detail_ingredient_img').attr('src', $('#id_ingredient_img_'.concat(ingredient.id)).attr('src'));    
}

function detail_ingredient(id) {
    remplissage(id);
    
    $('#id_detail_ingredient_previous').click( function(event) {
        event.preventDefault();
        var idx =  getNbIngredient();
        var next_idx  = current_no_ingredient - 1;
        if (next_idx < 0) {
            next_idx  = idx - 1;
        }
        remplissage(next_idx);
    });

    $('#id_detail_ingredient_next').click( function(event) {
        event.preventDefault();
        var idx =  getNbIngredient();
        next_idx  = current_no_ingredient + 1;
        if (next_idx >= idx) {
            next_idx  = 0;
        }
        remplissage(next_idx);
    });

    $("#id_detail_ingredient_modal_view_footer").css("display", "block");
    $('#id_detail_ingredient_modal_delete_footer').css("display", "none");
    $("#id_detail_ingredient_modal_view_header").css("display", "block");
    $('#id_detail_ingredient_modal_delete_header').css("display", "none");
    
    $('#id_detail_ingredient_modal').modal('show');
}


function ask_delete_ingredient(id) {
    remplissage(id);

    $("#id_detail_ingredient_modal_view_footer").css("display", "none");
    $('#id_detail_ingredient_modal_delete_footer').css("display", "block");
    $("#id_detail_ingredient_modal_view_header").css("display", "none");
    $('#id_detail_ingredient_modal_delete_header').css("display", "block");

    $('#id_detail_ingredient_modal').modal('show');
    
    return;
    
    $('#id_ingredient_photo_code').text($('#id_photo_code_'.concat(id)).text());
    $('#id_delete_photo_description').text($('#id_photo_description_'.concat(id)).text());
    $('#id_delete_photo_message').text("");
    $('#id_delete_photo_img').attr('src', $('#id_photo_img_'.concat(id)).attr('src'));
    $('#id_delete_photo_id').text(id);
    $('#delete_photo').modal('show')
};

function ask_edit_photo(id) {
    // reset du formulaire
    //$('#id_edit_photo').val('');
    $('#id_edit_photo_code').val($('#id_photo_code_'.concat(id)).text());
    $('#id_edit_photo_description').val($('#id_photo_description_'.concat(id)).text());
    $('#id_edit_photo_acces').val($('#id_photo_acces_'.concat(id)).text());
    $('#id_edit_photo_message').text("");
    $('#id_edit_photo_img').attr('src', $('#id_photo_img_'.concat(id)).attr('src'));
    $('#id_edit_photo_id').val(id);

    //reset du champ choix fichier file
    //var el = $('#id_edit_photo');
    //el.wrap('<form>').closest('form').get(0).reset();
    //el.unwrap();

    $('#id_edit_photo_label').text('');
    $('#id_edit_photo_modal').modal('show')
};

function ask_import_photo() {
    // reset du formulaire
    //$('#id_import_photo').get(0).reset(); 
    //$('#id_edit_photo_code').val($('#id_photo_code_'.concat(id)).text());
    //$('#id_edit_photo_description').val($('#id_photo_description_'.concat(id)).text());
    //$('#id_edit_photo_acces').val($('#id_photo_acces_'.concat(id)).text());
    //$('#id_edit_photo_message').text("");
    //$('#id_edit_photo_img').attr('src', $('#id_photo_img_'.concat(id)).attr('src'));
    //$('#id_edit_photo_id').val(id);

    //reset du champ choix fichier file
    //var el = $('#id_edit_photo');
    //el.wrap('<form>').closest('form').get(0).reset();
    //el.unwrap();

    //$('#id_edit_photo_label').text('');

    $('#id_import_photo_form').get(0).reset();
    $('#id_import_photo_img').attr('src', blank_photo);
    $('#modalAddPhoto').modal('show');
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

        

        // soumission de l'import de la photo
        $("#id_import_photo_form").submit(
            function(event){
                event.preventDefault();
                $("#id_import_photo_message").text("");
                var formdata = new FormData($(this)[0]);
                $("#id_loader").css("display","block");
                var csrftoken = getCookie('csrftoken');
                var u = getPhotoCreateUrl();

                $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
                //$ajaxSetup({   headers: {  "X-CSRFToken": csrftoken, "Content-Type": "multipart/form-data"  }  });
                $.ajax({
                    //https://stackoverflow.com/questions/13240664/how-to-set-a-boundary-on-a-multipart-form-data-request-while-using-jquery-ajax-
                    processData: false,
                    contentType:false,
                    'type': 'put',
                    'url': u,
                    data: formdata,
                    
                    'success': function(response)
                    {
	                window.location.reload();
                    },
                    'error': function(jqXHR, textStatus, errorThrown)
                    {
                        console.log('Error on deleting photo:', jqXHR, textStatus, errorThrown);
	                $("#id_loader").css("display","none");
                        $("#id_import_photo_message").text(JSON.parse(jqXHR.responseText).message);
                    }
                });    
            });
                
        // soumission de l'import de la photo
        $("#id_edit_photo_form").submit(
            function(event){
                event.preventDefault();
                $("#id_edit_photo_message").text("");
                var formdata = new FormData($(this)[0]);
                $("#id_loader").css("display","block");
                var csrftoken = getCookie('csrftoken');
                var u = getPhotoCreateUrl();

                $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
                //$ajaxSetup({   headers: {  "X-CSRFToken": csrftoken, "Content-Type": "multipart/form-data"  }  });
                $.ajax({
                    //https://stackoverflow.com/questions/13240664/how-to-set-a-boundary-on-a-multipart-form-data-request-while-using-jquery-ajax-
                    processData: false,
                    contentType:false,
                    'type': 'post',
                    'url': u,
                    data: formdata,
                    
                    'success': function(response)
                    {
	                window.location.reload();
                    },
                    'error': function(jqXHR, textStatus, errorThrown)
                    {
                        console.log('Error on deleting photo:', jqXHR, textStatus, errorThrown);
	                $("#id_loader").css("display","none");
                        $("#id_edit_photo_message").text(JSON.parse(jqXHR.responseText).message);
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
