define(["knockout"],function(ko){

var exceptionCatchAll;
(function (exceptionCatchAll) {
    /**
     * Compute Stack Trace From Stack Properties
     */
    var ComputeJQueryAjaxStackProp = (function () {
        function ComputeJQueryAjaxStackProp(error, xhr, settings, errorType) {
            this.results = {};
            this.results.errorType = errorType.toLowerCase();
            this.results.accepts = settings.accepts;
            this.results.isAsync = settings.async;
            this.results.contentType = settings.contentType;
            this.results.dataTypes = settings.dataTypes;
            this.results.hasContent = settings.hasContent;
            this.results.isLocal = settings.isLocal;
            this.results.canProcessData = settings.processData;
            this.results.requestType = settings.type;
            this.results.url = settings.url;
            this.results.readyState = xhr.readyState;
            this.results.status = xhr.status;
            this.results.statusText = xhr.statusText;
            this.results.state = xhr.state();
            this.results.mode = 'ajax-stack';
            this.results.name = this.results.errorType;
            this.results.message = 'request (\'' + this.results.url + '\') return status code:' + this.results.status + ' with a state of ' + this.results.state;
            this.results.stack = [];
            if (this.results.errorType) {
                this.results.errorTypeCallback = this.results.errorType.toLowerCase();
            }
            if (this.results.status) {
                this.results.errorStatusCallback = this.results.status;
            }
            if (this.results.statusText) {
                this.results.errorStatusTextCallback = this.results.statusText.toLowerCase();
            }
            if (this.results.state) {
                this.results.errorStateCallback = this.results.state.toLowerCase();
            }
            this.results.response = ComputeJQueryAjaxStackProp.parseResponse(xhr.responseText, this.results, xhr);
        }
        ComputeJQueryAjaxStackProp.parseResponse = function (response, trace, xhr) {
            return response;
        };
        ComputeJQueryAjaxStackProp.prototype.toJSON = function () {
            return this.getResults();
        };
        ComputeJQueryAjaxStackProp.prototype.toString = function () {
            return JSON.stringify(this.getResults());
        };
        ComputeJQueryAjaxStackProp.prototype.toFormattedString = function () {
            return JSON.stringify(this.getResults(), null, '\t');
        };
        ComputeJQueryAjaxStackProp.prototype.getResults = function () {
            return this.results;
        };
        return ComputeJQueryAjaxStackProp;
    })();
    exceptionCatchAll.ComputeJQueryAjaxStackProp = ComputeJQueryAjaxStackProp;
})(exceptionCatchAll || (exceptionCatchAll = {}));

var exceptionCatchAll;
(function (exceptionCatchAll) {
    function isInnerError(error) {
        if (error && error.innerError) {
            return true;
        }
    }
    function isReferenceError(error) {
        if (!isInnerError(error) || !error.innerError.constructor) {
            return false;
        }
        if (error.innerError.constructor.name === 'ReferenceError') {
            return true;
        }
    }
    /**
     * Compute Stack Trace From Stack Properties
     */
    var ComputeStackTraceFromStackProp = (function () {
        function ComputeStackTraceFromStackProp(error) {
            this.results = {};
            if (!error.stack) {
                return null;
            }
            var chrome = /^\s*at (?:((?:\[object object\])?\S+(?: \[as \S+\])?) )?\(?((?:file|http|https):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
            var lines = error.stack.split('\n');
            var stackParts = [];
            var parts;
            var element;
            var modaType = 'javascript-stack';
            for (var i = 0, j = lines.length; i < j; ++i) {
                var _ = '|';
                if ((parts = chrome.exec(lines[i]))) {
                    element = {
                        'url': parts[2],
                        'func': parts[1] || '?',
                        'line': +parts[3],
                        'column': parts[4] ? +parts[4] : null
                    };
                    element.log = element.url + _ + element.line + _ + element.func;
                }
                else {
                    continue;
                }
                stackParts.push(element);
            }
            if (stackParts.length) {
                error.message = error.message || '';
                this.results = {
                    mode: modaType,
                    name: error.name,
                    message: error.message,
                    stack: stackParts,
                };
                var messageKey = error.message.toLowerCase();
                if (exceptionCatchAll._has(exceptionCatchAll.Constant.knownMessage, messageKey)) {
                    this.results.possibleCause = exceptionCatchAll.Constant.knownMessage[messageKey];
                }
            }
            if (isReferenceError(error)) {
                this.results.reference = new ComputeStackTraceFromStackProp(error.innerError);
                this.results.requireMap = error.innerError.requireMap;
                this.results.requireType = error.innerError.requireType;
                this.results.requireModules = error.innerError.requireModules;
            }
            else if (isInnerError(error)) {
                this.results.reference = new ComputeStackTraceFromStackProp(error.innerError);
                this.results.requireMap = error.innerError.requireMap;
                this.results.requireType = error.innerError.requireType;
                this.results.requireModules = error.innerError.requireModules;
            }
            else if (error && error.stack) {
            }
            this.results.error = error;
            return this;
        }
        ComputeStackTraceFromStackProp.prototype.toJSON = function () {
            return this.getResults();
        };
        ComputeStackTraceFromStackProp.prototype.toString = function () {
            return JSON.stringify(this.getResults());
        };
        ComputeStackTraceFromStackProp.prototype.toFormattedString = function () {
            return JSON.stringify(this.getResults(), null, '\t');
        };
        ComputeStackTraceFromStackProp.prototype.getResults = function () {
            return this.results;
        };
        return ComputeStackTraceFromStackProp;
    })();
    exceptionCatchAll.ComputeStackTraceFromStackProp = ComputeStackTraceFromStackProp;
})(exceptionCatchAll || (exceptionCatchAll = {}));

var exceptionCatchAll;
(function (exceptionCatchAll) {
    /**
     * OnWindowError Class
     */
    var Constant = (function () {
        function Constant() {
        }
        Constant.knownMessage = {
            "cannot read property 'router' of undefined": 'required class is returning undefined object can\'t create route'
        };
        Constant.colors = {
            'bold': [1, 22],
            'italic': [3, 23],
            'underline': [4, 24],
            'inverse': [7, 27],
            'white': [37, 39],
            'grey': [90, 39],
            'black': [30, 39],
            'blue': [34, 39],
            'cyan': [36, 39],
            'green': [32, 39],
            'magenta': [35, 39],
            'red': [31, 39],
            'yellow': [33, 39]
        };
        // Don't use 'blue' not visible on cmd.exe
        Constant.styles = {
            'special': 'cyan',
            'number': 'yellow',
            'boolean': 'yellow',
            'undefined': 'grey',
            'null': 'bold',
            'string': 'green',
            'date': 'magenta',
            // "name": intentionally not styling
            'regexp': 'red'
        };
        Constant.FIREFOX_SAFARI_STACK_REGEXP = /\S+\:\d+/;
        Constant.CHROME_IE_STACK_REGEXP = /\s+at /;
        return Constant;
    })();
    exceptionCatchAll.Constant = Constant;
})(exceptionCatchAll || (exceptionCatchAll = {}));

var exceptionCatchAll;
(function (exceptionCatchAll) {
    /**
     * OnWindowError Class
     */
    var errorReporter = (function () {
        function errorReporter() {
        }
        errorReporter.silence = function () {
            window.onerror = function () {
                return true;
            };
        };
        errorReporter.count = 0;
        return errorReporter;
    })();
    exceptionCatchAll.errorReporter = errorReporter;
})(exceptionCatchAll || (exceptionCatchAll = {}));

var exceptionCatchAll;
(function (exceptionCatchAll) {
    /**
     * Agent Helpers
     */
    function getUserInfo() {
        return {
            platform: navigator.platform,
            browserData: navigator.userAgent,
            browserName: navigator.appCodeName,
        };
    }
    exceptionCatchAll.getUserInfo = getUserInfo;
    function notifyMe(name, message, data, icon) {
        if (exceptionCatchAll.property.stopDesktopNotication) {
            return;
        }
        exceptionCatchAll.notifyWindowDesktop({
            title: 'An ' + name + ' has occurred',
            icon: icon,
            body: message,
            onClick: function () {
                if (typeof (data) === 'function') {
                    data(name, message, data, icon);
                }
                else if (typeof (data) === 'object') {
                    console.info(JSON.stringify(data, null, '\t'));
                }
            }
        });
    }
    exceptionCatchAll.notifyMe = notifyMe;
    /**
     * Document Helpers
     */
    function getDocumentInfo() {
        var documentWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var documentHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        return {
            domain: document.domain,
            viewport: documentWidth + ' x ' + documentHeight,
            documentUrl: document.URL,
            currentUrl: document.location.href,
            cookie: document.cookie,
        };
    }
    exceptionCatchAll.getDocumentInfo = getDocumentInfo;
    function replaceWindowObject(fnName) {
        var originalFn = window[fnName];
        window[fnName] = function replaceWindowObject$$Callback() {
            // Make a copy of the arguments
            var args = Array.prototype.slice.call(arguments);
            if (typeof (args) === 'function') {
            }
            originalFn.apply(this, args);
        };
    }
    exceptionCatchAll.replaceWindowObject = replaceWindowObject;
    function _has(object, key) {
        return Object.prototype.hasOwnProperty.call(object, key);
    }
    exceptionCatchAll._has = _has;
    function escapeRegExp(text) {
        return text.replace(/[\-\[\]{}()*+?.,\\\^$|#]/g, '\\$&');
    }
    exceptionCatchAll.escapeRegExp = escapeRegExp;
    function escapeCodeAsRegExpForMatchingInsideHTML(body) {
        return escapeRegExp(body).replace('<', '(?:<|&lt;)').replace('>', '(?:>|&gt;)').replace('&', '(?:&|&amp;)').replace('"', '(?:"|&quot;)').replace(/\s+/g, '\\s+');
    }
    exceptionCatchAll.escapeCodeAsRegExpForMatchingInsideHTML = escapeCodeAsRegExpForMatchingInsideHTML;
    function escapeHtml(html) {
        return String(html).replace(/&(?!\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    exceptionCatchAll.escapeHtml = escapeHtml;
    function objectToString(o) {
        return Object.prototype.toString.call(o);
    }
    exceptionCatchAll.objectToString = objectToString;
    function stylizeWithColor(str, styleType) {
        var style = exceptionCatchAll.Constant.styles[styleType];
        if (style) {
            return '\033[' + exceptionCatchAll.Constant.colors[style][0] + 'm' + str + '\033[' + exceptionCatchAll.Constant.colors[style][1] + 'm';
        }
        else {
            return str;
        }
    }
    /**
     * Helpers
     */
    function isArray(obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    }
    exceptionCatchAll.isArray = isArray;
    ;
    /**
     * Make the bytes human readable if needed.
     *
     * @param {Number} b Bytes
     * @returns {String|Number}
     * @api private
     */
    function bytes(b) {
        var tb = ((1 << 30) * 1024), gb = 1 << 30, mb = 1 << 20, kb = 1 << 10, abs = Math.abs(b);
        if (abs >= tb)
            return (Math.round(b / tb * 100) / 100) + 'tb';
        if (abs >= gb)
            return (Math.round(b / gb * 100) / 100) + 'gb';
        if (abs >= mb)
            return (Math.round(b / mb * 100) / 100) + 'mb';
        if (abs >= kb)
            return (Math.round(b / kb * 100) / 100) + 'kb';
        return b + 'b';
    }
    function isExcludedFile(filename) {
        //return filename.match(value) ? true : false;
    }
    function inherits(ctor, superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
    }
    ;
    function isSameDomain(url) {
        return url.indexOf(location.hostname) !== -1;
    }
    function extend(origin, add) {
        // Don't do anything if add isn't an object
        if (!add)
            return origin;
        var keys = Object.keys(add);
        var i = keys.length;
        while (i--) {
            origin[keys[i]] = add[keys[i]];
        }
        return origin;
    }
    ;
})(exceptionCatchAll || (exceptionCatchAll = {}));

var exceptionCatchAll;
(function (exceptionCatchAll) {
    /**
     * Document Helpers
     */
    var lastException = ko.observable();
    var subscriptions = [];
    function getLastException(options) {
        return lastException();
    }
    exceptionCatchAll.getLastException = getLastException;
    function setLastException(value) {
        lastException(value);
    }
    exceptionCatchAll.setLastException = setLastException;
    function onExceptionType(eventType, callback, scope) {
        scope = scope || this;
        subscriptions.push(lastException.subscribe(callback, scope, eventType));
    }
    exceptionCatchAll.onExceptionType = onExceptionType;
    function onException(callback) {
        subscriptions.push(lastException.subscribe(callback));
    }
    exceptionCatchAll.onException = onException;
    function disposeSubscriptions() {
        var index, subscribe, _disposeOf, _i, _len;
        _disposeOf = subscriptions.filter(function (subscribe) {
            return subscribe;
        });
        for (index = _i = 0, _len = _disposeOf.length; _i < _len; index = ++_i) {
            subscribe = _disposeOf[index];
            subscribe.dispose();
            subscriptions[index] = null;
        }
        _disposeOf = null;
    }
    ;
    function dispose() {
        disposeSubscriptions();
    }
    exceptionCatchAll.dispose = dispose;
    ;
    function notifyWindowDesktop(options) {
        var title = options.title;
        var icon = options.icon;
        var body = options.body;
        var onClick = options.onClick;
        if (!Notification) {
            alert('Please use a modern version of Chrome, Firefox, Opera or Firefox.');
            return;
        }
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
        var notification = new Notification(title, {
            icon: icon,
            body: body,
        });
        notification.onclick = function () {
            var args = Array.prototype.slice.call(arguments);
            if (typeof (onClick) === 'function') {
                onClick.apply(onClick, args);
            }
        };
    }
    exceptionCatchAll.notifyWindowDesktop = notifyWindowDesktop;
})(exceptionCatchAll || (exceptionCatchAll = {}));

///<reference path="computeStackTraceFromStackProp.ts" />
///<reference path="notify.ts" />
var exceptionCatchAll;
(function (exceptionCatchAll) {
    /**
     * OnWindowError Class
     */
    var onWindowError = (function () {
        function onWindowError() {
        }
        onWindowError.notifyHandlers = function () {
            if (exceptionCatchAll.property.isProductionEnv) {
                return null;
            }
            var documentInfo = exceptionCatchAll.getDocumentInfo();
            var userInfo = exceptionCatchAll.getUserInfo();
            var timestamp = (new Date()).toString();
            var args = Array.prototype.slice.call(arguments);
            var message;
            var fileUrl;
            var linenumber;
            var columnNumber;
            var error;
            var caller = arguments.callee;
            exceptionCatchAll.errorReporter.count += 1;
            if (args.length === 5) {
                message = args[0];
                fileUrl = args[1];
                linenumber = args[2];
                columnNumber = args[3];
                error = args[4];
            }
            else {
                console.error('unhandled error exception');
                return false;
            }
            var trace = new exceptionCatchAll.ComputeStackTraceFromStackProp(error).getResults();
            trace.document = documentInfo;
            trace.user = userInfo;
            trace.timestamp = timestamp;
            exceptionCatchAll.setLastException(trace);
            exceptionCatchAll.notifyMe(trace.name, trace.message, trace, exceptionCatchAll.property.icon);
            if (console && console.debug) {
                console.debug(trace);
            }
            return exceptionCatchAll.property.stopPropagateError;
        };
        onWindowError.subscribe = function () {
            window.onerror = onWindowError.notifyHandlers;
        };
        onWindowError.unsubscribe = function () {
            window.onerror = null;
        };
        return onWindowError;
    })();
    exceptionCatchAll.onWindowError = onWindowError;
})(exceptionCatchAll || (exceptionCatchAll = {}));

///<reference path="computeStackTraceFromStackProp.ts" />
///<reference path="notify.ts" />
var exceptionCatchAll;
(function (exceptionCatchAll) {
    var defineStatusTextNamespace = 'statustext$$';
    var defineStatusNamespace = 'status$$';
    var defineStateNamespace = 'state$$';
    var defineTypeNamespace = 'type$$';
    function getDefineStatus(name) {
        return onJQueryAjaxError.errorTypeCallback[defineStatusNamespace + name];
    }
    function getDefineStatusText(name) {
        return onJQueryAjaxError.errorTypeCallback[defineStatusTextNamespace + name];
    }
    function getDefineState(name, callback) {
        return onJQueryAjaxError.errorTypeCallback[defineStateNamespace + name];
    }
    function getDefineType(name, callback) {
        return onJQueryAjaxError.errorTypeCallback[defineTypeNamespace + name];
    }
    /**
     * On jQuery Ajax Error Class
     */
    var onJQueryAjaxError = (function () {
        function onJQueryAjaxError() {
        }
        onJQueryAjaxError.checkContentType = function (xhr) {
            return xhr.getRepsonseHeader('Content-Type');
        };
        onJQueryAjaxError.getResponse = function (xhr) {
        };
        onJQueryAjaxError.parseResponse = function (callback) {
            if (typeof (callback) === 'function') {
                exceptionCatchAll.ComputeJQueryAjaxStackProp.parseResponse = callback;
            }
        };
        onJQueryAjaxError.isDefaultContextType = function (xhr) {
            onJQueryAjaxError.checkContentType(xhr) === onJQueryAjaxError.defaultContextType;
        };
        onJQueryAjaxError.elseCatchAll = function (error, xhr, settings, errorType) {
            console.debug('===>', error, xhr, settings, errorType);
        };
        onJQueryAjaxError.notify = function () {
            if (exceptionCatchAll.property.isProductionEnv) {
                return null;
            }
            var documentInfo = exceptionCatchAll.getDocumentInfo();
            var userInfo = exceptionCatchAll.getUserInfo();
            var timestamp = (new Date()).toString();
            var args = Array.prototype.slice.call(arguments);
            var error;
            var xhr;
            var settings;
            var errorType;
            if (args.length === 4) {
                error = args[0];
                xhr = args[1];
                settings = args[2];
                errorType = args[3];
            }
            else {
                console.error('unhandled error exception');
                return false;
            }
            exceptionCatchAll.errorReporter.count += 1;
            var trace = new exceptionCatchAll.ComputeJQueryAjaxStackProp(error, xhr, settings, errorType).getResults();
            trace.document = documentInfo;
            trace.user = userInfo;
            trace.timestamp = timestamp;
            exceptionCatchAll.setLastException(trace);
            var handlerKeys = Object.keys(onJQueryAjaxError.errorTypeCallback);
            var callErrorLog = function (type, handler) {
                if (handlerKeys.indexOf(type)) {
                    var callback = handler(type);
                    if (callback && typeof (callback) === 'function') {
                        callback.apply(callback, args);
                    }
                }
            };
            callErrorLog(trace.errorStatusCallback, getDefineStatus);
            callErrorLog(trace.errorStateCallback, getDefineState);
            callErrorLog(trace.errorTypeCallback, getDefineType);
            callErrorLog(trace.errorStatusTextCallback, getDefineStatusText);
            exceptionCatchAll.notifyMe(trace.name, trace.message, trace, exceptionCatchAll.property.icon);
            if (console && console.debug) {
                console.debug(trace);
            }
        };
        onJQueryAjaxError.subscribe = function () {
            jQuery(document).ajaxError(onJQueryAjaxError.notify);
        };
        onJQueryAjaxError.unsubscribe = function () {
        };
        onJQueryAjaxError.defineStatus = function (name, callback) {
            if (!name || typeof (callback) !== 'function') {
                throw new Error('missing params');
                return;
            }
            onJQueryAjaxError.errorTypeCallback[defineStatusNamespace + name] = callback;
        };
        onJQueryAjaxError.defineStatusText = function (name, callback) {
            if (!name || typeof (callback) !== 'function') {
                throw new Error('missing params');
                return;
            }
            onJQueryAjaxError.errorTypeCallback[defineStatusTextNamespace + name] = callback;
        };
        onJQueryAjaxError.defineState = function (name, callback) {
            if (!name || typeof (callback) !== 'function') {
                throw new Error('missing params');
                return;
            }
            onJQueryAjaxError.errorTypeCallback[defineStateNamespace + name] = callback;
        };
        onJQueryAjaxError.defineType = function (name, callback) {
            if (!name || typeof (callback) !== 'function') {
                throw new Error('missing params');
                return;
            }
            onJQueryAjaxError.errorTypeCallback[defineTypeNamespace + name] = callback;
        };
        onJQueryAjaxError.errorTypeCallback = {};
        onJQueryAjaxError.defaultContextType = 'application/json';
        return onJQueryAjaxError;
    })();
    exceptionCatchAll.onJQueryAjaxError = onJQueryAjaxError;
})(exceptionCatchAll || (exceptionCatchAll = {}));

///<reference path="onWindowException.ts" />
///<reference path="onJQueryAjaxException.ts" />
///<reference path="errorReporter.ts" />
var exceptionCatchAll;
(function (exceptionCatchAll) {
    var property = (function () {
        function property() {
        }
        property.stopDesktopNotication = true;
        property.stopPropagateError = false;
        property.isProductionEnv = false;
        property.isLabEnv = false;
        property.icon = 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png';
        return property;
    })();
    exceptionCatchAll.property = property;
})(exceptionCatchAll || (exceptionCatchAll = {}));

return exceptionCatchAll;

});
