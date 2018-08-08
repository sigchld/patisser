function loadCategoriesPopOver(event){
    event.preventDefault();
    loadCategoriesPopOverAtWork();
}

function loadCategoriesPopOverAtWork() {
    $("#id_popover_message").text(" ");

    var csrftoken = getCookie('csrftoken');
    var u = $("#id_popover_categorie_form").data('cat-action');
    var groupe = $("#id_popover_groupe");

    if (groupe.val() == "ALL") {
        $("#id_popover_categorie option[value='ALL']").prop('selected', true);
        return ;
    }
    
    $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
    $.ajax({
        //processData: true,
        //contentType: true,
        'type' : 'post',
        'url' : u,
        'data' : $("#id_popover_categorie_form").serialize(),        
        'success' : function(response)
        {
            $select = $("#id_popover_categorie");
            $select.empty();
            var res = JSON.parse(response).message;
            $select.append('<option value="ALL">toutes</option>');
            for (var idx=0; idx < res.length; idx++) { 
                var element = res[idx];
                $select.append('<option value=' + element.categorie + '>' + element.description + '</option>');
            }
        },
        'error': function(jqXHR, textStatus, errorThrown)
        {
            $("#id_popover_message").text(JSON.stringify(JSON.parse(jqXHR.responseText).message));
        }
    });    
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

function isTouchDevice(){
    return true == ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
}

function prependClass(sel, strClass) {
    var $el = jQuery(sel);

    /* prepend class */
    var classes = $el.attr('class');
    classes = strClass +' ' +classes;
    $el.attr('class', classes);
}

// Check for the various File API support.
var fileApi = false;
if (window.File && window.FileReader && window.FileList && window.Blob) {
    fileApi = true;
}

$(document).ready(function(){
    // lors de l'affichage de la modale
    // le champ id_user_name aura le focus
    $('#id_login_modal').on('shown.bs.modal', function() {
        $('#id_username').focus();
    });

    // gestion choix categorie
    $('#id_sel_categorie').popover({
        html: true,
        placement: 'right',
        content : function() {
            return $('#popover-content').html();
        },
        title: function(){
	    return $(this).data('title')+'<span class="close">&times;</span>';
        }
    }).on('shown.bs.popover', function(event){
	var popover = $(this);
        var groupe = popover.data('groupe');
        //var action = popover.data('myaction');
        //$("#id_popover_categorie_form").attr("action", action);        
        //console.log("action="+action);
        if (groupe && groupe != "ALL") {
            console.log("groupe=" + groupe);
            
            var grp = $("#id_popover_groupe");
            grp.val(groupe);
            loadCategoriesPopOverAtWork();
            //grp.trigger('change');
            $('#id_popover_groupe').attr("disabled", true);
        }
        $('#id_popover_groupe').on('change', loadCategoriesPopOver);
	$(this).parent().find('div.popover .close').on('click', function(e){
	    popover.popover('hide');
            // pour eviter de clicker 2 fois
            // https://stackoverflow.com/questions/11703093/how-to-dismiss-a-twitter-bootstrap-popover-by-clicking-outside/14857326#14857326
            popover.popover('hide').data('bs.popover').inState.click = false
        });
    }).on("show.bs.popover", function(e){  $(this).data("bs.popover").tip().css({"max-width": "400px"}); });
    
    
    //  soumission de l'import de la photo
    $("#id_login_form").submit(
        function(event){
            event.preventDefault();
            // Gestion du login
            $("#id_login_message").text("");
            $("#id_loader").css("display","block");
            var csrftoken = getCookie('csrftoken');

            $.ajaxSetup({headers:{"X-CSRFToken": csrftoken}});
            $.ajax({
                //https://stackoverflow.com/questions/13240664/how-to-set-a-boundary-on-a-multipart-form-data-request-while-using-jquery-ajax-
                //processData: true,
                //contentType:true,
                'type': 'post',
                'url':  getLoginUrl(),
                data: $("#id_login_form").serialize(),          
                'success': function(response)
                { 
                    window.location.reload();
                },
                'error': function(jqXHR, textStatus, errorThrown)
                {
                    console.log('Erreur login :', jqXHR, textStatus, errorThrown);
	            $("#id_loader").css("display","none");
                    $("#id_login_message").text(JSON.parse(jqXHR.responseText).message);
                }                                
            });
            return true;
        });


    // scroll via bouton
    $(window).scroll(function(){
        posScroll = $(document).scrollTop();
        if(posScroll >=300) 
	    $('#scrollUp').fadeIn(600);
        else
	    $('#scrollUp').fadeOut(600);
    });

    // enable tooltip
    if(isTouchDevice()===false) {
        $('[data-toggle="tooltip"]').tooltip();
    }

    // menu actif
    setCurrentMenu();

    // pour que le menu ne cache pas des informations
    $(document.body).css('padding-top', $('#topnavbar').height() + 10);
    $(window).resize(function(){
    $(document.body).css('padding-top', $('#topnavbar').height() + 10);
    }); 

});

// FAT le 25 jui 18
$('.collapse').on('shown.bs.collapse', function(){
    console.log("base.html - show ");
    $(this).parent().find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
}).on('hidden.bs.collapse', function(){
    console.log("base.html - hide ");
    $(this).parent().find(".glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");
});


function myFunction() {
    myVar = setTimeout(showPage, 3000);
}

function showPage() {
    $("#id_loader").css("display", "none");
}

