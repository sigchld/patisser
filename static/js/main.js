function isCarteUtilisable() {
    var cb_mm = $("#cb_mm").val();
    var cb_aa = $("#cb_aa").val();
    var error = false;
    var ok = false;

    var mois = 0;
    var annee = 0;

    mois = parseInt(cb_mm, 10);
    annee = parseInt(cb_aa, 10);

    error = (cb_mm.search("^\\d{1,2}$") !== 0 || mois < 1 || mois > 12);
    error = error || (cb_aa.search("^\\d{2}$"));

    if (!error) {
        annee = annee + 2000;
        error = annee < 2000 || annee > 2100;
    }

    //  ctrl date expiration
    if (!error) {
        var dateDerniereEcheance = new Date(souscription.dateechance);
        var expiration = new Date();

        dateDerniereEcheance.setMinutes(0);
        dateDerniereEcheance.setHours(0);
        dateDerniereEcheance.setMilliseconds(0);
        dateDerniereEcheance.setSeconds(0);

        // si contrat 3 mois on se réserve un mois en plus
        // pour récupérer la dernière échéance 
        if (parseInt(souscription.nbecheances, 10) === 3) {
            dateDerniereEcheance.setFullYear(dateDerniereEcheance.getFullYear(), dateDerniereEcheance.getMonth() + 1, dateDerniereEcheance.getDate());
        }

        // date à partir de laquelle la carte n'est plus utilisable
        // attn mois de 0 à 11
        expiration.setFullYear(annee, mois, 1);
        expiration.setMinutes(0);
        expiration.setHours(0);
        expiration.setMilliseconds(0);
        expiration.setSeconds(0);

        ok = (dateDerniereEcheance < expiration);
    } else {
        ok = false;
    }

    return ok;
}

function isDateDelivranceJustificatifIdentiteValide() {
    var ji_jj = $("#ji_jj").val();
    var ji_mm = $("#ji_mm").val();
    var ji_aaaa = $("#ji_aaaa").val();
    var error = false;
    var ok = false;
    var jour = 0;
    var mois = 0;
    var annee = 0;

    jour = parseInt(ji_jj, 10);
    mois = parseInt(ji_mm, 10);
    annee = parseInt(ji_aaaa, 10);

    error = (ji_jj.search("^\\d{1,2}$") !== 0 || jour < 1 || jour > 31);
    error = error || (ji_mm.search("^\\d{1,2}$") !== 0 || mois < 1 || mois > 12);
    error = error || (ji_aaaa.search("^\\d{4}$") !== 0 || annee < 1900 || annee > 2100);


    // année bissextile vérification jour 
    if (!error) {
        var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (annee % 400 === 0 || (annee % 100 !== 0 && annee % 4 === 0))
        {
            monthLength[1] = 29;
        }
        if (jour > monthLength[mois - 1]) {
            error = true;
        }
    }

    // date <= auhourd'hui
    if (!error) {
        var today = new Date();
        var dateDelivrance = new Date();
        dateDelivrance.setFullYear(annee, mois - 1, jour);
        dateDelivrance.setMinutes(0);
        dateDelivrance.setHours(0);
        dateDelivrance.setMilliseconds(0);
        dateDelivrance.setSeconds(0);

        ok = (dateDelivrance <= today);
    } else {
        ok = false;
    }

    return ok;
}

function getAge() {
	   
    var userday = $("#in_jj").val();
    var usermonth =$("#in_mm").val();
    var useryear = $("#in_aaaa").val();

    var d = new Date();
    var curday = d.getDate();
    var curmonth = d.getMonth()+1;
    var curyear = d.getFullYear();

    var age = curyear - useryear;

    if((curmonth < usermonth) || ( (curmonth == usermonth) && curday < userday   )){

        age--;

    }
    
    return age;
}

function verifnext(currentValid) {

    var error = false;

    if (souscription.civilite === 'MME' && (!$('#in_nom_jf').val() || $('#in_nom_jf').val().length < 2)) {
        error = true;
    }
    if (!$('#in_jj').val() || $('#in_jj').val().length !== 2 || !$('#in_mm').val() || $('#in_mm').val().length !== 2 || !$('#in_aaaa').val() || $('#in_aaaa').val().length !== 4 || getAge()<18 || getAge()>=100 || !isValideDateNaissance()) {
        error = true;
    }
    if ($('#in_pays option:selected').val() === '#' || $('#in_pays option:selected').val() === '' || $('#in_pays option:selected').val() === null) {
        error = true;
    }
    if (!$('#in_departement').val() || $('#in_departement').val().length !== 2) {
        error = true;
    }
    if ($('#in_ville option:selected').val() === '#' || $('#in_ville option:selected').val() === null || $('#in_ville option:selected').val() === '') {
        error = true;
    }
    if ($('#ji_nationalite option:selected').val() === '#' || $('#ji_nationalite option:selected').val() === null || $('#ji_nationalite option:selected').val() === '') {
        error = true;
    }
    if ($('#ji_type option:selected').val() === '#' || $('#ji_type option:selected').val() === null || $('#ji_type option:selected').val() === '') {
        error = true;
    }
    if (!$('#ji_jj').val() || $('#ji_jj').val().length !== 2 || !$('#ji_mm').val() || $('#ji_mm').val().length !== 2 || !$('#ji_aaaa').val() || $('#ji_aaaa').val().length !== 4 || !isDateDelivranceJustificatifIdentiteValide()) {
        error = true;
    }
    if (!$('#cb_pan').val() || $('#cb_pan').val().length !== 16) {
        error = true;
    }
    if (!$('#cb_mm').val() || $('#cb_mm').val().length !== 2 || !$('#cb_aa').val() || $('#cb_aa').val().length !== 2 || $('#cb_mm').val() < 1 || $('#cb_mm').val() > 12 || !isCarteUtilisable()) {
        error = true;
    }
    if (!$('#cb_cvx').val() || $('#cb_cvx').val().length !== 3) {
        error = true;
    }
    if (!$('#i_mentions').is(':checked')) {
        error = true;
    }
    if (!$('#i_desuite').is(':checked')) {
        error = true;
    }

    if (error || currentValid) {
        $('#bt-next').attr('disabled', true);
    } else {
        $('#bt-next').removeAttr('disabled');
    }
}

$(document).ready(function () {
	
	var compatible = true;
	var msie = window.navigator.userAgent;
    if (/Mobi/.test(navigator.userAgent)) {
    	// ouvrir dans une nouvelle anglet si smartphone
    	$('.ouvrirpdf').attr("target", "_blank");
    	    	
    }else if( msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
    	
    	$("#ouvrirpdf").fancybox({
            padding: ['45px', '15px', '15px', '15px'],
            maxWidth: 1280,
            maxHeight: 1024,
            fitToView: false,
            width: '70%',
            height: '70%',
            autoSize: false,
            closeClick: false,
            openEffect: 'none',
            closeEffect: 'none',
            iframe: {
                preload: false
            }
        });   
    
    }else{
    	$("#ouvrirpdf").fancybox({
            padding: ['45px', '15px', '15px', '15px'],
            maxWidth: 1280,
            maxHeight: 1024,
            fitToView: false,
            width: '70%',
            height: '70%',
            autoSize: false,
            closeClick: false,
            openEffect: 'none',
            closeEffect: 'none',
            iframe: {
                preload: true
            }
        });   
    	
    };

    $(".mentions").fancybox({
        padding: ['45px', '15px', '15px', '15px'],
        maxWidth: 800,
        maxHeight: 600,
        fitToView: false,
        width: '70%',
        height: '70%',
        autoSize: false,
        closeClick: false,
        openEffect: 'none',
        closeEffect: 'none'
    });

    $(".wait").fancybox({
        padding: ['45px', '15px', '15px', '15px'],
        maxWidth: 600,
        maxHeight: 350,
        fitToView: false,
        width: '70%',
        height: '70%',
        autoSize: false,
        closeClick: false,
        openEffect: 'none',
        closeEffect: 'none',
        modal: true,
        afterShow: function () {
            $('#fpayer').submit();
        }
    });

    // TAG A l'apparition d'une popin
    $(".ouvrirpdf").click(
        function () {
        	dataLayer.push({
                "event":"Apparition_popin",
                 "Popin_type" : "Conditions generales du contrat"
              });
        }            
     );
    // TAG A l'apparition d'une popin
    $(".mentions").click(
            function () {
            	dataLayer.push({
                    "event":"Apparition_popin",
                     "Popin_type" : "Informatique & Libertés"
                  });
            }            
         );

    

    $(".panel.openable h2").on("click", function () {
        $(this).parent().find(".panel-content").slideToggle();
        if ($(this).parent().hasClass("opened")) {
            $(this).parent().removeClass("opened").addClass("closed");
        } else {
            $(this).parent().removeClass("closed").addClass("opened");
        }
    });

    // champ nom de naissance	
    $('#in_nom_jf').filter_input({regex: '[a-zA-Z]'});

    $(document).on('keyup', '#in_nom_jf', function () {
        if ($(this).val().length > 1) {
            $('#in_jj').removeAttr('disabled');
            $('#in_mm').removeAttr('disabled');
            $('#in_aaaa').removeAttr('disabled');
            $(this).parent().parent().children('.col-md-1').children('.img-no').addClass('hidden');
            $(this).parent().removeClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-ok').removeClass('hidden');
        } else {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
        }
        verifnext(false);
    });
    $(document).on('focusout', '#in_nom_jf', function () {
        if (!$(this).val() || $(this).val().length < 2) {
            $(this).parent().addClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-no').removeClass('hidden');
            $(this).parent().children('.text-info').css('display', 'inline-block');
            verifnext(true); //*
        } else {
            $(this).parent().children('.text-info').css('display', 'none');
            verifnext(false);
        }
    });

    if (souscription.civilite === 'M' || souscription.civilite === 'MLLE') {
        $('#div-nom-naissance').css({'display': 'none'});
        $('#in_nom_jf').attr('disabled', 'disabled');
        $('#in_jj').removeAttr('disabled');
        $('#in_mm').removeAttr('disabled');
        $('#in_aaaa').removeAttr('disabled');
    }
    // champs date de naissance
    $('#in_jj').filter_input({regex: '[0-9]'});
    $('#in_mm').filter_input({regex: '[0-9]'});
    $('#in_aaaa').filter_input({regex: '[0-9]'});

    $(document).on('focus', '#in_jj, #in_mm, #in_aaaa', function () {
        $(this).val('');
    });

    $(document).on('keyup', '#in_jj', function () {
        if ($(this).val().length === 2) {
            $('#in_mm').focus();
        }
    });
    $(document).on('keyup', '#in_mm', function () {
        if ($(this).val().length === 2) {
            $('#in_aaaa').focus();
        }
    });
    $(document).on('keyup', '#in_aaaa', function () {
        if ($(this).val().length === 4 && $('#in_jj').val().length === 2 && $('#in_mm').val().length === 2 && getAge()>=18 && getAge()<100 && isValideDateNaissance()) { 
            $('#in_pays').removeAttr('disabled');
            $(this).parent().parent().children('.col-md-1').children('.img-no').addClass('hidden');
            $(this).parent().parent().children('.col-md-1').children('.img-ok').removeClass('hidden');
            verifnext(false);
        } else {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
            verifnext(true);
        }
    });
    $(document).on('focusout', '#in_jj', function () {
        if (!$(this).val() || $(this).val().length !== 2) {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
            $(this).parent().addClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-no').removeClass('hidden');
            $(this).parent().children('.text-info').css('display', 'inline-block');
            verifnext(true); //*
        } else {
            $(this).parent().removeClass('has-error');
            $(this).parent().children('.text-info').css('display', 'none');
            verifnext(false);
        }
    });
    $(document).on('focusout', '#in_mm', function () {
        if (!$(this).val() || $(this).val().length !== 2) {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
            $(this).parent().addClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-no').removeClass('hidden');
            $(this).parent().children('.text-info').css('display', 'inline-block');
            verifnext(true); //*
        } else {
            $(this).parent().removeClass('has-error');
            $(this).parent().children('.text-info').css('display', 'none');
            verifnext(false);
        }
    });
    $(document).on('focusout', '#in_aaaa', function () {
        if (!$(this).val() || $(this).val().length !== 4 || !isValideDateNaissance()) {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
            $(this).parent().addClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-no').removeClass('hidden');
            $(this).parent().children('.text-info').text("Votre date de naissance est incorrecte (jj/mm/aaaa)");
            $(this).parent().children('.text-info').css('display', 'inline-block');
            verifnext(true); //*
        } else if (getAge()<18) {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
            $(this).parent().addClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-no').removeClass('hidden');
            $(this).parent().children('.text-info').text("Vous devez être majeur(e) pour souscrire à l'offre");
            $(this).parent().children('.text-info').css('display', 'inline-block');
            verifnext(true); //*
        }else if (getAge()>=100) {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
            $(this).parent().addClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-no').removeClass('hidden');
            $(this).parent().children('.text-info').text("Vous devez avoir moins de 100 ans pour souscrire à l'offre");
            $(this).parent().children('.text-info').css('display', 'inline-block');
            verifnext(true);            
         }else {
            $(this).parent().removeClass('has-error');
            $(this).parent().children('.text-info').css('display', 'none');
            verifnext(false);
        }
    });

    // champ pays	
    $(document).on('change', '#in_pays', function () {
        if ($('#in_pays option:selected').val() !== '#') {
            // $('#in_departement').removeAttr('disabled');
            $(this).parent().parent().children('.col-md-1').children('.img-no').addClass('hidden');
            $(this).parent().removeClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-ok').removeClass('hidden');
            verifnext(false); //
        } else {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
            verifnext(true);
        }
    });
    $(document).on('focusout', '#in_pays', function () {
        if ($('#in_pays option:selected').val() === '#') {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
            $(this).parent().addClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-no').removeClass('hidden');
            $(this).parent().children('.text-info').css('display', 'inline-block');
            verifnext(true); //*
        } else {
            $(this).parent().children('.text-info').css('display', 'none');
            verifnext(false);
        }
    });

    // champ departement
    $('#in_departement').filter_input({regex: '[0-9]'});

    $(document).on('keyup', '#in_departement', function () {
        if ($(this).val().length === 2) {
            $('#in_ville').removeAttr('disabled');
            $('#in_ville').focus();
            $(this).parent().parent().children('.col-md-1').children('.img-no').addClass('hidden');
            $(this).parent().removeClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-ok').removeClass('hidden');
            verifnext(false);//
        } else {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
            verifnext(false);
        }
        verifnext();
    });
    $(document).on('focusout', '#in_departement', function () {
        if (!$(this).val() || $(this).val().length !== 2) {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
            $(this).parent().addClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-no').removeClass('hidden');
            $(this).parent().children('.text-info').css('display', 'inline-block');
            verifnext(true); //*
        } else {
            $(this).parent().children('.text-info').css('display', 'none');
            verifnext(false);
        }
    });

    // champ ville
    $(document).on('change', '#in_ville', function () {
        if ($('#in_ville option:selected').val() !== '#') {
            $('#ji_nationalite').removeAttr('disabled');
            $(this).parent().parent().children('.col-md-1').children('.img-no').addClass('hidden');
            $(this).parent().removeClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-ok').removeClass('hidden');
            verifnext(false); //
        } else {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
            verifnext(true);
        }
        verifnext();
    });
    $(document).on('focusout', '#in_ville', function () {
        if ($('#in_ville option:selected').val() === '#') {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
            $(this).parent().addClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-no').removeClass('hidden');
            $(this).parent().children('.text-info').css('display', 'inline-block');
            verifnext(true); //*
        } else {
            $(this).parent().children('.text-info').css('display', 'none');
            verifnext(false);
        }
    });

    // champ nationalite
    $(document).on('change', '#ji_nationalite', function () {
        if ($('#ji_nationalite option:selected').val() !== '#') {
            $('#ji_type').removeAttr('disabled');
            $(this).parent().parent().children('.col-md-1').children('.img-no').addClass('hidden');
            $(this).parent().removeClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-ok').removeClass('hidden');
            verifnext(false); //
        } else {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
            verifnext(true);
        }
        verifnext();
    });
    $(document).on('focusout', '#ji_nationalite', function () {
        if ($('#ji_nationalite option:selected').val() === '#') {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
            $(this).parent().addClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-no').removeClass('hidden');
            $(this).parent().children('.text-info').css('display', 'inline-block');
            verifnext(true); //*
        } else {
            $(this).parent().children('.text-info').css('display', 'none');
            verifnext(false);
        }
    });

    // champ type de piece identite
    $(document).on('change', '#ji_type', function () {
        if ($('#ji_type option:selected').val() !== '#') {
            $('#ji_numero').removeAttr('disabled');
            $(this).parent().parent().children('.col-md-1').children('.img-no').addClass('hidden');
            $(this).parent().removeClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-ok').removeClass('hidden');
        } else {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
        }
        verifnext();
    });
    $(document).on('focusout', '#ji_type', function () {
        if ($('#ji_type option:selected').val() === '#') {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
            $(this).parent().addClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-no').removeClass('hidden');
            $(this).parent().children('.text-info').css('display', 'inline-block');
            verifnext(true); //*
        } else {
            $(this).parent().children('.text-info').css('display', 'none');
            verifnext(false);
        }
    });

    // champ numero de la piece identite
    $('#ji_numero').filter_input({regex: '[0-9a-ZA-Z|a-ZA-Z0-9]'});

    $(document).on('keyup', '#ji_numero', function () {
        if ($(this).val().length > 0) {
            $('#ji_jj').removeAttr('disabled');
            $('#ji_mm').removeAttr('disabled');
            $('#ji_aaaa').removeAttr('disabled');
            $(this).parent().parent().children('.col-md-1').children('.img-no').addClass('hidden');
            $(this).parent().removeClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-ok').removeClass('hidden');
        } else {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
        }
        verifnext();
    });
    $(document).on('focusout', '#ji_numero', function () {
        if (!$(this).val() || $(this).val().length > 30) {
            $(this).parent().addClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-no').removeClass('hidden');
            $(this).parent().children('.text-info').css('display', 'inline-block');
            verifnext(true); //*
        } else {
            $(this).parent().children('.text-info').css('display', 'none');
            verifnext(false);
        }
    });

    // champs date de delivrabilite
    $('#ji_jj').filter_input({regex: '[0-9]'});
    $('#ji_mm').filter_input({regex: '[0-9]'});
    $('#ji_aaaa').filter_input({regex: '[0-9]'});

    $(document).on('focus', '#ji_jj, #ji_mm, #ji_aaaa', function () {
        $(this).val('');
    });

    $(document).on('keyup', '#ji_jj', function () {
        if ($(this).val().length === 2) {
            $('#ji_mm').focus();
        }
    });
    $(document).on('keyup', '#ji_mm', function () {
        if ($(this).val().length === 2) {
            $('#ji_aaaa').focus();
        }
    });
    $(document).on('keyup', '#ji_aaaa', function () {
        if ($(this).val().length === 4) {
            $('#info-paiement').removeClass('disabled');
            $('#cb_pan').removeAttr('disabled');
            $('#i_mentions').removeAttr('disabled');
            $('#i_desuite').removeAttr('disabled');
            $('#mask').addClass('hidden');
            $(this).parent().parent().children('.col-md-1').children('.img-no').addClass('hidden');
            $(this).parent().removeClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-ok').removeClass('hidden');
            verifnext(false);
        } else {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
            verifnext(true);
        }
       
    });
    $(document).on('focusout', '#ji_jj', function () {
        if (!$(this).val() || $(this).val().length !== 2) {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
            $(this).parent().addClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-no').removeClass('hidden');
            $(this).parent().children('.text-info').css('display', 'inline-block');
            verifnext(true); //*
        } else {
            $(this).parent().children('.text-info').css('display', 'none');
            verifnext(false);
        }
    });
    $(document).on('focusout', '#ji_mm', function () {
        if (!$(this).val() || $(this).val().length !== 2) {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
            $(this).parent().addClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-no').removeClass('hidden');
            $(this).parent().children('.text-info').css('display', 'inline-block');
            verifnext(true); //*
        } else {
            $(this).parent().children('.text-info').css('display', 'none');
            verifnext(false);
        }
    });

    $(document).on('focusout', '#ji_aaaa', function () {
        if (!$(this).val() || $(this).val().length !== 4) {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
            $(this).parent().addClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-no').removeClass('hidden');
            $(this).parent().children('.text-info').text("La date de validité de votre pièce d'identité est incorrecte (jj/mm/aaaa)");
            $(this).parent().children('.text-info').css('display', 'inline-block');
            verifnext(true); //*
        } else if (!isDateDelivranceJustificatifIdentiteValide()) {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
            $(this).parent().addClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-no').removeClass('hidden');
            $(this).parent().children('.text-info').text("La date de validité de votre pièce d'identité est incorrecte (jj/mm/aaaa)");
            $(this).parent().children('.text-info').css('display', 'inline-block');
            verifnext(true); //*
        } else {
            $(this).parent().children('.text-info').css('display', 'none');
            verifnext(false);
        }
    });

    // champ numero de carte
    $('#cb_pan').filter_input({regex: '[0-9-]'});

    $(document).on('keyup', '#cb_pan', function (event) {
        /*var x = event.keyCode;
         console.log(x);
         if (x !== 8 && x !== 46) {
         if ( $(this).val().length === 4 || $(this).val().length === 9 || $(this).val().length === 14 ) {
         $(this).val($(this).val()+'-');
         }
         }*/
        if ($(this).val().length === 16) {
            $('#cb_mm').removeAttr('disabled');
            $('#cb_aa').removeAttr('disabled');
            $(this).parent().parent().children('.col-md-1').children('.img-no').addClass('hidden');
            $(this).parent().removeClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-ok').removeClass('hidden');
        } else {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
        }
        verifnext();
    });
    $(document).on('focusout', '#cb_pan', function () {
        if (!$(this).val() || $(this).val().length !== 16) {
            $(this).parent().addClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-no').removeClass('hidden');
            $(this).parent().children('.text-info').css('display', 'inline-block');
            verifnext(true); //*
        } else {
            $(this).parent().children('.text-info').css('display', 'none');
            verifnext(false);
        }
    });

    // champs date d expiration
    $('#cb_mm').filter_input({regex: '[0-9]'});
    $('#cb_aa').filter_input({regex: '[0-9]'});

    $(document).on('focus', '#cb_mm, #cb_aa', function () {
        $(this).val('');
    });

    $(document).on('keyup', '#cb_mm', function () {
        if ($(this).val().length === 2 && $(this).val() > 0 && $(this).val() < 13) {
            $('#cb_aa').focus();
        }
    });
    $(document).on('keyup', '#cb_aa', function () {
        if ($(this).val().length === 2 && $('#cb_mm').val() > 0 && $('#cb_mm').val() < 13 && isCarteUtilisable()) {
            $('#cb_cvx').removeAttr('disabled');
            $(this).parent().parent().children('.col-md-1').children('.img-no').addClass('hidden');
            $(this).parent().removeClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-ok').removeClass('hidden');
            verifnext(false);
        } else {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
            verifnext(true);
        }
       
    });

    $(document).on('focusout', '#cb_mm', function () {
        if ($(this).val().length === 2 && $('#cb_mm').val() > 0 && $('#cb_mm').val() < 13) {
            $(this).parent().children('.text-info').css('display', 'none');
            verifnext(false);
        } else {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
            $(this).parent().addClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-no').removeClass('hidden');
            $(this).parent().children('.text-info').css('display', 'inline-block');
            verifnext(true); //*
        }
    });
    $(document).on('focusout', '#cb_aa', function () {
        if ($(this).val().length === 2 && $('#cb_mm').val() > 0 && $('#cb_mm').val() < 13 && isCarteUtilisable()) {
            $(this).parent().children('.text-info').css('display', 'none');
            verifnext(false);
        } else {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
            $(this).parent().addClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-no').removeClass('hidden');
            $(this).parent().children('.text-info').css('display', 'inline-block');
            verifnext(true); //*
        }
    });

    // champ code
    $('#cb_cvx').filter_input({regex: '[0-9]'});

    $(document).on('keyup', '#cb_cvx', function () {
        if ($(this).val().length === 3) {
            $(this).parent().parent().children('.col-md-1').children('.img-no').addClass('hidden');
            $(this).parent().removeClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-ok').removeClass('hidden');
        } else {
            $(this).parent().parent().children('.col-md-1').children('.img-ok').addClass('hidden');
        }
        verifnext();
    });
    $(document).on('focusout', '#cb_cvx', function () {
        if (!$(this).val() || $(this).val().length < 3) {
            $(this).parent().addClass('has-error');
            $(this).parent().parent().children('.col-md-1').children('.img-no').removeClass('hidden');
            $(this).parent().children('.text-info').css('display', 'inline-block');
            verifnext(true); //*
        } else {
            $(this).parent().children('.text-info').css('display', 'none');
            verifnext(false);
        }
    });
    $(document).on('change', '#i_mentions', function () {
        verifnext();
    });
    $(document).on('change', '#i_desuite', function () {
        verifnext();
    });
    $(document).on('click', '#info_code, #info_box .bt-close', function () {
        $('#info_box').toggleClass('hidden');
    });
    /*
     $(document).on('click','#bt-next',function() {
     $(location).attr('href',"confirmation.do");
     });
     */
});

