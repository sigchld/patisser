function ask_delete_photo(id) {
    $('#id_delete_photo_code').text($('#id_photo_code_'.concat(id)).text());
    $('#id_delete_photo_description').text($('#id_photo_description_'.concat(id)).text());
    $('#id_delete_photo_message').text("");
    $('#id_delete_photo_img').attr('src', $('#id_photo_img_'.concat(id)).attr('src'));
    $('#id_delete_photo_id').text(id);
    $('#delete_photo').modal('show')
};

function ask_edit_photo(id) {
    $('#id_photo_code').val($('#id_photo_code_'.concat(id)).text());
    $('#id_photo_description').val($('#id_photo_description_'.concat(id)).text());
    $('#id_photo_acces').val($('#id_photo_acces_'.concat(id)).text());
    $('#id_photo_message').text("");
    $('#id_photo_img').attr('src', $('#id_photo_img_'.concat(id)).attr('src'));
    $('#id_photo_id').text(id);

    $('#id_photo_groupe').val($('#id_groupe_'.concat(id)).text());
    $('#id_photo_categorie').data("current", $('#id_categorie_'.concat(id)).text());

    loadCategoriesAtWork($('#id_photo_groupe').val(),
                         $('#id_photo_message'),
                         $('#id_photo_categorie'),
                         $('#id_photo_categorie').data('current')
                        );
    
    $("#id_photo_form").submit(submit_modification_photo);
    $("#id_photo_titre_modal").text("Modifier une photo");
    $("#id_photo_modal").modal("show")
};

function ask_import_photo() {
    $('#id_photo_form').get(0).reset();
    $('#id_photo_img').attr('src', blank_photo);
    $('#id_photo_message').text('');    
    var selected = $('#id_photo_categorie');
    
    selected.empty();
    selected.append("<option value='NONE'>Choisir..</option>");

    // soumission de l'import de la photo
    $("#id_photo_form").submit(submit_creation_photo);
    $("#id_photo_titre_modal").text("Ajouter une photo");
    $('#id_photo_modal').modal('show');
};


function handleFileSelect(inp) {
    var files = inp.get(0).files; // FileList object    
    var msg_id = '#id_photo_message';
    var img_target_id = '#id_photo_img'

    $('#id_photo_img').attr('src', blank_photo);
    
    if (files.length !=1) {
        $(msg_id).text("Il faut sélectionner un fichier");
        return false;
    }


    // files is a FileList of File objects. List some properties.
    var f = files[0];
    var error = "";
    if (f.size == 0 || f.size > 300000) {
        error = f.name.concat(", fichier trop gros 300ko au maximum");
        $( this ).val('');
    }
    else if ((f.type != "image/png" && f.type != "image/jpeg")) {
        error = f.name.concat(", n'est pas une image jpeg ou png");
        $( this ).val('');
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



function loadCategories(event) {
    event.preventDefault();
    loadCategoriesAtWork($('#id_photo_groupe').val(),
                         $('#id_photo_message'),
                         $('#id_photo_categorie'),
                         $('#id_photo_categorie').data('current')
                        );
}

function submit_creation_photo(event){
    event.preventDefault();
    $("#id_photo_message").text("");
    var formdata = new FormData($(this)[0]);
    $("#id_loader").css("display","block");
    var csrftoken = getCookie('csrftoken');
    var u = getPhotoCreateUrl();
    
    $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
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
            $("#id_photo_message").text(JSON.parse(jqXHR.responseText).message);
        }
    });    
}

function submit_modification_photo(event){
    event.preventDefault();
    $("#id_photo_message").text("");
    var formdata = new FormData($(this)[0]);
    $("#id_loader").css("display","block");
    var csrftoken = getCookie('csrftoken');
    var u = getPhotoCreateUrl().concat($("#id_photo_id").text());
    
    $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
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
            $("#id_photo_message").text(JSON.parse(jqXHR.responseText).message);
        }
    });        
}

$(document).on('change', ':file', function() {
    var input = $(this);
    var numFiles = input.get(0).files ? input.get(0).files.length : 1;
    var label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [numFiles, label]);
    handleFileSelect(input);
});

$(document).ready(
    function () {
        $(':file').on('fileselect', function(event, numFiles, label) {
            var input = $(this).parents('.input-group').find(':text');
            if ( input.length ) {
                var log = numFiles > 1 ? numFiles + ' files selected' : label;
                input.each(function(index) {
                    $(this).val(log);
                });
            }
        });
        

        $('#id_photo_photo').change(handleFileSelect);
        $('#id_photo_groupe').on('change', loadCategories);

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

       
        
        $("#id_delete_photo").click(
	    function(){
	        $("#id_delete_photo").attr("disabled", true);
	        $("#id_delete_photo_abandon").attr("disabled", true);
	        $("#id_delete_photo_message").text("");
                $("#id_loader").css("display","block");
                var u = getGetPhotoUrl().concat("X").replace("99X", $('#id_delete_photo_id').text());
                var csrftoken = getCookie('csrftoken');
                $.ajaxSetup({   headers: {  "X-CSRFToken": csrftoken  }  });
                $.ajax({
                    'type': 'delete',
                    'url': u,

                    'success': function(response)
                    {
	                window.location.reload()
                        //			    $("#id_delete_photo_message").text(response);
                        //			    $("#id_loader").css("display","none");
                        //			    $("#id_delete_photo").removeAttr("disabled");
                        //			    $("#id_delete_photo_abandon").removeAttr("disabled");
                    },
                    'error': function(jqXHR, textStatus, errorThrown)
                    {
                        console.log('Error on deleting photo:', jqXHR, textStatus, errorThrown);
	                $("#id_loader").css("display","none");
	                $("#id_delete_photo").removeAttr("disabled");
	                $("#id_delete_photo_abandon").removeAttr("disabled");
                        $("#id_delete_photo_message").text(JSON.parse(jqXHR.responseText).message);
                    }
                });    
            });
        
        
    }); // fin document ready
