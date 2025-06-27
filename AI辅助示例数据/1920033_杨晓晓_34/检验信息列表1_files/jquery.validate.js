//(function($) {
//    debugger
//    $.fn.validate = function(options) {
//        var validators = $.data(document.body);
//        if (validators == null || validators == undefined) validators = $();
//        validators.each(function() {
//            var is = $(this).attr("rule");
//            var rule = $(this).attr("rule");

//        });

//    };
//    function getValue(jobj) {
//        if (ojobj.attr("tagName") == "input" && ojobj.attr("type") == "text") { return jobj.val(); };
//        if (ojobj.attr("tagName") == "texteare") { return jobj.val(); }
//        if (ojobj.attr("tagName") == "select" ){return jobj["value"]}
//        if (ojobj.attr("tagName") == "input" && ojobj.attr("type") == "check")
//    };
//    $.fn.validate.CommValidators = {
//        Custom: "[validate='true']",
//        Email: "",
//        Telphone: ""
//    }
//    $.fn.validate.Result = { UnKnow: 0, Succes: 1, Error: -1 };

//    $.fn.validate.DefaultSetting = {
//        Open: true,
//        Submit: true,
//        Message: "",
//        ErrorClass: "error",
//        Validator: this.CommValidators.Custom
//    };
//    $.extend($.validate, {
//        format: function() {

//        }
//    });
//    $.fn.validate({ validate: false });
//})(jQuery)