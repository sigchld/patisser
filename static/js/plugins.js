// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

(function($){  
  
    $.fn.extend({   

        filter_input: function(options) {

          var defaults = {  
              regex:".",
              negkey: false, // use "-" if you want to allow minus sign at the beginning of the string
              live:false,
              events:'keypress paste'
          }  
                
          var options =  $.extend(defaults, options);  
          
          function filter_input_function(event) {

            var input = (event.input) ? event.input : $(this);
            if (event.ctrlKey || event.altKey) return;
            if (event.type=='keypress') {

              var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;

              // 8 = backspace, 9 = tab, 13 = enter, 35 = end, 36 = home, 37 = left, 39 = right, 46 = delete
              if (key == 8 || key == 9 || key == 13 || key == 35 || key == 36|| key == 37 || key == 39 || key == 46) {

                // if charCode = key & keyCode = 0
                // 35 = #, 36 = $, 37 = %, 39 = ', 46 = .
         
                if (event.charCode == 0 && event.keyCode == key) {
                  return true;                                             
                }
              }
              var string = String.fromCharCode(key);
              // if they pressed the defined negative key
              if (options.negkey && string == options.negkey) {
                // if there is already one at the beginning, remove it
                if (input.val().substr(0, 1) == string) {
                  input.val(input.val().substring(1, input.val().length)).change();
                } else {
                  // it isn't there so add it to the beginning of the string
                  input.val(string + input.val()).change();
                }
                return false;
              }
              var regex = new RegExp(options.regex);
            } else if (event.type=='paste') {
              input.data('value_before_paste', event.target.value);
              setTimeout(function(){
                filter_input_function({type:'after_paste', input:input});
              }, 1);
              return true;
            } else if (event.type=='after_paste') {
              var string = input.val();
              var regex = new RegExp('^('+options.regex+')+$');
            } else {
              return false;
            }

            if (regex.test(string)) {
              return true;
            } else if (typeof(options.feedback) == 'function') {
              options.feedback.call(this, string);
            }
            if (event.type=='after_paste') input.val(input.data('value_before_paste'));
            return false;
          }
          
          var jquery_version = $.fn.jquery.split('.');
          if (options.live) {
            if (parseInt(jquery_version[0]) >= 1 && parseInt(jquery_version[1]) >= 7) {
              $(this).on(options.events, filter_input_function); 
            } else {
              $(this).live(options.events, filter_input_function); 
            }
          } else {
            return this.each(function() {  
              var input = $(this);
              if (parseInt(jquery_version[0]) >= 1 && parseInt(jquery_version[1]) >= 7) {
                input.off(options.events).on(options.events, filter_input_function);
              } else {
                input.unbind(options.events).bind(options.events, filter_input_function);
              }
            });  
          }
          
        }  
    });  
      
})(jQuery); 
