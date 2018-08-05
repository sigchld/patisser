function ask_delete_photo(id) {
    $('#id_delete_photo_code').text($('#id_photo_code_'.concat(id)).text());
    $('#id_delete_photo_description').text($('#id_photo_description_'.concat(id)).text());
    $('#id_delete_photo_message').text("");
    $('#id_delete_photo_img').attr('src', $('#id_photo_img_'.concat(id)).attr('src'));
    $('#id_delete_photo_id').text(id);
    $('#delete_photo').modal('show')
};

function ask_edit_photo(id) {
    $('#id_edit_photo_code').val($('#id_photo_code_'.concat(id)).text());
    $('#id_edit_photo_description').val($('#id_photo_description_'.concat(id)).text());
    $('#id_edit_photo_acces').val($('#id_photo_acces_'.concat(id)).text());
    $('#id_edit_photo_message').text("");
    $('#id_edit_photo_img').attr('src', $('#id_photo_img_'.concat(id)).attr('src'));
    $('#id_edit_photo_id').val(id);

    $('#id_edit_groupe').val($('#id_groupe_'.concat(id)).text());
    $('#id_edit_categorie').data("current", $('#id_categorie_'.concat(id)).text());

    $('#id_edit_photo_label').text('');

    loadCategoriesAtWork(false);
    $('#id_edit_photo_modal').modal('show')
};

function ask_import_photo() {
    $('#id_import_photo_form').get(0).reset();
    $('#id_import_photo_img').attr('src', blank_photo);
    var selected = $('#id_import_categorie');
    
    selected.empty();
    selected.append("<option value='NONE'>Choisir..</option>");
    $('#modalAddPhoto').modal('show');
};


function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    var msg_id = '#id_edit_photo_message';
    var img_target_id = '#id_edit_photo_img'
    var creation = false;
    
    if (evt.target.id.match(/import/)) {
        msg_id = '#id_import_photo_message';
        img_target_id = '#id_import_photo_img'
        creation = true;
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
        if (creation) {
            $('#id_import_photo_img').attr('src', blank_photo);
        }
    }
    else if ((f.type != "image/png" && f.type != "image/jpeg")) {
        error = f.name.concat(", n'est pas une image jpeg ou png");
        $( this ).val('');
        if (creation) {
            $('#id_import_photo_img').attr('src', blank_photo);
        }
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



function loadCategories(event) {
    event.preventDefault();
    var create_form = event.target.id.match(/import/) != null ;
    loadCategoriesAtWork(create_form);
}

function loadCategoriesAtWork(create_form) {
    
    var id_msg = '#id_edit_photo_message';
    var id_groupe = "#id_edit_groupe";
    var id_img_target = '#id_edit_photo_img'
    var id_categorie = '#id_edit_categorie';

    if (create_form) { 
        id_msg = '#id_import_photo_message';
        id_img_target = '#id_import_photo_img';
        id_groupe = "#id_import_groupe";
        id_categorie = "#id_import_categorie";
    }

    $(id_msg).text(" ");
    
    var csrftoken = getCookie('csrftoken');
    var u = "/mesrecettes/categories"; //$("#id_popover_categorie_form").data('action');
    var groupe = $(id_groupe);
    
    if (groupe.val() == "NONE" || !groupe.val()) {
        var selected = $(id_categorie);
        selected.empty();
        selected.append("<option value='NONE' selected>Choisir..</option>");
        selected.val("NONE");
        selected.data("current", "NONE");
        return ;
    }
    
    $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
    $.ajax({
        'type' : 'post',
        'url' : u,
        'data' : "groupe=".concat($(id_groupe).val()),
           'success' : function(response)
           {
               $select = $(id_categorie);
               var val = $select.data("current");
               $select.empty();
               var res = JSON.parse(response).message;
               $select.append("<option value='NONE' selected>Choisir..</option>");
               for (var idx=0; idx < res.length; idx++) { 
                   var element = res[idx];
                   if (element.categorie == val) {
                       $select.append('<option selected value=' + element.categorie + '>' + element.description + '</option>');
                   } else {
                       $select.append('<option value=' + element.categorie + '>' + element.description + '</option>');
                   }
               }
               if (val) {
                   $select.val(val);
               }
               
               $select.change();
               //$(id_categorie.concat(" option[value=").concat(val).concat("]")).attr("disabled", false);

           },
           'error': function(jqXHR, textStatus, errorThrown)
           {
               $(id_msg).text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
           }
          });    
}

$(document).ready(
    function () {
        $('#id_edit_photo').change(handleFileSelect);
        $('#id_import_photo').change(handleFileSelect);
        $('#id_import_groupe').on('change', loadCategories);
        $('#id_edit_groupe').on('change', loadCategories);

        
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
