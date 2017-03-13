//
// Definitions for schema: http://jaxws.core.subscription.cre.monext/
//  http://127.0.0.1:8084//subscription-ws/doInit?wsdl=subscriptionService.wsdl#types1
//
//
// Constructor for XML Schema item {http://jaxws.core.subscription.cre.monext/}doInitProcess
//
function jaxws_core_subscription_cre_monext__doInitProcess () {
    this.typeMarker = 'jaxws_core_subscription_cre_monext__doInitProcess';
    this._access = null;
    this._doInitProcess = null;
}

//
// accessor is jaxws_core_subscription_cre_monext__doInitProcess.prototype.getAccess
// element get for access
// - element type is {http://jaxws.core.subscription.cre.monext/}wsAccessBean
// - optional element
//
// element set for access
// setter function is is jaxws_core_subscription_cre_monext__doInitProcess.prototype.setAccess
//
function jaxws_core_subscription_cre_monext__doInitProcess_getAccess() { return this._access;}

jaxws_core_subscription_cre_monext__doInitProcess.prototype.getAccess = jaxws_core_subscription_cre_monext__doInitProcess_getAccess;

function jaxws_core_subscription_cre_monext__doInitProcess_setAccess(value) { this._access = value;}

jaxws_core_subscription_cre_monext__doInitProcess.prototype.setAccess = jaxws_core_subscription_cre_monext__doInitProcess_setAccess;
//
// accessor is jaxws_core_subscription_cre_monext__doInitProcess.prototype.getDoInitProcess
// element get for doInitProcess
// - element type is {http://jaxws.core.subscription.cre.monext/}jaxWsDoInitRequestBean
// - optional element
//
// element set for doInitProcess
// setter function is is jaxws_core_subscription_cre_monext__doInitProcess.prototype.setDoInitProcess
//
function jaxws_core_subscription_cre_monext__doInitProcess_getDoInitProcess() { return this._doInitProcess;}

jaxws_core_subscription_cre_monext__doInitProcess.prototype.getDoInitProcess = jaxws_core_subscription_cre_monext__doInitProcess_getDoInitProcess;

function jaxws_core_subscription_cre_monext__doInitProcess_setDoInitProcess(value) { this._doInitProcess = value;}

jaxws_core_subscription_cre_monext__doInitProcess.prototype.setDoInitProcess = jaxws_core_subscription_cre_monext__doInitProcess_setDoInitProcess;
//
// Serialize {http://jaxws.core.subscription.cre.monext/}doInitProcess
//
function jaxws_core_subscription_cre_monext__doInitProcess_serialize(cxfjsutils, elementName, extraNamespaces) {
    var xml = '';
    if (elementName != null) {
     xml = xml + '<';
     xml = xml + elementName;
     if (extraNamespaces) {
      xml = xml + ' ' + extraNamespaces;
     }
     xml = xml + '>';
    }
    // block for local variables
    {
     if (this._access != null) {
      xml = xml + this._access.serialize(cxfjsutils, 'access', null);
     }
    }
    // block for local variables
    {
     if (this._doInitProcess != null) {
      xml = xml + this._doInitProcess.serialize(cxfjsutils, 'doInitProcess', null);
     }
    }
    if (elementName != null) {
     xml = xml + '</';
     xml = xml + elementName;
     xml = xml + '>';
    }
    return xml;
}

jaxws_core_subscription_cre_monext__doInitProcess.prototype.serialize = jaxws_core_subscription_cre_monext__doInitProcess_serialize;

function jaxws_core_subscription_cre_monext__doInitProcess_deserialize (cxfjsutils, element) {
    var newobject = new jaxws_core_subscription_cre_monext__doInitProcess();
    cxfjsutils.trace('element: ' + cxfjsutils.traceElementName(element));
    var curElement = cxfjsutils.getFirstElementChild(element);
    var item;
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing access');
    if (curElement != null && cxfjsutils.isNodeNamedNS(curElement, '', 'access')) {
     var value = null;
     if (!cxfjsutils.isElementNil(curElement)) {
      item = jaxws_core_subscription_cre_monext__wsAccessBean_deserialize(cxfjsutils, curElement);
     }
     newobject.setAccess(item);
     var item = null;
     if (curElement != null) {
      curElement = cxfjsutils.getNextElementSibling(curElement);
     }
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing doInitProcess');
    if (curElement != null && cxfjsutils.isNodeNamedNS(curElement, '', 'doInitProcess')) {
     var value = null;
     if (!cxfjsutils.isElementNil(curElement)) {
      item = jaxws_core_subscription_cre_monext__jaxWsDoInitRequestBean_deserialize(cxfjsutils, curElement);
     }
     newobject.setDoInitProcess(item);
     var item = null;
     if (curElement != null) {
      curElement = cxfjsutils.getNextElementSibling(curElement);
     }
    }
    return newobject;
}

//
// Constructor for XML Schema item {http://jaxws.core.subscription.cre.monext/}Exception
//
function jaxws_core_subscription_cre_monext__Exception () {
    this.typeMarker = 'jaxws_core_subscription_cre_monext__Exception';
    this._message = null;
}

//
// accessor is jaxws_core_subscription_cre_monext__Exception.prototype.getMessage
// element get for message
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - optional element
//
// element set for message
// setter function is is jaxws_core_subscription_cre_monext__Exception.prototype.setMessage
//
function jaxws_core_subscription_cre_monext__Exception_getMessage() { return this._message;}

jaxws_core_subscription_cre_monext__Exception.prototype.getMessage = jaxws_core_subscription_cre_monext__Exception_getMessage;

function jaxws_core_subscription_cre_monext__Exception_setMessage(value) { this._message = value;}

jaxws_core_subscription_cre_monext__Exception.prototype.setMessage = jaxws_core_subscription_cre_monext__Exception_setMessage;
//
// Serialize {http://jaxws.core.subscription.cre.monext/}Exception
//
function jaxws_core_subscription_cre_monext__Exception_serialize(cxfjsutils, elementName, extraNamespaces) {
    var xml = '';
    if (elementName != null) {
     xml = xml + '<';
     xml = xml + elementName;
     if (extraNamespaces) {
      xml = xml + ' ' + extraNamespaces;
     }
     xml = xml + '>';
    }
    // block for local variables
    {
     if (this._message != null) {
      xml = xml + '<message>';
      xml = xml + cxfjsutils.escapeXmlEntities(this._message);
      xml = xml + '</message>';
     }
    }
    if (elementName != null) {
     xml = xml + '</';
     xml = xml + elementName;
     xml = xml + '>';
    }
    return xml;
}

jaxws_core_subscription_cre_monext__Exception.prototype.serialize = jaxws_core_subscription_cre_monext__Exception_serialize;

function jaxws_core_subscription_cre_monext__Exception_deserialize (cxfjsutils, element) {
    var newobject = new jaxws_core_subscription_cre_monext__Exception();
    cxfjsutils.trace('element: ' + cxfjsutils.traceElementName(element));
    var curElement = cxfjsutils.getFirstElementChild(element);
    var item;
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing message');
    if (curElement != null && cxfjsutils.isNodeNamedNS(curElement, '', 'message')) {
     var value = null;
     if (!cxfjsutils.isElementNil(curElement)) {
      value = cxfjsutils.getNodeText(curElement);
      item = value;
     }
     newobject.setMessage(item);
     var item = null;
     if (curElement != null) {
      curElement = cxfjsutils.getNextElementSibling(curElement);
     }
    }
    return newobject;
}

//
// Constructor for XML Schema item {http://jaxws.core.subscription.cre.monext/}jaxWsGetDetailResponseBean
//
function jaxws_core_subscription_cre_monext__jaxWsGetDetailResponseBean () {
    this.typeMarker = 'jaxws_core_subscription_cre_monext__jaxWsGetDetailResponseBean';
    this._getDetailOut = null;
}

//
// accessor is jaxws_core_subscription_cre_monext__jaxWsGetDetailResponseBean.prototype.getGetDetailOut
// element get for getDetailOut
// - element type is {http://jaxws.core.subscription.cre.monext/}jaxWsGetDetailOut
// - optional element
//
// element set for getDetailOut
// setter function is is jaxws_core_subscription_cre_monext__jaxWsGetDetailResponseBean.prototype.setGetDetailOut
//
function jaxws_core_subscription_cre_monext__jaxWsGetDetailResponseBean_getGetDetailOut() { return this._getDetailOut;}

jaxws_core_subscription_cre_monext__jaxWsGetDetailResponseBean.prototype.getGetDetailOut = jaxws_core_subscription_cre_monext__jaxWsGetDetailResponseBean_getGetDetailOut;

function jaxws_core_subscription_cre_monext__jaxWsGetDetailResponseBean_setGetDetailOut(value) { this._getDetailOut = value;}

jaxws_core_subscription_cre_monext__jaxWsGetDetailResponseBean.prototype.setGetDetailOut = jaxws_core_subscription_cre_monext__jaxWsGetDetailResponseBean_setGetDetailOut;
//
// Serialize {http://jaxws.core.subscription.cre.monext/}jaxWsGetDetailResponseBean
//
function jaxws_core_subscription_cre_monext__jaxWsGetDetailResponseBean_serialize(cxfjsutils, elementName, extraNamespaces) {
    var xml = '';
    if (elementName != null) {
     xml = xml + '<';
     xml = xml + elementName;
     if (extraNamespaces) {
      xml = xml + ' ' + extraNamespaces;
     }
     xml = xml + '>';
    }
    // block for local variables
    {
     if (this._getDetailOut != null) {
      xml = xml + this._getDetailOut.serialize(cxfjsutils, 'getDetailOut', null);
     }
    }
    if (elementName != null) {
     xml = xml + '</';
     xml = xml + elementName;
     xml = xml + '>';
    }
    return xml;
}

jaxws_core_subscription_cre_monext__jaxWsGetDetailResponseBean.prototype.serialize = jaxws_core_subscription_cre_monext__jaxWsGetDetailResponseBean_serialize;

function jaxws_core_subscription_cre_monext__jaxWsGetDetailResponseBean_deserialize (cxfjsutils, element) {
    var newobject = new jaxws_core_subscription_cre_monext__jaxWsGetDetailResponseBean();
    cxfjsutils.trace('element: ' + cxfjsutils.traceElementName(element));
    var curElement = cxfjsutils.getFirstElementChild(element);
    var item;
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing getDetailOut');
    if (curElement != null && cxfjsutils.isNodeNamedNS(curElement, '', 'getDetailOut')) {
     var value = null;
     if (!cxfjsutils.isElementNil(curElement)) {
      item = jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_deserialize(cxfjsutils, curElement);
     }
     newobject.setGetDetailOut(item);
     var item = null;
     if (curElement != null) {
      curElement = cxfjsutils.getNextElementSibling(curElement);
     }
    }
    return newobject;
}

//
// Constructor for XML Schema item {http://jaxws.core.subscription.cre.monext/}jaxWsGetDetailOut
//
function jaxws_core_subscription_cre_monext__jaxWsGetDetailOut () {
    this.typeMarker = 'jaxws_core_subscription_cre_monext__jaxWsGetDetailOut';
    this._REFID = '';
    this._REFMERCHANT = '';
    this._RETURNCODE = 0;
    this._RETURNLABEL = '';
    this._RETURNPID = '';
    this._SIGN = '';
}

//
// accessor is jaxws_core_subscription_cre_monext__jaxWsGetDetailOut.prototype.getREFID
// element get for REFID
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for REFID
// setter function is is jaxws_core_subscription_cre_monext__jaxWsGetDetailOut.prototype.setREFID
//
function jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_getREFID() { return this._REFID;}

jaxws_core_subscription_cre_monext__jaxWsGetDetailOut.prototype.getREFID = jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_getREFID;

function jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_setREFID(value) { this._REFID = value;}

jaxws_core_subscription_cre_monext__jaxWsGetDetailOut.prototype.setREFID = jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_setREFID;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsGetDetailOut.prototype.getREFMERCHANT
// element get for REFMERCHANT
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for REFMERCHANT
// setter function is is jaxws_core_subscription_cre_monext__jaxWsGetDetailOut.prototype.setREFMERCHANT
//
function jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_getREFMERCHANT() { return this._REFMERCHANT;}

jaxws_core_subscription_cre_monext__jaxWsGetDetailOut.prototype.getREFMERCHANT = jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_getREFMERCHANT;

function jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_setREFMERCHANT(value) { this._REFMERCHANT = value;}

jaxws_core_subscription_cre_monext__jaxWsGetDetailOut.prototype.setREFMERCHANT = jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_setREFMERCHANT;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsGetDetailOut.prototype.getRETURNCODE
// element get for RETURNCODE
// - element type is {http://www.w3.org/2001/XMLSchema}int
// - required element
//
// element set for RETURNCODE
// setter function is is jaxws_core_subscription_cre_monext__jaxWsGetDetailOut.prototype.setRETURNCODE
//
function jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_getRETURNCODE() { return this._RETURNCODE;}

jaxws_core_subscription_cre_monext__jaxWsGetDetailOut.prototype.getRETURNCODE = jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_getRETURNCODE;

function jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_setRETURNCODE(value) { this._RETURNCODE = value;}

jaxws_core_subscription_cre_monext__jaxWsGetDetailOut.prototype.setRETURNCODE = jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_setRETURNCODE;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsGetDetailOut.prototype.getRETURNLABEL
// element get for RETURNLABEL
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for RETURNLABEL
// setter function is is jaxws_core_subscription_cre_monext__jaxWsGetDetailOut.prototype.setRETURNLABEL
//
function jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_getRETURNLABEL() { return this._RETURNLABEL;}

jaxws_core_subscription_cre_monext__jaxWsGetDetailOut.prototype.getRETURNLABEL = jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_getRETURNLABEL;

function jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_setRETURNLABEL(value) { this._RETURNLABEL = value;}

jaxws_core_subscription_cre_monext__jaxWsGetDetailOut.prototype.setRETURNLABEL = jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_setRETURNLABEL;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsGetDetailOut.prototype.getRETURNPID
// element get for RETURNPID
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for RETURNPID
// setter function is is jaxws_core_subscription_cre_monext__jaxWsGetDetailOut.prototype.setRETURNPID
//
function jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_getRETURNPID() { return this._RETURNPID;}

jaxws_core_subscription_cre_monext__jaxWsGetDetailOut.prototype.getRETURNPID = jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_getRETURNPID;

function jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_setRETURNPID(value) { this._RETURNPID = value;}

jaxws_core_subscription_cre_monext__jaxWsGetDetailOut.prototype.setRETURNPID = jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_setRETURNPID;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsGetDetailOut.prototype.getSIGN
// element get for SIGN
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for SIGN
// setter function is is jaxws_core_subscription_cre_monext__jaxWsGetDetailOut.prototype.setSIGN
//
function jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_getSIGN() { return this._SIGN;}

jaxws_core_subscription_cre_monext__jaxWsGetDetailOut.prototype.getSIGN = jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_getSIGN;

function jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_setSIGN(value) { this._SIGN = value;}

jaxws_core_subscription_cre_monext__jaxWsGetDetailOut.prototype.setSIGN = jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_setSIGN;
//
// Serialize {http://jaxws.core.subscription.cre.monext/}jaxWsGetDetailOut
//
function jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_serialize(cxfjsutils, elementName, extraNamespaces) {
    var xml = '';
    if (elementName != null) {
     xml = xml + '<';
     xml = xml + elementName;
     if (extraNamespaces) {
      xml = xml + ' ' + extraNamespaces;
     }
     xml = xml + '>';
    }
    // block for local variables
    {
     xml = xml + '<REFID>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._REFID);
     xml = xml + '</REFID>';
    }
    // block for local variables
    {
     xml = xml + '<REFMERCHANT>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._REFMERCHANT);
     xml = xml + '</REFMERCHANT>';
    }
    // block for local variables
    {
     xml = xml + '<RETURNCODE>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._RETURNCODE);
     xml = xml + '</RETURNCODE>';
    }
    // block for local variables
    {
     xml = xml + '<RETURNLABEL>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._RETURNLABEL);
     xml = xml + '</RETURNLABEL>';
    }
    // block for local variables
    {
     xml = xml + '<RETURNPID>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._RETURNPID);
     xml = xml + '</RETURNPID>';
    }
    // block for local variables
    {
     xml = xml + '<SIGN>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._SIGN);
     xml = xml + '</SIGN>';
    }
    if (elementName != null) {
     xml = xml + '</';
     xml = xml + elementName;
     xml = xml + '>';
    }
    return xml;
}

jaxws_core_subscription_cre_monext__jaxWsGetDetailOut.prototype.serialize = jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_serialize;

function jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_deserialize (cxfjsutils, element) {
    var newobject = new jaxws_core_subscription_cre_monext__jaxWsGetDetailOut();
    cxfjsutils.trace('element: ' + cxfjsutils.traceElementName(element));
    var curElement = cxfjsutils.getFirstElementChild(element);
    var item;
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing REFID');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setREFID(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing REFMERCHANT');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setREFMERCHANT(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing RETURNCODE');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = parseInt(value);
    }
    newobject.setRETURNCODE(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing RETURNLABEL');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setRETURNLABEL(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing RETURNPID');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setRETURNPID(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing SIGN');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setSIGN(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    return newobject;
}

//
// Constructor for XML Schema item {http://jaxws.core.subscription.cre.monext/}jaxWsGetDetailRequestBean
//
function jaxws_core_subscription_cre_monext__jaxWsGetDetailRequestBean () {
    this.typeMarker = 'jaxws_core_subscription_cre_monext__jaxWsGetDetailRequestBean';
    this._getDetailIn = null;
}

//
// accessor is jaxws_core_subscription_cre_monext__jaxWsGetDetailRequestBean.prototype.getGetDetailIn
// element get for getDetailIn
// - element type is {http://jaxws.core.subscription.cre.monext/}jaxWsGetDetailIn
// - optional element
//
// element set for getDetailIn
// setter function is is jaxws_core_subscription_cre_monext__jaxWsGetDetailRequestBean.prototype.setGetDetailIn
//
function jaxws_core_subscription_cre_monext__jaxWsGetDetailRequestBean_getGetDetailIn() { return this._getDetailIn;}

jaxws_core_subscription_cre_monext__jaxWsGetDetailRequestBean.prototype.getGetDetailIn = jaxws_core_subscription_cre_monext__jaxWsGetDetailRequestBean_getGetDetailIn;

function jaxws_core_subscription_cre_monext__jaxWsGetDetailRequestBean_setGetDetailIn(value) { this._getDetailIn = value;}

jaxws_core_subscription_cre_monext__jaxWsGetDetailRequestBean.prototype.setGetDetailIn = jaxws_core_subscription_cre_monext__jaxWsGetDetailRequestBean_setGetDetailIn;
//
// Serialize {http://jaxws.core.subscription.cre.monext/}jaxWsGetDetailRequestBean
//
function jaxws_core_subscription_cre_monext__jaxWsGetDetailRequestBean_serialize(cxfjsutils, elementName, extraNamespaces) {
    var xml = '';
    if (elementName != null) {
     xml = xml + '<';
     xml = xml + elementName;
     if (extraNamespaces) {
      xml = xml + ' ' + extraNamespaces;
     }
     xml = xml + '>';
    }
    // block for local variables
    {
     if (this._getDetailIn != null) {
      xml = xml + this._getDetailIn.serialize(cxfjsutils, 'getDetailIn', null);
     }
    }
    if (elementName != null) {
     xml = xml + '</';
     xml = xml + elementName;
     xml = xml + '>';
    }
    return xml;
}

jaxws_core_subscription_cre_monext__jaxWsGetDetailRequestBean.prototype.serialize = jaxws_core_subscription_cre_monext__jaxWsGetDetailRequestBean_serialize;

function jaxws_core_subscription_cre_monext__jaxWsGetDetailRequestBean_deserialize (cxfjsutils, element) {
    var newobject = new jaxws_core_subscription_cre_monext__jaxWsGetDetailRequestBean();
    cxfjsutils.trace('element: ' + cxfjsutils.traceElementName(element));
    var curElement = cxfjsutils.getFirstElementChild(element);
    var item;
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing getDetailIn');
    if (curElement != null && cxfjsutils.isNodeNamedNS(curElement, '', 'getDetailIn')) {
     var value = null;
     if (!cxfjsutils.isElementNil(curElement)) {
      item = jaxws_core_subscription_cre_monext__jaxWsGetDetailIn_deserialize(cxfjsutils, curElement);
     }
     newobject.setGetDetailIn(item);
     var item = null;
     if (curElement != null) {
      curElement = cxfjsutils.getNextElementSibling(curElement);
     }
    }
    return newobject;
}

//
// Constructor for XML Schema item {http://jaxws.core.subscription.cre.monext/}getDetailProcess
//
function jaxws_core_subscription_cre_monext__getDetailProcess () {
    this.typeMarker = 'jaxws_core_subscription_cre_monext__getDetailProcess';
    this._access = null;
    this._getDetailProcess = null;
}

//
// accessor is jaxws_core_subscription_cre_monext__getDetailProcess.prototype.getAccess
// element get for access
// - element type is {http://jaxws.core.subscription.cre.monext/}wsAccessBean
// - optional element
//
// element set for access
// setter function is is jaxws_core_subscription_cre_monext__getDetailProcess.prototype.setAccess
//
function jaxws_core_subscription_cre_monext__getDetailProcess_getAccess() { return this._access;}

jaxws_core_subscription_cre_monext__getDetailProcess.prototype.getAccess = jaxws_core_subscription_cre_monext__getDetailProcess_getAccess;

function jaxws_core_subscription_cre_monext__getDetailProcess_setAccess(value) { this._access = value;}

jaxws_core_subscription_cre_monext__getDetailProcess.prototype.setAccess = jaxws_core_subscription_cre_monext__getDetailProcess_setAccess;
//
// accessor is jaxws_core_subscription_cre_monext__getDetailProcess.prototype.getGetDetailProcess
// element get for getDetailProcess
// - element type is {http://jaxws.core.subscription.cre.monext/}jaxWsGetDetailRequestBean
// - optional element
//
// element set for getDetailProcess
// setter function is is jaxws_core_subscription_cre_monext__getDetailProcess.prototype.setGetDetailProcess
//
function jaxws_core_subscription_cre_monext__getDetailProcess_getGetDetailProcess() { return this._getDetailProcess;}

jaxws_core_subscription_cre_monext__getDetailProcess.prototype.getGetDetailProcess = jaxws_core_subscription_cre_monext__getDetailProcess_getGetDetailProcess;

function jaxws_core_subscription_cre_monext__getDetailProcess_setGetDetailProcess(value) { this._getDetailProcess = value;}

jaxws_core_subscription_cre_monext__getDetailProcess.prototype.setGetDetailProcess = jaxws_core_subscription_cre_monext__getDetailProcess_setGetDetailProcess;
//
// Serialize {http://jaxws.core.subscription.cre.monext/}getDetailProcess
//
function jaxws_core_subscription_cre_monext__getDetailProcess_serialize(cxfjsutils, elementName, extraNamespaces) {
    var xml = '';
    if (elementName != null) {
     xml = xml + '<';
     xml = xml + elementName;
     if (extraNamespaces) {
      xml = xml + ' ' + extraNamespaces;
     }
     xml = xml + '>';
    }
    // block for local variables
    {
     if (this._access != null) {
      xml = xml + this._access.serialize(cxfjsutils, 'access', null);
     }
    }
    // block for local variables
    {
     if (this._getDetailProcess != null) {
      xml = xml + this._getDetailProcess.serialize(cxfjsutils, 'getDetailProcess', null);
     }
    }
    if (elementName != null) {
     xml = xml + '</';
     xml = xml + elementName;
     xml = xml + '>';
    }
    return xml;
}

jaxws_core_subscription_cre_monext__getDetailProcess.prototype.serialize = jaxws_core_subscription_cre_monext__getDetailProcess_serialize;

function jaxws_core_subscription_cre_monext__getDetailProcess_deserialize (cxfjsutils, element) {
    var newobject = new jaxws_core_subscription_cre_monext__getDetailProcess();
    cxfjsutils.trace('element: ' + cxfjsutils.traceElementName(element));
    var curElement = cxfjsutils.getFirstElementChild(element);
    var item;
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing access');
    if (curElement != null && cxfjsutils.isNodeNamedNS(curElement, '', 'access')) {
     var value = null;
     if (!cxfjsutils.isElementNil(curElement)) {
      item = jaxws_core_subscription_cre_monext__wsAccessBean_deserialize(cxfjsutils, curElement);
     }
     newobject.setAccess(item);
     var item = null;
     if (curElement != null) {
      curElement = cxfjsutils.getNextElementSibling(curElement);
     }
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing getDetailProcess');
    if (curElement != null && cxfjsutils.isNodeNamedNS(curElement, '', 'getDetailProcess')) {
     var value = null;
     if (!cxfjsutils.isElementNil(curElement)) {
      item = jaxws_core_subscription_cre_monext__jaxWsGetDetailRequestBean_deserialize(cxfjsutils, curElement);
     }
     newobject.setGetDetailProcess(item);
     var item = null;
     if (curElement != null) {
      curElement = cxfjsutils.getNextElementSibling(curElement);
     }
    }
    return newobject;
}

//
// Constructor for XML Schema item {http://jaxws.core.subscription.cre.monext/}jaxWsDoInitRequestBean
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitRequestBean () {
    this.typeMarker = 'jaxws_core_subscription_cre_monext__jaxWsDoInitRequestBean';
    this._doInitIn = null;
}

//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitRequestBean.prototype.getDoInitIn
// element get for doInitIn
// - element type is {http://jaxws.core.subscription.cre.monext/}jaxWsDoInitIn
// - optional element
//
// element set for doInitIn
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitRequestBean.prototype.setDoInitIn
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitRequestBean_getDoInitIn() { return this._doInitIn;}

jaxws_core_subscription_cre_monext__jaxWsDoInitRequestBean.prototype.getDoInitIn = jaxws_core_subscription_cre_monext__jaxWsDoInitRequestBean_getDoInitIn;

function jaxws_core_subscription_cre_monext__jaxWsDoInitRequestBean_setDoInitIn(value) { this._doInitIn = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitRequestBean.prototype.setDoInitIn = jaxws_core_subscription_cre_monext__jaxWsDoInitRequestBean_setDoInitIn;
//
// Serialize {http://jaxws.core.subscription.cre.monext/}jaxWsDoInitRequestBean
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitRequestBean_serialize(cxfjsutils, elementName, extraNamespaces) {
    var xml = '';
    if (elementName != null) {
     xml = xml + '<';
     xml = xml + elementName;
     if (extraNamespaces) {
      xml = xml + ' ' + extraNamespaces;
     }
     xml = xml + '>';
    }
    // block for local variables
    {
     if (this._doInitIn != null) {
      xml = xml + this._doInitIn.serialize(cxfjsutils, 'doInitIn', null);
     }
    }
    if (elementName != null) {
     xml = xml + '</';
     xml = xml + elementName;
     xml = xml + '>';
    }
    return xml;
}

jaxws_core_subscription_cre_monext__jaxWsDoInitRequestBean.prototype.serialize = jaxws_core_subscription_cre_monext__jaxWsDoInitRequestBean_serialize;

function jaxws_core_subscription_cre_monext__jaxWsDoInitRequestBean_deserialize (cxfjsutils, element) {
    var newobject = new jaxws_core_subscription_cre_monext__jaxWsDoInitRequestBean();
    cxfjsutils.trace('element: ' + cxfjsutils.traceElementName(element));
    var curElement = cxfjsutils.getFirstElementChild(element);
    var item;
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing doInitIn');
    if (curElement != null && cxfjsutils.isNodeNamedNS(curElement, '', 'doInitIn')) {
     var value = null;
     if (!cxfjsutils.isElementNil(curElement)) {
      item = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_deserialize(cxfjsutils, curElement);
     }
     newobject.setDoInitIn(item);
     var item = null;
     if (curElement != null) {
      curElement = cxfjsutils.getNextElementSibling(curElement);
     }
    }
    return newobject;
}

//
// Constructor for XML Schema item {http://jaxws.core.subscription.cre.monext/}doInitProcessResponse
//
function jaxws_core_subscription_cre_monext__doInitProcessResponse () {
    this.typeMarker = 'jaxws_core_subscription_cre_monext__doInitProcessResponse';
    this._return = null;
}

//
// accessor is jaxws_core_subscription_cre_monext__doInitProcessResponse.prototype.getReturn
// element get for return
// - element type is {http://jaxws.core.subscription.cre.monext/}jaxWsDoInitResponseBean
// - optional element
//
// element set for return
// setter function is is jaxws_core_subscription_cre_monext__doInitProcessResponse.prototype.setReturn
//
function jaxws_core_subscription_cre_monext__doInitProcessResponse_getReturn() { return this._return;}

jaxws_core_subscription_cre_monext__doInitProcessResponse.prototype.getReturn = jaxws_core_subscription_cre_monext__doInitProcessResponse_getReturn;

function jaxws_core_subscription_cre_monext__doInitProcessResponse_setReturn(value) { this._return = value;}

jaxws_core_subscription_cre_monext__doInitProcessResponse.prototype.setReturn = jaxws_core_subscription_cre_monext__doInitProcessResponse_setReturn;
//
// Serialize {http://jaxws.core.subscription.cre.monext/}doInitProcessResponse
//
function jaxws_core_subscription_cre_monext__doInitProcessResponse_serialize(cxfjsutils, elementName, extraNamespaces) {
    var xml = '';
    if (elementName != null) {
     xml = xml + '<';
     xml = xml + elementName;
     if (extraNamespaces) {
      xml = xml + ' ' + extraNamespaces;
     }
     xml = xml + '>';
    }
    // block for local variables
    {
     if (this._return != null) {
      xml = xml + this._return.serialize(cxfjsutils, 'return', null);
     }
    }
    if (elementName != null) {
     xml = xml + '</';
     xml = xml + elementName;
     xml = xml + '>';
    }
    return xml;
}

jaxws_core_subscription_cre_monext__doInitProcessResponse.prototype.serialize = jaxws_core_subscription_cre_monext__doInitProcessResponse_serialize;

function jaxws_core_subscription_cre_monext__doInitProcessResponse_deserialize (cxfjsutils, element) {
    var newobject = new jaxws_core_subscription_cre_monext__doInitProcessResponse();
    cxfjsutils.trace('element: ' + cxfjsutils.traceElementName(element));
    var curElement = cxfjsutils.getFirstElementChild(element);
    var item;
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing return');
    if (curElement != null && cxfjsutils.isNodeNamedNS(curElement, '', 'return')) {
     var value = null;
     if (!cxfjsutils.isElementNil(curElement)) {
      item = jaxws_core_subscription_cre_monext__jaxWsDoInitResponseBean_deserialize(cxfjsutils, curElement);
     }
     newobject.setReturn(item);
     var item = null;
     if (curElement != null) {
      curElement = cxfjsutils.getNextElementSibling(curElement);
     }
    }
    return newobject;
}

//
// Constructor for XML Schema item {http://jaxws.core.subscription.cre.monext/}getDetailProcessResponse
//
function jaxws_core_subscription_cre_monext__getDetailProcessResponse () {
    this.typeMarker = 'jaxws_core_subscription_cre_monext__getDetailProcessResponse';
    this._return = null;
}

//
// accessor is jaxws_core_subscription_cre_monext__getDetailProcessResponse.prototype.getReturn
// element get for return
// - element type is {http://jaxws.core.subscription.cre.monext/}jaxWsGetDetailResponseBean
// - optional element
//
// element set for return
// setter function is is jaxws_core_subscription_cre_monext__getDetailProcessResponse.prototype.setReturn
//
function jaxws_core_subscription_cre_monext__getDetailProcessResponse_getReturn() { return this._return;}

jaxws_core_subscription_cre_monext__getDetailProcessResponse.prototype.getReturn = jaxws_core_subscription_cre_monext__getDetailProcessResponse_getReturn;

function jaxws_core_subscription_cre_monext__getDetailProcessResponse_setReturn(value) { this._return = value;}

jaxws_core_subscription_cre_monext__getDetailProcessResponse.prototype.setReturn = jaxws_core_subscription_cre_monext__getDetailProcessResponse_setReturn;
//
// Serialize {http://jaxws.core.subscription.cre.monext/}getDetailProcessResponse
//
function jaxws_core_subscription_cre_monext__getDetailProcessResponse_serialize(cxfjsutils, elementName, extraNamespaces) {
    var xml = '';
    if (elementName != null) {
     xml = xml + '<';
     xml = xml + elementName;
     if (extraNamespaces) {
      xml = xml + ' ' + extraNamespaces;
     }
     xml = xml + '>';
    }
    // block for local variables
    {
     if (this._return != null) {
      xml = xml + this._return.serialize(cxfjsutils, 'return', null);
     }
    }
    if (elementName != null) {
     xml = xml + '</';
     xml = xml + elementName;
     xml = xml + '>';
    }
    return xml;
}

jaxws_core_subscription_cre_monext__getDetailProcessResponse.prototype.serialize = jaxws_core_subscription_cre_monext__getDetailProcessResponse_serialize;

function jaxws_core_subscription_cre_monext__getDetailProcessResponse_deserialize (cxfjsutils, element) {
    var newobject = new jaxws_core_subscription_cre_monext__getDetailProcessResponse();
    cxfjsutils.trace('element: ' + cxfjsutils.traceElementName(element));
    var curElement = cxfjsutils.getFirstElementChild(element);
    var item;
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing return');
    if (curElement != null && cxfjsutils.isNodeNamedNS(curElement, '', 'return')) {
     var value = null;
     if (!cxfjsutils.isElementNil(curElement)) {
      item = jaxws_core_subscription_cre_monext__jaxWsGetDetailResponseBean_deserialize(cxfjsutils, curElement);
     }
     newobject.setReturn(item);
     var item = null;
     if (curElement != null) {
      curElement = cxfjsutils.getNextElementSibling(curElement);
     }
    }
    return newobject;
}

//
// Constructor for XML Schema item {http://jaxws.core.subscription.cre.monext/}requestBean
//
function jaxws_core_subscription_cre_monext__requestBean () {
    this.typeMarker = 'jaxws_core_subscription_cre_monext__requestBean';
    this._b2b = null;
}

//
// accessor is jaxws_core_subscription_cre_monext__requestBean.prototype.getB2b
// element get for b2b
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - optional element
//
// element set for b2b
// setter function is is jaxws_core_subscription_cre_monext__requestBean.prototype.setB2b
//
function jaxws_core_subscription_cre_monext__requestBean_getB2b() { return this._b2b;}

jaxws_core_subscription_cre_monext__requestBean.prototype.getB2b = jaxws_core_subscription_cre_monext__requestBean_getB2b;

function jaxws_core_subscription_cre_monext__requestBean_setB2b(value) { this._b2b = value;}

jaxws_core_subscription_cre_monext__requestBean.prototype.setB2b = jaxws_core_subscription_cre_monext__requestBean_setB2b;
//
// Serialize {http://jaxws.core.subscription.cre.monext/}requestBean
//
function jaxws_core_subscription_cre_monext__requestBean_serialize(cxfjsutils, elementName, extraNamespaces) {
    var xml = '';
    if (elementName != null) {
     xml = xml + '<';
     xml = xml + elementName;
     if (extraNamespaces) {
      xml = xml + ' ' + extraNamespaces;
     }
     xml = xml + '>';
    }
    // block for local variables
    {
     if (this._b2b != null) {
      xml = xml + '<b2b>';
      xml = xml + cxfjsutils.escapeXmlEntities(this._b2b);
      xml = xml + '</b2b>';
     }
    }
    if (elementName != null) {
     xml = xml + '</';
     xml = xml + elementName;
     xml = xml + '>';
    }
    return xml;
}

jaxws_core_subscription_cre_monext__requestBean.prototype.serialize = jaxws_core_subscription_cre_monext__requestBean_serialize;

function jaxws_core_subscription_cre_monext__requestBean_deserialize (cxfjsutils, element) {
    var newobject = new jaxws_core_subscription_cre_monext__requestBean();
    cxfjsutils.trace('element: ' + cxfjsutils.traceElementName(element));
    var curElement = cxfjsutils.getFirstElementChild(element);
    var item;
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing b2b');
    if (curElement != null && cxfjsutils.isNodeNamedNS(curElement, '', 'b2b')) {
     var value = null;
     if (!cxfjsutils.isElementNil(curElement)) {
      value = cxfjsutils.getNodeText(curElement);
      item = value;
     }
     newobject.setB2b(item);
     var item = null;
     if (curElement != null) {
      curElement = cxfjsutils.getNextElementSibling(curElement);
     }
    }
    return newobject;
}

//
// Constructor for XML Schema item {http://jaxws.core.subscription.cre.monext/}jaxWsDoInitOut
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitOut () {
    this.typeMarker = 'jaxws_core_subscription_cre_monext__jaxWsDoInitOut';
    this._AMOUNT = '';
    this._REFID = '';
    this._REFORDER = '';
    this._RETURNCODE = 0;
    this._RETURNLABEL = '';
    this._RETURNPID = '';
    this._SIGN = '';
    this._URLREDIRECTION = '';
}

//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.getAMOUNT
// element get for AMOUNT
// - element type is {http://www.w3.org/2001/XMLSchema}decimal
// - required element
//
// element set for AMOUNT
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.setAMOUNT
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitOut_getAMOUNT() { return this._AMOUNT;}

jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.getAMOUNT = jaxws_core_subscription_cre_monext__jaxWsDoInitOut_getAMOUNT;

function jaxws_core_subscription_cre_monext__jaxWsDoInitOut_setAMOUNT(value) { this._AMOUNT = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.setAMOUNT = jaxws_core_subscription_cre_monext__jaxWsDoInitOut_setAMOUNT;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.getREFID
// element get for REFID
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for REFID
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.setREFID
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitOut_getREFID() { return this._REFID;}

jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.getREFID = jaxws_core_subscription_cre_monext__jaxWsDoInitOut_getREFID;

function jaxws_core_subscription_cre_monext__jaxWsDoInitOut_setREFID(value) { this._REFID = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.setREFID = jaxws_core_subscription_cre_monext__jaxWsDoInitOut_setREFID;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.getREFORDER
// element get for REFORDER
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for REFORDER
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.setREFORDER
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitOut_getREFORDER() { return this._REFORDER;}

jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.getREFORDER = jaxws_core_subscription_cre_monext__jaxWsDoInitOut_getREFORDER;

function jaxws_core_subscription_cre_monext__jaxWsDoInitOut_setREFORDER(value) { this._REFORDER = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.setREFORDER = jaxws_core_subscription_cre_monext__jaxWsDoInitOut_setREFORDER;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.getRETURNCODE
// element get for RETURNCODE
// - element type is {http://www.w3.org/2001/XMLSchema}int
// - required element
//
// element set for RETURNCODE
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.setRETURNCODE
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitOut_getRETURNCODE() { return this._RETURNCODE;}

jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.getRETURNCODE = jaxws_core_subscription_cre_monext__jaxWsDoInitOut_getRETURNCODE;

function jaxws_core_subscription_cre_monext__jaxWsDoInitOut_setRETURNCODE(value) { this._RETURNCODE = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.setRETURNCODE = jaxws_core_subscription_cre_monext__jaxWsDoInitOut_setRETURNCODE;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.getRETURNLABEL
// element get for RETURNLABEL
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for RETURNLABEL
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.setRETURNLABEL
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitOut_getRETURNLABEL() { return this._RETURNLABEL;}

jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.getRETURNLABEL = jaxws_core_subscription_cre_monext__jaxWsDoInitOut_getRETURNLABEL;

function jaxws_core_subscription_cre_monext__jaxWsDoInitOut_setRETURNLABEL(value) { this._RETURNLABEL = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.setRETURNLABEL = jaxws_core_subscription_cre_monext__jaxWsDoInitOut_setRETURNLABEL;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.getRETURNPID
// element get for RETURNPID
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for RETURNPID
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.setRETURNPID
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitOut_getRETURNPID() { return this._RETURNPID;}

jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.getRETURNPID = jaxws_core_subscription_cre_monext__jaxWsDoInitOut_getRETURNPID;

function jaxws_core_subscription_cre_monext__jaxWsDoInitOut_setRETURNPID(value) { this._RETURNPID = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.setRETURNPID = jaxws_core_subscription_cre_monext__jaxWsDoInitOut_setRETURNPID;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.getSIGN
// element get for SIGN
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for SIGN
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.setSIGN
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitOut_getSIGN() { return this._SIGN;}

jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.getSIGN = jaxws_core_subscription_cre_monext__jaxWsDoInitOut_getSIGN;

function jaxws_core_subscription_cre_monext__jaxWsDoInitOut_setSIGN(value) { this._SIGN = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.setSIGN = jaxws_core_subscription_cre_monext__jaxWsDoInitOut_setSIGN;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.getURLREDIRECTION
// element get for URLREDIRECTION
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for URLREDIRECTION
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.setURLREDIRECTION
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitOut_getURLREDIRECTION() { return this._URLREDIRECTION;}

jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.getURLREDIRECTION = jaxws_core_subscription_cre_monext__jaxWsDoInitOut_getURLREDIRECTION;

function jaxws_core_subscription_cre_monext__jaxWsDoInitOut_setURLREDIRECTION(value) { this._URLREDIRECTION = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.setURLREDIRECTION = jaxws_core_subscription_cre_monext__jaxWsDoInitOut_setURLREDIRECTION;
//
// Serialize {http://jaxws.core.subscription.cre.monext/}jaxWsDoInitOut
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitOut_serialize(cxfjsutils, elementName, extraNamespaces) {
    var xml = '';
    if (elementName != null) {
     xml = xml + '<';
     xml = xml + elementName;
     if (extraNamespaces) {
      xml = xml + ' ' + extraNamespaces;
     }
     xml = xml + '>';
    }
    // block for local variables
    {
     xml = xml + '<AMOUNT>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._AMOUNT);
     xml = xml + '</AMOUNT>';
    }
    // block for local variables
    {
     xml = xml + '<REFID>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._REFID);
     xml = xml + '</REFID>';
    }
    // block for local variables
    {
     xml = xml + '<REFORDER>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._REFORDER);
     xml = xml + '</REFORDER>';
    }
    // block for local variables
    {
     xml = xml + '<RETURNCODE>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._RETURNCODE);
     xml = xml + '</RETURNCODE>';
    }
    // block for local variables
    {
     xml = xml + '<RETURNLABEL>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._RETURNLABEL);
     xml = xml + '</RETURNLABEL>';
    }
    // block for local variables
    {
     xml = xml + '<RETURNPID>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._RETURNPID);
     xml = xml + '</RETURNPID>';
    }
    // block for local variables
    {
     xml = xml + '<SIGN>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._SIGN);
     xml = xml + '</SIGN>';
    }
    // block for local variables
    {
     xml = xml + '<URLREDIRECTION>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._URLREDIRECTION);
     xml = xml + '</URLREDIRECTION>';
    }
    if (elementName != null) {
     xml = xml + '</';
     xml = xml + elementName;
     xml = xml + '>';
    }
    return xml;
}

jaxws_core_subscription_cre_monext__jaxWsDoInitOut.prototype.serialize = jaxws_core_subscription_cre_monext__jaxWsDoInitOut_serialize;

function jaxws_core_subscription_cre_monext__jaxWsDoInitOut_deserialize (cxfjsutils, element) {
    var newobject = new jaxws_core_subscription_cre_monext__jaxWsDoInitOut();
    cxfjsutils.trace('element: ' + cxfjsutils.traceElementName(element));
    var curElement = cxfjsutils.getFirstElementChild(element);
    var item;
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing AMOUNT');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setAMOUNT(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing REFID');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setREFID(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing REFORDER');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setREFORDER(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing RETURNCODE');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = parseInt(value);
    }
    newobject.setRETURNCODE(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing RETURNLABEL');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setRETURNLABEL(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing RETURNPID');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setRETURNPID(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing SIGN');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setSIGN(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing URLREDIRECTION');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setURLREDIRECTION(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    return newobject;
}

//
// Constructor for XML Schema item {http://jaxws.core.subscription.cre.monext/}wsAccessBean
//
function jaxws_core_subscription_cre_monext__wsAccessBean () {
    this.typeMarker = 'jaxws_core_subscription_cre_monext__wsAccessBean';
    this._subscriber = null;
    this._business = null;
}

//
// accessor is jaxws_core_subscription_cre_monext__wsAccessBean.prototype.getSubscriber
// element get for subscriber
// - element type is {http://jaxws.core.subscription.cre.monext/}wsSubscriberBean
// - optional element
//
// element set for subscriber
// setter function is is jaxws_core_subscription_cre_monext__wsAccessBean.prototype.setSubscriber
//
function jaxws_core_subscription_cre_monext__wsAccessBean_getSubscriber() { return this._subscriber;}

jaxws_core_subscription_cre_monext__wsAccessBean.prototype.getSubscriber = jaxws_core_subscription_cre_monext__wsAccessBean_getSubscriber;

function jaxws_core_subscription_cre_monext__wsAccessBean_setSubscriber(value) { this._subscriber = value;}

jaxws_core_subscription_cre_monext__wsAccessBean.prototype.setSubscriber = jaxws_core_subscription_cre_monext__wsAccessBean_setSubscriber;
//
// accessor is jaxws_core_subscription_cre_monext__wsAccessBean.prototype.getBusiness
// element get for business
// - element type is {http://jaxws.core.subscription.cre.monext/}wsBusinessBean
// - optional element
//
// element set for business
// setter function is is jaxws_core_subscription_cre_monext__wsAccessBean.prototype.setBusiness
//
function jaxws_core_subscription_cre_monext__wsAccessBean_getBusiness() { return this._business;}

jaxws_core_subscription_cre_monext__wsAccessBean.prototype.getBusiness = jaxws_core_subscription_cre_monext__wsAccessBean_getBusiness;

function jaxws_core_subscription_cre_monext__wsAccessBean_setBusiness(value) { this._business = value;}

jaxws_core_subscription_cre_monext__wsAccessBean.prototype.setBusiness = jaxws_core_subscription_cre_monext__wsAccessBean_setBusiness;
//
// Serialize {http://jaxws.core.subscription.cre.monext/}wsAccessBean
//
function jaxws_core_subscription_cre_monext__wsAccessBean_serialize(cxfjsutils, elementName, extraNamespaces) {
    var xml = '';
    if (elementName != null) {
     xml = xml + '<';
     xml = xml + elementName;
     if (extraNamespaces) {
      xml = xml + ' ' + extraNamespaces;
     }
     xml = xml + '>';
    }
    // block for local variables
    {
     if (this._subscriber != null) {
      xml = xml + this._subscriber.serialize(cxfjsutils, 'subscriber', null);
     }
    }
    // block for local variables
    {
     if (this._business != null) {
      xml = xml + this._business.serialize(cxfjsutils, 'business', null);
     }
    }
    if (elementName != null) {
     xml = xml + '</';
     xml = xml + elementName;
     xml = xml + '>';
    }
    return xml;
}

jaxws_core_subscription_cre_monext__wsAccessBean.prototype.serialize = jaxws_core_subscription_cre_monext__wsAccessBean_serialize;

function jaxws_core_subscription_cre_monext__wsAccessBean_deserialize (cxfjsutils, element) {
    var newobject = new jaxws_core_subscription_cre_monext__wsAccessBean();
    cxfjsutils.trace('element: ' + cxfjsutils.traceElementName(element));
    var curElement = cxfjsutils.getFirstElementChild(element);
    var item;
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing subscriber');
    if (curElement != null && cxfjsutils.isNodeNamedNS(curElement, '', 'subscriber')) {
     var value = null;
     if (!cxfjsutils.isElementNil(curElement)) {
      item = jaxws_core_subscription_cre_monext__wsSubscriberBean_deserialize(cxfjsutils, curElement);
     }
     newobject.setSubscriber(item);
     var item = null;
     if (curElement != null) {
      curElement = cxfjsutils.getNextElementSibling(curElement);
     }
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing business');
    if (curElement != null && cxfjsutils.isNodeNamedNS(curElement, '', 'business')) {
     var value = null;
     if (!cxfjsutils.isElementNil(curElement)) {
      item = jaxws_core_subscription_cre_monext__wsBusinessBean_deserialize(cxfjsutils, curElement);
     }
     newobject.setBusiness(item);
     var item = null;
     if (curElement != null) {
      curElement = cxfjsutils.getNextElementSibling(curElement);
     }
    }
    return newobject;
}

//
// Constructor for XML Schema item {http://jaxws.core.subscription.cre.monext/}wsBusinessBean
//
function jaxws_core_subscription_cre_monext__wsBusinessBean () {
    this.typeMarker = 'jaxws_core_subscription_cre_monext__wsBusinessBean';
    this._b2b = null;
    this._organization = null;
}

//
// accessor is jaxws_core_subscription_cre_monext__wsBusinessBean.prototype.getB2b
// element get for b2b
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - optional element
//
// element set for b2b
// setter function is is jaxws_core_subscription_cre_monext__wsBusinessBean.prototype.setB2b
//
function jaxws_core_subscription_cre_monext__wsBusinessBean_getB2b() { return this._b2b;}

jaxws_core_subscription_cre_monext__wsBusinessBean.prototype.getB2b = jaxws_core_subscription_cre_monext__wsBusinessBean_getB2b;

function jaxws_core_subscription_cre_monext__wsBusinessBean_setB2b(value) { this._b2b = value;}

jaxws_core_subscription_cre_monext__wsBusinessBean.prototype.setB2b = jaxws_core_subscription_cre_monext__wsBusinessBean_setB2b;
//
// accessor is jaxws_core_subscription_cre_monext__wsBusinessBean.prototype.getOrganization
// element get for organization
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - optional element
//
// element set for organization
// setter function is is jaxws_core_subscription_cre_monext__wsBusinessBean.prototype.setOrganization
//
function jaxws_core_subscription_cre_monext__wsBusinessBean_getOrganization() { return this._organization;}

jaxws_core_subscription_cre_monext__wsBusinessBean.prototype.getOrganization = jaxws_core_subscription_cre_monext__wsBusinessBean_getOrganization;

function jaxws_core_subscription_cre_monext__wsBusinessBean_setOrganization(value) { this._organization = value;}

jaxws_core_subscription_cre_monext__wsBusinessBean.prototype.setOrganization = jaxws_core_subscription_cre_monext__wsBusinessBean_setOrganization;
//
// Serialize {http://jaxws.core.subscription.cre.monext/}wsBusinessBean
//
function jaxws_core_subscription_cre_monext__wsBusinessBean_serialize(cxfjsutils, elementName, extraNamespaces) {
    var xml = '';
    if (elementName != null) {
     xml = xml + '<';
     xml = xml + elementName;
     if (extraNamespaces) {
      xml = xml + ' ' + extraNamespaces;
     }
     xml = xml + '>';
    }
    // block for local variables
    {
     if (this._b2b != null) {
      xml = xml + '<b2b>';
      xml = xml + cxfjsutils.escapeXmlEntities(this._b2b);
      xml = xml + '</b2b>';
     }
    }
    // block for local variables
    {
     if (this._organization != null) {
      xml = xml + '<organization>';
      xml = xml + cxfjsutils.escapeXmlEntities(this._organization);
      xml = xml + '</organization>';
     }
    }
    if (elementName != null) {
     xml = xml + '</';
     xml = xml + elementName;
     xml = xml + '>';
    }
    return xml;
}

jaxws_core_subscription_cre_monext__wsBusinessBean.prototype.serialize = jaxws_core_subscription_cre_monext__wsBusinessBean_serialize;

function jaxws_core_subscription_cre_monext__wsBusinessBean_deserialize (cxfjsutils, element) {
    var newobject = new jaxws_core_subscription_cre_monext__wsBusinessBean();
    cxfjsutils.trace('element: ' + cxfjsutils.traceElementName(element));
    var curElement = cxfjsutils.getFirstElementChild(element);
    var item;
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing b2b');
    if (curElement != null && cxfjsutils.isNodeNamedNS(curElement, '', 'b2b')) {
     var value = null;
     if (!cxfjsutils.isElementNil(curElement)) {
      value = cxfjsutils.getNodeText(curElement);
      item = value;
     }
     newobject.setB2b(item);
     var item = null;
     if (curElement != null) {
      curElement = cxfjsutils.getNextElementSibling(curElement);
     }
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing organization');
    if (curElement != null && cxfjsutils.isNodeNamedNS(curElement, '', 'organization')) {
     var value = null;
     if (!cxfjsutils.isElementNil(curElement)) {
      value = cxfjsutils.getNodeText(curElement);
      item = value;
     }
     newobject.setOrganization(item);
     var item = null;
     if (curElement != null) {
      curElement = cxfjsutils.getNextElementSibling(curElement);
     }
    }
    return newobject;
}

//
// Constructor for XML Schema item {http://jaxws.core.subscription.cre.monext/}jaxWsDoInitResponseBean
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitResponseBean () {
    this.typeMarker = 'jaxws_core_subscription_cre_monext__jaxWsDoInitResponseBean';
    this._doInitOut = null;
}

//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitResponseBean.prototype.getDoInitOut
// element get for doInitOut
// - element type is {http://jaxws.core.subscription.cre.monext/}jaxWsDoInitOut
// - optional element
//
// element set for doInitOut
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitResponseBean.prototype.setDoInitOut
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitResponseBean_getDoInitOut() { return this._doInitOut;}

jaxws_core_subscription_cre_monext__jaxWsDoInitResponseBean.prototype.getDoInitOut = jaxws_core_subscription_cre_monext__jaxWsDoInitResponseBean_getDoInitOut;

function jaxws_core_subscription_cre_monext__jaxWsDoInitResponseBean_setDoInitOut(value) { this._doInitOut = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitResponseBean.prototype.setDoInitOut = jaxws_core_subscription_cre_monext__jaxWsDoInitResponseBean_setDoInitOut;
//
// Serialize {http://jaxws.core.subscription.cre.monext/}jaxWsDoInitResponseBean
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitResponseBean_serialize(cxfjsutils, elementName, extraNamespaces) {
    var xml = '';
    if (elementName != null) {
     xml = xml + '<';
     xml = xml + elementName;
     if (extraNamespaces) {
      xml = xml + ' ' + extraNamespaces;
     }
     xml = xml + '>';
    }
    // block for local variables
    {
     if (this._doInitOut != null) {
      xml = xml + this._doInitOut.serialize(cxfjsutils, 'doInitOut', null);
     }
    }
    if (elementName != null) {
     xml = xml + '</';
     xml = xml + elementName;
     xml = xml + '>';
    }
    return xml;
}

jaxws_core_subscription_cre_monext__jaxWsDoInitResponseBean.prototype.serialize = jaxws_core_subscription_cre_monext__jaxWsDoInitResponseBean_serialize;

function jaxws_core_subscription_cre_monext__jaxWsDoInitResponseBean_deserialize (cxfjsutils, element) {
    var newobject = new jaxws_core_subscription_cre_monext__jaxWsDoInitResponseBean();
    cxfjsutils.trace('element: ' + cxfjsutils.traceElementName(element));
    var curElement = cxfjsutils.getFirstElementChild(element);
    var item;
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing doInitOut');
    if (curElement != null && cxfjsutils.isNodeNamedNS(curElement, '', 'doInitOut')) {
     var value = null;
     if (!cxfjsutils.isElementNil(curElement)) {
      item = jaxws_core_subscription_cre_monext__jaxWsDoInitOut_deserialize(cxfjsutils, curElement);
     }
     newobject.setDoInitOut(item);
     var item = null;
     if (curElement != null) {
      curElement = cxfjsutils.getNextElementSibling(curElement);
     }
    }
    return newobject;
}

//
// Constructor for XML Schema item {http://jaxws.core.subscription.cre.monext/}jaxWsGetDetailIn
//
function jaxws_core_subscription_cre_monext__jaxWsGetDetailIn () {
    this.typeMarker = 'jaxws_core_subscription_cre_monext__jaxWsGetDetailIn';
    this._b2b = null;
    this._REFID = '';
    this._REFMERCHANT = '';
    this._SIGN = '';
}

//
// accessor is jaxws_core_subscription_cre_monext__jaxWsGetDetailIn.prototype.getB2b
// element get for b2b
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - optional element
//
// element set for b2b
// setter function is is jaxws_core_subscription_cre_monext__jaxWsGetDetailIn.prototype.setB2b
//
function jaxws_core_subscription_cre_monext__jaxWsGetDetailIn_getB2b() { return this._b2b;}

jaxws_core_subscription_cre_monext__jaxWsGetDetailIn.prototype.getB2b = jaxws_core_subscription_cre_monext__jaxWsGetDetailIn_getB2b;

function jaxws_core_subscription_cre_monext__jaxWsGetDetailIn_setB2b(value) { this._b2b = value;}

jaxws_core_subscription_cre_monext__jaxWsGetDetailIn.prototype.setB2b = jaxws_core_subscription_cre_monext__jaxWsGetDetailIn_setB2b;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsGetDetailIn.prototype.getREFID
// element get for REFID
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for REFID
// setter function is is jaxws_core_subscription_cre_monext__jaxWsGetDetailIn.prototype.setREFID
//
function jaxws_core_subscription_cre_monext__jaxWsGetDetailIn_getREFID() { return this._REFID;}

jaxws_core_subscription_cre_monext__jaxWsGetDetailIn.prototype.getREFID = jaxws_core_subscription_cre_monext__jaxWsGetDetailIn_getREFID;

function jaxws_core_subscription_cre_monext__jaxWsGetDetailIn_setREFID(value) { this._REFID = value;}

jaxws_core_subscription_cre_monext__jaxWsGetDetailIn.prototype.setREFID = jaxws_core_subscription_cre_monext__jaxWsGetDetailIn_setREFID;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsGetDetailIn.prototype.getREFMERCHANT
// element get for REFMERCHANT
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for REFMERCHANT
// setter function is is jaxws_core_subscription_cre_monext__jaxWsGetDetailIn.prototype.setREFMERCHANT
//
function jaxws_core_subscription_cre_monext__jaxWsGetDetailIn_getREFMERCHANT() { return this._REFMERCHANT;}

jaxws_core_subscription_cre_monext__jaxWsGetDetailIn.prototype.getREFMERCHANT = jaxws_core_subscription_cre_monext__jaxWsGetDetailIn_getREFMERCHANT;

function jaxws_core_subscription_cre_monext__jaxWsGetDetailIn_setREFMERCHANT(value) { this._REFMERCHANT = value;}

jaxws_core_subscription_cre_monext__jaxWsGetDetailIn.prototype.setREFMERCHANT = jaxws_core_subscription_cre_monext__jaxWsGetDetailIn_setREFMERCHANT;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsGetDetailIn.prototype.getSIGN
// element get for SIGN
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for SIGN
// setter function is is jaxws_core_subscription_cre_monext__jaxWsGetDetailIn.prototype.setSIGN
//
function jaxws_core_subscription_cre_monext__jaxWsGetDetailIn_getSIGN() { return this._SIGN;}

jaxws_core_subscription_cre_monext__jaxWsGetDetailIn.prototype.getSIGN = jaxws_core_subscription_cre_monext__jaxWsGetDetailIn_getSIGN;

function jaxws_core_subscription_cre_monext__jaxWsGetDetailIn_setSIGN(value) { this._SIGN = value;}

jaxws_core_subscription_cre_monext__jaxWsGetDetailIn.prototype.setSIGN = jaxws_core_subscription_cre_monext__jaxWsGetDetailIn_setSIGN;
//
// Serialize {http://jaxws.core.subscription.cre.monext/}jaxWsGetDetailIn
//
function jaxws_core_subscription_cre_monext__jaxWsGetDetailIn_serialize(cxfjsutils, elementName, extraNamespaces) {
    var xml = '';
    if (elementName != null) {
     xml = xml + '<';
     xml = xml + elementName;
     if (extraNamespaces) {
      xml = xml + ' ' + extraNamespaces;
     }
     xml = xml + '>';
    }
    // block for local variables
    {
     if (this._b2b != null) {
      xml = xml + '<b2b>';
      xml = xml + cxfjsutils.escapeXmlEntities(this._b2b);
      xml = xml + '</b2b>';
     }
    }
    // block for local variables
    {
     xml = xml + '<REFID>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._REFID);
     xml = xml + '</REFID>';
    }
    // block for local variables
    {
     xml = xml + '<REFMERCHANT>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._REFMERCHANT);
     xml = xml + '</REFMERCHANT>';
    }
    // block for local variables
    {
     xml = xml + '<SIGN>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._SIGN);
     xml = xml + '</SIGN>';
    }
    if (elementName != null) {
     xml = xml + '</';
     xml = xml + elementName;
     xml = xml + '>';
    }
    return xml;
}

jaxws_core_subscription_cre_monext__jaxWsGetDetailIn.prototype.serialize = jaxws_core_subscription_cre_monext__jaxWsGetDetailIn_serialize;

function jaxws_core_subscription_cre_monext__jaxWsGetDetailIn_deserialize (cxfjsutils, element) {
    var newobject = new jaxws_core_subscription_cre_monext__jaxWsGetDetailIn();
    cxfjsutils.trace('element: ' + cxfjsutils.traceElementName(element));
    var curElement = cxfjsutils.getFirstElementChild(element);
    var item;
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing b2b');
    if (curElement != null && cxfjsutils.isNodeNamedNS(curElement, '', 'b2b')) {
     var value = null;
     if (!cxfjsutils.isElementNil(curElement)) {
      value = cxfjsutils.getNodeText(curElement);
      item = value;
     }
     newobject.setB2b(item);
     var item = null;
     if (curElement != null) {
      curElement = cxfjsutils.getNextElementSibling(curElement);
     }
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing REFID');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setREFID(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing REFMERCHANT');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setREFMERCHANT(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing SIGN');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setSIGN(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    return newobject;
}

//
// Constructor for XML Schema item {http://jaxws.core.subscription.cre.monext/}wsSubscriberBean
//
function jaxws_core_subscription_cre_monext__wsSubscriberBean () {
    this.typeMarker = 'jaxws_core_subscription_cre_monext__wsSubscriberBean';
    this._login = null;
    this._password = null;
}

//
// accessor is jaxws_core_subscription_cre_monext__wsSubscriberBean.prototype.getLogin
// element get for login
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - optional element
//
// element set for login
// setter function is is jaxws_core_subscription_cre_monext__wsSubscriberBean.prototype.setLogin
//
function jaxws_core_subscription_cre_monext__wsSubscriberBean_getLogin() { return this._login;}

jaxws_core_subscription_cre_monext__wsSubscriberBean.prototype.getLogin = jaxws_core_subscription_cre_monext__wsSubscriberBean_getLogin;

function jaxws_core_subscription_cre_monext__wsSubscriberBean_setLogin(value) { this._login = value;}

jaxws_core_subscription_cre_monext__wsSubscriberBean.prototype.setLogin = jaxws_core_subscription_cre_monext__wsSubscriberBean_setLogin;
//
// accessor is jaxws_core_subscription_cre_monext__wsSubscriberBean.prototype.getPassword
// element get for password
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - optional element
//
// element set for password
// setter function is is jaxws_core_subscription_cre_monext__wsSubscriberBean.prototype.setPassword
//
function jaxws_core_subscription_cre_monext__wsSubscriberBean_getPassword() { return this._password;}

jaxws_core_subscription_cre_monext__wsSubscriberBean.prototype.getPassword = jaxws_core_subscription_cre_monext__wsSubscriberBean_getPassword;

function jaxws_core_subscription_cre_monext__wsSubscriberBean_setPassword(value) { this._password = value;}

jaxws_core_subscription_cre_monext__wsSubscriberBean.prototype.setPassword = jaxws_core_subscription_cre_monext__wsSubscriberBean_setPassword;
//
// Serialize {http://jaxws.core.subscription.cre.monext/}wsSubscriberBean
//
function jaxws_core_subscription_cre_monext__wsSubscriberBean_serialize(cxfjsutils, elementName, extraNamespaces) {
    var xml = '';
    if (elementName != null) {
     xml = xml + '<';
     xml = xml + elementName;
     if (extraNamespaces) {
      xml = xml + ' ' + extraNamespaces;
     }
     xml = xml + '>';
    }
    // block for local variables
    {
     if (this._login != null) {
      xml = xml + '<login>';
      xml = xml + cxfjsutils.escapeXmlEntities(this._login);
      xml = xml + '</login>';
     }
    }
    // block for local variables
    {
     if (this._password != null) {
      xml = xml + '<password>';
      xml = xml + cxfjsutils.escapeXmlEntities(this._password);
      xml = xml + '</password>';
     }
    }
    if (elementName != null) {
     xml = xml + '</';
     xml = xml + elementName;
     xml = xml + '>';
    }
    return xml;
}

jaxws_core_subscription_cre_monext__wsSubscriberBean.prototype.serialize = jaxws_core_subscription_cre_monext__wsSubscriberBean_serialize;

function jaxws_core_subscription_cre_monext__wsSubscriberBean_deserialize (cxfjsutils, element) {
    var newobject = new jaxws_core_subscription_cre_monext__wsSubscriberBean();
    cxfjsutils.trace('element: ' + cxfjsutils.traceElementName(element));
    var curElement = cxfjsutils.getFirstElementChild(element);
    var item;
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing login');
    if (curElement != null && cxfjsutils.isNodeNamedNS(curElement, '', 'login')) {
     var value = null;
     if (!cxfjsutils.isElementNil(curElement)) {
      value = cxfjsutils.getNodeText(curElement);
      item = value;
     }
     newobject.setLogin(item);
     var item = null;
     if (curElement != null) {
      curElement = cxfjsutils.getNextElementSibling(curElement);
     }
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing password');
    if (curElement != null && cxfjsutils.isNodeNamedNS(curElement, '', 'password')) {
     var value = null;
     if (!cxfjsutils.isElementNil(curElement)) {
      value = cxfjsutils.getNodeText(curElement);
      item = value;
     }
     newobject.setPassword(item);
     var item = null;
     if (curElement != null) {
      curElement = cxfjsutils.getNextElementSibling(curElement);
     }
    }
    return newobject;
}

//
// Constructor for XML Schema item {http://jaxws.core.subscription.cre.monext/}jaxWsDoInitIn
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn () {
    this.typeMarker = 'jaxws_core_subscription_cre_monext__jaxWsDoInitIn';
    this._b2b = null;
    this._AMOUNT = '';
    this._BILLING_CITY = '';
    this._BILLING_COMP = '';
    this._BILLING_COUNTRY = '';
    this._BILLING_FIRSTNAME = '';
    this._BILLING_LASTNAME = '';
    this._BILLING_STREET = '';
    this._BILLING_ZIP = '';
    this._CIVILITY = '';
    this._CURRENCYCODE = '';
    this._DATA = '';
    this._EMAIL = '';
    this._FIRSTNAME = '';
    this._LASTNAME = '';
    this._MERCHANT_DATA = '';
    this._PHONENUMBER = '';
    this._PRODUCTID = 0;
    this._REFMERCHANT = '';
    this._REFORDER = '';
    this._RETURN_URL = '';
    this._SHIPPING_CITY = '';
    this._SHIPPING_COMP = '';
    this._SHIPPING_COUNTRY = '';
    this._SHIPPING_FIRSTNAME = '';
    this._SHIPPING_LASTNAME = '';
    this._SHIPPING_STREET = '';
    this._SHIPPING_ZIP = '';
    this._SIGN = '';
}

//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getB2b
// element get for b2b
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - optional element
//
// element set for b2b
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setB2b
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getB2b() { return this._b2b;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getB2b = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getB2b;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setB2b(value) { this._b2b = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setB2b = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setB2b;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getAMOUNT
// element get for AMOUNT
// - element type is {http://www.w3.org/2001/XMLSchema}decimal
// - required element
//
// element set for AMOUNT
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setAMOUNT
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getAMOUNT() { return this._AMOUNT;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getAMOUNT = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getAMOUNT;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setAMOUNT(value) { this._AMOUNT = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setAMOUNT = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setAMOUNT;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getBILLING_CITY
// element get for BILLING_CITY
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for BILLING_CITY
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setBILLING_CITY
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getBILLING_CITY() { return this._BILLING_CITY;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getBILLING_CITY = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getBILLING_CITY;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setBILLING_CITY(value) { this._BILLING_CITY = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setBILLING_CITY = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setBILLING_CITY;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getBILLING_COMP
// element get for BILLING_COMP
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for BILLING_COMP
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setBILLING_COMP
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getBILLING_COMP() { return this._BILLING_COMP;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getBILLING_COMP = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getBILLING_COMP;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setBILLING_COMP(value) { this._BILLING_COMP = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setBILLING_COMP = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setBILLING_COMP;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getBILLING_COUNTRY
// element get for BILLING_COUNTRY
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for BILLING_COUNTRY
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setBILLING_COUNTRY
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getBILLING_COUNTRY() { return this._BILLING_COUNTRY;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getBILLING_COUNTRY = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getBILLING_COUNTRY;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setBILLING_COUNTRY(value) { this._BILLING_COUNTRY = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setBILLING_COUNTRY = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setBILLING_COUNTRY;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getBILLING_FIRSTNAME
// element get for BILLING_FIRSTNAME
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for BILLING_FIRSTNAME
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setBILLING_FIRSTNAME
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getBILLING_FIRSTNAME() { return this._BILLING_FIRSTNAME;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getBILLING_FIRSTNAME = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getBILLING_FIRSTNAME;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setBILLING_FIRSTNAME(value) { this._BILLING_FIRSTNAME = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setBILLING_FIRSTNAME = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setBILLING_FIRSTNAME;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getBILLING_LASTNAME
// element get for BILLING_LASTNAME
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for BILLING_LASTNAME
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setBILLING_LASTNAME
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getBILLING_LASTNAME() { return this._BILLING_LASTNAME;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getBILLING_LASTNAME = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getBILLING_LASTNAME;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setBILLING_LASTNAME(value) { this._BILLING_LASTNAME = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setBILLING_LASTNAME = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setBILLING_LASTNAME;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getBILLING_STREET
// element get for BILLING_STREET
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for BILLING_STREET
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setBILLING_STREET
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getBILLING_STREET() { return this._BILLING_STREET;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getBILLING_STREET = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getBILLING_STREET;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setBILLING_STREET(value) { this._BILLING_STREET = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setBILLING_STREET = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setBILLING_STREET;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getBILLING_ZIP
// element get for BILLING_ZIP
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for BILLING_ZIP
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setBILLING_ZIP
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getBILLING_ZIP() { return this._BILLING_ZIP;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getBILLING_ZIP = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getBILLING_ZIP;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setBILLING_ZIP(value) { this._BILLING_ZIP = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setBILLING_ZIP = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setBILLING_ZIP;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getCIVILITY
// element get for CIVILITY
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for CIVILITY
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setCIVILITY
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getCIVILITY() { return this._CIVILITY;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getCIVILITY = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getCIVILITY;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setCIVILITY(value) { this._CIVILITY = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setCIVILITY = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setCIVILITY;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getCURRENCYCODE
// element get for CURRENCYCODE
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for CURRENCYCODE
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setCURRENCYCODE
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getCURRENCYCODE() { return this._CURRENCYCODE;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getCURRENCYCODE = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getCURRENCYCODE;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setCURRENCYCODE(value) { this._CURRENCYCODE = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setCURRENCYCODE = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setCURRENCYCODE;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getDATA
// element get for DATA
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for DATA
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setDATA
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getDATA() { return this._DATA;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getDATA = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getDATA;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setDATA(value) { this._DATA = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setDATA = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setDATA;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getEMAIL
// element get for EMAIL
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for EMAIL
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setEMAIL
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getEMAIL() { return this._EMAIL;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getEMAIL = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getEMAIL;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setEMAIL(value) { this._EMAIL = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setEMAIL = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setEMAIL;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getFIRSTNAME
// element get for FIRSTNAME
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for FIRSTNAME
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setFIRSTNAME
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getFIRSTNAME() { return this._FIRSTNAME;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getFIRSTNAME = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getFIRSTNAME;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setFIRSTNAME(value) { this._FIRSTNAME = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setFIRSTNAME = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setFIRSTNAME;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getLASTNAME
// element get for LASTNAME
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for LASTNAME
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setLASTNAME
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getLASTNAME() { return this._LASTNAME;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getLASTNAME = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getLASTNAME;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setLASTNAME(value) { this._LASTNAME = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setLASTNAME = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setLASTNAME;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getMERCHANT_DATA
// element get for MERCHANT_DATA
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for MERCHANT_DATA
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setMERCHANT_DATA
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getMERCHANT_DATA() { return this._MERCHANT_DATA;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getMERCHANT_DATA = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getMERCHANT_DATA;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setMERCHANT_DATA(value) { this._MERCHANT_DATA = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setMERCHANT_DATA = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setMERCHANT_DATA;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getPHONENUMBER
// element get for PHONENUMBER
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for PHONENUMBER
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setPHONENUMBER
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getPHONENUMBER() { return this._PHONENUMBER;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getPHONENUMBER = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getPHONENUMBER;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setPHONENUMBER(value) { this._PHONENUMBER = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setPHONENUMBER = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setPHONENUMBER;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getPRODUCTID
// element get for PRODUCTID
// - element type is {http://www.w3.org/2001/XMLSchema}int
// - required element
//
// element set for PRODUCTID
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setPRODUCTID
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getPRODUCTID() { return this._PRODUCTID;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getPRODUCTID = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getPRODUCTID;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setPRODUCTID(value) { this._PRODUCTID = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setPRODUCTID = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setPRODUCTID;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getREFMERCHANT
// element get for REFMERCHANT
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for REFMERCHANT
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setREFMERCHANT
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getREFMERCHANT() { return this._REFMERCHANT;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getREFMERCHANT = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getREFMERCHANT;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setREFMERCHANT(value) { this._REFMERCHANT = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setREFMERCHANT = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setREFMERCHANT;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getREFORDER
// element get for REFORDER
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for REFORDER
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setREFORDER
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getREFORDER() { return this._REFORDER;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getREFORDER = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getREFORDER;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setREFORDER(value) { this._REFORDER = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setREFORDER = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setREFORDER;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getRETURN_URL
// element get for RETURN_URL
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for RETURN_URL
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setRETURN_URL
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getRETURN_URL() { return this._RETURN_URL;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getRETURN_URL = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getRETURN_URL;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setRETURN_URL(value) { this._RETURN_URL = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setRETURN_URL = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setRETURN_URL;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getSHIPPING_CITY
// element get for SHIPPING_CITY
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for SHIPPING_CITY
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setSHIPPING_CITY
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getSHIPPING_CITY() { return this._SHIPPING_CITY;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getSHIPPING_CITY = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getSHIPPING_CITY;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setSHIPPING_CITY(value) { this._SHIPPING_CITY = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setSHIPPING_CITY = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setSHIPPING_CITY;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getSHIPPING_COMP
// element get for SHIPPING_COMP
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for SHIPPING_COMP
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setSHIPPING_COMP
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getSHIPPING_COMP() { return this._SHIPPING_COMP;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getSHIPPING_COMP = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getSHIPPING_COMP;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setSHIPPING_COMP(value) { this._SHIPPING_COMP = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setSHIPPING_COMP = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setSHIPPING_COMP;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getSHIPPING_COUNTRY
// element get for SHIPPING_COUNTRY
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for SHIPPING_COUNTRY
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setSHIPPING_COUNTRY
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getSHIPPING_COUNTRY() { return this._SHIPPING_COUNTRY;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getSHIPPING_COUNTRY = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getSHIPPING_COUNTRY;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setSHIPPING_COUNTRY(value) { this._SHIPPING_COUNTRY = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setSHIPPING_COUNTRY = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setSHIPPING_COUNTRY;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getSHIPPING_FIRSTNAME
// element get for SHIPPING_FIRSTNAME
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for SHIPPING_FIRSTNAME
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setSHIPPING_FIRSTNAME
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getSHIPPING_FIRSTNAME() { return this._SHIPPING_FIRSTNAME;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getSHIPPING_FIRSTNAME = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getSHIPPING_FIRSTNAME;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setSHIPPING_FIRSTNAME(value) { this._SHIPPING_FIRSTNAME = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setSHIPPING_FIRSTNAME = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setSHIPPING_FIRSTNAME;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getSHIPPING_LASTNAME
// element get for SHIPPING_LASTNAME
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for SHIPPING_LASTNAME
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setSHIPPING_LASTNAME
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getSHIPPING_LASTNAME() { return this._SHIPPING_LASTNAME;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getSHIPPING_LASTNAME = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getSHIPPING_LASTNAME;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setSHIPPING_LASTNAME(value) { this._SHIPPING_LASTNAME = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setSHIPPING_LASTNAME = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setSHIPPING_LASTNAME;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getSHIPPING_STREET
// element get for SHIPPING_STREET
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for SHIPPING_STREET
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setSHIPPING_STREET
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getSHIPPING_STREET() { return this._SHIPPING_STREET;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getSHIPPING_STREET = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getSHIPPING_STREET;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setSHIPPING_STREET(value) { this._SHIPPING_STREET = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setSHIPPING_STREET = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setSHIPPING_STREET;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getSHIPPING_ZIP
// element get for SHIPPING_ZIP
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for SHIPPING_ZIP
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setSHIPPING_ZIP
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getSHIPPING_ZIP() { return this._SHIPPING_ZIP;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getSHIPPING_ZIP = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getSHIPPING_ZIP;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setSHIPPING_ZIP(value) { this._SHIPPING_ZIP = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setSHIPPING_ZIP = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setSHIPPING_ZIP;
//
// accessor is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getSIGN
// element get for SIGN
// - element type is {http://www.w3.org/2001/XMLSchema}string
// - required element
//
// element set for SIGN
// setter function is is jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setSIGN
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getSIGN() { return this._SIGN;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.getSIGN = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_getSIGN;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setSIGN(value) { this._SIGN = value;}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.setSIGN = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_setSIGN;
//
// Serialize {http://jaxws.core.subscription.cre.monext/}jaxWsDoInitIn
//
function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_serialize(cxfjsutils, elementName, extraNamespaces) {
    var xml = '';
    if (elementName != null) {
     xml = xml + '<';
     xml = xml + elementName;
     if (extraNamespaces) {
      xml = xml + ' ' + extraNamespaces;
     }
     xml = xml + '>';
    }
    // block for local variables
    {
     if (this._b2b != null) {
      xml = xml + '<b2b>';
      xml = xml + cxfjsutils.escapeXmlEntities(this._b2b);
      xml = xml + '</b2b>';
     }
    }
    // block for local variables
    {
     xml = xml + '<AMOUNT>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._AMOUNT);
     xml = xml + '</AMOUNT>';
    }
    // block for local variables
    {
     xml = xml + '<BILLING_CITY>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._BILLING_CITY);
     xml = xml + '</BILLING_CITY>';
    }
    // block for local variables
    {
     xml = xml + '<BILLING_COMP>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._BILLING_COMP);
     xml = xml + '</BILLING_COMP>';
    }
    // block for local variables
    {
     xml = xml + '<BILLING_COUNTRY>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._BILLING_COUNTRY);
     xml = xml + '</BILLING_COUNTRY>';
    }
    // block for local variables
    {
     xml = xml + '<BILLING_FIRSTNAME>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._BILLING_FIRSTNAME);
     xml = xml + '</BILLING_FIRSTNAME>';
    }
    // block for local variables
    {
     xml = xml + '<BILLING_LASTNAME>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._BILLING_LASTNAME);
     xml = xml + '</BILLING_LASTNAME>';
    }
    // block for local variables
    {
     xml = xml + '<BILLING_STREET>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._BILLING_STREET);
     xml = xml + '</BILLING_STREET>';
    }
    // block for local variables
    {
     xml = xml + '<BILLING_ZIP>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._BILLING_ZIP);
     xml = xml + '</BILLING_ZIP>';
    }
    // block for local variables
    {
     xml = xml + '<CIVILITY>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._CIVILITY);
     xml = xml + '</CIVILITY>';
    }
    // block for local variables
    {
     xml = xml + '<CURRENCYCODE>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._CURRENCYCODE);
     xml = xml + '</CURRENCYCODE>';
    }
    // block for local variables
    {
     xml = xml + '<DATA>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._DATA);
     xml = xml + '</DATA>';
    }
    // block for local variables
    {
     xml = xml + '<EMAIL>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._EMAIL);
     xml = xml + '</EMAIL>';
    }
    // block for local variables
    {
     xml = xml + '<FIRSTNAME>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._FIRSTNAME);
     xml = xml + '</FIRSTNAME>';
    }
    // block for local variables
    {
     xml = xml + '<LASTNAME>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._LASTNAME);
     xml = xml + '</LASTNAME>';
    }
    // block for local variables
    {
     xml = xml + '<MERCHANT_DATA>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._MERCHANT_DATA);
     xml = xml + '</MERCHANT_DATA>';
    }
    // block for local variables
    {
     xml = xml + '<PHONENUMBER>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._PHONENUMBER);
     xml = xml + '</PHONENUMBER>';
    }
    // block for local variables
    {
     xml = xml + '<PRODUCTID>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._PRODUCTID);
     xml = xml + '</PRODUCTID>';
    }
    // block for local variables
    {
     xml = xml + '<REFMERCHANT>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._REFMERCHANT);
     xml = xml + '</REFMERCHANT>';
    }
    // block for local variables
    {
     xml = xml + '<REFORDER>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._REFORDER);
     xml = xml + '</REFORDER>';
    }
    // block for local variables
    {
     xml = xml + '<RETURN_URL>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._RETURN_URL);
     xml = xml + '</RETURN_URL>';
    }
    // block for local variables
    {
     xml = xml + '<SHIPPING_CITY>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._SHIPPING_CITY);
     xml = xml + '</SHIPPING_CITY>';
    }
    // block for local variables
    {
     xml = xml + '<SHIPPING_COMP>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._SHIPPING_COMP);
     xml = xml + '</SHIPPING_COMP>';
    }
    // block for local variables
    {
     xml = xml + '<SHIPPING_COUNTRY>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._SHIPPING_COUNTRY);
     xml = xml + '</SHIPPING_COUNTRY>';
    }
    // block for local variables
    {
     xml = xml + '<SHIPPING_FIRSTNAME>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._SHIPPING_FIRSTNAME);
     xml = xml + '</SHIPPING_FIRSTNAME>';
    }
    // block for local variables
    {
     xml = xml + '<SHIPPING_LASTNAME>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._SHIPPING_LASTNAME);
     xml = xml + '</SHIPPING_LASTNAME>';
    }
    // block for local variables
    {
     xml = xml + '<SHIPPING_STREET>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._SHIPPING_STREET);
     xml = xml + '</SHIPPING_STREET>';
    }
    // block for local variables
    {
     xml = xml + '<SHIPPING_ZIP>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._SHIPPING_ZIP);
     xml = xml + '</SHIPPING_ZIP>';
    }
    // block for local variables
    {
     xml = xml + '<SIGN>';
     xml = xml + cxfjsutils.escapeXmlEntities(this._SIGN);
     xml = xml + '</SIGN>';
    }
    if (elementName != null) {
     xml = xml + '</';
     xml = xml + elementName;
     xml = xml + '>';
    }
    return xml;
}

jaxws_core_subscription_cre_monext__jaxWsDoInitIn.prototype.serialize = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_serialize;

function jaxws_core_subscription_cre_monext__jaxWsDoInitIn_deserialize (cxfjsutils, element) {
    var newobject = new jaxws_core_subscription_cre_monext__jaxWsDoInitIn();
    cxfjsutils.trace('element: ' + cxfjsutils.traceElementName(element));
    var curElement = cxfjsutils.getFirstElementChild(element);
    var item;
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing b2b');
    if (curElement != null && cxfjsutils.isNodeNamedNS(curElement, '', 'b2b')) {
     var value = null;
     if (!cxfjsutils.isElementNil(curElement)) {
      value = cxfjsutils.getNodeText(curElement);
      item = value;
     }
     newobject.setB2b(item);
     var item = null;
     if (curElement != null) {
      curElement = cxfjsutils.getNextElementSibling(curElement);
     }
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing AMOUNT');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setAMOUNT(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing BILLING_CITY');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setBILLING_CITY(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing BILLING_COMP');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setBILLING_COMP(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing BILLING_COUNTRY');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setBILLING_COUNTRY(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing BILLING_FIRSTNAME');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setBILLING_FIRSTNAME(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing BILLING_LASTNAME');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setBILLING_LASTNAME(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing BILLING_STREET');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setBILLING_STREET(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing BILLING_ZIP');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setBILLING_ZIP(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing CIVILITY');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setCIVILITY(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing CURRENCYCODE');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setCURRENCYCODE(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing DATA');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setDATA(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing EMAIL');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setEMAIL(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing FIRSTNAME');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setFIRSTNAME(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing LASTNAME');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setLASTNAME(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing MERCHANT_DATA');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setMERCHANT_DATA(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing PHONENUMBER');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setPHONENUMBER(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing PRODUCTID');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = parseInt(value);
    }
    newobject.setPRODUCTID(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing REFMERCHANT');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setREFMERCHANT(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing REFORDER');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setREFORDER(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing RETURN_URL');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setRETURN_URL(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing SHIPPING_CITY');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setSHIPPING_CITY(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing SHIPPING_COMP');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setSHIPPING_COMP(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing SHIPPING_COUNTRY');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setSHIPPING_COUNTRY(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing SHIPPING_FIRSTNAME');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setSHIPPING_FIRSTNAME(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing SHIPPING_LASTNAME');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setSHIPPING_LASTNAME(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing SHIPPING_STREET');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setSHIPPING_STREET(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing SHIPPING_ZIP');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setSHIPPING_ZIP(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    cxfjsutils.trace('curElement: ' + cxfjsutils.traceElementName(curElement));
    cxfjsutils.trace('processing SIGN');
    var value = null;
    if (!cxfjsutils.isElementNil(curElement)) {
     value = cxfjsutils.getNodeText(curElement);
     item = value;
    }
    newobject.setSIGN(item);
    var item = null;
    if (curElement != null) {
     curElement = cxfjsutils.getNextElementSibling(curElement);
    }
    return newobject;
}

//
// Definitions for service: {http://jaxws.ws.subscription.cre.monext/}WSSubscriptionServiceImplService
//

// Javascript for {http://jaxws.core.subscription.cre.monext/}subscriptionService

function jaxws_core_subscription_cre_monext__subscriptionService () {
    this.jsutils = new CxfApacheOrgUtil();
    this.jsutils.interfaceObject = this;
    this.synchronous = false;
    this.url = null;
    this.client = null;
    this.response = null;
    this.globalElementSerializers = [];
    this.globalElementDeserializers = [];
    this.globalElementSerializers['{http://jaxws.core.subscription.cre.monext/}doInitProcess'] = jaxws_core_subscription_cre_monext__doInitProcess_serialize;
    this.globalElementDeserializers['{http://jaxws.core.subscription.cre.monext/}doInitProcess'] = jaxws_core_subscription_cre_monext__doInitProcess_deserialize;
    this.globalElementSerializers['{http://jaxws.core.subscription.cre.monext/}Exception'] = jaxws_core_subscription_cre_monext__Exception_serialize;
    this.globalElementDeserializers['{http://jaxws.core.subscription.cre.monext/}Exception'] = jaxws_core_subscription_cre_monext__Exception_deserialize;
    this.globalElementSerializers['{http://jaxws.core.subscription.cre.monext/}getDetailProcessResponse'] = jaxws_core_subscription_cre_monext__getDetailProcessResponse_serialize;
    this.globalElementDeserializers['{http://jaxws.core.subscription.cre.monext/}getDetailProcessResponse'] = jaxws_core_subscription_cre_monext__getDetailProcessResponse_deserialize;
    this.globalElementSerializers['{http://jaxws.core.subscription.cre.monext/}getDetailProcess'] = jaxws_core_subscription_cre_monext__getDetailProcess_serialize;
    this.globalElementDeserializers['{http://jaxws.core.subscription.cre.monext/}getDetailProcess'] = jaxws_core_subscription_cre_monext__getDetailProcess_deserialize;
    this.globalElementSerializers['{http://jaxws.core.subscription.cre.monext/}doInitProcessResponse'] = jaxws_core_subscription_cre_monext__doInitProcessResponse_serialize;
    this.globalElementDeserializers['{http://jaxws.core.subscription.cre.monext/}doInitProcessResponse'] = jaxws_core_subscription_cre_monext__doInitProcessResponse_deserialize;
    this.globalElementSerializers['{http://jaxws.core.subscription.cre.monext/}doInitProcess'] = jaxws_core_subscription_cre_monext__doInitProcess_serialize;
    this.globalElementDeserializers['{http://jaxws.core.subscription.cre.monext/}doInitProcess'] = jaxws_core_subscription_cre_monext__doInitProcess_deserialize;
    this.globalElementSerializers['{http://jaxws.core.subscription.cre.monext/}Exception'] = jaxws_core_subscription_cre_monext__Exception_serialize;
    this.globalElementDeserializers['{http://jaxws.core.subscription.cre.monext/}Exception'] = jaxws_core_subscription_cre_monext__Exception_deserialize;
    this.globalElementSerializers['{http://jaxws.core.subscription.cre.monext/}jaxWsGetDetailResponseBean'] = jaxws_core_subscription_cre_monext__jaxWsGetDetailResponseBean_serialize;
    this.globalElementDeserializers['{http://jaxws.core.subscription.cre.monext/}jaxWsGetDetailResponseBean'] = jaxws_core_subscription_cre_monext__jaxWsGetDetailResponseBean_deserialize;
    this.globalElementSerializers['{http://jaxws.core.subscription.cre.monext/}jaxWsGetDetailOut'] = jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_serialize;
    this.globalElementDeserializers['{http://jaxws.core.subscription.cre.monext/}jaxWsGetDetailOut'] = jaxws_core_subscription_cre_monext__jaxWsGetDetailOut_deserialize;
    this.globalElementSerializers['{http://jaxws.core.subscription.cre.monext/}jaxWsGetDetailRequestBean'] = jaxws_core_subscription_cre_monext__jaxWsGetDetailRequestBean_serialize;
    this.globalElementDeserializers['{http://jaxws.core.subscription.cre.monext/}jaxWsGetDetailRequestBean'] = jaxws_core_subscription_cre_monext__jaxWsGetDetailRequestBean_deserialize;
    this.globalElementSerializers['{http://jaxws.core.subscription.cre.monext/}getDetailProcess'] = jaxws_core_subscription_cre_monext__getDetailProcess_serialize;
    this.globalElementDeserializers['{http://jaxws.core.subscription.cre.monext/}getDetailProcess'] = jaxws_core_subscription_cre_monext__getDetailProcess_deserialize;
    this.globalElementSerializers['{http://jaxws.core.subscription.cre.monext/}jaxWsDoInitRequestBean'] = jaxws_core_subscription_cre_monext__jaxWsDoInitRequestBean_serialize;
    this.globalElementDeserializers['{http://jaxws.core.subscription.cre.monext/}jaxWsDoInitRequestBean'] = jaxws_core_subscription_cre_monext__jaxWsDoInitRequestBean_deserialize;
    this.globalElementSerializers['{http://jaxws.core.subscription.cre.monext/}doInitProcessResponse'] = jaxws_core_subscription_cre_monext__doInitProcessResponse_serialize;
    this.globalElementDeserializers['{http://jaxws.core.subscription.cre.monext/}doInitProcessResponse'] = jaxws_core_subscription_cre_monext__doInitProcessResponse_deserialize;
    this.globalElementSerializers['{http://jaxws.core.subscription.cre.monext/}getDetailProcessResponse'] = jaxws_core_subscription_cre_monext__getDetailProcessResponse_serialize;
    this.globalElementDeserializers['{http://jaxws.core.subscription.cre.monext/}getDetailProcessResponse'] = jaxws_core_subscription_cre_monext__getDetailProcessResponse_deserialize;
    this.globalElementSerializers['{http://jaxws.core.subscription.cre.monext/}requestBean'] = jaxws_core_subscription_cre_monext__requestBean_serialize;
    this.globalElementDeserializers['{http://jaxws.core.subscription.cre.monext/}requestBean'] = jaxws_core_subscription_cre_monext__requestBean_deserialize;
    this.globalElementSerializers['{http://jaxws.core.subscription.cre.monext/}jaxWsDoInitOut'] = jaxws_core_subscription_cre_monext__jaxWsDoInitOut_serialize;
    this.globalElementDeserializers['{http://jaxws.core.subscription.cre.monext/}jaxWsDoInitOut'] = jaxws_core_subscription_cre_monext__jaxWsDoInitOut_deserialize;
    this.globalElementSerializers['{http://jaxws.core.subscription.cre.monext/}wsAccessBean'] = jaxws_core_subscription_cre_monext__wsAccessBean_serialize;
    this.globalElementDeserializers['{http://jaxws.core.subscription.cre.monext/}wsAccessBean'] = jaxws_core_subscription_cre_monext__wsAccessBean_deserialize;
    this.globalElementSerializers['{http://jaxws.core.subscription.cre.monext/}wsBusinessBean'] = jaxws_core_subscription_cre_monext__wsBusinessBean_serialize;
    this.globalElementDeserializers['{http://jaxws.core.subscription.cre.monext/}wsBusinessBean'] = jaxws_core_subscription_cre_monext__wsBusinessBean_deserialize;
    this.globalElementSerializers['{http://jaxws.core.subscription.cre.monext/}jaxWsDoInitResponseBean'] = jaxws_core_subscription_cre_monext__jaxWsDoInitResponseBean_serialize;
    this.globalElementDeserializers['{http://jaxws.core.subscription.cre.monext/}jaxWsDoInitResponseBean'] = jaxws_core_subscription_cre_monext__jaxWsDoInitResponseBean_deserialize;
    this.globalElementSerializers['{http://jaxws.core.subscription.cre.monext/}jaxWsGetDetailIn'] = jaxws_core_subscription_cre_monext__jaxWsGetDetailIn_serialize;
    this.globalElementDeserializers['{http://jaxws.core.subscription.cre.monext/}jaxWsGetDetailIn'] = jaxws_core_subscription_cre_monext__jaxWsGetDetailIn_deserialize;
    this.globalElementSerializers['{http://jaxws.core.subscription.cre.monext/}wsSubscriberBean'] = jaxws_core_subscription_cre_monext__wsSubscriberBean_serialize;
    this.globalElementDeserializers['{http://jaxws.core.subscription.cre.monext/}wsSubscriberBean'] = jaxws_core_subscription_cre_monext__wsSubscriberBean_deserialize;
    this.globalElementSerializers['{http://jaxws.core.subscription.cre.monext/}jaxWsDoInitIn'] = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_serialize;
    this.globalElementDeserializers['{http://jaxws.core.subscription.cre.monext/}jaxWsDoInitIn'] = jaxws_core_subscription_cre_monext__jaxWsDoInitIn_deserialize;
}

function jaxws_core_subscription_cre_monext__doInitProcess_op_onsuccess(client, responseXml) {
    if (client.user_onsuccess) {
     var responseObject = null;
     var element = responseXml.documentElement;
     this.jsutils.trace('responseXml: ' + this.jsutils.traceElementName(element));
     element = this.jsutils.getFirstElementChild(element);
     this.jsutils.trace('first element child: ' + this.jsutils.traceElementName(element));
     while (!this.jsutils.isNodeNamedNS(element, 'http://schemas.xmlsoap.org/soap/envelope/', 'Body')) {
      element = this.jsutils.getNextElementSibling(element);
      if (element == null) {
       throw 'No env:Body in message.'
      }
     }
     element = this.jsutils.getFirstElementChild(element);
     this.jsutils.trace('part element: ' + this.jsutils.traceElementName(element));
     this.jsutils.trace('calling jaxws_core_subscription_cre_monext__doInitProcessResponse_deserializeResponse');
     responseObject = jaxws_core_subscription_cre_monext__doInitProcessResponse_deserializeResponse(this.jsutils, element);
     client.user_onsuccess(responseObject);
    }
}

jaxws_core_subscription_cre_monext__subscriptionService.prototype.doInitProcess_onsuccess = jaxws_core_subscription_cre_monext__doInitProcess_op_onsuccess;

function jaxws_core_subscription_cre_monext__doInitProcess_op_onerror(client) {
    if (client.user_onerror) {
     var httpStatus;
     var httpStatusText;
     try {
      httpStatus = client.req.status;
      httpStatusText = client.req.statusText;
     } catch(e) {
      httpStatus = -1;
      httpStatusText = 'Error opening connection to server';
     }
     if (client.parseErrorDetails) {
      client.user_onerror(httpStatus, httpStatusText, client.parseErrorDetails(this));
     } else {
      client.user_onerror(httpStatus, httpStatusText);
     }
    }
}

jaxws_core_subscription_cre_monext__subscriptionService.prototype.doInitProcess_onerror = jaxws_core_subscription_cre_monext__doInitProcess_op_onerror;

//
// Operation {http://jaxws.core.subscription.cre.monext/}doInitProcess
// Wrapped operation.
// parameter access
// - Object constructor is jaxws_core_subscription_cre_monext__wsAccessBean
// parameter doInitProcess
// - Object constructor is jaxws_core_subscription_cre_monext__jaxWsDoInitRequestBean
//
function jaxws_core_subscription_cre_monext__doInitProcess_op(successCallback, errorCallback, access, doInitProcess) {
    this.client = new CxfApacheOrgClient(this.jsutils);
    var xml = null;
    var args = new Array(2);
    args[0] = access;
    args[1] = doInitProcess;
    xml = this.doInitProcess_serializeInput(this.jsutils, args);
    this.client.user_onsuccess = successCallback;
    this.client.user_onerror = errorCallback;
    var closureThis = this;
    this.client.onsuccess = function(client, responseXml) { closureThis.doInitProcess_onsuccess(client, responseXml); };
    this.client.onerror = function(client) { closureThis.doInitProcess_onerror(client); };
    var requestHeaders = [];
    requestHeaders['SOAPAction'] = '';
    this.jsutils.trace('synchronous = ' + this.synchronous);
    this.client.request(this.url, xml, null, this.synchronous, requestHeaders);
}

jaxws_core_subscription_cre_monext__subscriptionService.prototype.doInitProcess = jaxws_core_subscription_cre_monext__doInitProcess_op;

function jaxws_core_subscription_cre_monext__doInitProcess_serializeInput(cxfjsutils, args) {
    var wrapperObj = new jaxws_core_subscription_cre_monext__doInitProcess();
    wrapperObj.setAccess(args[0]);
    wrapperObj.setDoInitProcess(args[1]);
    var xml;
    xml = cxfjsutils.beginSoap11Message("xmlns:jns0='http://jaxws.core.subscription.cre.monext/' ");
    // block for local variables
    {
     xml = xml + wrapperObj.serialize(cxfjsutils, 'jns0:doInitProcess', null);
    }
    xml = xml + cxfjsutils.endSoap11Message();
    return xml;
}

jaxws_core_subscription_cre_monext__subscriptionService.prototype.doInitProcess_serializeInput = jaxws_core_subscription_cre_monext__doInitProcess_serializeInput;

function jaxws_core_subscription_cre_monext__doInitProcessResponse_deserializeResponse(cxfjsutils, partElement) {
    var returnObject = jaxws_core_subscription_cre_monext__doInitProcessResponse_deserialize (cxfjsutils, partElement);

    return returnObject;
}
function jaxws_core_subscription_cre_monext__getDetailProcess_op_onsuccess(client, responseXml) {
    if (client.user_onsuccess) {
     var responseObject = null;
     var element = responseXml.documentElement;
     this.jsutils.trace('responseXml: ' + this.jsutils.traceElementName(element));
     element = this.jsutils.getFirstElementChild(element);
     this.jsutils.trace('first element child: ' + this.jsutils.traceElementName(element));
     while (!this.jsutils.isNodeNamedNS(element, 'http://schemas.xmlsoap.org/soap/envelope/', 'Body')) {
      element = this.jsutils.getNextElementSibling(element);
      if (element == null) {
       throw 'No env:Body in message.'
      }
     }
     element = this.jsutils.getFirstElementChild(element);
     this.jsutils.trace('part element: ' + this.jsutils.traceElementName(element));
     this.jsutils.trace('calling jaxws_core_subscription_cre_monext__getDetailProcessResponse_deserializeResponse');
     responseObject = jaxws_core_subscription_cre_monext__getDetailProcessResponse_deserializeResponse(this.jsutils, element);
     client.user_onsuccess(responseObject);
    }
}

jaxws_core_subscription_cre_monext__subscriptionService.prototype.getDetailProcess_onsuccess = jaxws_core_subscription_cre_monext__getDetailProcess_op_onsuccess;

function jaxws_core_subscription_cre_monext__getDetailProcess_op_onerror(client) {
    if (client.user_onerror) {
     var httpStatus;
     var httpStatusText;
     try {
      httpStatus = client.req.status;
      httpStatusText = client.req.statusText;
     } catch(e) {
      httpStatus = -1;
      httpStatusText = 'Error opening connection to server';
     }
     if (client.parseErrorDetails) {
      client.user_onerror(httpStatus, httpStatusText, client.parseErrorDetails(this));
     } else {
      client.user_onerror(httpStatus, httpStatusText);
     }
    }
}

jaxws_core_subscription_cre_monext__subscriptionService.prototype.getDetailProcess_onerror = jaxws_core_subscription_cre_monext__getDetailProcess_op_onerror;

//
// Operation {http://jaxws.core.subscription.cre.monext/}getDetailProcess
// Wrapped operation.
// parameter access
// - Object constructor is jaxws_core_subscription_cre_monext__wsAccessBean
// parameter getDetailProcess
// - Object constructor is jaxws_core_subscription_cre_monext__jaxWsGetDetailRequestBean
//
function jaxws_core_subscription_cre_monext__getDetailProcess_op(successCallback, errorCallback, access, getDetailProcess) {
    this.client = new CxfApacheOrgClient(this.jsutils);
    var xml = null;
    var args = new Array(2);
    args[0] = access;
    args[1] = getDetailProcess;
    xml = this.getDetailProcess_serializeInput(this.jsutils, args);
    this.client.user_onsuccess = successCallback;
    this.client.user_onerror = errorCallback;
    var closureThis = this;
    this.client.onsuccess = function(client, responseXml) { closureThis.getDetailProcess_onsuccess(client, responseXml); };
    this.client.onerror = function(client) { closureThis.getDetailProcess_onerror(client); };
    var requestHeaders = [];
    requestHeaders['SOAPAction'] = '';
    this.jsutils.trace('synchronous = ' + this.synchronous);
    this.client.request(this.url, xml, null, this.synchronous, requestHeaders);
}

jaxws_core_subscription_cre_monext__subscriptionService.prototype.getDetailProcess = jaxws_core_subscription_cre_monext__getDetailProcess_op;

function jaxws_core_subscription_cre_monext__getDetailProcess_serializeInput(cxfjsutils, args) {
    var wrapperObj = new jaxws_core_subscription_cre_monext__getDetailProcess();
    wrapperObj.setAccess(args[0]);
    wrapperObj.setGetDetailProcess(args[1]);
    var xml;
    xml = cxfjsutils.beginSoap11Message("xmlns:jns0='http://jaxws.core.subscription.cre.monext/' ");
    // block for local variables
    {
     xml = xml + wrapperObj.serialize(cxfjsutils, 'jns0:getDetailProcess', null);
    }
    xml = xml + cxfjsutils.endSoap11Message();
    return xml;
}

jaxws_core_subscription_cre_monext__subscriptionService.prototype.getDetailProcess_serializeInput = jaxws_core_subscription_cre_monext__getDetailProcess_serializeInput;

function jaxws_core_subscription_cre_monext__getDetailProcessResponse_deserializeResponse(cxfjsutils, partElement) {
    var returnObject = jaxws_core_subscription_cre_monext__getDetailProcessResponse_deserialize (cxfjsutils, partElement);

    return returnObject;
}
function jaxws_core_subscription_cre_monext__subscriptionService_jaxws_ws_subscription_cre_monext__WSSubscriptionServiceImplPort () {
  this.url = 'http://127.0.0.1:8084//subscription-ws/doInit';
}
jaxws_core_subscription_cre_monext__subscriptionService_jaxws_ws_subscription_cre_monext__WSSubscriptionServiceImplPort.prototype = new jaxws_core_subscription_cre_monext__subscriptionService;
