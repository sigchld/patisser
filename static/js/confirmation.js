$(document).ready(function () {
    $('.abandon').click(function (event) {
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

    $('#goBack').click(function (event) {
        event.preventDefault();
        var myForm = $("<form id=\"formGoBack\" />").attr("method", "POST").attr("action", "souscription.do");

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
                .attr("name", "ORGANIZATION")
                .val(souscription.organization)
                .appendTo(myForm);
        
        $("<input type='hidden' />")
        .attr("name", "goback")
        .val("true")
        .appendTo(myForm);
        
        $("<input type='hidden' />")
        .attr("name", "offre1")
        .val(souscription.offre1)
        .appendTo(myForm);
        
        $("<input type='hidden' />")
        .attr("name", "offre2")
        .val(souscription.offre2)
        .appendTo(myForm);

        $("#divForm").append(myForm);
        myForm.submit();
        return false;
    });
});

