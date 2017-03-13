
function reportCBError(err) {

    $('#div-cberror').css({'display': 'block'});
    $(document).scrollTop($("#div-cberror").offset().top);
    $('#cberror').text(err);
}

function isValideCB() {
    var cb_pan = $("#cb_pan").val();
    var cb_cvx = $("#cb_cvx").val();
    var cb_mm = $("#cb_mm").val();
    var cb_aa = $("#cb_aa").val();
    var ok = true;
    var mois = 0;
    var annee = 0;

    mois = parseInt(cb_mm, 10);
    annee = parseInt(cb_aa, 10);
    if (cb_pan === "") {
        ok = false;
    } else if (cb_cvx === "") {
        ok = false;
    } else if (cb_mm.search("^\\d{2}$") !== 0 || mois < 1 || mois > 12) {
        ok = false;
    } else if (cb_aa.search("^\\d{2}$") !== 0 || annee < 16) {
        ok = false;
    }

    return ok;
}

function isValideDatePIdent() {
    var ji_jj = $("#ji_jj").val();
    var ji_mm = $("#ji_mm").val();
    var ji_aaaa = $("#ji_aaaa").val();
    var ok = true;
    var jour = 0;
    var mois = 0;
    var annee = 0;

    jour = parseInt(ji_jj, 10);
    mois = parseInt(ji_mm, 10);
    annee = parseInt(ji_aaaa, 10);

    if (ji_jj.search("^\\d{1,2}$") !== 0 || jour < 1 || jour > 31) {
        ok = false;
    } else if (ji_mm.search("^\\d{1,2}$") !== 0 || mois < 1 || mois > 12) {
        ok = false;
    } else if (ji_aaaa.search("^\\d{4}$") !== 0 || annee < 1900 || annee > 2100) {
        ok = false;
    } else {
        var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (annee % 400 === 0 || (annee % 100 !== 0 && annee % 4 === 0)) {
            monthLength[1] = 29;
        }
        if (jour > monthLength[mois - 1]) {
            ok = false;
        }
    }

    return ok;
}


function isValidePIdent() {
    var ji_type = $("#ji_type").val();
    var ji_numero = $("#ji_numero").val();
    var ji_nationalite = $("#ji_nationalite").val();
    var ok = true;

    if (ji_type === "") {
        ok = false;
    } else if (ji_numero === "") {
        ok = false;
    } else if (ji_nationalite === "") {
        ok = false;
    } else {
        ok = isValideDatePIdent();
    }
    return ok;
}

function isValideLectureMentions() {
    return $('#i_mentions').prop('checked') && $('#i_desuite').prop('checked');
    //return i_mentions.attr('checked') === undefined || i_mentions.attr('checked');
}


function isValideDateNaissance() {
    var in_jj = $("#in_jj").val();
    var in_mm = $("#in_mm").val();
    var in_aaaa = $("#in_aaaa").val();
    var ok = true;
    var jour = 0;
    var mois = 0;
    var annee = 0

    jour = parseInt(in_jj, 10);
    mois = parseInt(in_mm, 10);
    annee = parseInt(in_aaaa, 10);

    if (in_jj.search("^\\d{1,2}$") !== 0 || jour < 1 || jour > 31) {
        ok = false;
    } else if (in_mm.search("^\\d{1,2}$") !== 0 || mois < 1 || mois > 12) {
        ok = false;
    } else if (in_aaaa.search("^\\d{4}$") !== 0 || annee > 2100) { //annee < 1900
        ok = false;
    } else {
        var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (annee % 400 === 0 || (annee % 100 !== 0 && annee % 4 === 0))
        {
            monthLength[1] = 29;
        }
        if (jour > monthLength[mois - 1]) {
            ok = false;
        }
    }

    return ok;
}

function isValideInfosNaissance() {

    var in_nom_jf = $("#in_nom_jf").val();
    var in_departement = $("#in_departement").val();
    var in_ville = $("#in_ville").val();
    var ok = true;

    if (souscription.civilite === "MME" && (in_nom_jf === "" || in_nom_jf === null)) {
        ok = false;
    } else if (in_departement === "" || in_departement === null) {
        ok = false;
    } else if (in_ville === "" || in_ville === null) {
        ok = false;
    } else {
        ok = isValideDateNaissance();
    }
    return ok;
}

function displaySessionTimeout(json) {

    var myForm = $("<form id=\"timeoutForm\" />").attr("method", "POST").attr("action", json[0].redirectUrl);

    $("<input type='hidden' />")
            .attr("name", "REFMERCHANT")
            .val(json[0].REFMERCHANT)
            .appendTo(myForm);

    $("<input type='hidden' />")
            .attr("name", "REFORDER")
            .val(json[0].REFORDER)
            .appendTo(myForm);

    $("<input type='hidden' />")
            .attr("name", "REFID")
            .val(json[0].REFID)
            .appendTo(myForm);

    $("<input type='hidden' />")
            .attr("name", "AMOUNT")
            .val(json[0].AMOUNT)
            .appendTo(myForm);

    $("<input type='hidden' />")
            .attr("name", "RETURNCODE")
            .val(json[0].RETURNCODE)
            .appendTo(myForm);

    $("<input type='hidden' />")
            .attr("name", "SIGN")
            .val(json[0].SIGN)
            .appendTo(myForm);

    /*
     $("<input type='submit' />")
     .attr("name", "goHomeTimeout")
     .val("Cliquez ici si vouns n'êtes pas redirigé vers le site marchand")
     .appendTo(myForm);
     
     
     */

    $('#div-timeout').append(myForm);
    setTimeout(function () {
        $('#timeoutForm').submit();
    }, 10000);

    $('#div-timeout').css({'display': 'block'});
    $(document).scrollTop($("#div-timeout").offset().top);
}

function isValeurNum(idChamp, longueur_min, longueur_max, val_min, val_max) {
    var champ = $('#' + idChamp);
    var valeur = champ.val();


    if (valeur === null ||
            valeur === undefined ||
            valeur.match(/^[0-9]+$/) === null ||
            valeur.length < longueur_min ||
            valeur.length > longueur_max ||
            valeur < val_min ||
            valeur > val_max) {
        return true;
    } else {
        return false;
    }
}

var oldDepartement = null;
function getVilles() {
    var dep = $('#in_departement').val();
    var pays = $('#in_pays').val();
    var path = location.pathname.split('/');
    var page = '/subscription-ihm/villes.do';

    if (dep === undefined || dep === null || dep.length === 0)
        return;
    if (pays === undefined || pays === null || pays.length === 0)
        return;
    if (dep === oldDepartement)
        return;

    if (dep === '99') {
        oldDepartement = dep;
        return;
    }

    path[path.length - 1] = 'villes.do';
    page = path.join("/");

    // on ne garde qu'un / au début 
    page = page.replace(/^\/+/, '/');

    $.ajax({type: "POST",
        url: page,
        data: "dep=" + dep + "&pays=" + encodeURIComponent(pays)
                + "&ORGANIZATION=" + encodeURIComponent(souscription.organization)
                + "&REFMERCHANT=" + encodeURIComponent(souscription.refmerchant)
                + "&REFID=" + encodeURIComponent(souscription.refid)
                + "&SIGN=" + encodeURIComponent(souscription.sign),
        dataType: 'json',
        success: function (json) {
            if ($.isArray(json) && json.length > 0) {
                $('#in_ville')[0].options.length = 0;
                $('#in_ville').append($('<option>').text('Veuillez choisir une ville').attr('value', '#'));
                if (json[0].error === "40") {
                    displaySessionTimeout(json);
                } else {
                    $.each(json, function (idx, ville) {
                        $('#in_ville').append($('<option>').text(ville.nom).attr('value', ville.nom));
                    });
                    oldDepartement = dep;
                }
            }
            $('#in_ville').focus();
            $( "#in_ville" ).change();
        },
        error: function (msg) {
            console.log("error lecture recuperation villes " + msg);
        }
    });
}


$(document).ready(function () {

    $('.abandon').click(function (event) {
    	
    	//TAG : Lien retour
    	if($(this).text()==="Modifier mes infos personnelles"){
	    	dataLayer.push({
	            "event":"Modification_Infos_Persos",
	          });
    	}else{
    		dataLayer.push({
    		      "event":"RetourWebdistrib"
    		  });
    	}
    	
        event.preventDefault();
        var myForm = $("<form id=\"formAbandon\" />").attr("method", "POST").attr("action", souscription.redirecturl);

        $("<input type='hidden' />")
                .attr("name", "REFORDER")
                .val(souscription.reforder)
                .appendTo(myForm);

        $("<input type='hidden' />")
                .attr("name", "REFMERCHANT")
                .val(souscription.refmerchant)
                .appendTo(myForm);

        $("<input type='hidden' />")
                .attr("name", "REFID")
                .val(souscription.refid)
                .appendTo(myForm);

        $("<input type='hidden' />")
                .attr("name", "AMOUNT")
                .val(souscription.amount)
                .appendTo(myForm);

        $("<input type='hidden' />")
                .attr("name", "SIGN")
                .val(souscription.abandon)
                .appendTo(myForm);

        $("<input type='hidden' />")
                .attr("name", "RETURNCODE")
                .val("30")
                .appendTo(myForm);

        $("#divForm").append(myForm);
        myForm.submit();
        return false;
    });

    // fcts encodage/décodage chaines vers/depuis html.
    // pour appel PayLine
    var htmlEnDeCode = (function () {
        var charToEntityRegex,
                entityToCharRegex,
                charToEntity,
                entityToChar;

        function resetCharacterEntities() {
            charToEntity = {};
            entityToChar = {};
            // add the default set
            addCharacterEntities({
                '&amp;': '&',
                '&gt;': '>',
                '&lt;': '<',
                '&quot;': '"',
                '&#39;': "'"
            });
        }

        function addCharacterEntities(newEntities) {
            var charKeys = [],
                    entityKeys = [],
                    key, echar;
            for (key in newEntities) {
                echar = newEntities[key];
                entityToChar[key] = echar;
                charToEntity[echar] = key;
                charKeys.push(echar);
                entityKeys.push(key);
            }
            charToEntityRegex = new RegExp('(' + charKeys.join('|') + ')', 'g');
            entityToCharRegex = new RegExp('(' + entityKeys.join('|') + '|&#[0-9]{1,5};' + ')', 'g');
        }

        function htmlEncode(value) {
            var htmlEncodeReplaceFn = function (match, capture) {
                return charToEntity[capture];
            };

            return (!value) ? value : String(value).replace(charToEntityRegex, htmlEncodeReplaceFn);
        }

        function htmlDecode(value) {
            var htmlDecodeReplaceFn = function (match, capture) {
                return (capture in entityToChar) ? entityToChar[capture] : String.fromCharCode(parseInt(capture.substr(2), 10));
            };

            return (!value) ? value : String(value).replace(entityToCharRegex, htmlDecodeReplaceFn);
        }

        resetCharacterEntities();

        return {
            htmlEncode: htmlEncode,
            htmlDecode: htmlDecode
        };
    })();

    var choixDepartement = $('#in_departement');
    choixDepartement.keypress(function (e)
    {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code === 13 || code === 10) {
            getVilles();
            //e.preventDefault();
        }
    });

    choixDepartement.focusout(function () {
        getVilles();
    });


    $('#in_pays').change(function () {
        var value = $('#in_pays').val();
        if (value === 'FR') {
            $('#in_ville').removeAttr('disabled');
            $('#in_departement').removeAttr('disabled');
            $('#in_departement').val("");
            $('#in_departement').focus();
            $('#in_ville')[0].options.length = 0;
            $('#in_ville').append($('<option>').text('Veuillez choisir une ville').attr('value', '#'));
            oldDepartement = null;
        } else {
            var ville = $('#in_pays').find('option:selected').text();
            $('#in_departement').val('99');
            $('#in_ville')[0].options.length = 0;
            // ville = nom du pays
            $('#in_ville').append($('<option>').text(ville).attr('value', ville));
            $('#in_ville').prop('disabled', true);
            $('#in_ville').parent().children('.text-info').css('display', 'none');
            $('#in_departement').prop('disabled', true);
            $('#ji_nationalite').removeAttr('disabled');
            oldDepartement = null;
        }
    });

    $('#ji_nationalite').change(function () {
        var value = $('#ji_nationalite').val();
        if (value === '#') {
            $('#ji_type')[0].options.length = 0;
            $('#ji_type').append($('<option>').text('Veuillez choisir un document...').attr('value', '#'));
            $('#ji_numero').text("");
        } else if (value === 'FR') {
            $('#ji_type')[0].options.length = 0;
            $('#ji_type').append($('<option>').text('Veuillez choisir un document...').attr('value', '#'));
            $('#ji_numero').text("");
            $('#ji_type').append($('<option>').text("Carte nationale d'identité").attr('value', 'CNI'));
            $('#ji_type').append($('<option>').text("Passeport").attr('value', 'PSP'));
            $('#ji_type').append($('<option>').text("Permis de conduire").attr('value', 'CON'));
        } else if (value === 'UE') {
            $('#ji_type')[0].options.length = 0;
            $('#ji_type').append($('<option>').text('Veuillez choisir un document...').attr('value', '#'));
            $('#ji_type').append($('<option>').text("Carte nationale d'identité").attr('value', 'CNI'));
            $('#ji_type').append($('<option>').text("Passeport").attr('value', 'PSP'));
            $('#ji_numero').text("");
        } else {
            $('#ji_type')[0].options.length = 0;
            $('#ji_type').append($('<option>').text('Veuillez choisir un document...').attr('value', '#'));
            $('#ji_type').append($('<option>').text("Titre de séjour").attr('value', 'SEJ'));
            $('#ji_numero').text("");
        }
    });

    $("#bt-next").click(function () { // à la soumission du formulaire
        try {
            if (!isValideLectureMentions()) {
                return false;
            }
            if (!isValidePIdent()) {
                return false;
            }

            if (!isValideCB()) {
                return false;
            }

            if (!isValideInfosNaissance()) {
                return false;
            }

            // validation PAN, DATE, CVV
            // validation Nationamité, type piece identite, numero de la piece, date délivrée
            jQuery.support.cors = true; // activer les requêtes ajax cross-domain
            $('#div-cberror').css({'display': 'none'});
            $.ajax({
                type: "POST",
                url: souscription.paylineURL,
                data: "data=" + encodeURIComponent(souscription.data) +
                        "&accessKeyRef=" + encodeURIComponent(souscription.accessKeyRef) +
                        "&cardNumber=" + encodeURIComponent($("#cb_pan").val()) +
                        "&cardExpirationDate=" + encodeURIComponent($("#cb_mm").val() + $("#cb_aa").val()) +
                        "&cardCvx=" + encodeURIComponent($("#cb_cvx").val()),
                success: function (msg) {

                    console.log(msg);
                    if (msg.search(/^errorCode=[0-9]+$/i) === 0)
                    {
                        //erreur appel payline
                        var err = msg.split("=");
                        reportCBError(err[1]);
                        return false;
                    }
                    // reponse payline dans data
                    if (msg.search(/^data=.+$/i) === 0)
                    {
                        // suppression donnees CB
                        $("#cb_pan").val("");
                        $("#cb_cvx").val("");
                        $("#cb_mm").val("");
                        $("#cb_aa").val("");

                        var idx = 0;
                        var data = msg.split("=");
                        var champs = [];
                        var myForm = $("<form id=\"form\" />").attr("method", "POST").attr("action", "confirmation.do");

                        $("<input type='hidden' />")
                                .attr("name", "ORGANIZATION")
                                .val(souscription.organization)
                                .appendTo(myForm);
                        
                        $("<input type='hidden' />")
                                .attr("name", "REFMERCHANT")
                                .val(souscription.refmerchant)
                                .appendTo(myForm);                        

                        $("<input type='hidden' />")
                                .attr("name", "REFID")
                                .val(souscription.refid)
                                .appendTo(myForm);

                        $("<input type='hidden' />")
                                .attr("name", "SIGN")
                                .val(souscription.sign)
                                .appendTo(myForm);

                        $("<input type='hidden' />")
                                .attr("name", "data")
                                .val(data[1])
                                .appendTo(myForm);

                        // informations naissance
                        champs = ['in_departement', 'in_ville', 'in_pays', 'in_mm', 'in_aaaa', 'in_jj'];
                        for (idx = 0; idx < champs.length; idx++) {
                            $("<input type='hidden' />")
                                    .attr("name", champs[idx])
                                    .val($("#" + champs[idx]).val())
                                    .appendTo(myForm);
                        }

                        if ($("#in_nom_jf").val() !== "")
                            $("<input type='hidden' />")
                                    .attr("name", "in_nom_jf")
                                    .val($("#in_nom_jf").val())
                                    .appendTo(myForm);

                        // justificatif identité + indicateurs
                        champs = ['ji_nationalite', 'ji_type', 'ji_numero', 'ji_jj', 'ji_mm', 'ji_aaaa'];
                        for (idx = 0; idx < champs.length; idx++) {
                            $("<input type='hidden' />")
                                    .attr("name", champs[idx])
                                    .val($("#" + champs[idx]).val())
                                    .appendTo(myForm);
                        }

                        champs = ['i_desuite', 'i_mentions', 'i_offre1', 'i_offre2'];
                        for (idx = 0; idx < champs.length; idx++) {
                            if ($("#" + champs[idx]).is(':checked')) {
                                $("<input type='hidden' />")
                                        .attr("name", champs[idx])
                                        .val("Y")
                                        .appendTo(myForm);
                            } else {
                                $("<input type='hidden' />")
                                        .attr("name", champs[idx])
                                        .val("N")
                                        .appendTo(myForm);
                            }
                        }

                        $("#divForm").append(myForm);
                        myForm.submit();
                        return true;
                    }
                    // erreur appel Payline
                    reportCBError("9999");
                    return false;
                }
                ,
                error: function (xhr, status, error) {
                    console.log("Erreur lors de l'appel de Payline : " + xhr.responseText
                            + " (" + status + " - " + error + ")");
                    reportCBError("9999");
                    return false;
                }
            });
        } catch (err) {
            console.log(err);
        }

        return false;
    });
});

