/**
 * implementation de la simulation en mode full_ws
 * @author zbajaja
 */
// variable globale 
var B2B = ""
var PRODUCTID = "";
var AMOUNT = "";
var BUSINESSDATE = "";
var REFMERCHANT= "";
var LOGIN = "login";
var PASSWORD = "password";
var ORGANIZATION = "organization";

// implementation du service dosimulate(...)
function dosimulate(b2b_code,dateb,amount,merchant_ref,product_id, callBack){
	B2B = b2b_code;
    PRODUCTID = product_id;
	AMOUNT = amount;
	BUSINESSDATE = convertDate(dateb);
	REFMERCHANT= merchant_ref;

	var WS_URL =  repo +"/subscription-ws/GetSimulationInfos";	
    console.log("soap call ");
    
    jQuery.support.cors = true;
    // Appel web service en mode asychnrone
    $.ajax({
        type: "POST",
        url: WS_URL,
        data: getSoapRequest(),
        dataType: "xml",
        success: function(data, status, req, xml, xmlHttpRequest, responseXML) {
        	try{ 
	        	var json =  xml2json(req.responseXML.getElementsByTagName("simulationInfosOut")[0]);
	        	var format = JSON.stringify(json, null, 2);
	        	console.log(format); 
	        	return callBack(format) ; 
        	 } catch (error) {
        		 console.log("XML response error : ");
             	 console.log(req.responseXML);
        		 return callBack(req.responseXML) ;
             }
        },
        error: function (xhr, status, error) {
        	console.log("XML response error : ");
        	console.log(xhr.responseXML);
            return callBack(xhr.responseXML) ; 
        }
    });
   
}
;

// Construction envloppe SOAP
function getSoapRequest() {
    	
    	var req =  '<?xml version="1.0" encoding="utf-8"?>' +
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:jax="http://jaxws.core.subscription.cre.monext/"> ' +
        "<soapenv:Header/>" +
        "<soapenv:Body>" +
    	"<jax:getSimulationInfos>"+
    	"<access>"+
    	"<subscriber>"+
    	"<login>" + LOGIN + "</login>" +
        "<password>" + PASSWORD + "</password>" +
        "</subscriber>" +
        "<business>" +
        "<b2b>" + B2B + "</b2b>" +
        "<organization>" + ORGANIZATION + "</organization>" +
        "</business>" +
    	"</access>"+
    	"<SimulationInfos>"+
    	"<simulationInfosIn>"+
    	"<b2b>"+ B2B +"</b2b>"+
    	"<BUSINESSDATE>"+BUSINESSDATE+"</BUSINESSDATE>"+
    	"<AMOUNT>"+ AMOUNT +"</AMOUNT>"+
    	"<PRODUCTID>"+ PRODUCTID +"</PRODUCTID>"+
    	"<REFMERCHANT>"+ REFMERCHANT +"</REFMERCHANT>"+
    	"</simulationInfosIn>"+
    	"</SimulationInfos>"+
    	"</jax:getSimulationInfos>"+
    	"</soapenv:Body>"+
    	"</soapenv:Envelope>";
    	console.log(req);
    	return req;
}
;
   
// Convertion XML to JSON
function xml2json(xml) {
	//try {
		var obj = {};
		if (xml.firstElementChild !== null) {
			for (var i = 0; i < xml.childNodes.length; i++) {
				var item = xml.childNodes[i];
				var nodeName = item.nodeName;

				if (typeof (obj[nodeName]) == "undefined") {
					obj[nodeName] = xml2json(item);
				} else {
					if (typeof (obj[nodeName].push) == "undefined") {
						var old = obj[nodeName];

						obj[nodeName] = [];
						obj[nodeName].push(old);
					}
					obj[nodeName].push(xml2json(item));
				}
			}
		} else {
			obj = xml.textContent;
		}
		return obj;
	//} catch (e) {
	//	console.log(e.message);
	//}
}
;

// Convert date format (in : jj/mm/aaaa, out: yyyy-MM-dd)
function convertDate(p_date){
	var parts = p_date.split('/');
	if(parts == null || parts.length != 3 || parts[0] == "jj"){
		return p_date;
	}
	return parts[2]+"-"+parts[1]+"-"+parts[0]
}
;
