(function ($) {

    $("a").click(function () {
        returnValue = false;
        if ($('#page_botbox') != null) {
            if ($(this).attr('href') != "javascript:void(0)" && $(this).attr('href') != "" && $(this).attr('href') != null) {
                $.get($(this).attr('href'), function (d) {
                    $('#page_botbox').html(d);
                });
                return false;
            }
        }
    });

    $.ShowProcess = function(v, m) {
        if (m == undefined || m == null || m == "") m = "正在开始任务...";
        ymPrompt.close();
        ymPrompt.win({ message: '<br /><br /><br /><center><img src="../Resources/images/loading.gif" />' + m + '完成度' + v + '%</center>', handler: $.CloseProcess, btn: [['关闭']], titleBar: false });
        if (v >= 100) setTimeout("ymPrompt.close()", 1000);
    };
    $.CloseProcess = function() { ymPrompt.close(); };
    $.fn.ShowLoading = function(msg) {
        var loading = $("#pnl_loading", this);
        if (loading.length == 0) {
            loading = $("<div id=\"pnl_loading\" style=\"text-align:center;line-height:35px;\"><img src=\"../Resources/images/panel_loading.gif\" />" + msg + "</div>");
            $(this).append(loading);
        };
        $(this).children().each(function() {
            $(this).hide();
        });
        loading.show();
    };
    $.fn.Alt = function(p) {
        var loading = $("#pnl_loading_memo", document.body);
        if (loading.length == 0) {
            loading = $("<div id=\"pnl_loading_memo\" style=\"margin-top:5px;text-align:left;font-size:14px;line-height:20px;position:absolute;display:none;border:solid 1px #666666;color:#666666;background-color:#FFFFFF;padding:4px;\"></div>");
            $(document.body).append(loading);
        };

        var o_left = (p && p.left) ? p.left : 0;
        var o_top = (p && p.top) ? p.top : 0;
        $(this).each(function() {
            var obj = $(this);
            var v = obj.val() || obj.html();
            if (v == "") return;
            obj.bind("mouseover", function() {
                var position = obj.position();
                //if ($.browser.msie == undefined) { alert($(window.top.document).scrollTop()); alert(position.top);alert(o_top) }
                //o_top = $(window.top.document).scrollTop() + o_top; }
                loading.css("left", position.left + obj.width() / 2 + o_left);
                if ($.browser.msie == undefined)
                    loading.css("top", position.top + obj.height() / 2 + o_top - $(window.top.document).scrollTop());
                else
                    loading.css("top", position.top + obj.height() / 2 + o_top);
                loading.html(v);
                loading.show();
            }).bind("mouseout", function() {
                loading.hide();
            });
        });
    };
    $.fn.GetIFrame = function() {
        if (document.getElementById && this.length > 0) {
            if (!window.opera) {
            try{ return this[0].contentDocument || this[0].Document;}
            catch(ex){return null;}
               
            }
        };
        return null;
    }
    $.fn.CloseLoading = function() {
        var loading = $("#pnl_loading", this);
        $(this).children().each(function() {
            $(this).show();
        });
        loading.hide();
    };
    $.fn.SetValue = function(value) {
        if (value == undefined || value == null) value = "&nbsp;";
        $("[field]", this).each(function() {
            var o = $(this);
            var v = eval("value." + o.attr("field"));
            if (v) {
                if (typeof (v) == "string") v = v.pareseDate();
                if (o.attr("format") && v.format) v = v.format(o.attr("format"));
                var tag = o.attr("tagName");
                var type = o.attr("type");
                var isSet = false;
                if (o.attr("SetValue")) {
                    eval("o." + o.attr("SetValue") + "(" + v + ")");
                    isSet = true;
                };
                if (o.attr("SetText")) {
                    eval("o." + o.attr("SetText") + "(" + v + ")");
                    isSet = true;
                };
                if (isSet) return;
                if ((tag == "INPUT" && (type == "TEXT" || type == "HIDDEN"))
                    || tag == "SELECT" || tag == "TEXTAREA") o.attr("value", v);
                else if (tag == "LABEL" || tag == "SPAN") o.html(v ? v : "&nbsp;");
                else if (tag == "INPUT" && (type == "CHECKBOX" || type == "RADIO")) o.atrr("checked", v);
            }
            else {
                var tag = o.attr("tagName");
                if (tag == "LABEL" || tag == "SPAN") o.html("&nbsp;");
            }
        });
    };
    $.fn.Win = function (option) {
        $.extend({ maxBtn: false, minBtn: false }, option);
        for (var i = 0; i < this.length; i++) {
            var o = $(this[i]);
            option.height = o.attr("winheight") || option.height;
            option.width = o.attr("winwidth") || option.width;
            if (o.attr("winurl")) option = $.extend({ maxBtn: true, minBtn: false }, option, { iframe: { src: o.attr("winurl") }, title: o.attr("title")});
            o.click((function(v) { return function() { ymPrompt.win(v); if ($.browser.msie && ($.browser.version == "6.0")) $(ymPrompt.getPage()).one("load", function() { this.contentWindow.document.body.style.backgroundImage = "none"; this.contentWindow.document.body.style.backgroundColor = "#FFFFFF";}) } })(option));
        };
    };
    $.fn.huAjax = function(options) {
        var o = $.extend({}, $.fn.huAjax.DefaultSetting || {}, options || {});
        var ajaxdata = {};
        if (o.autoajaxdata) {
            $("[autoajaxdata='true']").each(function() {
                var obj = $(this);
                $(ajaxdata).attr(obj.attr("name"), obj.val());
            });
        };
        $.ajax({
            type: o.method,
            cache: o.cache,
            url: o.url,
            data: $.extend(ajaxdata, o.data || {}),
            dataType: o.datatype,
            beforeSend: function(XMLHttpRequest) {
                var r = false;
                if (o.beforeSend && $.isFunction(o.beforeSend)) { r = o.beforeSend.call(this, v); };
                if (r) {

                }
            },
            success: function(data, textStatus) {
                if (data) {
                    var r = data; //eval("(" + data + ")");
                    if (r.Tag == $.AjaxResultTag.SessionTimeOut) { location.href = r.Value; return; }
                    if (o.success && $.isFunction(o.success)) { r = o.success.call(this, r); };
                }
            },
            complete: function(XMLHttpRequest, textStatus) {
                var r = false;
                if (o.complete && $.isFunction(o.complete)) { r = o.complete.call(this, v); };
                if (r) {

                }
            },
            error: function(v) {
                var r = false;
                if (o && o.error && $.isFunction(o.error)) { r = o.error.call(this, v); }
                //全局处理
                if (r) {

                }
            }
        });
    };
    $.fn.huAjax.Method = {
        POST: "post", GET: "get"
    };
    $.fn.huAjax.DefaultSetting = {
        method: $.fn.huAjax.Method.GET,
        validate: true, //是否自动验证,验证符合验证规则
        autoajaxdata: true, //是否自动获取参数
        url: "",
        data: null,
        datatype: "json", //"html",
        cache: false,
        beforeSend: null, success: null, complete: null, error: null
    };
    $.AjaxResultTag = {
        /// <summary>
        /// 未知错误
        /// </summary>
        UnKnown: 0,
        /// <summary>
        /// 成功
        /// </summary>
        Success: 1,
        /// <summary>
        /// 没有权限
        /// </summary>
        NoRight: 2,
        /// <summary>
        /// 数据操作错误
        /// </summary>
        DbError: 3,
        /// <summary>
        /// Session过期
        /// </summary>
        SessionTimeOut: 4,
        /// <summary>
        /// 输入错误
        /// </summary>
        InputError: 5,
        /// <summary>
        /// 没有输入
        /// </summary>
        NoInput: 6,
        /// <summary>
        /// 没有数据
        /// </summary>
        NoInput: 7
    };
})(jQuery);

/**  
 * 时间对象的格式化;  
 */
Date.prototype.format = function(format) {
    /*  
    * eg:format="YYYY-MM-dd hh:mm:ss";  
    */
    var o = {
        "M+": this.getMonth() + 1, // month   
        "d+": this.getDate(), // day   
        "h+": this.getHours(), // hour   
        "m+": this.getMinutes(), // minute   
        "s+": this.getSeconds(), // second   
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter   
        "S": this.getMilliseconds()
        // millisecond   
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
//判断JOSN输出是否为日期型
//var dateForJosnRules = new RegExp("^\/Date\\((\-)?\\d+?([\+\-](\\d\\d){2})\\)\/$", "gi");
var dateForJosnRules = /^\/Date\((\-)?\d+[\+\-](\d\d){2}\)\/$/;

String.prototype.pareseDate = function() {
    if (dateForJosnRules.test(this)) {
        return eval("(new " + this.substr("1", this.length - 2) + ")");
    };
    return this.toString();
}
//加入收藏
function addBookmark(title, url) {
    if (window.sidebar) {
        window.sidebar.addPanel(title, url, "");
    } else if (document.all) {
        window.external.AddFavorite(url, title);
    } else if (window.opera && window.print) {
        return true;
    }
};
//设置首页
function setHome(url) {
    if (document.all) {
        document.body.style.behavior = 'url(#default#homepage)';
        document.body.setHomePage(url);
    } else if (window.sidebar) {
        if (window.netscape) {
            try {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            } catch (e) {
                alert("该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true");
            }
        }
        if (window.confirm("你确定要设置" + url + "为首页吗？") == 1) {
            var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
            prefs.setCharPref('browser.startup.homepage', url);
        }
    }
};

//合并表格单元格
function mergeCell(obj, cellIndex) {
    if (!obj) obj = document.getElementById(obj);
    if (obj) {
        var startRowIndex = 0;
        var endRowIndex = 1;
        if (obj.rows.length > 0) {
            if (cellIndex < obj.rows[0].cells.length) {
                var startValue = obj.rows[0].cells[cellIndex].innerText;
                var endValue = obj.rows[0].cells[cellIndex].innerText;

                for (var rowIndex = 1; rowIndex < obj.rows.length; rowIndex++) {
                    var cell = obj.rows[rowIndex].cells[cellIndex];
                    if (cell && cell.innerText) {
                        endValue = cell.innerText;
                        endRowIndex = rowIndex;

                        if (endValue == startValue) {
                            obj.rows[rowIndex].removeChild(cell);
                            obj.rows[startRowIndex].cells[cellIndex].rowSpan += 1;
                        }
                        else {
                            startValue = endValue;
                            startRowIndex = endRowIndex;
                        }
                    }
                }
            }
        }
    }
};