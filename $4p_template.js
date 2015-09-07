/*
 * 4p javascript template ports 
 * version : 0.5
 * Copyright Desgranges Mickael
 * mickael@mkdgs.fr
 */
if (typeof $4p !== 'object')
    var $4p = {};

$4p.template = function (tpl) {
    var f = {};
    f.cache = {};
    f.scope = {};
    
    f.skipCache = function () {
        return (typeof $4p.skipCache !== "undefined") ? $4p.skipCache() : '';
    };

    f.getTemplate = function (tpl) {
        if (typeof tpl == 'string') {
            if (tpl.substring(0, 4) == 'http') {
                $.ajax({
                    cache: true,
                    url: tpl + f.skipCache(),
                    dataType: 'text',
                    async: false,
                    success: function (d) {
                        return d;
                    }
                });
            }
            return tpl;
        }
        f.log('unknow tpl type ' + typeof tpl);
        return;
    };

    f.decomposeTemplate = function ($element, scopeObject) {      
        var scopeObject;
        if (!scopeObject)
            scopeObject = f.scope;
        var $textarea = $('<textarea />');
        var $nestedParts = $('[data-fp-scope]', $element); 
         
        $nestedParts.each(function () {            
            f.decomposeTemplate($(this), scopeObject);  
        });            
              
        $element.each(function () {              
            if ( $('[data-fp-scope]', $(this)).length !== 0 ) console.log($(this));
            var scope = $(this).attr('data-fp-scope');
            $(this).parent().attr('data-fp-scope-parent', scope);
            // if (f.scope[scope]) f.log('template part ' + scope + ' has been overwritten');
            f.scope[scope] = $textarea.append($(this)).html();
            // if ($(this)[0].hasAttribute('data-fp-remove')) // become useless 
            $(this).remove();
            $textarea.html('');            
        });
    };
        
    f.getParent = function (scope) {
        if ( scope === 'root' ) return f.element;
        return $('[data-fp-scope-parent='+scope+']', f.element);
    };
    
    f.renderAfter = function (scope, data, bind_data) {
        if ( scope === 'root' ) return f.element;
        return $(f.render(data, scope, bind_data)).appendTo(f.getParent(scope));
    };
    
    f.render = function (data, scope, data_key) {
        var err = "", func;
        if (!scope)
            scope = 'root';
        if (!data_key)
            data_key = 'data';
        var tpl_data = {};
        tpl_data[data_key] = new $4p.templateData(data);
        try {
            if (typeof f.cache[scope] != 'function') {
                var strFunc = "var p=[]; var print = function(str) { p.push(str); }; $4p.template.print=print; p.push('"
                        + f.scope[scope].replace(/[\r\t\n]/g, " ")
                        .split("'")
                        .join("\\'")
                        .replace(/<script>/g, "{{")
                        .replace(/<\/script>/g, "}}")
                        .replace(/{{=([^}{2}]+)}}/g, function (m, p1) {
                            return "'+" + p1.split("\\'").join("'") + "+'";
                        })
                        .replace(/{{(.+?)}}/g, function (m, p1) {
                            return "');" + p1.split("\\'").join("'") + ";p.push('";
                        })
                        + "');return p.join('');";

                var args = [];
                for (var x in tpl_data) {
                    args.push(x);
                }
                f.cache[scope] = new Function(args, strFunc);
            }

            var args_value = [];
            for (var x in tpl_data) {
                args_value.push(tpl_data[x]);
            }

            return f.cache[scope].apply(this, args_value);
        } catch (e) {
            err = e.message;
        }
        f.log("$4p.template ERROR: " + scope + ' ' + err);
    };

    f.log = function (msg) {
        if (typeof console !== "undefined")
            console.log(msg)
    };
    
    f.print = function (str) {
        f.log('print: '+ str);
    };

    f.tpl = f.getTemplate(tpl);
    // get scope part
    f.element = document.createElement('div');
    f.element.innerHTML = f.tpl;
    f.element = $(f.element).attr('data-fp-scope', 'root');
    f.decomposeTemplate(f.element);

    return f;
};

$4p.templateData = function (vars, key) {
    this.vars = null;
    this.key = null;
    this.i_iterate = null;
    this.i_total = null;
    this.i_position = null;
    this.instanceOfTemplateData = true;

    this.constructor = function (vars, key) {
        var k, v;
        this.key = (key) ? key : null;
        var varsTypeOf = typeof vars;
        
        if ( varsTypeOf !== 'undefined' ) {
            if (vars.instanceOfTemplateData === true) {
                this.vars = vars.vars;
            } else if ((/boolean|number|string/).test(varsTypeOf)) {
                this.vars = vars;
            } else {
                this.vars = {};
                for (k in vars) {
                    if (vars.hasOwnProperty(k)) {
                        v = vars[k];
                        this.vars[k] = new $4p.templateData(v, k);
                        // reference the data index
                        if (!this[k])
                            this[k] = this.vars[k];
                    }
                }
            }
        }
    };
    
    this.constructor.call(this, vars, key);

    this.is = function (args) {
        if (!(args instanceof Array))
            args = Array.prototype.slice.call(arguments);
        var o = this;
        var v;
        for (k in args) {
            if (args.hasOwnProperty(k)) {
                v = args[k];
                if (o && (typeof o.vars[v] != 'undefined')
                        && (o.vars[v].instanceOfTemplateData)) {
                    o = o.vars[v];
                } else {
                    return new $4p.templateData('');
                }
            }
        }
        return o;
    };

    this.v = function () {
        return this.vars;
    };
    this.e = function () {
        return $4p.template.print(this.value());
    };

    this.toString = function () {
        return this.value() + '';
    };

    this.valueOf = function () {
        return this.value() + '';
    };

    /*
     * ITERATOR
     */
    if (this.vars !== null && typeof this.vars === 'object') {
        this.currentKey = 0;
        if (!this.vars.instanceOfTemplateData) {
            this.keys = [];
            for (var key in this.vars) {
                if (this.vars.hasOwnProperty(key)) {
                    this.keys.push(key);
                }
            }
        } else {
            this.keys = this.vars.keys;
        }

        this.end = function () {
            this.currentKey = (this.keys.length - 1);
        };
        this.reset = function () {
            this.currentKey = 0;
        };
        this.prev = function () {
            return this.vars[this.keys[--this.currentKey]];
        };
        this.next = function () {
            return this.vars[this.keys[++this.currentKey]];
        };
        this.count = function () {
            return this.keys.length;
        };
        this.current = function () {
            return this.vars[this.keys[this.currentKey]];
        };
        this.iteratePosition = function () {
            if (this.i_position === null)
                return this.i_position = this.i_total - this.i_iterate;
            return this.i_position;
        };

        this.iterate = function (nb, offset, rewind) {
            var nb = (nb) ? nb : null;
            var offset = (offset) ? offset : null;
            var rewind = (rewind) ? rewind : false;

            if (!this.instanceOfTemplateData)
                return null;
            if ((/boolean|number|string/).test(typeof this.vars))
                return null;
            if (this.i_iterate == null) {
                if (rewind) {
                    this.end();
                } else {
                    this.reset();
                }
                if (offset) {
                    if (offset > this.count()) {
                        return null;
                    } else {
                        for (var i = 0; i != offset; i++) {
                            if (rewind)
                                this.prev();
                            else
                                this.next();
                        }
                    }
                }
                if (nb === null) {
                    this.i_total = this.count();
                    this.i_iterate = this.i_total + 1;
                } else {
                    this.i_iterate = nb + 1;
                    this.i_total = nb;
                }
            }
            this.i_iterate--;
            this.i_position = null;
            var a;
            if (this.i_iterate > 0 && (a = this.current())) {
                if (!rewind)
                    this.next();
                else
                    this.prev();
                a.i_position = this.iteratePosition();
                return a;
            }
            this.i_total = this.i_iterate = null;
            this.reset();
        };
    }
};
