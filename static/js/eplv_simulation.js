/**
 * zbajaja 
 */

function getSoapRequest() {
            	
            	return  '<?xml version="1.0" encoding="utf-8"?>' +
                '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:jax="http://jaxws.core.subscription.cre.monext/"> ' +
                "<soapenv:Header/>" +
                "<soapenv:Body>" +
            	"<jax:getSimulationInfos>"+
            	"<arg0>"+
            	"<subscriber>"+
            	"<login>" + LOGIN + "</login>" +
                "<password>" + PASSWORD + "</password>" +
                "</subscriber>" +
                "<business>" +
                "<b2b>" + B2B + "</b2b>" +
                "<organization>" + ORGANIZATION + "</organization>" +
                "</business>" +
            	"</arg0>"+
            	"<arg1>"+
            	"<simulationInfosIn>"+
            	"<b2b>"+ B2B +"</b2b>"+
            	"<AMOUNT>"+ AMOUNT +"</AMOUNT>"+
            	"<PRODUCTID>"+ PRODUCTID +"</PRODUCTID>"+
            	"<REFMERCHANT>"+ REFMERCHANT +"</REFMERCHANT>"+
            	"</simulationInfosIn>"+
            	"</arg1>"+
            	"</jax:getSimulationInfos>"+
            	"</soapenv:Body>"+
            	"</soapenv:Envelope>";
            }
            ;
          
  function doSimulate(){
                $.ajax({
                    type: "POST",
                    headers: {
                        'SOAPAction': '',
                        'Content-Type': "text/xml"
                    },
                    url: WS_URL,
                    data: getSoapRequest(),
                    success: function (msg) {

                        console.log(msg);
                        try {
                        	for(i = 0; i < msg.getElementsByTagName("CREDIT_TIMETABLE").length; i++){
                        		console.log(msg.getElementsByTagName("CREDIT_TIMETABLE")[i].getElementsByTagName("CREDIT_TIMETABLE_AMOUNT"));	
                        	}
                        	

                            var AMOUNT_TOTAL = msg.getElementsByTagName("AMOUNT_TOTAL")[0].innerHTML;
                            var AMOUNT_FEE = msg.getElementsByTagName("AMOUNT_FEE")[0].innerHTML;
                            var TEAG = msg.getElementsByTagName("TEAG")[0].innerHTML;
                            var TIA = msg.getElementsByTagName("TIA")[0].innerHTML;
                            var CREDIT_TIMETABLE_AMOUNT = new Array();
                            var CREDIT_TIMETABLE_DATE = new Array();
                            var CREDIT_TIMETABLE = new Array();;
                            for(i = 0; i < msg.getElementsByTagName("CREDIT_TIMETABLE").length; i++){
                            	CREDIT_TIMETABLE_AMOUNT[i] = msg.getElementsByTagName("CREDIT_TIMETABLE_AMOUNT")[i].innerHTML;
                            	CREDIT_TIMETABLE_DATE[i] = msg.getElementsByTagName("CREDIT_TIMETABLE_DATE")[i].innerHTML;
                            	CREDIT_TIMETABLE[i] = CREDIT_TIMETABLE_AMOUNT[i] +" | "+ CREDIT_TIMETABLE_DATE[i]+"<br/>";
                        	}
                            
                             
                            $('#AMOUNT_TOTAL').text(AMOUNT_TOTAL);
                            $('#AMOUNT_FEE').html(AMOUNT_FEE);
                            $('#TEAG').html(TEAG);
                            $('#TIA').html(TIA); 
                            $('#CREDIT_TIMETABLE').html(CREDIT_TIMETABLE); 
                        } catch (error) {
                            $('#RETLABEL').html(error);
                        }
                        return false;
                    },
                    error: function (xhr, status, error) {

                        $('#RETURNCODE').html('&nbsp;');
                        $('#URLCOPIE').html('&nbsp;');
                        $('#RETLABEL').html(xhr + "," + status + "," + error);

                        return false;
                    }
                });	
            }
            ;