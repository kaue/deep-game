System.registerDynamic('npm:socket.io-client@1.4.5/lib/url.js', ['npm:parseuri@0.0.4.js', 'npm:debug@2.2.0.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;

  /**
   * Module dependencies.
   */

  var parseuri = $__require('npm:parseuri@0.0.4.js');
  var debug = $__require('npm:debug@2.2.0.js')('socket.io-client:url');

  /**
   * Module exports.
   */

  module.exports = url;

  /**
   * URL parser.
   *
   * @param {String} url
   * @param {Object} An object meant to mimic window.location.
   *                 Defaults to window.location.
   * @api public
   */

  function url(uri, loc) {
    var obj = uri;

    // default to window.location
    var loc = loc || global.location;
    if (null == uri) uri = loc.protocol + '//' + loc.host;

    // relative path support
    if ('string' == typeof uri) {
      if ('/' == uri.charAt(0)) {
        if ('/' == uri.charAt(1)) {
          uri = loc.protocol + uri;
        } else {
          uri = loc.host + uri;
        }
      }

      if (!/^(https?|wss?):\/\//.test(uri)) {
        debug('protocol-less url %s', uri);
        if ('undefined' != typeof loc) {
          uri = loc.protocol + '//' + uri;
        } else {
          uri = 'https://' + uri;
        }
      }

      // parse
      debug('parse %s', uri);
      obj = parseuri(uri);
    }

    // make sure we treat `localhost:80` and `localhost` equally
    if (!obj.port) {
      if (/^(http|ws)$/.test(obj.protocol)) {
        obj.port = '80';
      } else if (/^(http|ws)s$/.test(obj.protocol)) {
        obj.port = '443';
      }
    }

    obj.path = obj.path || '/';

    var ipv6 = obj.host.indexOf(':') !== -1;
    var host = ipv6 ? '[' + obj.host + ']' : obj.host;

    // define unique id
    obj.id = obj.protocol + '://' + host + ':' + obj.port;
    // define href
    obj.href = obj.protocol + '://' + host + (loc && loc.port == obj.port ? '' : ':' + obj.port);

    return obj;
  }
  return module.exports;
});
System.registerDynamic('npm:engine.io-client@1.6.8/lib/transports/polling-xhr.js', ['npm:engine.io-client@1.6.8/lib/xmlhttprequest.js', 'npm:engine.io-client@1.6.8/lib/transports/polling.js', 'npm:component-emitter@1.1.2.js', 'npm:component-inherit@0.0.3.js', 'npm:debug@2.2.0.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var XMLHttpRequest = $__require('npm:engine.io-client@1.6.8/lib/xmlhttprequest.js');
  var Polling = $__require('npm:engine.io-client@1.6.8/lib/transports/polling.js');
  var Emitter = $__require('npm:component-emitter@1.1.2.js');
  var inherit = $__require('npm:component-inherit@0.0.3.js');
  var debug = $__require('npm:debug@2.2.0.js')('engine.io-client:polling-xhr');
  module.exports = XHR;
  module.exports.Request = Request;
  function empty() {}
  function XHR(opts) {
    Polling.call(this, opts);
    if (global.location) {
      var isSSL = 'https:' == location.protocol;
      var port = location.port;
      if (!port) {
        port = isSSL ? 443 : 80;
      }
      this.xd = opts.hostname != global.location.hostname || port != opts.port;
      this.xs = opts.secure != isSSL;
    } else {
      this.extraHeaders = opts.extraHeaders;
    }
  }
  inherit(XHR, Polling);
  XHR.prototype.supportsBinary = true;
  XHR.prototype.request = function (opts) {
    opts = opts || {};
    opts.uri = this.uri();
    opts.xd = this.xd;
    opts.xs = this.xs;
    opts.agent = this.agent || false;
    opts.supportsBinary = this.supportsBinary;
    opts.enablesXDR = this.enablesXDR;
    opts.pfx = this.pfx;
    opts.key = this.key;
    opts.passphrase = this.passphrase;
    opts.cert = this.cert;
    opts.ca = this.ca;
    opts.ciphers = this.ciphers;
    opts.rejectUnauthorized = this.rejectUnauthorized;
    opts.extraHeaders = this.extraHeaders;
    return new Request(opts);
  };
  XHR.prototype.doWrite = function (data, fn) {
    var isBinary = typeof data !== 'string' && data !== undefined;
    var req = this.request({
      method: 'POST',
      data: data,
      isBinary: isBinary
    });
    var self = this;
    req.on('success', fn);
    req.on('error', function (err) {
      self.onError('xhr post error', err);
    });
    this.sendXhr = req;
  };
  XHR.prototype.doPoll = function () {
    debug('xhr poll');
    var req = this.request();
    var self = this;
    req.on('data', function (data) {
      self.onData(data);
    });
    req.on('error', function (err) {
      self.onError('xhr poll error', err);
    });
    this.pollXhr = req;
  };
  function Request(opts) {
    this.method = opts.method || 'GET';
    this.uri = opts.uri;
    this.xd = !!opts.xd;
    this.xs = !!opts.xs;
    this.async = false !== opts.async;
    this.data = undefined != opts.data ? opts.data : null;
    this.agent = opts.agent;
    this.isBinary = opts.isBinary;
    this.supportsBinary = opts.supportsBinary;
    this.enablesXDR = opts.enablesXDR;
    this.pfx = opts.pfx;
    this.key = opts.key;
    this.passphrase = opts.passphrase;
    this.cert = opts.cert;
    this.ca = opts.ca;
    this.ciphers = opts.ciphers;
    this.rejectUnauthorized = opts.rejectUnauthorized;
    this.extraHeaders = opts.extraHeaders;
    this.create();
  }
  Emitter(Request.prototype);
  Request.prototype.create = function () {
    var opts = {
      agent: this.agent,
      xdomain: this.xd,
      xscheme: this.xs,
      enablesXDR: this.enablesXDR
    };
    opts.pfx = this.pfx;
    opts.key = this.key;
    opts.passphrase = this.passphrase;
    opts.cert = this.cert;
    opts.ca = this.ca;
    opts.ciphers = this.ciphers;
    opts.rejectUnauthorized = this.rejectUnauthorized;
    var xhr = this.xhr = new XMLHttpRequest(opts);
    var self = this;
    try {
      debug('xhr open %s: %s', this.method, this.uri);
      xhr.open(this.method, this.uri, this.async);
      try {
        if (this.extraHeaders) {
          xhr.setDisableHeaderCheck(true);
          for (var i in this.extraHeaders) {
            if (this.extraHeaders.hasOwnProperty(i)) {
              xhr.setRequestHeader(i, this.extraHeaders[i]);
            }
          }
        }
      } catch (e) {}
      if (this.supportsBinary) {
        xhr.responseType = 'arraybuffer';
      }
      if ('POST' == this.method) {
        try {
          if (this.isBinary) {
            xhr.setRequestHeader('Content-type', 'application/octet-stream');
          } else {
            xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
          }
        } catch (e) {}
      }
      if ('withCredentials' in xhr) {
        xhr.withCredentials = true;
      }
      if (this.hasXDR()) {
        xhr.onload = function () {
          self.onLoad();
        };
        xhr.onerror = function () {
          self.onError(xhr.responseText);
        };
      } else {
        xhr.onreadystatechange = function () {
          if (4 != xhr.readyState) return;
          if (200 == xhr.status || 1223 == xhr.status) {
            self.onLoad();
          } else {
            setTimeout(function () {
              self.onError(xhr.status);
            }, 0);
          }
        };
      }
      debug('xhr data %s', this.data);
      xhr.send(this.data);
    } catch (e) {
      setTimeout(function () {
        self.onError(e);
      }, 0);
      return;
    }
    if (global.document) {
      this.index = Request.requestsCount++;
      Request.requests[this.index] = this;
    }
  };
  Request.prototype.onSuccess = function () {
    this.emit('success');
    this.cleanup();
  };
  Request.prototype.onData = function (data) {
    this.emit('data', data);
    this.onSuccess();
  };
  Request.prototype.onError = function (err) {
    this.emit('error', err);
    this.cleanup(true);
  };
  Request.prototype.cleanup = function (fromError) {
    if ('undefined' == typeof this.xhr || null === this.xhr) {
      return;
    }
    if (this.hasXDR()) {
      this.xhr.onload = this.xhr.onerror = empty;
    } else {
      this.xhr.onreadystatechange = empty;
    }
    if (fromError) {
      try {
        this.xhr.abort();
      } catch (e) {}
    }
    if (global.document) {
      delete Request.requests[this.index];
    }
    this.xhr = null;
  };
  Request.prototype.onLoad = function () {
    var data;
    try {
      var contentType;
      try {
        contentType = this.xhr.getResponseHeader('Content-Type').split(';')[0];
      } catch (e) {}
      if (contentType === 'application/octet-stream') {
        data = this.xhr.response;
      } else {
        if (!this.supportsBinary) {
          data = this.xhr.responseText;
        } else {
          try {
            data = String.fromCharCode.apply(null, new Uint8Array(this.xhr.response));
          } catch (e) {
            var ui8Arr = new Uint8Array(this.xhr.response);
            var dataArray = [];
            for (var idx = 0, length = ui8Arr.length; idx < length; idx++) {
              dataArray.push(ui8Arr[idx]);
            }
            data = String.fromCharCode.apply(null, dataArray);
          }
        }
      }
    } catch (e) {
      this.onError(e);
    }
    if (null != data) {
      this.onData(data);
    }
  };
  Request.prototype.hasXDR = function () {
    return 'undefined' !== typeof global.XDomainRequest && !this.xs && this.enablesXDR;
  };
  Request.prototype.abort = function () {
    this.cleanup();
  };
  if (global.document) {
    Request.requestsCount = 0;
    Request.requests = {};
    if (global.attachEvent) {
      global.attachEvent('onunload', unloadHandler);
    } else if (global.addEventListener) {
      global.addEventListener('beforeunload', unloadHandler, false);
    }
  }
  function unloadHandler() {
    for (var i in Request.requests) {
      if (Request.requests.hasOwnProperty(i)) {
        Request.requests[i].abort();
      }
    }
  }
  return module.exports;
});
System.registerDynamic('npm:has-cors@1.1.0/index.js', [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;

  /**
   * Module exports.
   *
   * Logic borrowed from Modernizr:
   *
   *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
   */

  try {
    module.exports = typeof XMLHttpRequest !== 'undefined' && 'withCredentials' in new XMLHttpRequest();
  } catch (err) {
    // if XMLHttp support is disabled in IE then it will throw
    // when trying to create
    module.exports = false;
  }
  return module.exports;
});
System.registerDynamic("npm:has-cors@1.1.0.js", ["npm:has-cors@1.1.0/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:has-cors@1.1.0/index.js");
  return module.exports;
});
System.registerDynamic('npm:engine.io-client@1.6.8/lib/xmlhttprequest.js', ['npm:has-cors@1.1.0.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  // browser shim for xmlhttprequest module
  var hasCORS = $__require('npm:has-cors@1.1.0.js');

  module.exports = function (opts) {
    var xdomain = opts.xdomain;

    // scheme must be same when usign XDomainRequest
    // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
    var xscheme = opts.xscheme;

    // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
    // https://github.com/Automattic/engine.io-client/pull/217
    var enablesXDR = opts.enablesXDR;

    // XMLHttpRequest can be disabled on IE
    try {
      if ('undefined' != typeof XMLHttpRequest && (!xdomain || hasCORS)) {
        return new XMLHttpRequest();
      }
    } catch (e) {}

    // Use XDomainRequest for IE8 if enablesXDR is true
    // because loading bar keeps flashing when using jsonp-polling
    // https://github.com/yujiosaka/socke.io-ie8-loading-example
    try {
      if ('undefined' != typeof XDomainRequest && !xscheme && enablesXDR) {
        return new XDomainRequest();
      }
    } catch (e) {}

    if (!xdomain) {
      try {
        return new ActiveXObject('Microsoft.XMLHTTP');
      } catch (e) {}
    }
  };
  return module.exports;
});
System.registerDynamic('npm:engine.io-client@1.6.8/lib/transports/polling.js', ['npm:engine.io-client@1.6.8/lib/transport.js', 'npm:parseqs@0.0.2.js', 'npm:engine.io-parser@1.2.4.js', 'npm:component-inherit@0.0.3.js', 'npm:yeast@0.1.2.js', 'npm:debug@2.2.0.js', 'npm:engine.io-client@1.6.8/lib/xmlhttprequest.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var Transport = $__require('npm:engine.io-client@1.6.8/lib/transport.js');
  var parseqs = $__require('npm:parseqs@0.0.2.js');
  var parser = $__require('npm:engine.io-parser@1.2.4.js');
  var inherit = $__require('npm:component-inherit@0.0.3.js');
  var yeast = $__require('npm:yeast@0.1.2.js');
  var debug = $__require('npm:debug@2.2.0.js')('engine.io-client:polling');
  module.exports = Polling;
  var hasXHR2 = function () {
    var XMLHttpRequest = $__require('npm:engine.io-client@1.6.8/lib/xmlhttprequest.js');
    var xhr = new XMLHttpRequest({ xdomain: false });
    return null != xhr.responseType;
  }();
  function Polling(opts) {
    var forceBase64 = opts && opts.forceBase64;
    if (!hasXHR2 || forceBase64) {
      this.supportsBinary = false;
    }
    Transport.call(this, opts);
  }
  inherit(Polling, Transport);
  Polling.prototype.name = 'polling';
  Polling.prototype.doOpen = function () {
    this.poll();
  };
  Polling.prototype.pause = function (onPause) {
    var pending = 0;
    var self = this;
    this.readyState = 'pausing';
    function pause() {
      debug('paused');
      self.readyState = 'paused';
      onPause();
    }
    if (this.polling || !this.writable) {
      var total = 0;
      if (this.polling) {
        debug('we are currently polling - waiting to pause');
        total++;
        this.once('pollComplete', function () {
          debug('pre-pause polling complete');
          --total || pause();
        });
      }
      if (!this.writable) {
        debug('we are currently writing - waiting to pause');
        total++;
        this.once('drain', function () {
          debug('pre-pause writing complete');
          --total || pause();
        });
      }
    } else {
      pause();
    }
  };
  Polling.prototype.poll = function () {
    debug('polling');
    this.polling = true;
    this.doPoll();
    this.emit('poll');
  };
  Polling.prototype.onData = function (data) {
    var self = this;
    debug('polling got data %s', data);
    var callback = function (packet, index, total) {
      if ('opening' == self.readyState) {
        self.onOpen();
      }
      if ('close' == packet.type) {
        self.onClose();
        return false;
      }
      self.onPacket(packet);
    };
    parser.decodePayload(data, this.socket.binaryType, callback);
    if ('closed' != this.readyState) {
      this.polling = false;
      this.emit('pollComplete');
      if ('open' == this.readyState) {
        this.poll();
      } else {
        debug('ignoring poll - transport state "%s"', this.readyState);
      }
    }
  };
  Polling.prototype.doClose = function () {
    var self = this;
    function close() {
      debug('writing close packet');
      self.write([{ type: 'close' }]);
    }
    if ('open' == this.readyState) {
      debug('transport open - closing');
      close();
    } else {
      debug('transport not open - deferring close');
      this.once('open', close);
    }
  };
  Polling.prototype.write = function (packets) {
    var self = this;
    this.writable = false;
    var callbackfn = function () {
      self.writable = true;
      self.emit('drain');
    };
    var self = this;
    parser.encodePayload(packets, this.supportsBinary, function (data) {
      self.doWrite(data, callbackfn);
    });
  };
  Polling.prototype.uri = function () {
    var query = this.query || {};
    var schema = this.secure ? 'https' : 'http';
    var port = '';
    if (false !== this.timestampRequests) {
      query[this.timestampParam] = yeast();
    }
    if (!this.supportsBinary && !query.sid) {
      query.b64 = 1;
    }
    query = parseqs.encode(query);
    if (this.port && ('https' == schema && this.port != 443 || 'http' == schema && this.port != 80)) {
      port = ':' + this.port;
    }
    if (query.length) {
      query = '?' + query;
    }
    var ipv6 = this.hostname.indexOf(':') !== -1;
    return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
  };
  return module.exports;
});
System.registerDynamic('npm:engine.io-client@1.6.8/lib/transports/polling-jsonp.js', ['npm:engine.io-client@1.6.8/lib/transports/polling.js', 'npm:component-inherit@0.0.3.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var Polling = $__require('npm:engine.io-client@1.6.8/lib/transports/polling.js');
  var inherit = $__require('npm:component-inherit@0.0.3.js');
  module.exports = JSONPPolling;
  var rNewline = /\n/g;
  var rEscapedNewline = /\\n/g;
  var callbacks;
  var index = 0;
  function empty() {}
  function JSONPPolling(opts) {
    Polling.call(this, opts);
    this.query = this.query || {};
    if (!callbacks) {
      if (!global.___eio) global.___eio = [];
      callbacks = global.___eio;
    }
    this.index = callbacks.length;
    var self = this;
    callbacks.push(function (msg) {
      self.onData(msg);
    });
    this.query.j = this.index;
    if (global.document && global.addEventListener) {
      global.addEventListener('beforeunload', function () {
        if (self.script) self.script.onerror = empty;
      }, false);
    }
  }
  inherit(JSONPPolling, Polling);
  JSONPPolling.prototype.supportsBinary = false;
  JSONPPolling.prototype.doClose = function () {
    if (this.script) {
      this.script.parentNode.removeChild(this.script);
      this.script = null;
    }
    if (this.form) {
      this.form.parentNode.removeChild(this.form);
      this.form = null;
      this.iframe = null;
    }
    Polling.prototype.doClose.call(this);
  };
  JSONPPolling.prototype.doPoll = function () {
    var self = this;
    var script = document.createElement('script');
    if (this.script) {
      this.script.parentNode.removeChild(this.script);
      this.script = null;
    }
    script.async = true;
    script.src = this.uri();
    script.onerror = function (e) {
      self.onError('jsonp poll error', e);
    };
    var insertAt = document.getElementsByTagName('script')[0];
    if (insertAt) {
      insertAt.parentNode.insertBefore(script, insertAt);
    } else {
      (document.head || document.body).appendChild(script);
    }
    this.script = script;
    var isUAgecko = 'undefined' != typeof navigator && /gecko/i.test(navigator.userAgent);
    if (isUAgecko) {
      setTimeout(function () {
        var iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        document.body.removeChild(iframe);
      }, 100);
    }
  };
  JSONPPolling.prototype.doWrite = function (data, fn) {
    var self = this;
    if (!this.form) {
      var form = document.createElement('form');
      var area = document.createElement('textarea');
      var id = this.iframeId = 'eio_iframe_' + this.index;
      var iframe;
      form.className = 'socketio';
      form.style.position = 'absolute';
      form.style.top = '-1000px';
      form.style.left = '-1000px';
      form.target = id;
      form.method = 'POST';
      form.setAttribute('accept-charset', 'utf-8');
      area.name = 'd';
      form.appendChild(area);
      document.body.appendChild(form);
      this.form = form;
      this.area = area;
    }
    this.form.action = this.uri();
    function complete() {
      initIframe();
      fn();
    }
    function initIframe() {
      if (self.iframe) {
        try {
          self.form.removeChild(self.iframe);
        } catch (e) {
          self.onError('jsonp polling iframe removal error', e);
        }
      }
      try {
        var html = '<iframe src="javascript:0" name="' + self.iframeId + '">';
        iframe = document.createElement(html);
      } catch (e) {
        iframe = document.createElement('iframe');
        iframe.name = self.iframeId;
        iframe.src = 'javascript:0';
      }
      iframe.id = self.iframeId;
      self.form.appendChild(iframe);
      self.iframe = iframe;
    }
    initIframe();
    data = data.replace(rEscapedNewline, '\\\n');
    this.area.value = data.replace(rNewline, '\\n');
    try {
      this.form.submit();
    } catch (e) {}
    if (this.iframe.attachEvent) {
      this.iframe.onreadystatechange = function () {
        if (self.iframe.readyState == 'complete') {
          complete();
        }
      };
    } else {
      this.iframe.onload = complete;
    }
  };
  return module.exports;
});
System.registerDynamic("npm:component-inherit@0.0.3/index.js", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */

  module.exports = function (a, b) {
    var fn = function () {};
    fn.prototype = b.prototype;
    a.prototype = new fn();
    a.prototype.constructor = a;
  };
  return module.exports;
});
System.registerDynamic("npm:component-inherit@0.0.3.js", ["npm:component-inherit@0.0.3/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:component-inherit@0.0.3/index.js");
  return module.exports;
});
System.registerDynamic('npm:yeast@0.1.2/index.js', [], true, function ($__require, exports, module) {
  /* */
  'use strict';

  var define,
      global = this || self,
      GLOBAL = global;
  var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split(''),
      length = 64,
      map = {},
      seed = 0,
      i = 0,
      prev;

  /**
   * Return a string representing the specified number.
   *
   * @param {Number} num The number to convert.
   * @returns {String} The string representation of the number.
   * @api public
   */
  function encode(num) {
    var encoded = '';

    do {
      encoded = alphabet[num % length] + encoded;
      num = Math.floor(num / length);
    } while (num > 0);

    return encoded;
  }

  /**
   * Return the integer value specified by the given string.
   *
   * @param {String} str The string to convert.
   * @returns {Number} The integer value represented by the string.
   * @api public
   */
  function decode(str) {
    var decoded = 0;

    for (i = 0; i < str.length; i++) {
      decoded = decoded * length + map[str.charAt(i)];
    }

    return decoded;
  }

  /**
   * Yeast: A tiny growing id generator.
   *
   * @returns {String} A unique id.
   * @api public
   */
  function yeast() {
    var now = encode(+new Date());

    if (now !== prev) return seed = 0, prev = now;
    return now + '.' + encode(seed++);
  }

  //
  // Map each character to its index.
  //
  for (; i < length; i++) map[alphabet[i]] = i;

  //
  // Expose the `yeast`, `encode` and `decode` functions.
  //
  yeast.encode = encode;
  yeast.decode = decode;
  module.exports = yeast;
  return module.exports;
});
System.registerDynamic("npm:yeast@0.1.2.js", ["npm:yeast@0.1.2/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:yeast@0.1.2/index.js");
  return module.exports;
});
System.registerDynamic('npm:engine.io-client@1.6.8/lib/transports/websocket.js', ['npm:engine.io-client@1.6.8/lib/transport.js', 'npm:engine.io-parser@1.2.4.js', 'npm:parseqs@0.0.2.js', 'npm:component-inherit@0.0.3.js', 'npm:yeast@0.1.2.js', 'npm:debug@2.2.0.js', '@empty'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var Transport = $__require('npm:engine.io-client@1.6.8/lib/transport.js');
  var parser = $__require('npm:engine.io-parser@1.2.4.js');
  var parseqs = $__require('npm:parseqs@0.0.2.js');
  var inherit = $__require('npm:component-inherit@0.0.3.js');
  var yeast = $__require('npm:yeast@0.1.2.js');
  var debug = $__require('npm:debug@2.2.0.js')('engine.io-client:websocket');
  var BrowserWebSocket = global.WebSocket || global.MozWebSocket;
  var WebSocket = BrowserWebSocket;
  if (!WebSocket && typeof window === 'undefined') {
    try {
      WebSocket = $__require('@empty');
    } catch (e) {}
  }
  module.exports = WS;
  function WS(opts) {
    var forceBase64 = opts && opts.forceBase64;
    if (forceBase64) {
      this.supportsBinary = false;
    }
    this.perMessageDeflate = opts.perMessageDeflate;
    Transport.call(this, opts);
  }
  inherit(WS, Transport);
  WS.prototype.name = 'websocket';
  WS.prototype.supportsBinary = true;
  WS.prototype.doOpen = function () {
    if (!this.check()) {
      return;
    }
    var self = this;
    var uri = this.uri();
    var protocols = void 0;
    var opts = {
      agent: this.agent,
      perMessageDeflate: this.perMessageDeflate
    };
    opts.pfx = this.pfx;
    opts.key = this.key;
    opts.passphrase = this.passphrase;
    opts.cert = this.cert;
    opts.ca = this.ca;
    opts.ciphers = this.ciphers;
    opts.rejectUnauthorized = this.rejectUnauthorized;
    if (this.extraHeaders) {
      opts.headers = this.extraHeaders;
    }
    this.ws = BrowserWebSocket ? new WebSocket(uri) : new WebSocket(uri, protocols, opts);
    if (this.ws.binaryType === undefined) {
      this.supportsBinary = false;
    }
    if (this.ws.supports && this.ws.supports.binary) {
      this.supportsBinary = true;
      this.ws.binaryType = 'buffer';
    } else {
      this.ws.binaryType = 'arraybuffer';
    }
    this.addEventListeners();
  };
  WS.prototype.addEventListeners = function () {
    var self = this;
    this.ws.onopen = function () {
      self.onOpen();
    };
    this.ws.onclose = function () {
      self.onClose();
    };
    this.ws.onmessage = function (ev) {
      self.onData(ev.data);
    };
    this.ws.onerror = function (e) {
      self.onError('websocket error', e);
    };
  };
  if ('undefined' != typeof navigator && /iPad|iPhone|iPod/i.test(navigator.userAgent)) {
    WS.prototype.onData = function (data) {
      var self = this;
      setTimeout(function () {
        Transport.prototype.onData.call(self, data);
      }, 0);
    };
  }
  WS.prototype.write = function (packets) {
    var self = this;
    this.writable = false;
    var total = packets.length;
    for (var i = 0, l = total; i < l; i++) {
      (function (packet) {
        parser.encodePacket(packet, self.supportsBinary, function (data) {
          if (!BrowserWebSocket) {
            var opts = {};
            if (packet.options) {
              opts.compress = packet.options.compress;
            }
            if (self.perMessageDeflate) {
              var len = 'string' == typeof data ? global.Buffer.byteLength(data) : data.length;
              if (len < self.perMessageDeflate.threshold) {
                opts.compress = false;
              }
            }
          }
          try {
            if (BrowserWebSocket) {
              self.ws.send(data);
            } else {
              self.ws.send(data, opts);
            }
          } catch (e) {
            debug('websocket closed before onclose event');
          }
          --total || done();
        });
      })(packets[i]);
    }
    function done() {
      self.emit('flush');
      setTimeout(function () {
        self.writable = true;
        self.emit('drain');
      }, 0);
    }
  };
  WS.prototype.onClose = function () {
    Transport.prototype.onClose.call(this);
  };
  WS.prototype.doClose = function () {
    if (typeof this.ws !== 'undefined') {
      this.ws.close();
    }
  };
  WS.prototype.uri = function () {
    var query = this.query || {};
    var schema = this.secure ? 'wss' : 'ws';
    var port = '';
    if (this.port && ('wss' == schema && this.port != 443 || 'ws' == schema && this.port != 80)) {
      port = ':' + this.port;
    }
    if (this.timestampRequests) {
      query[this.timestampParam] = yeast();
    }
    if (!this.supportsBinary) {
      query.b64 = 1;
    }
    query = parseqs.encode(query);
    if (query.length) {
      query = '?' + query;
    }
    var ipv6 = this.hostname.indexOf(':') !== -1;
    return schema + '://' + (ipv6 ? '[' + this.hostname + ']' : this.hostname) + port + this.path + query;
  };
  WS.prototype.check = function () {
    return !!WebSocket && !('__initialize' in WebSocket && this.name === WS.prototype.name);
  };
  return module.exports;
});
System.registerDynamic('npm:engine.io-client@1.6.8/lib/transports/index.js', ['npm:engine.io-client@1.6.8/lib/xmlhttprequest.js', 'npm:engine.io-client@1.6.8/lib/transports/polling-xhr.js', 'npm:engine.io-client@1.6.8/lib/transports/polling-jsonp.js', 'npm:engine.io-client@1.6.8/lib/transports/websocket.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var XMLHttpRequest = $__require('npm:engine.io-client@1.6.8/lib/xmlhttprequest.js');
  var XHR = $__require('npm:engine.io-client@1.6.8/lib/transports/polling-xhr.js');
  var JSONP = $__require('npm:engine.io-client@1.6.8/lib/transports/polling-jsonp.js');
  var websocket = $__require('npm:engine.io-client@1.6.8/lib/transports/websocket.js');
  exports.polling = polling;
  exports.websocket = websocket;
  function polling(opts) {
    var xhr;
    var xd = false;
    var xs = false;
    var jsonp = false !== opts.jsonp;
    if (global.location) {
      var isSSL = 'https:' == location.protocol;
      var port = location.port;
      if (!port) {
        port = isSSL ? 443 : 80;
      }
      xd = opts.hostname != location.hostname || port != opts.port;
      xs = opts.secure != isSSL;
    }
    opts.xdomain = xd;
    opts.xscheme = xs;
    xhr = new XMLHttpRequest(opts);
    if ('open' in xhr && !opts.forceJSONP) {
      return new XHR(opts);
    } else {
      if (!jsonp) throw new Error('JSONP disabled');
      return new JSONP(opts);
    }
  }
  return module.exports;
});
System.registerDynamic('npm:parseuri@0.0.4/index.js', [], true, function ($__require, exports, module) {
    var define,
        global = this || self,
        GLOBAL = global;
    /**
     * Parses an URI
     *
     * @author Steven Levithan <stevenlevithan.com> (MIT license)
     * @api private
     */

    var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

    var parts = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'];

    module.exports = function parseuri(str) {
        var src = str,
            b = str.indexOf('['),
            e = str.indexOf(']');

        if (b != -1 && e != -1) {
            str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
        }

        var m = re.exec(str || ''),
            uri = {},
            i = 14;

        while (i--) {
            uri[parts[i]] = m[i] || '';
        }

        if (b != -1 && e != -1) {
            uri.source = src;
            uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
            uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
            uri.ipv6uri = true;
        }

        return uri;
    };
    return module.exports;
});
System.registerDynamic("npm:parseuri@0.0.4.js", ["npm:parseuri@0.0.4/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:parseuri@0.0.4/index.js");
  return module.exports;
});
System.registerDynamic('npm:parsejson@0.0.1/index.js', [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /**
   * JSON parse.
   *
   * @see Based on jQuery#parseJSON (MIT) and JSON2
   * @api private
   */

  var rvalidchars = /^[\],:{}\s]*$/;
  var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
  var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
  var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
  var rtrimLeft = /^\s+/;
  var rtrimRight = /\s+$/;

  module.exports = function parsejson(data) {
    if ('string' != typeof data || !data) {
      return null;
    }

    data = data.replace(rtrimLeft, '').replace(rtrimRight, '');

    // Attempt to parse using the native JSON parser first
    if (global.JSON && JSON.parse) {
      return JSON.parse(data);
    }

    if (rvalidchars.test(data.replace(rvalidescape, '@').replace(rvalidtokens, ']').replace(rvalidbraces, ''))) {
      return new Function('return ' + data)();
    }
  };
  return module.exports;
});
System.registerDynamic("npm:parsejson@0.0.1.js", ["npm:parsejson@0.0.1/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:parsejson@0.0.1/index.js");
  return module.exports;
});
System.registerDynamic('npm:parseqs@0.0.2/index.js', [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /**
   * Compiles a querystring
   * Returns string representation of the object
   *
   * @param {Object}
   * @api private
   */

  exports.encode = function (obj) {
    var str = '';

    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        if (str.length) str += '&';
        str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
      }
    }

    return str;
  };

  /**
   * Parses a simple querystring into an object
   *
   * @param {String} qs
   * @api private
   */

  exports.decode = function (qs) {
    var qry = {};
    var pairs = qs.split('&');
    for (var i = 0, l = pairs.length; i < l; i++) {
      var pair = pairs[i].split('=');
      qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return qry;
  };
  return module.exports;
});
System.registerDynamic("npm:parseqs@0.0.2.js", ["npm:parseqs@0.0.2/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:parseqs@0.0.2/index.js");
  return module.exports;
});
System.registerDynamic('npm:engine.io-client@1.6.8/lib/transport.js', ['npm:engine.io-parser@1.2.4.js', 'npm:component-emitter@1.1.2.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /**
   * Module dependencies.
   */

  var parser = $__require('npm:engine.io-parser@1.2.4.js');
  var Emitter = $__require('npm:component-emitter@1.1.2.js');

  /**
   * Module exports.
   */

  module.exports = Transport;

  /**
   * Transport abstract constructor.
   *
   * @param {Object} options.
   * @api private
   */

  function Transport(opts) {
    this.path = opts.path;
    this.hostname = opts.hostname;
    this.port = opts.port;
    this.secure = opts.secure;
    this.query = opts.query;
    this.timestampParam = opts.timestampParam;
    this.timestampRequests = opts.timestampRequests;
    this.readyState = '';
    this.agent = opts.agent || false;
    this.socket = opts.socket;
    this.enablesXDR = opts.enablesXDR;

    // SSL options for Node.js client
    this.pfx = opts.pfx;
    this.key = opts.key;
    this.passphrase = opts.passphrase;
    this.cert = opts.cert;
    this.ca = opts.ca;
    this.ciphers = opts.ciphers;
    this.rejectUnauthorized = opts.rejectUnauthorized;

    // other options for Node.js client
    this.extraHeaders = opts.extraHeaders;
  }

  /**
   * Mix in `Emitter`.
   */

  Emitter(Transport.prototype);

  /**
   * Emits an error.
   *
   * @param {String} str
   * @return {Transport} for chaining
   * @api public
   */

  Transport.prototype.onError = function (msg, desc) {
    var err = new Error(msg);
    err.type = 'TransportError';
    err.description = desc;
    this.emit('error', err);
    return this;
  };

  /**
   * Opens the transport.
   *
   * @api public
   */

  Transport.prototype.open = function () {
    if ('closed' == this.readyState || '' == this.readyState) {
      this.readyState = 'opening';
      this.doOpen();
    }

    return this;
  };

  /**
   * Closes the transport.
   *
   * @api private
   */

  Transport.prototype.close = function () {
    if ('opening' == this.readyState || 'open' == this.readyState) {
      this.doClose();
      this.onClose();
    }

    return this;
  };

  /**
   * Sends multiple packets.
   *
   * @param {Array} packets
   * @api private
   */

  Transport.prototype.send = function (packets) {
    if ('open' == this.readyState) {
      this.write(packets);
    } else {
      throw new Error('Transport not open');
    }
  };

  /**
   * Called upon open
   *
   * @api private
   */

  Transport.prototype.onOpen = function () {
    this.readyState = 'open';
    this.writable = true;
    this.emit('open');
  };

  /**
   * Called with data.
   *
   * @param {String} data
   * @api private
   */

  Transport.prototype.onData = function (data) {
    var packet = parser.decodePacket(data, this.socket.binaryType);
    this.onPacket(packet);
  };

  /**
   * Called with a decoded packet.
   */

  Transport.prototype.onPacket = function (packet) {
    this.emit('packet', packet);
  };

  /**
   * Called upon close.
   *
   * @api private
   */

  Transport.prototype.onClose = function () {
    this.readyState = 'closed';
    this.emit('close');
  };
  return module.exports;
});
System.registerDynamic('npm:engine.io-client@1.6.8/lib/socket.js', ['npm:engine.io-client@1.6.8/lib/transports/index.js', 'npm:component-emitter@1.1.2.js', 'npm:debug@2.2.0.js', 'npm:indexof@0.0.1.js', 'npm:engine.io-parser@1.2.4.js', 'npm:parseuri@0.0.4.js', 'npm:parsejson@0.0.1.js', 'npm:parseqs@0.0.2.js', 'npm:engine.io-client@1.6.8/lib/transport.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var transports = $__require('npm:engine.io-client@1.6.8/lib/transports/index.js');
  var Emitter = $__require('npm:component-emitter@1.1.2.js');
  var debug = $__require('npm:debug@2.2.0.js')('engine.io-client:socket');
  var index = $__require('npm:indexof@0.0.1.js');
  var parser = $__require('npm:engine.io-parser@1.2.4.js');
  var parseuri = $__require('npm:parseuri@0.0.4.js');
  var parsejson = $__require('npm:parsejson@0.0.1.js');
  var parseqs = $__require('npm:parseqs@0.0.2.js');
  module.exports = Socket;
  function noop() {}
  function Socket(uri, opts) {
    if (!(this instanceof Socket)) return new Socket(uri, opts);
    opts = opts || {};
    if (uri && 'object' == typeof uri) {
      opts = uri;
      uri = null;
    }
    if (uri) {
      uri = parseuri(uri);
      opts.hostname = uri.host;
      opts.secure = uri.protocol == 'https' || uri.protocol == 'wss';
      opts.port = uri.port;
      if (uri.query) opts.query = uri.query;
    } else if (opts.host) {
      opts.hostname = parseuri(opts.host).host;
    }
    this.secure = null != opts.secure ? opts.secure : global.location && 'https:' == location.protocol;
    if (opts.hostname && !opts.port) {
      opts.port = this.secure ? '443' : '80';
    }
    this.agent = opts.agent || false;
    this.hostname = opts.hostname || (global.location ? location.hostname : 'localhost');
    this.port = opts.port || (global.location && location.port ? location.port : this.secure ? 443 : 80);
    this.query = opts.query || {};
    if ('string' == typeof this.query) this.query = parseqs.decode(this.query);
    this.upgrade = false !== opts.upgrade;
    this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
    this.forceJSONP = !!opts.forceJSONP;
    this.jsonp = false !== opts.jsonp;
    this.forceBase64 = !!opts.forceBase64;
    this.enablesXDR = !!opts.enablesXDR;
    this.timestampParam = opts.timestampParam || 't';
    this.timestampRequests = opts.timestampRequests;
    this.transports = opts.transports || ['polling', 'websocket'];
    this.readyState = '';
    this.writeBuffer = [];
    this.policyPort = opts.policyPort || 843;
    this.rememberUpgrade = opts.rememberUpgrade || false;
    this.binaryType = null;
    this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
    this.perMessageDeflate = false !== opts.perMessageDeflate ? opts.perMessageDeflate || {} : false;
    if (true === this.perMessageDeflate) this.perMessageDeflate = {};
    if (this.perMessageDeflate && null == this.perMessageDeflate.threshold) {
      this.perMessageDeflate.threshold = 1024;
    }
    this.pfx = opts.pfx || null;
    this.key = opts.key || null;
    this.passphrase = opts.passphrase || null;
    this.cert = opts.cert || null;
    this.ca = opts.ca || null;
    this.ciphers = opts.ciphers || null;
    this.rejectUnauthorized = opts.rejectUnauthorized === undefined ? null : opts.rejectUnauthorized;
    var freeGlobal = typeof global == 'object' && global;
    if (freeGlobal.global === freeGlobal) {
      if (opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0) {
        this.extraHeaders = opts.extraHeaders;
      }
    }
    this.open();
  }
  Socket.priorWebsocketSuccess = false;
  Emitter(Socket.prototype);
  Socket.protocol = parser.protocol;
  Socket.Socket = Socket;
  Socket.Transport = $__require('npm:engine.io-client@1.6.8/lib/transport.js');
  Socket.transports = $__require('npm:engine.io-client@1.6.8/lib/transports/index.js');
  Socket.parser = $__require('npm:engine.io-parser@1.2.4.js');
  Socket.prototype.createTransport = function (name) {
    debug('creating transport "%s"', name);
    var query = clone(this.query);
    query.EIO = parser.protocol;
    query.transport = name;
    if (this.id) query.sid = this.id;
    var transport = new transports[name]({
      agent: this.agent,
      hostname: this.hostname,
      port: this.port,
      secure: this.secure,
      path: this.path,
      query: query,
      forceJSONP: this.forceJSONP,
      jsonp: this.jsonp,
      forceBase64: this.forceBase64,
      enablesXDR: this.enablesXDR,
      timestampRequests: this.timestampRequests,
      timestampParam: this.timestampParam,
      policyPort: this.policyPort,
      socket: this,
      pfx: this.pfx,
      key: this.key,
      passphrase: this.passphrase,
      cert: this.cert,
      ca: this.ca,
      ciphers: this.ciphers,
      rejectUnauthorized: this.rejectUnauthorized,
      perMessageDeflate: this.perMessageDeflate,
      extraHeaders: this.extraHeaders
    });
    return transport;
  };
  function clone(obj) {
    var o = {};
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        o[i] = obj[i];
      }
    }
    return o;
  }
  Socket.prototype.open = function () {
    var transport;
    if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') != -1) {
      transport = 'websocket';
    } else if (0 === this.transports.length) {
      var self = this;
      setTimeout(function () {
        self.emit('error', 'No transports available');
      }, 0);
      return;
    } else {
      transport = this.transports[0];
    }
    this.readyState = 'opening';
    try {
      transport = this.createTransport(transport);
    } catch (e) {
      this.transports.shift();
      this.open();
      return;
    }
    transport.open();
    this.setTransport(transport);
  };
  Socket.prototype.setTransport = function (transport) {
    debug('setting transport %s', transport.name);
    var self = this;
    if (this.transport) {
      debug('clearing existing transport %s', this.transport.name);
      this.transport.removeAllListeners();
    }
    this.transport = transport;
    transport.on('drain', function () {
      self.onDrain();
    }).on('packet', function (packet) {
      self.onPacket(packet);
    }).on('error', function (e) {
      self.onError(e);
    }).on('close', function () {
      self.onClose('transport close');
    });
  };
  Socket.prototype.probe = function (name) {
    debug('probing transport "%s"', name);
    var transport = this.createTransport(name, { probe: 1 }),
        failed = false,
        self = this;
    Socket.priorWebsocketSuccess = false;
    function onTransportOpen() {
      if (self.onlyBinaryUpgrades) {
        var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
        failed = failed || upgradeLosesBinary;
      }
      if (failed) return;
      debug('probe transport "%s" opened', name);
      transport.send([{
        type: 'ping',
        data: 'probe'
      }]);
      transport.once('packet', function (msg) {
        if (failed) return;
        if ('pong' == msg.type && 'probe' == msg.data) {
          debug('probe transport "%s" pong', name);
          self.upgrading = true;
          self.emit('upgrading', transport);
          if (!transport) return;
          Socket.priorWebsocketSuccess = 'websocket' == transport.name;
          debug('pausing current transport "%s"', self.transport.name);
          self.transport.pause(function () {
            if (failed) return;
            if ('closed' == self.readyState) return;
            debug('changing transport and sending upgrade packet');
            cleanup();
            self.setTransport(transport);
            transport.send([{ type: 'upgrade' }]);
            self.emit('upgrade', transport);
            transport = null;
            self.upgrading = false;
            self.flush();
          });
        } else {
          debug('probe transport "%s" failed', name);
          var err = new Error('probe error');
          err.transport = transport.name;
          self.emit('upgradeError', err);
        }
      });
    }
    function freezeTransport() {
      if (failed) return;
      failed = true;
      cleanup();
      transport.close();
      transport = null;
    }
    function onerror(err) {
      var error = new Error('probe error: ' + err);
      error.transport = transport.name;
      freezeTransport();
      debug('probe transport "%s" failed because of error: %s', name, err);
      self.emit('upgradeError', error);
    }
    function onTransportClose() {
      onerror("transport closed");
    }
    function onclose() {
      onerror("socket closed");
    }
    function onupgrade(to) {
      if (transport && to.name != transport.name) {
        debug('"%s" works - aborting "%s"', to.name, transport.name);
        freezeTransport();
      }
    }
    function cleanup() {
      transport.removeListener('open', onTransportOpen);
      transport.removeListener('error', onerror);
      transport.removeListener('close', onTransportClose);
      self.removeListener('close', onclose);
      self.removeListener('upgrading', onupgrade);
    }
    transport.once('open', onTransportOpen);
    transport.once('error', onerror);
    transport.once('close', onTransportClose);
    this.once('close', onclose);
    this.once('upgrading', onupgrade);
    transport.open();
  };
  Socket.prototype.onOpen = function () {
    debug('socket open');
    this.readyState = 'open';
    Socket.priorWebsocketSuccess = 'websocket' == this.transport.name;
    this.emit('open');
    this.flush();
    if ('open' == this.readyState && this.upgrade && this.transport.pause) {
      debug('starting upgrade probes');
      for (var i = 0, l = this.upgrades.length; i < l; i++) {
        this.probe(this.upgrades[i]);
      }
    }
  };
  Socket.prototype.onPacket = function (packet) {
    if ('opening' == this.readyState || 'open' == this.readyState) {
      debug('socket receive: type "%s", data "%s"', packet.type, packet.data);
      this.emit('packet', packet);
      this.emit('heartbeat');
      switch (packet.type) {
        case 'open':
          this.onHandshake(parsejson(packet.data));
          break;
        case 'pong':
          this.setPing();
          this.emit('pong');
          break;
        case 'error':
          var err = new Error('server error');
          err.code = packet.data;
          this.onError(err);
          break;
        case 'message':
          this.emit('data', packet.data);
          this.emit('message', packet.data);
          break;
      }
    } else {
      debug('packet received with socket readyState "%s"', this.readyState);
    }
  };
  Socket.prototype.onHandshake = function (data) {
    this.emit('handshake', data);
    this.id = data.sid;
    this.transport.query.sid = data.sid;
    this.upgrades = this.filterUpgrades(data.upgrades);
    this.pingInterval = data.pingInterval;
    this.pingTimeout = data.pingTimeout;
    this.onOpen();
    if ('closed' == this.readyState) return;
    this.setPing();
    this.removeListener('heartbeat', this.onHeartbeat);
    this.on('heartbeat', this.onHeartbeat);
  };
  Socket.prototype.onHeartbeat = function (timeout) {
    clearTimeout(this.pingTimeoutTimer);
    var self = this;
    self.pingTimeoutTimer = setTimeout(function () {
      if ('closed' == self.readyState) return;
      self.onClose('ping timeout');
    }, timeout || self.pingInterval + self.pingTimeout);
  };
  Socket.prototype.setPing = function () {
    var self = this;
    clearTimeout(self.pingIntervalTimer);
    self.pingIntervalTimer = setTimeout(function () {
      debug('writing ping packet - expecting pong within %sms', self.pingTimeout);
      self.ping();
      self.onHeartbeat(self.pingTimeout);
    }, self.pingInterval);
  };
  Socket.prototype.ping = function () {
    var self = this;
    this.sendPacket('ping', function () {
      self.emit('ping');
    });
  };
  Socket.prototype.onDrain = function () {
    this.writeBuffer.splice(0, this.prevBufferLen);
    this.prevBufferLen = 0;
    if (0 === this.writeBuffer.length) {
      this.emit('drain');
    } else {
      this.flush();
    }
  };
  Socket.prototype.flush = function () {
    if ('closed' != this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
      debug('flushing %d packets in socket', this.writeBuffer.length);
      this.transport.send(this.writeBuffer);
      this.prevBufferLen = this.writeBuffer.length;
      this.emit('flush');
    }
  };
  Socket.prototype.write = Socket.prototype.send = function (msg, options, fn) {
    this.sendPacket('message', msg, options, fn);
    return this;
  };
  Socket.prototype.sendPacket = function (type, data, options, fn) {
    if ('function' == typeof data) {
      fn = data;
      data = undefined;
    }
    if ('function' == typeof options) {
      fn = options;
      options = null;
    }
    if ('closing' == this.readyState || 'closed' == this.readyState) {
      return;
    }
    options = options || {};
    options.compress = false !== options.compress;
    var packet = {
      type: type,
      data: data,
      options: options
    };
    this.emit('packetCreate', packet);
    this.writeBuffer.push(packet);
    if (fn) this.once('flush', fn);
    this.flush();
  };
  Socket.prototype.close = function () {
    if ('opening' == this.readyState || 'open' == this.readyState) {
      this.readyState = 'closing';
      var self = this;
      if (this.writeBuffer.length) {
        this.once('drain', function () {
          if (this.upgrading) {
            waitForUpgrade();
          } else {
            close();
          }
        });
      } else if (this.upgrading) {
        waitForUpgrade();
      } else {
        close();
      }
    }
    function close() {
      self.onClose('forced close');
      debug('socket closing - telling transport to close');
      self.transport.close();
    }
    function cleanupAndClose() {
      self.removeListener('upgrade', cleanupAndClose);
      self.removeListener('upgradeError', cleanupAndClose);
      close();
    }
    function waitForUpgrade() {
      self.once('upgrade', cleanupAndClose);
      self.once('upgradeError', cleanupAndClose);
    }
    return this;
  };
  Socket.prototype.onError = function (err) {
    debug('socket error %j', err);
    Socket.priorWebsocketSuccess = false;
    this.emit('error', err);
    this.onClose('transport error', err);
  };
  Socket.prototype.onClose = function (reason, desc) {
    if ('opening' == this.readyState || 'open' == this.readyState || 'closing' == this.readyState) {
      debug('socket close with reason: "%s"', reason);
      var self = this;
      clearTimeout(this.pingIntervalTimer);
      clearTimeout(this.pingTimeoutTimer);
      this.transport.removeAllListeners('close');
      this.transport.close();
      this.transport.removeAllListeners();
      this.readyState = 'closed';
      this.id = null;
      this.emit('close', reason, desc);
      self.writeBuffer = [];
      self.prevBufferLen = 0;
    }
  };
  Socket.prototype.filterUpgrades = function (upgrades) {
    var filteredUpgrades = [];
    for (var i = 0, j = upgrades.length; i < j; i++) {
      if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
    }
    return filteredUpgrades;
  };
  return module.exports;
});
System.registerDynamic("npm:engine.io-parser@1.2.4/lib/keys.js", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;

  /**
   * Gets the keys for an object.
   *
   * @return {Array} keys
   * @api private
   */

  module.exports = Object.keys || function keys(obj) {
    var arr = [];
    var has = Object.prototype.hasOwnProperty;

    for (var i in obj) {
      if (has.call(obj, i)) {
        arr.push(i);
      }
    }
    return arr;
  };
  return module.exports;
});
System.registerDynamic('npm:has-binary@0.1.6/index.js', ['npm:isarray@0.0.1.js', 'github:jspm/nodelibs-buffer@0.1.0.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  (function (Buffer) {
    var isArray = $__require('npm:isarray@0.0.1.js');
    module.exports = hasBinary;
    function hasBinary(data) {
      function _hasBinary(obj) {
        if (!obj) return false;
        if (global.Buffer && global.Buffer.isBuffer(obj) || global.ArrayBuffer && obj instanceof ArrayBuffer || global.Blob && obj instanceof Blob || global.File && obj instanceof File) {
          return true;
        }
        if (isArray(obj)) {
          for (var i = 0; i < obj.length; i++) {
            if (_hasBinary(obj[i])) {
              return true;
            }
          }
        } else if (obj && 'object' == typeof obj) {
          if (obj.toJSON) {
            obj = obj.toJSON();
          }
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) {
              return true;
            }
          }
        }
        return false;
      }
      return _hasBinary(data);
    }
  })($__require('github:jspm/nodelibs-buffer@0.1.0.js').Buffer);
  return module.exports;
});
System.registerDynamic("npm:has-binary@0.1.6.js", ["npm:has-binary@0.1.6/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:has-binary@0.1.6/index.js");
  return module.exports;
});
System.registerDynamic("npm:arraybuffer.slice@0.0.6/index.js", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /**
   * An abstraction for slicing an arraybuffer even when
   * ArrayBuffer.prototype.slice is not supported
   *
   * @api public
   */

  module.exports = function (arraybuffer, start, end) {
    var bytes = arraybuffer.byteLength;
    start = start || 0;
    end = end || bytes;

    if (arraybuffer.slice) {
      return arraybuffer.slice(start, end);
    }

    if (start < 0) {
      start += bytes;
    }
    if (end < 0) {
      end += bytes;
    }
    if (end > bytes) {
      end = bytes;
    }

    if (start >= bytes || start >= end || bytes === 0) {
      return new ArrayBuffer(0);
    }

    var abv = new Uint8Array(arraybuffer);
    var result = new Uint8Array(end - start);
    for (var i = start, ii = 0; i < end; i++, ii++) {
      result[ii] = abv[i];
    }
    return result.buffer;
  };
  return module.exports;
});
System.registerDynamic("npm:arraybuffer.slice@0.0.6.js", ["npm:arraybuffer.slice@0.0.6/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:arraybuffer.slice@0.0.6/index.js");
  return module.exports;
});
System.registerDynamic("npm:base64-arraybuffer@0.1.2/lib/base64-arraybuffer.js", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /*
   * base64-arraybuffer
   * https://github.com/niklasvh/base64-arraybuffer
   *
   * Copyright (c) 2012 Niklas von Hertzen
   * Licensed under the MIT license.
   */
  (function (chars) {
    "use strict";

    exports.encode = function (arraybuffer) {
      var bytes = new Uint8Array(arraybuffer),
          i,
          len = bytes.length,
          base64 = "";

      for (i = 0; i < len; i += 3) {
        base64 += chars[bytes[i] >> 2];
        base64 += chars[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
        base64 += chars[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
        base64 += chars[bytes[i + 2] & 63];
      }

      if (len % 3 === 2) {
        base64 = base64.substring(0, base64.length - 1) + "=";
      } else if (len % 3 === 1) {
        base64 = base64.substring(0, base64.length - 2) + "==";
      }

      return base64;
    };

    exports.decode = function (base64) {
      var bufferLength = base64.length * 0.75,
          len = base64.length,
          i,
          p = 0,
          encoded1,
          encoded2,
          encoded3,
          encoded4;

      if (base64[base64.length - 1] === "=") {
        bufferLength--;
        if (base64[base64.length - 2] === "=") {
          bufferLength--;
        }
      }

      var arraybuffer = new ArrayBuffer(bufferLength),
          bytes = new Uint8Array(arraybuffer);

      for (i = 0; i < len; i += 4) {
        encoded1 = chars.indexOf(base64[i]);
        encoded2 = chars.indexOf(base64[i + 1]);
        encoded3 = chars.indexOf(base64[i + 2]);
        encoded4 = chars.indexOf(base64[i + 3]);

        bytes[p++] = encoded1 << 2 | encoded2 >> 4;
        bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
        bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
      }

      return arraybuffer;
    };
  })("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");
  return module.exports;
});
System.registerDynamic("npm:base64-arraybuffer@0.1.2.js", ["npm:base64-arraybuffer@0.1.2/lib/base64-arraybuffer.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:base64-arraybuffer@0.1.2/lib/base64-arraybuffer.js");
  return module.exports;
});
System.registerDynamic('npm:after@0.8.1/index.js', [], true, function ($__require, exports, module) {
    var define,
        global = this || self,
        GLOBAL = global;
    /* */
    module.exports = after;

    function after(count, callback, err_cb) {
        var bail = false;
        err_cb = err_cb || noop;
        proxy.count = count;

        return count === 0 ? callback() : proxy;

        function proxy(err, result) {
            if (proxy.count <= 0) {
                throw new Error('after called too many times');
            }
            --proxy.count;

            // after first error, rest are passed to err_cb
            if (err) {
                bail = true;
                callback(err);
                // future error callbacks will go to error handler
                callback = err_cb;
            } else if (proxy.count === 0 && !bail) {
                callback(null, result);
            }
        }
    }

    function noop() {}
    return module.exports;
});
System.registerDynamic("npm:after@0.8.1.js", ["npm:after@0.8.1/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:after@0.8.1/index.js");
  return module.exports;
});
System.registerDynamic('npm:utf8@2.1.0/utf8.js', [], true, function ($__require, exports, module) {
	/* */
	"format cjs";
	/*! https://mths.be/utf8js v2.0.0 by @mathias */

	var define,
	    global = this || self,
	    GLOBAL = global;
	;(function (root) {

		// Detect free variables `exports`
		var freeExports = typeof exports == 'object' && exports;

		// Detect free variable `module`
		var freeModule = typeof module == 'object' && module && module.exports == freeExports && module;

		// Detect free variable `global`, from Node.js or Browserified code,
		// and use it as `root`
		var freeGlobal = typeof global == 'object' && global;
		if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
			root = freeGlobal;
		}

		/*--------------------------------------------------------------------------*/

		var stringFromCharCode = String.fromCharCode;

		// Taken from https://mths.be/punycode
		function ucs2decode(string) {
			var output = [];
			var counter = 0;
			var length = string.length;
			var value;
			var extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) {
						// low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}

		// Taken from https://mths.be/punycode
		function ucs2encode(array) {
			var length = array.length;
			var index = -1;
			var value;
			var output = '';
			while (++index < length) {
				value = array[index];
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
			}
			return output;
		}

		function checkScalarValue(codePoint) {
			if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
				throw Error('Lone surrogate U+' + codePoint.toString(16).toUpperCase() + ' is not a scalar value');
			}
		}
		/*--------------------------------------------------------------------------*/

		function createByte(codePoint, shift) {
			return stringFromCharCode(codePoint >> shift & 0x3F | 0x80);
		}

		function encodeCodePoint(codePoint) {
			if ((codePoint & 0xFFFFFF80) == 0) {
				// 1-byte sequence
				return stringFromCharCode(codePoint);
			}
			var symbol = '';
			if ((codePoint & 0xFFFFF800) == 0) {
				// 2-byte sequence
				symbol = stringFromCharCode(codePoint >> 6 & 0x1F | 0xC0);
			} else if ((codePoint & 0xFFFF0000) == 0) {
				// 3-byte sequence
				checkScalarValue(codePoint);
				symbol = stringFromCharCode(codePoint >> 12 & 0x0F | 0xE0);
				symbol += createByte(codePoint, 6);
			} else if ((codePoint & 0xFFE00000) == 0) {
				// 4-byte sequence
				symbol = stringFromCharCode(codePoint >> 18 & 0x07 | 0xF0);
				symbol += createByte(codePoint, 12);
				symbol += createByte(codePoint, 6);
			}
			symbol += stringFromCharCode(codePoint & 0x3F | 0x80);
			return symbol;
		}

		function utf8encode(string) {
			var codePoints = ucs2decode(string);
			var length = codePoints.length;
			var index = -1;
			var codePoint;
			var byteString = '';
			while (++index < length) {
				codePoint = codePoints[index];
				byteString += encodeCodePoint(codePoint);
			}
			return byteString;
		}

		/*--------------------------------------------------------------------------*/

		function readContinuationByte() {
			if (byteIndex >= byteCount) {
				throw Error('Invalid byte index');
			}

			var continuationByte = byteArray[byteIndex] & 0xFF;
			byteIndex++;

			if ((continuationByte & 0xC0) == 0x80) {
				return continuationByte & 0x3F;
			}

			// If we end up here, it’s not a continuation byte
			throw Error('Invalid continuation byte');
		}

		function decodeSymbol() {
			var byte1;
			var byte2;
			var byte3;
			var byte4;
			var codePoint;

			if (byteIndex > byteCount) {
				throw Error('Invalid byte index');
			}

			if (byteIndex == byteCount) {
				return false;
			}

			// Read first byte
			byte1 = byteArray[byteIndex] & 0xFF;
			byteIndex++;

			// 1-byte sequence (no continuation bytes)
			if ((byte1 & 0x80) == 0) {
				return byte1;
			}

			// 2-byte sequence
			if ((byte1 & 0xE0) == 0xC0) {
				var byte2 = readContinuationByte();
				codePoint = (byte1 & 0x1F) << 6 | byte2;
				if (codePoint >= 0x80) {
					return codePoint;
				} else {
					throw Error('Invalid continuation byte');
				}
			}

			// 3-byte sequence (may include unpaired surrogates)
			if ((byte1 & 0xF0) == 0xE0) {
				byte2 = readContinuationByte();
				byte3 = readContinuationByte();
				codePoint = (byte1 & 0x0F) << 12 | byte2 << 6 | byte3;
				if (codePoint >= 0x0800) {
					checkScalarValue(codePoint);
					return codePoint;
				} else {
					throw Error('Invalid continuation byte');
				}
			}

			// 4-byte sequence
			if ((byte1 & 0xF8) == 0xF0) {
				byte2 = readContinuationByte();
				byte3 = readContinuationByte();
				byte4 = readContinuationByte();
				codePoint = (byte1 & 0x0F) << 0x12 | byte2 << 0x0C | byte3 << 0x06 | byte4;
				if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
					return codePoint;
				}
			}

			throw Error('Invalid UTF-8 detected');
		}

		var byteArray;
		var byteCount;
		var byteIndex;
		function utf8decode(byteString) {
			byteArray = ucs2decode(byteString);
			byteCount = byteArray.length;
			byteIndex = 0;
			var codePoints = [];
			var tmp;
			while ((tmp = decodeSymbol()) !== false) {
				codePoints.push(tmp);
			}
			return ucs2encode(codePoints);
		}

		/*--------------------------------------------------------------------------*/

		var utf8 = {
			'version': '2.0.0',
			'encode': utf8encode,
			'decode': utf8decode
		};

		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
			define(function () {
				return utf8;
			});
		} else if (freeExports && !freeExports.nodeType) {
			if (freeModule) {
				// in Node.js or RingoJS v0.8.0+
				freeModule.exports = utf8;
			} else {
				// in Narwhal or RingoJS v0.7.0-
				var object = {};
				var hasOwnProperty = object.hasOwnProperty;
				for (var key in utf8) {
					hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
				}
			}
		} else {
			// in Rhino or a web browser
			root.utf8 = utf8;
		}
	})(this);
	return module.exports;
});
System.registerDynamic("npm:utf8@2.1.0.js", ["npm:utf8@2.1.0/utf8.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:utf8@2.1.0/utf8.js");
  return module.exports;
});
System.registerDynamic('npm:blob@0.0.4/index.js', [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /**
   * Create a blob builder even when vendor prefixes exist
   */

  var BlobBuilder = global.BlobBuilder || global.WebKitBlobBuilder || global.MSBlobBuilder || global.MozBlobBuilder;

  /**
   * Check if Blob constructor is supported
   */

  var blobSupported = function () {
    try {
      var a = new Blob(['hi']);
      return a.size === 2;
    } catch (e) {
      return false;
    }
  }();

  /**
   * Check if Blob constructor supports ArrayBufferViews
   * Fails in Safari 6, so we need to map to ArrayBuffers there.
   */

  var blobSupportsArrayBufferView = blobSupported && function () {
    try {
      var b = new Blob([new Uint8Array([1, 2])]);
      return b.size === 2;
    } catch (e) {
      return false;
    }
  }();

  /**
   * Check if BlobBuilder is supported
   */

  var blobBuilderSupported = BlobBuilder && BlobBuilder.prototype.append && BlobBuilder.prototype.getBlob;

  /**
   * Helper function that maps ArrayBufferViews to ArrayBuffers
   * Used by BlobBuilder constructor and old browsers that didn't
   * support it in the Blob constructor.
   */

  function mapArrayBufferViews(ary) {
    for (var i = 0; i < ary.length; i++) {
      var chunk = ary[i];
      if (chunk.buffer instanceof ArrayBuffer) {
        var buf = chunk.buffer;

        // if this is a subarray, make a copy so we only
        // include the subarray region from the underlying buffer
        if (chunk.byteLength !== buf.byteLength) {
          var copy = new Uint8Array(chunk.byteLength);
          copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
          buf = copy.buffer;
        }

        ary[i] = buf;
      }
    }
  }

  function BlobBuilderConstructor(ary, options) {
    options = options || {};

    var bb = new BlobBuilder();
    mapArrayBufferViews(ary);

    for (var i = 0; i < ary.length; i++) {
      bb.append(ary[i]);
    }

    return options.type ? bb.getBlob(options.type) : bb.getBlob();
  };

  function BlobConstructor(ary, options) {
    mapArrayBufferViews(ary);
    return new Blob(ary, options || {});
  };

  module.exports = function () {
    if (blobSupported) {
      return blobSupportsArrayBufferView ? global.Blob : BlobConstructor;
    } else if (blobBuilderSupported) {
      return BlobBuilderConstructor;
    } else {
      return undefined;
    }
  }();
  return module.exports;
});
System.registerDynamic("npm:blob@0.0.4.js", ["npm:blob@0.0.4/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:blob@0.0.4/index.js");
  return module.exports;
});
System.registerDynamic('npm:engine.io-parser@1.2.4/lib/browser.js', ['npm:engine.io-parser@1.2.4/lib/keys.js', 'npm:has-binary@0.1.6.js', 'npm:arraybuffer.slice@0.0.6.js', 'npm:base64-arraybuffer@0.1.2.js', 'npm:after@0.8.1.js', 'npm:utf8@2.1.0.js', 'npm:blob@0.0.4.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var keys = $__require('npm:engine.io-parser@1.2.4/lib/keys.js');
  var hasBinary = $__require('npm:has-binary@0.1.6.js');
  var sliceBuffer = $__require('npm:arraybuffer.slice@0.0.6.js');
  var base64encoder = $__require('npm:base64-arraybuffer@0.1.2.js');
  var after = $__require('npm:after@0.8.1.js');
  var utf8 = $__require('npm:utf8@2.1.0.js');
  var isAndroid = navigator.userAgent.match(/Android/i);
  var isPhantomJS = /PhantomJS/i.test(navigator.userAgent);
  var dontSendBlobs = isAndroid || isPhantomJS;
  exports.protocol = 3;
  var packets = exports.packets = {
    open: 0,
    close: 1,
    ping: 2,
    pong: 3,
    message: 4,
    upgrade: 5,
    noop: 6
  };
  var packetslist = keys(packets);
  var err = {
    type: 'error',
    data: 'parser error'
  };
  var Blob = $__require('npm:blob@0.0.4.js');
  exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
    if ('function' == typeof supportsBinary) {
      callback = supportsBinary;
      supportsBinary = false;
    }
    if ('function' == typeof utf8encode) {
      callback = utf8encode;
      utf8encode = null;
    }
    var data = packet.data === undefined ? undefined : packet.data.buffer || packet.data;
    if (global.ArrayBuffer && data instanceof ArrayBuffer) {
      return encodeArrayBuffer(packet, supportsBinary, callback);
    } else if (Blob && data instanceof global.Blob) {
      return encodeBlob(packet, supportsBinary, callback);
    }
    if (data && data.base64) {
      return encodeBase64Object(packet, callback);
    }
    var encoded = packets[packet.type];
    if (undefined !== packet.data) {
      encoded += utf8encode ? utf8.encode(String(packet.data)) : String(packet.data);
    }
    return callback('' + encoded);
  };
  function encodeBase64Object(packet, callback) {
    var message = 'b' + exports.packets[packet.type] + packet.data.data;
    return callback(message);
  }
  function encodeArrayBuffer(packet, supportsBinary, callback) {
    if (!supportsBinary) {
      return exports.encodeBase64Packet(packet, callback);
    }
    var data = packet.data;
    var contentArray = new Uint8Array(data);
    var resultBuffer = new Uint8Array(1 + data.byteLength);
    resultBuffer[0] = packets[packet.type];
    for (var i = 0; i < contentArray.length; i++) {
      resultBuffer[i + 1] = contentArray[i];
    }
    return callback(resultBuffer.buffer);
  }
  function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
    if (!supportsBinary) {
      return exports.encodeBase64Packet(packet, callback);
    }
    var fr = new FileReader();
    fr.onload = function () {
      packet.data = fr.result;
      exports.encodePacket(packet, supportsBinary, true, callback);
    };
    return fr.readAsArrayBuffer(packet.data);
  }
  function encodeBlob(packet, supportsBinary, callback) {
    if (!supportsBinary) {
      return exports.encodeBase64Packet(packet, callback);
    }
    if (dontSendBlobs) {
      return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
    }
    var length = new Uint8Array(1);
    length[0] = packets[packet.type];
    var blob = new Blob([length.buffer, packet.data]);
    return callback(blob);
  }
  exports.encodeBase64Packet = function (packet, callback) {
    var message = 'b' + exports.packets[packet.type];
    if (Blob && packet.data instanceof global.Blob) {
      var fr = new FileReader();
      fr.onload = function () {
        var b64 = fr.result.split(',')[1];
        callback(message + b64);
      };
      return fr.readAsDataURL(packet.data);
    }
    var b64data;
    try {
      b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
    } catch (e) {
      var typed = new Uint8Array(packet.data);
      var basic = new Array(typed.length);
      for (var i = 0; i < typed.length; i++) {
        basic[i] = typed[i];
      }
      b64data = String.fromCharCode.apply(null, basic);
    }
    message += global.btoa(b64data);
    return callback(message);
  };
  exports.decodePacket = function (data, binaryType, utf8decode) {
    if (typeof data == 'string' || data === undefined) {
      if (data.charAt(0) == 'b') {
        return exports.decodeBase64Packet(data.substr(1), binaryType);
      }
      if (utf8decode) {
        try {
          data = utf8.decode(data);
        } catch (e) {
          return err;
        }
      }
      var type = data.charAt(0);
      if (Number(type) != type || !packetslist[type]) {
        return err;
      }
      if (data.length > 1) {
        return {
          type: packetslist[type],
          data: data.substring(1)
        };
      } else {
        return { type: packetslist[type] };
      }
    }
    var asArray = new Uint8Array(data);
    var type = asArray[0];
    var rest = sliceBuffer(data, 1);
    if (Blob && binaryType === 'blob') {
      rest = new Blob([rest]);
    }
    return {
      type: packetslist[type],
      data: rest
    };
  };
  exports.decodeBase64Packet = function (msg, binaryType) {
    var type = packetslist[msg.charAt(0)];
    if (!global.ArrayBuffer) {
      return {
        type: type,
        data: {
          base64: true,
          data: msg.substr(1)
        }
      };
    }
    var data = base64encoder.decode(msg.substr(1));
    if (binaryType === 'blob' && Blob) {
      data = new Blob([data]);
    }
    return {
      type: type,
      data: data
    };
  };
  exports.encodePayload = function (packets, supportsBinary, callback) {
    if (typeof supportsBinary == 'function') {
      callback = supportsBinary;
      supportsBinary = null;
    }
    var isBinary = hasBinary(packets);
    if (supportsBinary && isBinary) {
      if (Blob && !dontSendBlobs) {
        return exports.encodePayloadAsBlob(packets, callback);
      }
      return exports.encodePayloadAsArrayBuffer(packets, callback);
    }
    if (!packets.length) {
      return callback('0:');
    }
    function setLengthHeader(message) {
      return message.length + ':' + message;
    }
    function encodeOne(packet, doneCallback) {
      exports.encodePacket(packet, !isBinary ? false : supportsBinary, true, function (message) {
        doneCallback(null, setLengthHeader(message));
      });
    }
    map(packets, encodeOne, function (err, results) {
      return callback(results.join(''));
    });
  };
  function map(ary, each, done) {
    var result = new Array(ary.length);
    var next = after(ary.length, done);
    var eachWithIndex = function (i, el, cb) {
      each(el, function (error, msg) {
        result[i] = msg;
        cb(error, result);
      });
    };
    for (var i = 0; i < ary.length; i++) {
      eachWithIndex(i, ary[i], next);
    }
  }
  exports.decodePayload = function (data, binaryType, callback) {
    if (typeof data != 'string') {
      return exports.decodePayloadAsBinary(data, binaryType, callback);
    }
    if (typeof binaryType === 'function') {
      callback = binaryType;
      binaryType = null;
    }
    var packet;
    if (data == '') {
      return callback(err, 0, 1);
    }
    var length = '',
        n,
        msg;
    for (var i = 0, l = data.length; i < l; i++) {
      var chr = data.charAt(i);
      if (':' != chr) {
        length += chr;
      } else {
        if ('' == length || length != (n = Number(length))) {
          return callback(err, 0, 1);
        }
        msg = data.substr(i + 1, n);
        if (length != msg.length) {
          return callback(err, 0, 1);
        }
        if (msg.length) {
          packet = exports.decodePacket(msg, binaryType, true);
          if (err.type == packet.type && err.data == packet.data) {
            return callback(err, 0, 1);
          }
          var ret = callback(packet, i + n, l);
          if (false === ret) return;
        }
        i += n;
        length = '';
      }
    }
    if (length != '') {
      return callback(err, 0, 1);
    }
  };
  exports.encodePayloadAsArrayBuffer = function (packets, callback) {
    if (!packets.length) {
      return callback(new ArrayBuffer(0));
    }
    function encodeOne(packet, doneCallback) {
      exports.encodePacket(packet, true, true, function (data) {
        return doneCallback(null, data);
      });
    }
    map(packets, encodeOne, function (err, encodedPackets) {
      var totalLength = encodedPackets.reduce(function (acc, p) {
        var len;
        if (typeof p === 'string') {
          len = p.length;
        } else {
          len = p.byteLength;
        }
        return acc + len.toString().length + len + 2;
      }, 0);
      var resultArray = new Uint8Array(totalLength);
      var bufferIndex = 0;
      encodedPackets.forEach(function (p) {
        var isString = typeof p === 'string';
        var ab = p;
        if (isString) {
          var view = new Uint8Array(p.length);
          for (var i = 0; i < p.length; i++) {
            view[i] = p.charCodeAt(i);
          }
          ab = view.buffer;
        }
        if (isString) {
          resultArray[bufferIndex++] = 0;
        } else {
          resultArray[bufferIndex++] = 1;
        }
        var lenStr = ab.byteLength.toString();
        for (var i = 0; i < lenStr.length; i++) {
          resultArray[bufferIndex++] = parseInt(lenStr[i]);
        }
        resultArray[bufferIndex++] = 255;
        var view = new Uint8Array(ab);
        for (var i = 0; i < view.length; i++) {
          resultArray[bufferIndex++] = view[i];
        }
      });
      return callback(resultArray.buffer);
    });
  };
  exports.encodePayloadAsBlob = function (packets, callback) {
    function encodeOne(packet, doneCallback) {
      exports.encodePacket(packet, true, true, function (encoded) {
        var binaryIdentifier = new Uint8Array(1);
        binaryIdentifier[0] = 1;
        if (typeof encoded === 'string') {
          var view = new Uint8Array(encoded.length);
          for (var i = 0; i < encoded.length; i++) {
            view[i] = encoded.charCodeAt(i);
          }
          encoded = view.buffer;
          binaryIdentifier[0] = 0;
        }
        var len = encoded instanceof ArrayBuffer ? encoded.byteLength : encoded.size;
        var lenStr = len.toString();
        var lengthAry = new Uint8Array(lenStr.length + 1);
        for (var i = 0; i < lenStr.length; i++) {
          lengthAry[i] = parseInt(lenStr[i]);
        }
        lengthAry[lenStr.length] = 255;
        if (Blob) {
          var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
          doneCallback(null, blob);
        }
      });
    }
    map(packets, encodeOne, function (err, results) {
      return callback(new Blob(results));
    });
  };
  exports.decodePayloadAsBinary = function (data, binaryType, callback) {
    if (typeof binaryType === 'function') {
      callback = binaryType;
      binaryType = null;
    }
    var bufferTail = data;
    var buffers = [];
    var numberTooLong = false;
    while (bufferTail.byteLength > 0) {
      var tailArray = new Uint8Array(bufferTail);
      var isString = tailArray[0] === 0;
      var msgLength = '';
      for (var i = 1;; i++) {
        if (tailArray[i] == 255) break;
        if (msgLength.length > 310) {
          numberTooLong = true;
          break;
        }
        msgLength += tailArray[i];
      }
      if (numberTooLong) return callback(err, 0, 1);
      bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
      msgLength = parseInt(msgLength);
      var msg = sliceBuffer(bufferTail, 0, msgLength);
      if (isString) {
        try {
          msg = String.fromCharCode.apply(null, new Uint8Array(msg));
        } catch (e) {
          var typed = new Uint8Array(msg);
          msg = '';
          for (var i = 0; i < typed.length; i++) {
            msg += String.fromCharCode(typed[i]);
          }
        }
      }
      buffers.push(msg);
      bufferTail = sliceBuffer(bufferTail, msgLength);
    }
    var total = buffers.length;
    buffers.forEach(function (buffer, i) {
      callback(exports.decodePacket(buffer, binaryType, true), i, total);
    });
  };
  return module.exports;
});
System.registerDynamic("npm:engine.io-parser@1.2.4.js", ["npm:engine.io-parser@1.2.4/lib/browser.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:engine.io-parser@1.2.4/lib/browser.js");
  return module.exports;
});
System.registerDynamic('npm:engine.io-client@1.6.8/lib/index.js', ['npm:engine.io-client@1.6.8/lib/socket.js', 'npm:engine.io-parser@1.2.4.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = $__require('npm:engine.io-client@1.6.8/lib/socket.js');
  module.exports.parser = $__require('npm:engine.io-parser@1.2.4.js');
  return module.exports;
});
System.registerDynamic('npm:engine.io-client@1.6.8/index.js', ['npm:engine.io-client@1.6.8/lib/index.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = $__require('npm:engine.io-client@1.6.8/lib/index.js');
  return module.exports;
});
System.registerDynamic("npm:engine.io-client@1.6.8.js", ["npm:engine.io-client@1.6.8/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:engine.io-client@1.6.8/index.js");
  return module.exports;
});
System.registerDynamic("npm:indexof@0.0.1/index.js", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */

  var indexOf = [].indexOf;

  module.exports = function (arr, obj) {
    if (indexOf) return arr.indexOf(obj);
    for (var i = 0; i < arr.length; ++i) {
      if (arr[i] === obj) return i;
    }
    return -1;
  };
  return module.exports;
});
System.registerDynamic("npm:indexof@0.0.1.js", ["npm:indexof@0.0.1/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:indexof@0.0.1/index.js");
  return module.exports;
});
System.registerDynamic("npm:backo2@1.0.2/index.js", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;

  /**
   * Expose `Backoff`.
   */

  module.exports = Backoff;

  /**
   * Initialize backoff timer with `opts`.
   *
   * - `min` initial timeout in milliseconds [100]
   * - `max` max timeout [10000]
   * - `jitter` [0]
   * - `factor` [2]
   *
   * @param {Object} opts
   * @api public
   */

  function Backoff(opts) {
    opts = opts || {};
    this.ms = opts.min || 100;
    this.max = opts.max || 10000;
    this.factor = opts.factor || 2;
    this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
    this.attempts = 0;
  }

  /**
   * Return the backoff duration.
   *
   * @return {Number}
   * @api public
   */

  Backoff.prototype.duration = function () {
    var ms = this.ms * Math.pow(this.factor, this.attempts++);
    if (this.jitter) {
      var rand = Math.random();
      var deviation = Math.floor(rand * this.jitter * ms);
      ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
    }
    return Math.min(ms, this.max) | 0;
  };

  /**
   * Reset the number of attempts.
   *
   * @api public
   */

  Backoff.prototype.reset = function () {
    this.attempts = 0;
  };

  /**
   * Set the minimum duration
   *
   * @api public
   */

  Backoff.prototype.setMin = function (min) {
    this.ms = min;
  };

  /**
   * Set the maximum duration
   *
   * @api public
   */

  Backoff.prototype.setMax = function (max) {
    this.max = max;
  };

  /**
   * Set the jitter
   *
   * @api public
   */

  Backoff.prototype.setJitter = function (jitter) {
    this.jitter = jitter;
  };
  return module.exports;
});
System.registerDynamic("npm:backo2@1.0.2.js", ["npm:backo2@1.0.2/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:backo2@1.0.2/index.js");
  return module.exports;
});
System.registerDynamic('npm:socket.io-client@1.4.5/lib/manager.js', ['npm:engine.io-client@1.6.8.js', 'npm:socket.io-client@1.4.5/lib/socket.js', 'npm:component-emitter@1.2.0.js', 'npm:socket.io-parser@2.2.6.js', 'npm:socket.io-client@1.4.5/lib/on.js', 'npm:component-bind@1.0.0.js', 'npm:debug@2.2.0.js', 'npm:indexof@0.0.1.js', 'npm:backo2@1.0.2.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var eio = $__require('npm:engine.io-client@1.6.8.js');
  var Socket = $__require('npm:socket.io-client@1.4.5/lib/socket.js');
  var Emitter = $__require('npm:component-emitter@1.2.0.js');
  var parser = $__require('npm:socket.io-parser@2.2.6.js');
  var on = $__require('npm:socket.io-client@1.4.5/lib/on.js');
  var bind = $__require('npm:component-bind@1.0.0.js');
  var debug = $__require('npm:debug@2.2.0.js')('socket.io-client:manager');
  var indexOf = $__require('npm:indexof@0.0.1.js');
  var Backoff = $__require('npm:backo2@1.0.2.js');
  var has = Object.prototype.hasOwnProperty;
  module.exports = Manager;
  function Manager(uri, opts) {
    if (!(this instanceof Manager)) return new Manager(uri, opts);
    if (uri && 'object' == typeof uri) {
      opts = uri;
      uri = undefined;
    }
    opts = opts || {};
    opts.path = opts.path || '/socket.io';
    this.nsps = {};
    this.subs = [];
    this.opts = opts;
    this.reconnection(opts.reconnection !== false);
    this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
    this.reconnectionDelay(opts.reconnectionDelay || 1000);
    this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
    this.randomizationFactor(opts.randomizationFactor || 0.5);
    this.backoff = new Backoff({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    });
    this.timeout(null == opts.timeout ? 20000 : opts.timeout);
    this.readyState = 'closed';
    this.uri = uri;
    this.connecting = [];
    this.lastPing = null;
    this.encoding = false;
    this.packetBuffer = [];
    this.encoder = new parser.Encoder();
    this.decoder = new parser.Decoder();
    this.autoConnect = opts.autoConnect !== false;
    if (this.autoConnect) this.open();
  }
  Manager.prototype.emitAll = function () {
    this.emit.apply(this, arguments);
    for (var nsp in this.nsps) {
      if (has.call(this.nsps, nsp)) {
        this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
      }
    }
  };
  Manager.prototype.updateSocketIds = function () {
    for (var nsp in this.nsps) {
      if (has.call(this.nsps, nsp)) {
        this.nsps[nsp].id = this.engine.id;
      }
    }
  };
  Emitter(Manager.prototype);
  Manager.prototype.reconnection = function (v) {
    if (!arguments.length) return this._reconnection;
    this._reconnection = !!v;
    return this;
  };
  Manager.prototype.reconnectionAttempts = function (v) {
    if (!arguments.length) return this._reconnectionAttempts;
    this._reconnectionAttempts = v;
    return this;
  };
  Manager.prototype.reconnectionDelay = function (v) {
    if (!arguments.length) return this._reconnectionDelay;
    this._reconnectionDelay = v;
    this.backoff && this.backoff.setMin(v);
    return this;
  };
  Manager.prototype.randomizationFactor = function (v) {
    if (!arguments.length) return this._randomizationFactor;
    this._randomizationFactor = v;
    this.backoff && this.backoff.setJitter(v);
    return this;
  };
  Manager.prototype.reconnectionDelayMax = function (v) {
    if (!arguments.length) return this._reconnectionDelayMax;
    this._reconnectionDelayMax = v;
    this.backoff && this.backoff.setMax(v);
    return this;
  };
  Manager.prototype.timeout = function (v) {
    if (!arguments.length) return this._timeout;
    this._timeout = v;
    return this;
  };
  Manager.prototype.maybeReconnectOnOpen = function () {
    if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) {
      this.reconnect();
    }
  };
  Manager.prototype.open = Manager.prototype.connect = function (fn) {
    debug('readyState %s', this.readyState);
    if (~this.readyState.indexOf('open')) return this;
    debug('opening %s', this.uri);
    this.engine = eio(this.uri, this.opts);
    var socket = this.engine;
    var self = this;
    this.readyState = 'opening';
    this.skipReconnect = false;
    var openSub = on(socket, 'open', function () {
      self.onopen();
      fn && fn();
    });
    var errorSub = on(socket, 'error', function (data) {
      debug('connect_error');
      self.cleanup();
      self.readyState = 'closed';
      self.emitAll('connect_error', data);
      if (fn) {
        var err = new Error('Connection error');
        err.data = data;
        fn(err);
      } else {
        self.maybeReconnectOnOpen();
      }
    });
    if (false !== this._timeout) {
      var timeout = this._timeout;
      debug('connect attempt will timeout after %d', timeout);
      var timer = setTimeout(function () {
        debug('connect attempt timed out after %d', timeout);
        openSub.destroy();
        socket.close();
        socket.emit('error', 'timeout');
        self.emitAll('connect_timeout', timeout);
      }, timeout);
      this.subs.push({ destroy: function () {
          clearTimeout(timer);
        } });
    }
    this.subs.push(openSub);
    this.subs.push(errorSub);
    return this;
  };
  Manager.prototype.onopen = function () {
    debug('open');
    this.cleanup();
    this.readyState = 'open';
    this.emit('open');
    var socket = this.engine;
    this.subs.push(on(socket, 'data', bind(this, 'ondata')));
    this.subs.push(on(socket, 'ping', bind(this, 'onping')));
    this.subs.push(on(socket, 'pong', bind(this, 'onpong')));
    this.subs.push(on(socket, 'error', bind(this, 'onerror')));
    this.subs.push(on(socket, 'close', bind(this, 'onclose')));
    this.subs.push(on(this.decoder, 'decoded', bind(this, 'ondecoded')));
  };
  Manager.prototype.onping = function () {
    this.lastPing = new Date();
    this.emitAll('ping');
  };
  Manager.prototype.onpong = function () {
    this.emitAll('pong', new Date() - this.lastPing);
  };
  Manager.prototype.ondata = function (data) {
    this.decoder.add(data);
  };
  Manager.prototype.ondecoded = function (packet) {
    this.emit('packet', packet);
  };
  Manager.prototype.onerror = function (err) {
    debug('error', err);
    this.emitAll('error', err);
  };
  Manager.prototype.socket = function (nsp) {
    var socket = this.nsps[nsp];
    if (!socket) {
      socket = new Socket(this, nsp);
      this.nsps[nsp] = socket;
      var self = this;
      socket.on('connecting', onConnecting);
      socket.on('connect', function () {
        socket.id = self.engine.id;
      });
      if (this.autoConnect) {
        onConnecting();
      }
    }
    function onConnecting() {
      if (!~indexOf(self.connecting, socket)) {
        self.connecting.push(socket);
      }
    }
    return socket;
  };
  Manager.prototype.destroy = function (socket) {
    var index = indexOf(this.connecting, socket);
    if (~index) this.connecting.splice(index, 1);
    if (this.connecting.length) return;
    this.close();
  };
  Manager.prototype.packet = function (packet) {
    debug('writing packet %j', packet);
    var self = this;
    if (!self.encoding) {
      self.encoding = true;
      this.encoder.encode(packet, function (encodedPackets) {
        for (var i = 0; i < encodedPackets.length; i++) {
          self.engine.write(encodedPackets[i], packet.options);
        }
        self.encoding = false;
        self.processPacketQueue();
      });
    } else {
      self.packetBuffer.push(packet);
    }
  };
  Manager.prototype.processPacketQueue = function () {
    if (this.packetBuffer.length > 0 && !this.encoding) {
      var pack = this.packetBuffer.shift();
      this.packet(pack);
    }
  };
  Manager.prototype.cleanup = function () {
    debug('cleanup');
    var sub;
    while (sub = this.subs.shift()) sub.destroy();
    this.packetBuffer = [];
    this.encoding = false;
    this.lastPing = null;
    this.decoder.destroy();
  };
  Manager.prototype.close = Manager.prototype.disconnect = function () {
    debug('disconnect');
    this.skipReconnect = true;
    this.reconnecting = false;
    if ('opening' == this.readyState) {
      this.cleanup();
    }
    this.backoff.reset();
    this.readyState = 'closed';
    if (this.engine) this.engine.close();
  };
  Manager.prototype.onclose = function (reason) {
    debug('onclose');
    this.cleanup();
    this.backoff.reset();
    this.readyState = 'closed';
    this.emit('close', reason);
    if (this._reconnection && !this.skipReconnect) {
      this.reconnect();
    }
  };
  Manager.prototype.reconnect = function () {
    if (this.reconnecting || this.skipReconnect) return this;
    var self = this;
    if (this.backoff.attempts >= this._reconnectionAttempts) {
      debug('reconnect failed');
      this.backoff.reset();
      this.emitAll('reconnect_failed');
      this.reconnecting = false;
    } else {
      var delay = this.backoff.duration();
      debug('will wait %dms before reconnect attempt', delay);
      this.reconnecting = true;
      var timer = setTimeout(function () {
        if (self.skipReconnect) return;
        debug('attempting reconnect');
        self.emitAll('reconnect_attempt', self.backoff.attempts);
        self.emitAll('reconnecting', self.backoff.attempts);
        if (self.skipReconnect) return;
        self.open(function (err) {
          if (err) {
            debug('reconnect attempt error');
            self.reconnecting = false;
            self.reconnect();
            self.emitAll('reconnect_error', err.data);
          } else {
            debug('reconnect success');
            self.onreconnect();
          }
        });
      }, delay);
      this.subs.push({ destroy: function () {
          clearTimeout(timer);
        } });
    }
  };
  Manager.prototype.onreconnect = function () {
    var attempt = this.backoff.attempts;
    this.reconnecting = false;
    this.backoff.reset();
    this.updateSocketIds();
    this.emitAll('reconnect', attempt);
  };
  return module.exports;
});
System.registerDynamic("npm:json3@3.3.2/lib/json3.js", [], true, function ($__require, exports, module) {
  /* */
  "format cjs";
  /*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */

  var define,
      global = this || self,
      GLOBAL = global;
  ;(function () {
    // Detect the `define` function exposed by asynchronous module loaders. The
    // strict `define` check is necessary for compatibility with `r.js`.
    var isLoader = typeof define === "function" && define.amd;

    // A set of types used to distinguish objects from primitives.
    var objectTypes = {
      "function": true,
      "object": true
    };

    // Detect the `exports` object exposed by CommonJS implementations.
    var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

    // Use the `global` object exposed by Node (including Browserify via
    // `insert-module-globals`), Narwhal, and Ringo as the default context,
    // and the `window` object in browsers. Rhino exports a `global` function
    // instead.
    var root = objectTypes[typeof window] && window || this,
        freeGlobal = freeExports && objectTypes[typeof module] && module && !module.nodeType && typeof global == "object" && global;

    if (freeGlobal && (freeGlobal["global"] === freeGlobal || freeGlobal["window"] === freeGlobal || freeGlobal["self"] === freeGlobal)) {
      root = freeGlobal;
    }

    // Public: Initializes JSON 3 using the given `context` object, attaching the
    // `stringify` and `parse` functions to the specified `exports` object.
    function runInContext(context, exports) {
      context || (context = root["Object"]());
      exports || (exports = root["Object"]());

      // Native constructor aliases.
      var Number = context["Number"] || root["Number"],
          String = context["String"] || root["String"],
          Object = context["Object"] || root["Object"],
          Date = context["Date"] || root["Date"],
          SyntaxError = context["SyntaxError"] || root["SyntaxError"],
          TypeError = context["TypeError"] || root["TypeError"],
          Math = context["Math"] || root["Math"],
          nativeJSON = context["JSON"] || root["JSON"];

      // Delegate to the native `stringify` and `parse` implementations.
      if (typeof nativeJSON == "object" && nativeJSON) {
        exports.stringify = nativeJSON.stringify;
        exports.parse = nativeJSON.parse;
      }

      // Convenience aliases.
      var objectProto = Object.prototype,
          getClass = objectProto.toString,
          isProperty,
          forEach,
          undef;

      // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
      var isExtended = new Date(-3509827334573292);
      try {
        // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
        // results for certain dates in Opera >= 10.53.
        isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
        // Safari < 2.0.2 stores the internal millisecond time value correctly,
        // but clips the values returned by the date methods to the range of
        // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
        isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
      } catch (exception) {}

      // Internal: Determines whether the native `JSON.stringify` and `parse`
      // implementations are spec-compliant. Based on work by Ken Snyder.
      function has(name) {
        if (has[name] !== undef) {
          // Return cached feature test result.
          return has[name];
        }
        var isSupported;
        if (name == "bug-string-char-index") {
          // IE <= 7 doesn't support accessing string characters using square
          // bracket notation. IE 8 only supports this for primitives.
          isSupported = "a"[0] != "a";
        } else if (name == "json") {
          // Indicates whether both `JSON.stringify` and `JSON.parse` are
          // supported.
          isSupported = has("json-stringify") && has("json-parse");
        } else {
          var value,
              serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
          // Test `JSON.stringify`.
          if (name == "json-stringify") {
            var stringify = exports.stringify,
                stringifySupported = typeof stringify == "function" && isExtended;
            if (stringifySupported) {
              // A test function object with a custom `toJSON` method.
              (value = function () {
                return 1;
              }).toJSON = value;
              try {
                stringifySupported =
                // Firefox 3.1b1 and b2 serialize string, number, and boolean
                // primitives as object literals.
                stringify(0) === "0" &&
                // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
                // literals.
                stringify(new Number()) === "0" && stringify(new String()) == '""' &&
                // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
                // does not define a canonical JSON representation (this applies to
                // objects with `toJSON` properties as well, *unless* they are nested
                // within an object or array).
                stringify(getClass) === undef &&
                // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
                // FF 3.1b3 pass this test.
                stringify(undef) === undef &&
                // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
                // respectively, if the value is omitted entirely.
                stringify() === undef &&
                // FF 3.1b1, 2 throw an error if the given value is not a number,
                // string, array, object, Boolean, or `null` literal. This applies to
                // objects with custom `toJSON` methods as well, unless they are nested
                // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
                // methods entirely.
                stringify(value) === "1" && stringify([value]) == "[1]" &&
                // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
                // `"[null]"`.
                stringify([undef]) == "[null]" &&
                // YUI 3.0.0b1 fails to serialize `null` literals.
                stringify(null) == "null" &&
                // FF 3.1b1, 2 halts serialization if an array contains a function:
                // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
                // elides non-JSON values from objects and arrays, unless they
                // define custom `toJSON` methods.
                stringify([undef, getClass, null]) == "[null,null,null]" &&
                // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
                // where character escape codes are expected (e.g., `\b` => `\u0008`).
                stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
                // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
                stringify(null, value) === "1" && stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
                // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
                // serialize extended years.
                stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
                // The milliseconds are optional in ES 5, but required in 5.1.
                stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
                // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
                // four-digit years instead of six-digit years. Credits: @Yaffle.
                stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
                // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
                // values less than 1000. Credits: @Yaffle.
                stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
              } catch (exception) {
                stringifySupported = false;
              }
            }
            isSupported = stringifySupported;
          }
          // Test `JSON.parse`.
          if (name == "json-parse") {
            var parse = exports.parse;
            if (typeof parse == "function") {
              try {
                // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
                // Conforming implementations should also coerce the initial argument to
                // a string prior to parsing.
                if (parse("0") === 0 && !parse(false)) {
                  // Simple parsing test.
                  value = parse(serialized);
                  var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
                  if (parseSupported) {
                    try {
                      // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
                      parseSupported = !parse('"\t"');
                    } catch (exception) {}
                    if (parseSupported) {
                      try {
                        // FF 4.0 and 4.0.1 allow leading `+` signs and leading
                        // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
                        // certain octal literals.
                        parseSupported = parse("01") !== 1;
                      } catch (exception) {}
                    }
                    if (parseSupported) {
                      try {
                        // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
                        // points. These environments, along with FF 3.1b1 and 2,
                        // also allow trailing commas in JSON objects and arrays.
                        parseSupported = parse("1.") !== 1;
                      } catch (exception) {}
                    }
                  }
                }
              } catch (exception) {
                parseSupported = false;
              }
            }
            isSupported = parseSupported;
          }
        }
        return has[name] = !!isSupported;
      }

      if (!has("json")) {
        // Common `[[Class]]` name aliases.
        var functionClass = "[object Function]",
            dateClass = "[object Date]",
            numberClass = "[object Number]",
            stringClass = "[object String]",
            arrayClass = "[object Array]",
            booleanClass = "[object Boolean]";

        // Detect incomplete support for accessing string characters by index.
        var charIndexBuggy = has("bug-string-char-index");

        // Define additional utility methods if the `Date` methods are buggy.
        if (!isExtended) {
          var floor = Math.floor;
          // A mapping between the months of the year and the number of days between
          // January 1st and the first of the respective month.
          var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
          // Internal: Calculates the number of days between the Unix epoch and the
          // first day of the given month.
          var getDay = function (year, month) {
            return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
          };
        }

        // Internal: Determines if a property is a direct property of the given
        // object. Delegates to the native `Object#hasOwnProperty` method.
        if (!(isProperty = objectProto.hasOwnProperty)) {
          isProperty = function (property) {
            var members = {},
                constructor;
            if ((members.__proto__ = null, members.__proto__ = {
              // The *proto* property cannot be set multiple times in recent
              // versions of Firefox and SeaMonkey.
              "toString": 1
            }, members).toString != getClass) {
              // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
              // supports the mutable *proto* property.
              isProperty = function (property) {
                // Capture and break the object's prototype chain (see section 8.6.2
                // of the ES 5.1 spec). The parenthesized expression prevents an
                // unsafe transformation by the Closure Compiler.
                var original = this.__proto__,
                    result = property in (this.__proto__ = null, this);
                // Restore the original prototype chain.
                this.__proto__ = original;
                return result;
              };
            } else {
              // Capture a reference to the top-level `Object` constructor.
              constructor = members.constructor;
              // Use the `constructor` property to simulate `Object#hasOwnProperty` in
              // other environments.
              isProperty = function (property) {
                var parent = (this.constructor || constructor).prototype;
                return property in this && !(property in parent && this[property] === parent[property]);
              };
            }
            members = null;
            return isProperty.call(this, property);
          };
        }

        // Internal: Normalizes the `for...in` iteration algorithm across
        // environments. Each enumerated key is yielded to a `callback` function.
        forEach = function (object, callback) {
          var size = 0,
              Properties,
              members,
              property;

          // Tests for bugs in the current environment's `for...in` algorithm. The
          // `valueOf` property inherits the non-enumerable flag from
          // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
          (Properties = function () {
            this.valueOf = 0;
          }).prototype.valueOf = 0;

          // Iterate over a new instance of the `Properties` class.
          members = new Properties();
          for (property in members) {
            // Ignore all properties inherited from `Object.prototype`.
            if (isProperty.call(members, property)) {
              size++;
            }
          }
          Properties = members = null;

          // Normalize the iteration algorithm.
          if (!size) {
            // A list of non-enumerable properties inherited from `Object.prototype`.
            members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
            // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
            // properties.
            forEach = function (object, callback) {
              var isFunction = getClass.call(object) == functionClass,
                  property,
                  length;
              var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;
              for (property in object) {
                // Gecko <= 1.0 enumerates the `prototype` property of functions under
                // certain conditions; IE does not.
                if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
                  callback(property);
                }
              }
              // Manually invoke the callback for each non-enumerable property.
              for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
            };
          } else if (size == 2) {
            // Safari <= 2.0.4 enumerates shadowed properties twice.
            forEach = function (object, callback) {
              // Create a set of iterated properties.
              var members = {},
                  isFunction = getClass.call(object) == functionClass,
                  property;
              for (property in object) {
                // Store each property name to prevent double enumeration. The
                // `prototype` property of functions is not enumerated due to cross-
                // environment inconsistencies.
                if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
                  callback(property);
                }
              }
            };
          } else {
            // No bugs detected; use the standard `for...in` algorithm.
            forEach = function (object, callback) {
              var isFunction = getClass.call(object) == functionClass,
                  property,
                  isConstructor;
              for (property in object) {
                if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
                  callback(property);
                }
              }
              // Manually invoke the callback for the `constructor` property due to
              // cross-environment inconsistencies.
              if (isConstructor || isProperty.call(object, property = "constructor")) {
                callback(property);
              }
            };
          }
          return forEach(object, callback);
        };

        // Public: Serializes a JavaScript `value` as a JSON string. The optional
        // `filter` argument may specify either a function that alters how object and
        // array members are serialized, or an array of strings and numbers that
        // indicates which properties should be serialized. The optional `width`
        // argument may be either a string or number that specifies the indentation
        // level of the output.
        if (!has("json-stringify")) {
          // Internal: A map of control characters and their escaped equivalents.
          var Escapes = {
            92: "\\\\",
            34: '\\"',
            8: "\\b",
            12: "\\f",
            10: "\\n",
            13: "\\r",
            9: "\\t"
          };

          // Internal: Converts `value` into a zero-padded string such that its
          // length is at least equal to `width`. The `width` must be <= 6.
          var leadingZeroes = "000000";
          var toPaddedString = function (width, value) {
            // The `|| 0` expression is necessary to work around a bug in
            // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
            return (leadingZeroes + (value || 0)).slice(-width);
          };

          // Internal: Double-quotes a string `value`, replacing all ASCII control
          // characters (characters with code unit values between 0 and 31) with
          // their escaped equivalents. This is an implementation of the
          // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
          var unicodePrefix = "\\u00";
          var quote = function (value) {
            var result = '"',
                index = 0,
                length = value.length,
                useCharIndex = !charIndexBuggy || length > 10;
            var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
            for (; index < length; index++) {
              var charCode = value.charCodeAt(index);
              // If the character is a control character, append its Unicode or
              // shorthand escape sequence; otherwise, append the character as-is.
              switch (charCode) {
                case 8:case 9:case 10:case 12:case 13:case 34:case 92:
                  result += Escapes[charCode];
                  break;
                default:
                  if (charCode < 32) {
                    result += unicodePrefix + toPaddedString(2, charCode.toString(16));
                    break;
                  }
                  result += useCharIndex ? symbols[index] : value.charAt(index);
              }
            }
            return result + '"';
          };

          // Internal: Recursively serializes an object. Implements the
          // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
          var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
            var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
            try {
              // Necessary for host object support.
              value = object[property];
            } catch (exception) {}
            if (typeof value == "object" && value) {
              className = getClass.call(value);
              if (className == dateClass && !isProperty.call(value, "toJSON")) {
                if (value > -1 / 0 && value < 1 / 0) {
                  // Dates are serialized according to the `Date#toJSON` method
                  // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
                  // for the ISO 8601 date time string format.
                  if (getDay) {
                    // Manually compute the year, month, date, hours, minutes,
                    // seconds, and milliseconds if the `getUTC*` methods are
                    // buggy. Adapted from @Yaffle's `date-shim` project.
                    date = floor(value / 864e5);
                    for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
                    for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
                    date = 1 + date - getDay(year, month);
                    // The `time` value specifies the time within the day (see ES
                    // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
                    // to compute `A modulo B`, as the `%` operator does not
                    // correspond to the `modulo` operation for negative numbers.
                    time = (value % 864e5 + 864e5) % 864e5;
                    // The hours, minutes, seconds, and milliseconds are obtained by
                    // decomposing the time within the day. See section 15.9.1.10.
                    hours = floor(time / 36e5) % 24;
                    minutes = floor(time / 6e4) % 60;
                    seconds = floor(time / 1e3) % 60;
                    milliseconds = time % 1e3;
                  } else {
                    year = value.getUTCFullYear();
                    month = value.getUTCMonth();
                    date = value.getUTCDate();
                    hours = value.getUTCHours();
                    minutes = value.getUTCMinutes();
                    seconds = value.getUTCSeconds();
                    milliseconds = value.getUTCMilliseconds();
                  }
                  // Serialize extended years correctly.
                  value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) + "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
                  // Months, dates, hours, minutes, and seconds should have two
                  // digits; milliseconds should have three.
                  "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
                  // Milliseconds are optional in ES 5.0, but required in 5.1.
                  "." + toPaddedString(3, milliseconds) + "Z";
                } else {
                  value = null;
                }
              } else if (typeof value.toJSON == "function" && (className != numberClass && className != stringClass && className != arrayClass || isProperty.call(value, "toJSON"))) {
                // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
                // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
                // ignores all `toJSON` methods on these objects unless they are
                // defined directly on an instance.
                value = value.toJSON(property);
              }
            }
            if (callback) {
              // If a replacement function was provided, call it to obtain the value
              // for serialization.
              value = callback.call(object, property, value);
            }
            if (value === null) {
              return "null";
            }
            className = getClass.call(value);
            if (className == booleanClass) {
              // Booleans are represented literally.
              return "" + value;
            } else if (className == numberClass) {
              // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
              // `"null"`.
              return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
            } else if (className == stringClass) {
              // Strings are double-quoted and escaped.
              return quote("" + value);
            }
            // Recursively serialize objects and arrays.
            if (typeof value == "object") {
              // Check for cyclic structures. This is a linear search; performance
              // is inversely proportional to the number of unique nested objects.
              for (length = stack.length; length--;) {
                if (stack[length] === value) {
                  // Cyclic structures cannot be serialized by `JSON.stringify`.
                  throw TypeError();
                }
              }
              // Add the object to the stack of traversed objects.
              stack.push(value);
              results = [];
              // Save the current indentation level and indent one additional level.
              prefix = indentation;
              indentation += whitespace;
              if (className == arrayClass) {
                // Recursively serialize array elements.
                for (index = 0, length = value.length; index < length; index++) {
                  element = serialize(index, value, callback, properties, whitespace, indentation, stack);
                  results.push(element === undef ? "null" : element);
                }
                result = results.length ? whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : "[" + results.join(",") + "]" : "[]";
              } else {
                // Recursively serialize object members. Members are selected from
                // either a user-specified list of property names, or the object
                // itself.
                forEach(properties || value, function (property) {
                  var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
                  if (element !== undef) {
                    // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
                    // is not the empty string, let `member` {quote(property) + ":"}
                    // be the concatenation of `member` and the `space` character."
                    // The "`space` character" refers to the literal space
                    // character, not the `space` {width} argument provided to
                    // `JSON.stringify`.
                    results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
                  }
                });
                result = results.length ? whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : "{" + results.join(",") + "}" : "{}";
              }
              // Remove the object from the traversed object stack.
              stack.pop();
              return result;
            }
          };

          // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
          exports.stringify = function (source, filter, width) {
            var whitespace, callback, properties, className;
            if (objectTypes[typeof filter] && filter) {
              if ((className = getClass.call(filter)) == functionClass) {
                callback = filter;
              } else if (className == arrayClass) {
                // Convert the property names array into a makeshift set.
                properties = {};
                for (var index = 0, length = filter.length, value; index < length; value = filter[index++], (className = getClass.call(value), className == stringClass || className == numberClass) && (properties[value] = 1));
              }
            }
            if (width) {
              if ((className = getClass.call(width)) == numberClass) {
                // Convert the `width` to an integer and create a string containing
                // `width` number of space characters.
                if ((width -= width % 1) > 0) {
                  for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
                }
              } else if (className == stringClass) {
                whitespace = width.length <= 10 ? width : width.slice(0, 10);
              }
            }
            // Opera <= 7.54u2 discards the values associated with empty string keys
            // (`""`) only if they are used directly within an object member list
            // (e.g., `!("" in { "": 1})`).
            return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
          };
        }

        // Public: Parses a JSON source string.
        if (!has("json-parse")) {
          var fromCharCode = String.fromCharCode;

          // Internal: A map of escaped control characters and their unescaped
          // equivalents.
          var Unescapes = {
            92: "\\",
            34: '"',
            47: "/",
            98: "\b",
            116: "\t",
            110: "\n",
            102: "\f",
            114: "\r"
          };

          // Internal: Stores the parser state.
          var Index, Source;

          // Internal: Resets the parser state and throws a `SyntaxError`.
          var abort = function () {
            Index = Source = null;
            throw SyntaxError();
          };

          // Internal: Returns the next token, or `"$"` if the parser has reached
          // the end of the source string. A token may be a string, number, `null`
          // literal, or Boolean literal.
          var lex = function () {
            var source = Source,
                length = source.length,
                value,
                begin,
                position,
                isSigned,
                charCode;
            while (Index < length) {
              charCode = source.charCodeAt(Index);
              switch (charCode) {
                case 9:case 10:case 13:case 32:
                  // Skip whitespace tokens, including tabs, carriage returns, line
                  // feeds, and space characters.
                  Index++;
                  break;
                case 123:case 125:case 91:case 93:case 58:case 44:
                  // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
                  // the current position.
                  value = charIndexBuggy ? source.charAt(Index) : source[Index];
                  Index++;
                  return value;
                case 34:
                  // `"` delimits a JSON string; advance to the next character and
                  // begin parsing the string. String tokens are prefixed with the
                  // sentinel `@` character to distinguish them from punctuators and
                  // end-of-string tokens.
                  for (value = "@", Index++; Index < length;) {
                    charCode = source.charCodeAt(Index);
                    if (charCode < 32) {
                      // Unescaped ASCII control characters (those with a code unit
                      // less than the space character) are not permitted.
                      abort();
                    } else if (charCode == 92) {
                      // A reverse solidus (`\`) marks the beginning of an escaped
                      // control character (including `"`, `\`, and `/`) or Unicode
                      // escape sequence.
                      charCode = source.charCodeAt(++Index);
                      switch (charCode) {
                        case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:
                          // Revive escaped control characters.
                          value += Unescapes[charCode];
                          Index++;
                          break;
                        case 117:
                          // `\u` marks the beginning of a Unicode escape sequence.
                          // Advance to the first character and validate the
                          // four-digit code point.
                          begin = ++Index;
                          for (position = Index + 4; Index < position; Index++) {
                            charCode = source.charCodeAt(Index);
                            // A valid sequence comprises four hexdigits (case-
                            // insensitive) that form a single hexadecimal value.
                            if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                              // Invalid Unicode escape sequence.
                              abort();
                            }
                          }
                          // Revive the escaped character.
                          value += fromCharCode("0x" + source.slice(begin, Index));
                          break;
                        default:
                          // Invalid escape sequence.
                          abort();
                      }
                    } else {
                      if (charCode == 34) {
                        // An unescaped double-quote character marks the end of the
                        // string.
                        break;
                      }
                      charCode = source.charCodeAt(Index);
                      begin = Index;
                      // Optimize for the common case where a string is valid.
                      while (charCode >= 32 && charCode != 92 && charCode != 34) {
                        charCode = source.charCodeAt(++Index);
                      }
                      // Append the string as-is.
                      value += source.slice(begin, Index);
                    }
                  }
                  if (source.charCodeAt(Index) == 34) {
                    // Advance to the next character and return the revived string.
                    Index++;
                    return value;
                  }
                  // Unterminated string.
                  abort();
                default:
                  // Parse numbers and literals.
                  begin = Index;
                  // Advance past the negative sign, if one is specified.
                  if (charCode == 45) {
                    isSigned = true;
                    charCode = source.charCodeAt(++Index);
                  }
                  // Parse an integer or floating-point value.
                  if (charCode >= 48 && charCode <= 57) {
                    // Leading zeroes are interpreted as octal literals.
                    if (charCode == 48 && (charCode = source.charCodeAt(Index + 1), charCode >= 48 && charCode <= 57)) {
                      // Illegal octal literal.
                      abort();
                    }
                    isSigned = false;
                    // Parse the integer component.
                    for (; Index < length && (charCode = source.charCodeAt(Index), charCode >= 48 && charCode <= 57); Index++);
                    // Floats cannot contain a leading decimal point; however, this
                    // case is already accounted for by the parser.
                    if (source.charCodeAt(Index) == 46) {
                      position = ++Index;
                      // Parse the decimal component.
                      for (; position < length && (charCode = source.charCodeAt(position), charCode >= 48 && charCode <= 57); position++);
                      if (position == Index) {
                        // Illegal trailing decimal.
                        abort();
                      }
                      Index = position;
                    }
                    // Parse exponents. The `e` denoting the exponent is
                    // case-insensitive.
                    charCode = source.charCodeAt(Index);
                    if (charCode == 101 || charCode == 69) {
                      charCode = source.charCodeAt(++Index);
                      // Skip past the sign following the exponent, if one is
                      // specified.
                      if (charCode == 43 || charCode == 45) {
                        Index++;
                      }
                      // Parse the exponential component.
                      for (position = Index; position < length && (charCode = source.charCodeAt(position), charCode >= 48 && charCode <= 57); position++);
                      if (position == Index) {
                        // Illegal empty exponent.
                        abort();
                      }
                      Index = position;
                    }
                    // Coerce the parsed value to a JavaScript number.
                    return +source.slice(begin, Index);
                  }
                  // A negative sign may only precede numbers.
                  if (isSigned) {
                    abort();
                  }
                  // `true`, `false`, and `null` literals.
                  if (source.slice(Index, Index + 4) == "true") {
                    Index += 4;
                    return true;
                  } else if (source.slice(Index, Index + 5) == "false") {
                    Index += 5;
                    return false;
                  } else if (source.slice(Index, Index + 4) == "null") {
                    Index += 4;
                    return null;
                  }
                  // Unrecognized token.
                  abort();
              }
            }
            // Return the sentinel `$` character if the parser has reached the end
            // of the source string.
            return "$";
          };

          // Internal: Parses a JSON `value` token.
          var get = function (value) {
            var results, hasMembers;
            if (value == "$") {
              // Unexpected end of input.
              abort();
            }
            if (typeof value == "string") {
              if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
                // Remove the sentinel `@` character.
                return value.slice(1);
              }
              // Parse object and array literals.
              if (value == "[") {
                // Parses a JSON array, returning a new JavaScript array.
                results = [];
                for (;; hasMembers || (hasMembers = true)) {
                  value = lex();
                  // A closing square bracket marks the end of the array literal.
                  if (value == "]") {
                    break;
                  }
                  // If the array literal contains elements, the current token
                  // should be a comma separating the previous element from the
                  // next.
                  if (hasMembers) {
                    if (value == ",") {
                      value = lex();
                      if (value == "]") {
                        // Unexpected trailing `,` in array literal.
                        abort();
                      }
                    } else {
                      // A `,` must separate each array element.
                      abort();
                    }
                  }
                  // Elisions and leading commas are not permitted.
                  if (value == ",") {
                    abort();
                  }
                  results.push(get(value));
                }
                return results;
              } else if (value == "{") {
                // Parses a JSON object, returning a new JavaScript object.
                results = {};
                for (;; hasMembers || (hasMembers = true)) {
                  value = lex();
                  // A closing curly brace marks the end of the object literal.
                  if (value == "}") {
                    break;
                  }
                  // If the object literal contains members, the current token
                  // should be a comma separator.
                  if (hasMembers) {
                    if (value == ",") {
                      value = lex();
                      if (value == "}") {
                        // Unexpected trailing `,` in object literal.
                        abort();
                      }
                    } else {
                      // A `,` must separate each object member.
                      abort();
                    }
                  }
                  // Leading commas are not permitted, object property names must be
                  // double-quoted strings, and a `:` must separate each property
                  // name and value.
                  if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                    abort();
                  }
                  results[value.slice(1)] = get(lex());
                }
                return results;
              }
              // Unexpected token encountered.
              abort();
            }
            return value;
          };

          // Internal: Updates a traversed object member.
          var update = function (source, property, callback) {
            var element = walk(source, property, callback);
            if (element === undef) {
              delete source[property];
            } else {
              source[property] = element;
            }
          };

          // Internal: Recursively traverses a parsed JSON object, invoking the
          // `callback` function for each value. This is an implementation of the
          // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
          var walk = function (source, property, callback) {
            var value = source[property],
                length;
            if (typeof value == "object" && value) {
              // `forEach` can't be used to traverse an array in Opera <= 8.54
              // because its `Object#hasOwnProperty` implementation returns `false`
              // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
              if (getClass.call(value) == arrayClass) {
                for (length = value.length; length--;) {
                  update(value, length, callback);
                }
              } else {
                forEach(value, function (property) {
                  update(value, property, callback);
                });
              }
            }
            return callback.call(source, property, value);
          };

          // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
          exports.parse = function (source, callback) {
            var result, value;
            Index = 0;
            Source = "" + source;
            result = get(lex());
            // If a JSON string contains multiple tokens, it is invalid.
            if (lex() != "$") {
              abort();
            }
            // Reset the parser state.
            Index = Source = null;
            return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
          };
        }
      }

      exports["runInContext"] = runInContext;
      return exports;
    }

    if (freeExports && !isLoader) {
      // Export for CommonJS environments.
      runInContext(root, freeExports);
    } else {
      // Export for web browsers and JavaScript engines.
      var nativeJSON = root.JSON,
          previousJSON = root["JSON3"],
          isRestored = false;

      var JSON3 = runInContext(root, root["JSON3"] = {
        // Public: Restores the original value of the global `JSON` object and
        // returns a reference to the `JSON3` object.
        "noConflict": function () {
          if (!isRestored) {
            isRestored = true;
            root.JSON = nativeJSON;
            root["JSON3"] = previousJSON;
            nativeJSON = previousJSON = null;
          }
          return JSON3;
        }
      });

      root.JSON = {
        "parse": JSON3.parse,
        "stringify": JSON3.stringify
      };
    }

    // Export for asynchronous module loaders.
    if (isLoader) {
      define(function () {
        return JSON3;
      });
    }
  }).call(this);
  return module.exports;
});
System.registerDynamic("npm:json3@3.3.2.js", ["npm:json3@3.3.2/lib/json3.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:json3@3.3.2/lib/json3.js");
  return module.exports;
});
System.registerDynamic("npm:component-emitter@1.1.2/index.js", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;

  /**
   * Expose `Emitter`.
   */

  module.exports = Emitter;

  /**
   * Initialize a new `Emitter`.
   *
   * @api public
   */

  function Emitter(obj) {
    if (obj) return mixin(obj);
  };

  /**
   * Mixin the emitter properties.
   *
   * @param {Object} obj
   * @return {Object}
   * @api private
   */

  function mixin(obj) {
    for (var key in Emitter.prototype) {
      obj[key] = Emitter.prototype[key];
    }
    return obj;
  }

  /**
   * Listen on the given `event` with `fn`.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */

  Emitter.prototype.on = Emitter.prototype.addEventListener = function (event, fn) {
    this._callbacks = this._callbacks || {};
    (this._callbacks[event] = this._callbacks[event] || []).push(fn);
    return this;
  };

  /**
   * Adds an `event` listener that will be invoked a single
   * time then automatically removed.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */

  Emitter.prototype.once = function (event, fn) {
    var self = this;
    this._callbacks = this._callbacks || {};

    function on() {
      self.off(event, on);
      fn.apply(this, arguments);
    }

    on.fn = fn;
    this.on(event, on);
    return this;
  };

  /**
   * Remove the given callback for `event` or all
   * registered callbacks.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */

  Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function (event, fn) {
    this._callbacks = this._callbacks || {};

    // all
    if (0 == arguments.length) {
      this._callbacks = {};
      return this;
    }

    // specific event
    var callbacks = this._callbacks[event];
    if (!callbacks) return this;

    // remove all handlers
    if (1 == arguments.length) {
      delete this._callbacks[event];
      return this;
    }

    // remove specific handler
    var cb;
    for (var i = 0; i < callbacks.length; i++) {
      cb = callbacks[i];
      if (cb === fn || cb.fn === fn) {
        callbacks.splice(i, 1);
        break;
      }
    }
    return this;
  };

  /**
   * Emit `event` with the given args.
   *
   * @param {String} event
   * @param {Mixed} ...
   * @return {Emitter}
   */

  Emitter.prototype.emit = function (event) {
    this._callbacks = this._callbacks || {};
    var args = [].slice.call(arguments, 1),
        callbacks = this._callbacks[event];

    if (callbacks) {
      callbacks = callbacks.slice(0);
      for (var i = 0, len = callbacks.length; i < len; ++i) {
        callbacks[i].apply(this, args);
      }
    }

    return this;
  };

  /**
   * Return array of callbacks for `event`.
   *
   * @param {String} event
   * @return {Array}
   * @api public
   */

  Emitter.prototype.listeners = function (event) {
    this._callbacks = this._callbacks || {};
    return this._callbacks[event] || [];
  };

  /**
   * Check if this emitter has `event` handlers.
   *
   * @param {String} event
   * @return {Boolean}
   * @api public
   */

  Emitter.prototype.hasListeners = function (event) {
    return !!this.listeners(event).length;
  };
  return module.exports;
});
System.registerDynamic("npm:component-emitter@1.1.2.js", ["npm:component-emitter@1.1.2/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:component-emitter@1.1.2/index.js");
  return module.exports;
});
System.registerDynamic('npm:socket.io-parser@2.2.6/binary.js', ['npm:isarray@0.0.1.js', 'npm:socket.io-parser@2.2.6/is-buffer.js', 'github:jspm/nodelibs-buffer@0.1.0.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  (function (Buffer) {
    var isArray = $__require('npm:isarray@0.0.1.js');
    var isBuf = $__require('npm:socket.io-parser@2.2.6/is-buffer.js');
    exports.deconstructPacket = function (packet) {
      var buffers = [];
      var packetData = packet.data;
      function _deconstructPacket(data) {
        if (!data) return data;
        if (isBuf(data)) {
          var placeholder = {
            _placeholder: true,
            num: buffers.length
          };
          buffers.push(data);
          return placeholder;
        } else if (isArray(data)) {
          var newData = new Array(data.length);
          for (var i = 0; i < data.length; i++) {
            newData[i] = _deconstructPacket(data[i]);
          }
          return newData;
        } else if ('object' == typeof data && !(data instanceof Date)) {
          var newData = {};
          for (var key in data) {
            newData[key] = _deconstructPacket(data[key]);
          }
          return newData;
        }
        return data;
      }
      var pack = packet;
      pack.data = _deconstructPacket(packetData);
      pack.attachments = buffers.length;
      return {
        packet: pack,
        buffers: buffers
      };
    };
    exports.reconstructPacket = function (packet, buffers) {
      var curPlaceHolder = 0;
      function _reconstructPacket(data) {
        if (data && data._placeholder) {
          var buf = buffers[data.num];
          return buf;
        } else if (isArray(data)) {
          for (var i = 0; i < data.length; i++) {
            data[i] = _reconstructPacket(data[i]);
          }
          return data;
        } else if (data && 'object' == typeof data) {
          for (var key in data) {
            data[key] = _reconstructPacket(data[key]);
          }
          return data;
        }
        return data;
      }
      packet.data = _reconstructPacket(packet.data);
      packet.attachments = undefined;
      return packet;
    };
    exports.removeBlobs = function (data, callback) {
      function _removeBlobs(obj, curKey, containingObject) {
        if (!obj) return obj;
        if (global.Blob && obj instanceof Blob || global.File && obj instanceof File) {
          pendingBlobs++;
          var fileReader = new FileReader();
          fileReader.onload = function () {
            if (containingObject) {
              containingObject[curKey] = this.result;
            } else {
              bloblessData = this.result;
            }
            if (! --pendingBlobs) {
              callback(bloblessData);
            }
          };
          fileReader.readAsArrayBuffer(obj);
        } else if (isArray(obj)) {
          for (var i = 0; i < obj.length; i++) {
            _removeBlobs(obj[i], i, obj);
          }
        } else if (obj && 'object' == typeof obj && !isBuf(obj)) {
          for (var key in obj) {
            _removeBlobs(obj[key], key, obj);
          }
        }
      }
      var pendingBlobs = 0;
      var bloblessData = data;
      _removeBlobs(bloblessData);
      if (!pendingBlobs) {
        callback(bloblessData);
      }
    };
  })($__require('github:jspm/nodelibs-buffer@0.1.0.js').Buffer);
  return module.exports;
});
System.registerDynamic("npm:socket.io-parser@2.2.6/is-buffer.js", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */

  module.exports = isBuf;

  /**
   * Returns true if obj is a buffer or an arraybuffer.
   *
   * @api private
   */

  function isBuf(obj) {
    return global.Buffer && global.Buffer.isBuffer(obj) || global.ArrayBuffer && obj instanceof ArrayBuffer;
  }
  return module.exports;
});
System.registerDynamic('npm:socket.io-parser@2.2.6/index.js', ['npm:debug@2.2.0.js', 'npm:json3@3.3.2.js', 'npm:isarray@0.0.1.js', 'npm:component-emitter@1.1.2.js', 'npm:socket.io-parser@2.2.6/binary.js', 'npm:socket.io-parser@2.2.6/is-buffer.js', 'github:jspm/nodelibs-buffer@0.1.0.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  (function (Buffer) {
    var debug = $__require('npm:debug@2.2.0.js')('socket.io-parser');
    var json = $__require('npm:json3@3.3.2.js');
    var isArray = $__require('npm:isarray@0.0.1.js');
    var Emitter = $__require('npm:component-emitter@1.1.2.js');
    var binary = $__require('npm:socket.io-parser@2.2.6/binary.js');
    var isBuf = $__require('npm:socket.io-parser@2.2.6/is-buffer.js');
    exports.protocol = 4;
    exports.types = ['CONNECT', 'DISCONNECT', 'EVENT', 'ACK', 'ERROR', 'BINARY_EVENT', 'BINARY_ACK'];
    exports.CONNECT = 0;
    exports.DISCONNECT = 1;
    exports.EVENT = 2;
    exports.ACK = 3;
    exports.ERROR = 4;
    exports.BINARY_EVENT = 5;
    exports.BINARY_ACK = 6;
    exports.Encoder = Encoder;
    exports.Decoder = Decoder;
    function Encoder() {}
    Encoder.prototype.encode = function (obj, callback) {
      debug('encoding packet %j', obj);
      if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
        encodeAsBinary(obj, callback);
      } else {
        var encoding = encodeAsString(obj);
        callback([encoding]);
      }
    };
    function encodeAsString(obj) {
      var str = '';
      var nsp = false;
      str += obj.type;
      if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
        str += obj.attachments;
        str += '-';
      }
      if (obj.nsp && '/' != obj.nsp) {
        nsp = true;
        str += obj.nsp;
      }
      if (null != obj.id) {
        if (nsp) {
          str += ',';
          nsp = false;
        }
        str += obj.id;
      }
      if (null != obj.data) {
        if (nsp) str += ',';
        str += json.stringify(obj.data);
      }
      debug('encoded %j as %s', obj, str);
      return str;
    }
    function encodeAsBinary(obj, callback) {
      function writeEncoding(bloblessData) {
        var deconstruction = binary.deconstructPacket(bloblessData);
        var pack = encodeAsString(deconstruction.packet);
        var buffers = deconstruction.buffers;
        buffers.unshift(pack);
        callback(buffers);
      }
      binary.removeBlobs(obj, writeEncoding);
    }
    function Decoder() {
      this.reconstructor = null;
    }
    Emitter(Decoder.prototype);
    Decoder.prototype.add = function (obj) {
      var packet;
      if ('string' == typeof obj) {
        packet = decodeString(obj);
        if (exports.BINARY_EVENT == packet.type || exports.BINARY_ACK == packet.type) {
          this.reconstructor = new BinaryReconstructor(packet);
          if (this.reconstructor.reconPack.attachments === 0) {
            this.emit('decoded', packet);
          }
        } else {
          this.emit('decoded', packet);
        }
      } else if (isBuf(obj) || obj.base64) {
        if (!this.reconstructor) {
          throw new Error('got binary data when not reconstructing a packet');
        } else {
          packet = this.reconstructor.takeBinaryData(obj);
          if (packet) {
            this.reconstructor = null;
            this.emit('decoded', packet);
          }
        }
      } else {
        throw new Error('Unknown type: ' + obj);
      }
    };
    function decodeString(str) {
      var p = {};
      var i = 0;
      p.type = Number(str.charAt(0));
      if (null == exports.types[p.type]) return error();
      if (exports.BINARY_EVENT == p.type || exports.BINARY_ACK == p.type) {
        var buf = '';
        while (str.charAt(++i) != '-') {
          buf += str.charAt(i);
          if (i == str.length) break;
        }
        if (buf != Number(buf) || str.charAt(i) != '-') {
          throw new Error('Illegal attachments');
        }
        p.attachments = Number(buf);
      }
      if ('/' == str.charAt(i + 1)) {
        p.nsp = '';
        while (++i) {
          var c = str.charAt(i);
          if (',' == c) break;
          p.nsp += c;
          if (i == str.length) break;
        }
      } else {
        p.nsp = '/';
      }
      var next = str.charAt(i + 1);
      if ('' !== next && Number(next) == next) {
        p.id = '';
        while (++i) {
          var c = str.charAt(i);
          if (null == c || Number(c) != c) {
            --i;
            break;
          }
          p.id += str.charAt(i);
          if (i == str.length) break;
        }
        p.id = Number(p.id);
      }
      if (str.charAt(++i)) {
        try {
          p.data = json.parse(str.substr(i));
        } catch (e) {
          return error();
        }
      }
      debug('decoded %s as %j', str, p);
      return p;
    }
    Decoder.prototype.destroy = function () {
      if (this.reconstructor) {
        this.reconstructor.finishedReconstruction();
      }
    };
    function BinaryReconstructor(packet) {
      this.reconPack = packet;
      this.buffers = [];
    }
    BinaryReconstructor.prototype.takeBinaryData = function (binData) {
      this.buffers.push(binData);
      if (this.buffers.length == this.reconPack.attachments) {
        var packet = binary.reconstructPacket(this.reconPack, this.buffers);
        this.finishedReconstruction();
        return packet;
      }
      return null;
    };
    BinaryReconstructor.prototype.finishedReconstruction = function () {
      this.reconPack = null;
      this.buffers = [];
    };
    function error(data) {
      return {
        type: exports.ERROR,
        data: 'parser error'
      };
    }
  })($__require('github:jspm/nodelibs-buffer@0.1.0.js').Buffer);
  return module.exports;
});
System.registerDynamic("npm:socket.io-parser@2.2.6.js", ["npm:socket.io-parser@2.2.6/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:socket.io-parser@2.2.6/index.js");
  return module.exports;
});
System.registerDynamic('npm:component-emitter@1.2.0/index.js', [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;

  /**
   * Expose `Emitter`.
   */

  module.exports = Emitter;

  /**
   * Initialize a new `Emitter`.
   *
   * @api public
   */

  function Emitter(obj) {
    if (obj) return mixin(obj);
  };

  /**
   * Mixin the emitter properties.
   *
   * @param {Object} obj
   * @return {Object}
   * @api private
   */

  function mixin(obj) {
    for (var key in Emitter.prototype) {
      obj[key] = Emitter.prototype[key];
    }
    return obj;
  }

  /**
   * Listen on the given `event` with `fn`.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */

  Emitter.prototype.on = Emitter.prototype.addEventListener = function (event, fn) {
    this._callbacks = this._callbacks || {};
    (this._callbacks['$' + event] = this._callbacks['$' + event] || []).push(fn);
    return this;
  };

  /**
   * Adds an `event` listener that will be invoked a single
   * time then automatically removed.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */

  Emitter.prototype.once = function (event, fn) {
    function on() {
      this.off(event, on);
      fn.apply(this, arguments);
    }

    on.fn = fn;
    this.on(event, on);
    return this;
  };

  /**
   * Remove the given callback for `event` or all
   * registered callbacks.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */

  Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function (event, fn) {
    this._callbacks = this._callbacks || {};

    // all
    if (0 == arguments.length) {
      this._callbacks = {};
      return this;
    }

    // specific event
    var callbacks = this._callbacks['$' + event];
    if (!callbacks) return this;

    // remove all handlers
    if (1 == arguments.length) {
      delete this._callbacks['$' + event];
      return this;
    }

    // remove specific handler
    var cb;
    for (var i = 0; i < callbacks.length; i++) {
      cb = callbacks[i];
      if (cb === fn || cb.fn === fn) {
        callbacks.splice(i, 1);
        break;
      }
    }
    return this;
  };

  /**
   * Emit `event` with the given args.
   *
   * @param {String} event
   * @param {Mixed} ...
   * @return {Emitter}
   */

  Emitter.prototype.emit = function (event) {
    this._callbacks = this._callbacks || {};
    var args = [].slice.call(arguments, 1),
        callbacks = this._callbacks['$' + event];

    if (callbacks) {
      callbacks = callbacks.slice(0);
      for (var i = 0, len = callbacks.length; i < len; ++i) {
        callbacks[i].apply(this, args);
      }
    }

    return this;
  };

  /**
   * Return array of callbacks for `event`.
   *
   * @param {String} event
   * @return {Array}
   * @api public
   */

  Emitter.prototype.listeners = function (event) {
    this._callbacks = this._callbacks || {};
    return this._callbacks['$' + event] || [];
  };

  /**
   * Check if this emitter has `event` handlers.
   *
   * @param {String} event
   * @return {Boolean}
   * @api public
   */

  Emitter.prototype.hasListeners = function (event) {
    return !!this.listeners(event).length;
  };
  return module.exports;
});
System.registerDynamic("npm:component-emitter@1.2.0.js", ["npm:component-emitter@1.2.0/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:component-emitter@1.2.0/index.js");
  return module.exports;
});
System.registerDynamic("npm:to-array@0.1.4/index.js", [], true, function ($__require, exports, module) {
    var define,
        global = this || self,
        GLOBAL = global;
    /* */
    module.exports = toArray;

    function toArray(list, index) {
        var array = [];

        index = index || 0;

        for (var i = index || 0; i < list.length; i++) {
            array[i - index] = list[i];
        }

        return array;
    }
    return module.exports;
});
System.registerDynamic("npm:to-array@0.1.4.js", ["npm:to-array@0.1.4/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:to-array@0.1.4/index.js");
  return module.exports;
});
System.registerDynamic("npm:socket.io-client@1.4.5/lib/on.js", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;

  /**
   * Module exports.
   */

  module.exports = on;

  /**
   * Helper for subscriptions.
   *
   * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
   * @param {String} event name
   * @param {Function} callback
   * @api public
   */

  function on(obj, ev, fn) {
    obj.on(ev, fn);
    return {
      destroy: function () {
        obj.removeListener(ev, fn);
      }
    };
  }
  return module.exports;
});
System.registerDynamic('npm:component-bind@1.0.0/index.js', [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /**
   * Slice reference.
   */

  var slice = [].slice;

  /**
   * Bind `obj` to `fn`.
   *
   * @param {Object} obj
   * @param {Function|String} fn or string
   * @return {Function}
   * @api public
   */

  module.exports = function (obj, fn) {
    if ('string' == typeof fn) fn = obj[fn];
    if ('function' != typeof fn) throw new Error('bind() requires a function');
    var args = slice.call(arguments, 2);
    return function () {
      return fn.apply(obj, args.concat(slice.call(arguments)));
    };
  };
  return module.exports;
});
System.registerDynamic("npm:component-bind@1.0.0.js", ["npm:component-bind@1.0.0/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:component-bind@1.0.0/index.js");
  return module.exports;
});
System.registerDynamic('npm:ms@0.7.1/index.js', [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /**
   * Helpers.
   */

  var s = 1000;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var y = d * 365.25;

  /**
   * Parse or format the given `val`.
   *
   * Options:
   *
   *  - `long` verbose formatting [false]
   *
   * @param {String|Number} val
   * @param {Object} options
   * @return {String|Number}
   * @api public
   */

  module.exports = function (val, options) {
    options = options || {};
    if ('string' == typeof val) return parse(val);
    return options.long ? long(val) : short(val);
  };

  /**
   * Parse the given `str` and return milliseconds.
   *
   * @param {String} str
   * @return {Number}
   * @api private
   */

  function parse(str) {
    str = '' + str;
    if (str.length > 10000) return;
    var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
    if (!match) return;
    var n = parseFloat(match[1]);
    var type = (match[2] || 'ms').toLowerCase();
    switch (type) {
      case 'years':
      case 'year':
      case 'yrs':
      case 'yr':
      case 'y':
        return n * y;
      case 'days':
      case 'day':
      case 'd':
        return n * d;
      case 'hours':
      case 'hour':
      case 'hrs':
      case 'hr':
      case 'h':
        return n * h;
      case 'minutes':
      case 'minute':
      case 'mins':
      case 'min':
      case 'm':
        return n * m;
      case 'seconds':
      case 'second':
      case 'secs':
      case 'sec':
      case 's':
        return n * s;
      case 'milliseconds':
      case 'millisecond':
      case 'msecs':
      case 'msec':
      case 'ms':
        return n;
    }
  }

  /**
   * Short format for `ms`.
   *
   * @param {Number} ms
   * @return {String}
   * @api private
   */

  function short(ms) {
    if (ms >= d) return Math.round(ms / d) + 'd';
    if (ms >= h) return Math.round(ms / h) + 'h';
    if (ms >= m) return Math.round(ms / m) + 'm';
    if (ms >= s) return Math.round(ms / s) + 's';
    return ms + 'ms';
  }

  /**
   * Long format for `ms`.
   *
   * @param {Number} ms
   * @return {String}
   * @api private
   */

  function long(ms) {
    return plural(ms, d, 'day') || plural(ms, h, 'hour') || plural(ms, m, 'minute') || plural(ms, s, 'second') || ms + ' ms';
  }

  /**
   * Pluralization helper.
   */

  function plural(ms, n, name) {
    if (ms < n) return;
    if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
    return Math.ceil(ms / n) + ' ' + name + 's';
  }
  return module.exports;
});
System.registerDynamic("npm:ms@0.7.1.js", ["npm:ms@0.7.1/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:ms@0.7.1/index.js");
  return module.exports;
});
System.registerDynamic('npm:debug@2.2.0/debug.js', ['npm:ms@0.7.1.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;

  /**
   * This is the common logic for both the Node.js and web browser
   * implementations of `debug()`.
   *
   * Expose `debug()` as the module.
   */

  exports = module.exports = debug;
  exports.coerce = coerce;
  exports.disable = disable;
  exports.enable = enable;
  exports.enabled = enabled;
  exports.humanize = $__require('npm:ms@0.7.1.js');

  /**
   * The currently active debug mode names, and names to skip.
   */

  exports.names = [];
  exports.skips = [];

  /**
   * Map of special "%n" handling functions, for the debug "format" argument.
   *
   * Valid key names are a single, lowercased letter, i.e. "n".
   */

  exports.formatters = {};

  /**
   * Previously assigned color.
   */

  var prevColor = 0;

  /**
   * Previous log timestamp.
   */

  var prevTime;

  /**
   * Select a color.
   *
   * @return {Number}
   * @api private
   */

  function selectColor() {
    return exports.colors[prevColor++ % exports.colors.length];
  }

  /**
   * Create a debugger with the given `namespace`.
   *
   * @param {String} namespace
   * @return {Function}
   * @api public
   */

  function debug(namespace) {

    // define the `disabled` version
    function disabled() {}
    disabled.enabled = false;

    // define the `enabled` version
    function enabled() {

      var self = enabled;

      // set `diff` timestamp
      var curr = +new Date();
      var ms = curr - (prevTime || curr);
      self.diff = ms;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;

      // add the `color` if not set
      if (null == self.useColors) self.useColors = exports.useColors();
      if (null == self.color && self.useColors) self.color = selectColor();

      var args = Array.prototype.slice.call(arguments);

      args[0] = exports.coerce(args[0]);

      if ('string' !== typeof args[0]) {
        // anything else let's inspect with %o
        args = ['%o'].concat(args);
      }

      // apply any `formatters` transformations
      var index = 0;
      args[0] = args[0].replace(/%([a-z%])/g, function (match, format) {
        // if we encounter an escaped % then don't increase the array index
        if (match === '%%') return match;
        index++;
        var formatter = exports.formatters[format];
        if ('function' === typeof formatter) {
          var val = args[index];
          match = formatter.call(self, val);

          // now we need to remove `args[index]` since it's inlined in the `format`
          args.splice(index, 1);
          index--;
        }
        return match;
      });

      if ('function' === typeof exports.formatArgs) {
        args = exports.formatArgs.apply(self, args);
      }
      var logFn = enabled.log || exports.log || console.log.bind(console);
      logFn.apply(self, args);
    }
    enabled.enabled = true;

    var fn = exports.enabled(namespace) ? enabled : disabled;

    fn.namespace = namespace;

    return fn;
  }

  /**
   * Enables a debug mode by namespaces. This can include modes
   * separated by a colon and wildcards.
   *
   * @param {String} namespaces
   * @api public
   */

  function enable(namespaces) {
    exports.save(namespaces);

    var split = (namespaces || '').split(/[\s,]+/);
    var len = split.length;

    for (var i = 0; i < len; i++) {
      if (!split[i]) continue; // ignore empty strings
      namespaces = split[i].replace(/\*/g, '.*?');
      if (namespaces[0] === '-') {
        exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
      } else {
        exports.names.push(new RegExp('^' + namespaces + '$'));
      }
    }
  }

  /**
   * Disable debug output.
   *
   * @api public
   */

  function disable() {
    exports.enable('');
  }

  /**
   * Returns true if the given mode name is enabled, false otherwise.
   *
   * @param {String} name
   * @return {Boolean}
   * @api public
   */

  function enabled(name) {
    var i, len;
    for (i = 0, len = exports.skips.length; i < len; i++) {
      if (exports.skips[i].test(name)) {
        return false;
      }
    }
    for (i = 0, len = exports.names.length; i < len; i++) {
      if (exports.names[i].test(name)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Coerce `val`.
   *
   * @param {Mixed} val
   * @return {Mixed}
   * @api private
   */

  function coerce(val) {
    if (val instanceof Error) return val.stack || val.message;
    return val;
  }
  return module.exports;
});
System.registerDynamic('npm:debug@2.2.0/browser.js', ['npm:debug@2.2.0/debug.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;

  /**
   * This is the web browser implementation of `debug()`.
   *
   * Expose `debug()` as the module.
   */

  exports = module.exports = $__require('npm:debug@2.2.0/debug.js');
  exports.log = log;
  exports.formatArgs = formatArgs;
  exports.save = save;
  exports.load = load;
  exports.useColors = useColors;
  exports.storage = 'undefined' != typeof chrome && 'undefined' != typeof chrome.storage ? chrome.storage.local : localstorage();

  /**
   * Colors.
   */

  exports.colors = ['lightseagreen', 'forestgreen', 'goldenrod', 'dodgerblue', 'darkorchid', 'crimson'];

  /**
   * Currently only WebKit-based Web Inspectors, Firefox >= v31,
   * and the Firebug extension (any Firefox version) are known
   * to support "%c" CSS customizations.
   *
   * TODO: add a `localStorage` variable to explicitly enable/disable colors
   */

  function useColors() {
    // is webkit? http://stackoverflow.com/a/16459606/376773
    return 'WebkitAppearance' in document.documentElement.style ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    window.console && (console.firebug || console.exception && console.table) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31;
  }

  /**
   * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
   */

  exports.formatters.j = function (v) {
    return JSON.stringify(v);
  };

  /**
   * Colorize log arguments if enabled.
   *
   * @api public
   */

  function formatArgs() {
    var args = arguments;
    var useColors = this.useColors;

    args[0] = (useColors ? '%c' : '') + this.namespace + (useColors ? ' %c' : ' ') + args[0] + (useColors ? '%c ' : ' ') + '+' + exports.humanize(this.diff);

    if (!useColors) return args;

    var c = 'color: ' + this.color;
    args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

    // the final "%c" is somewhat tricky, because there could be other
    // arguments passed either before or after the %c, so we need to
    // figure out the correct index to insert the CSS into
    var index = 0;
    var lastC = 0;
    args[0].replace(/%[a-z%]/g, function (match) {
      if ('%%' === match) return;
      index++;
      if ('%c' === match) {
        // we only are interested in the *last* %c
        // (the user may have provided their own)
        lastC = index;
      }
    });

    args.splice(lastC, 0, c);
    return args;
  }

  /**
   * Invokes `console.log()` when available.
   * No-op when `console.log` is not a "function".
   *
   * @api public
   */

  function log() {
    // this hackery is required for IE8/9, where
    // the `console.log` function doesn't have 'apply'
    return 'object' === typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
  }

  /**
   * Save `namespaces`.
   *
   * @param {String} namespaces
   * @api private
   */

  function save(namespaces) {
    try {
      if (null == namespaces) {
        exports.storage.removeItem('debug');
      } else {
        exports.storage.debug = namespaces;
      }
    } catch (e) {}
  }

  /**
   * Load `namespaces`.
   *
   * @return {String} returns the previously persisted debug modes
   * @api private
   */

  function load() {
    var r;
    try {
      r = exports.storage.debug;
    } catch (e) {}
    return r;
  }

  /**
   * Enable namespaces listed in `localStorage.debug` initially.
   */

  exports.enable(load());

  /**
   * Localstorage attempts to return the localstorage.
   *
   * This is necessary because safari throws
   * when a user disables cookies/localstorage
   * and you attempt to access it.
   *
   * @return {LocalStorage}
   * @api private
   */

  function localstorage() {
    try {
      return window.localStorage;
    } catch (e) {}
  }
  return module.exports;
});
System.registerDynamic("npm:debug@2.2.0.js", ["npm:debug@2.2.0/browser.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:debug@2.2.0/browser.js");
  return module.exports;
});
System.registerDynamic('npm:isarray@0.0.1/index.js', [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = Array.isArray || function (arr) {
    return Object.prototype.toString.call(arr) == '[object Array]';
  };
  return module.exports;
});
System.registerDynamic("npm:isarray@0.0.1.js", ["npm:isarray@0.0.1/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:isarray@0.0.1/index.js");
  return module.exports;
});
System.registerDynamic('npm:base64-js@0.0.8/lib/b64.js', [], true, function ($__require, exports, module) {
	var define,
	    global = this || self,
	    GLOBAL = global;
	/* */
	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	;(function (exports) {
		'use strict';

		var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

		var PLUS = '+'.charCodeAt(0);
		var SLASH = '/'.charCodeAt(0);
		var NUMBER = '0'.charCodeAt(0);
		var LOWER = 'a'.charCodeAt(0);
		var UPPER = 'A'.charCodeAt(0);
		var PLUS_URL_SAFE = '-'.charCodeAt(0);
		var SLASH_URL_SAFE = '_'.charCodeAt(0);

		function decode(elt) {
			var code = elt.charCodeAt(0);
			if (code === PLUS || code === PLUS_URL_SAFE) return 62; // '+'
			if (code === SLASH || code === SLASH_URL_SAFE) return 63; // '/'
			if (code < NUMBER) return -1; //no match
			if (code < NUMBER + 10) return code - NUMBER + 26 + 26;
			if (code < UPPER + 26) return code - UPPER;
			if (code < LOWER + 26) return code - LOWER + 26;
		}

		function b64ToByteArray(b64) {
			var i, j, l, tmp, placeHolders, arr;

			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4');
			}

			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length;
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0;

			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders);

			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length;

			var L = 0;

			function push(v) {
				arr[L++] = v;
			}

			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = decode(b64.charAt(i)) << 18 | decode(b64.charAt(i + 1)) << 12 | decode(b64.charAt(i + 2)) << 6 | decode(b64.charAt(i + 3));
				push((tmp & 0xFF0000) >> 16);
				push((tmp & 0xFF00) >> 8);
				push(tmp & 0xFF);
			}

			if (placeHolders === 2) {
				tmp = decode(b64.charAt(i)) << 2 | decode(b64.charAt(i + 1)) >> 4;
				push(tmp & 0xFF);
			} else if (placeHolders === 1) {
				tmp = decode(b64.charAt(i)) << 10 | decode(b64.charAt(i + 1)) << 4 | decode(b64.charAt(i + 2)) >> 2;
				push(tmp >> 8 & 0xFF);
				push(tmp & 0xFF);
			}

			return arr;
		}

		function uint8ToBase64(uint8) {
			var i,
			    extraBytes = uint8.length % 3,
			    // if we have 1 byte left, pad 2 bytes
			output = "",
			    temp,
			    length;

			function encode(num) {
				return lookup.charAt(num);
			}

			function tripletToBase64(num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F);
			}

			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
				output += tripletToBase64(temp);
			}

			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1];
					output += encode(temp >> 2);
					output += encode(temp << 4 & 0x3F);
					output += '==';
					break;
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + uint8[uint8.length - 1];
					output += encode(temp >> 10);
					output += encode(temp >> 4 & 0x3F);
					output += encode(temp << 2 & 0x3F);
					output += '=';
					break;
			}

			return output;
		}

		exports.toByteArray = b64ToByteArray;
		exports.fromByteArray = uint8ToBase64;
	})(typeof exports === 'undefined' ? this.base64js = {} : exports);
	return module.exports;
});
System.registerDynamic("npm:base64-js@0.0.8.js", ["npm:base64-js@0.0.8/lib/b64.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:base64-js@0.0.8/lib/b64.js");
  return module.exports;
});
System.registerDynamic("npm:ieee754@1.1.6/index.js", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  exports.read = function (buffer, offset, isLE, mLen, nBytes) {
    var e, m;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var nBits = -7;
    var i = isLE ? nBytes - 1 : 0;
    var d = isLE ? -1 : 1;
    var s = buffer[offset + i];

    i += d;

    e = s & (1 << -nBits) - 1;
    s >>= -nBits;
    nBits += eLen;
    for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

    m = e & (1 << -nBits) - 1;
    e >>= -nBits;
    nBits += mLen;
    for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

    if (e === 0) {
      e = 1 - eBias;
    } else if (e === eMax) {
      return m ? NaN : (s ? -1 : 1) * Infinity;
    } else {
      m = m + Math.pow(2, mLen);
      e = e - eBias;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
  };

  exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
    var e, m, c;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
    var i = isLE ? 0 : nBytes - 1;
    var d = isLE ? 1 : -1;
    var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;

    value = Math.abs(value);

    if (isNaN(value) || value === Infinity) {
      m = isNaN(value) ? 1 : 0;
      e = eMax;
    } else {
      e = Math.floor(Math.log(value) / Math.LN2);
      if (value * (c = Math.pow(2, -e)) < 1) {
        e--;
        c *= 2;
      }
      if (e + eBias >= 1) {
        value += rt / c;
      } else {
        value += rt * Math.pow(2, 1 - eBias);
      }
      if (value * c >= 2) {
        e++;
        c /= 2;
      }

      if (e + eBias >= eMax) {
        m = 0;
        e = eMax;
      } else if (e + eBias >= 1) {
        m = (value * c - 1) * Math.pow(2, mLen);
        e = e + eBias;
      } else {
        m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
        e = 0;
      }
    }

    for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

    e = e << mLen | m;
    eLen += mLen;
    for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

    buffer[offset + i - d] |= s * 128;
  };
  return module.exports;
});
System.registerDynamic("npm:ieee754@1.1.6.js", ["npm:ieee754@1.1.6/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:ieee754@1.1.6/index.js");
  return module.exports;
});
System.registerDynamic('npm:isarray@1.0.0/index.js', [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var toString = {}.toString;

  module.exports = Array.isArray || function (arr) {
    return toString.call(arr) == '[object Array]';
  };
  return module.exports;
});
System.registerDynamic("npm:isarray@1.0.0.js", ["npm:isarray@1.0.0/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:isarray@1.0.0/index.js");
  return module.exports;
});
System.registerDynamic('npm:buffer@3.6.0/index.js', ['npm:base64-js@0.0.8.js', 'npm:ieee754@1.1.6.js', 'npm:isarray@1.0.0.js'], true, function ($__require, exports, module) {
  /*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
   * @license  MIT
   */
  /* eslint-disable no-proto */

  'use strict';

  var define,
      global = this || self,
      GLOBAL = global;
  var base64 = $__require('npm:base64-js@0.0.8.js');
  var ieee754 = $__require('npm:ieee754@1.1.6.js');
  var isArray = $__require('npm:isarray@1.0.0.js');

  exports.Buffer = Buffer;
  exports.SlowBuffer = SlowBuffer;
  exports.INSPECT_MAX_BYTES = 50;
  Buffer.poolSize = 8192; // not used by this implementation

  var rootParent = {};

  /**
   * If `Buffer.TYPED_ARRAY_SUPPORT`:
   *   === true    Use Uint8Array implementation (fastest)
   *   === false   Use Object implementation (most compatible, even IE6)
   *
   * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
   * Opera 11.6+, iOS 4.2+.
   *
   * Due to various browser bugs, sometimes the Object implementation will be used even
   * when the browser supports typed arrays.
   *
   * Note:
   *
   *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
   *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
   *
   *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
   *     on objects.
   *
   *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
   *
   *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
   *     incorrect length in some situations.
  
   * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
   * get the Object implementation, which is slower but behaves correctly.
   */
  Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();

  function typedArraySupport() {
    function Bar() {}
    try {
      var arr = new Uint8Array(1);
      arr.foo = function () {
        return 42;
      };
      arr.constructor = Bar;
      return arr.foo() === 42 && // typed array instances can be augmented
      arr.constructor === Bar && // constructor can be set
      typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
      arr.subarray(1, 1).byteLength === 0; // ie10 has broken `subarray`
    } catch (e) {
      return false;
    }
  }

  function kMaxLength() {
    return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
  }

  /**
   * Class: Buffer
   * =============
   *
   * The Buffer constructor returns instances of `Uint8Array` that are augmented
   * with function properties for all the node `Buffer` API functions. We use
   * `Uint8Array` so that square bracket notation works as expected -- it returns
   * a single octet.
   *
   * By augmenting the instances, we can avoid modifying the `Uint8Array`
   * prototype.
   */
  function Buffer(arg) {
    if (!(this instanceof Buffer)) {
      // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
      if (arguments.length > 1) return new Buffer(arg, arguments[1]);
      return new Buffer(arg);
    }

    if (!Buffer.TYPED_ARRAY_SUPPORT) {
      this.length = 0;
      this.parent = undefined;
    }

    // Common case.
    if (typeof arg === 'number') {
      return fromNumber(this, arg);
    }

    // Slightly less common case.
    if (typeof arg === 'string') {
      return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8');
    }

    // Unusual.
    return fromObject(this, arg);
  }

  function fromNumber(that, length) {
    that = allocate(that, length < 0 ? 0 : checked(length) | 0);
    if (!Buffer.TYPED_ARRAY_SUPPORT) {
      for (var i = 0; i < length; i++) {
        that[i] = 0;
      }
    }
    return that;
  }

  function fromString(that, string, encoding) {
    if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8';

    // Assumption: byteLength() return value is always < kMaxLength.
    var length = byteLength(string, encoding) | 0;
    that = allocate(that, length);

    that.write(string, encoding);
    return that;
  }

  function fromObject(that, object) {
    if (Buffer.isBuffer(object)) return fromBuffer(that, object);

    if (isArray(object)) return fromArray(that, object);

    if (object == null) {
      throw new TypeError('must start with number, buffer, array or string');
    }

    if (typeof ArrayBuffer !== 'undefined') {
      if (object.buffer instanceof ArrayBuffer) {
        return fromTypedArray(that, object);
      }
      if (object instanceof ArrayBuffer) {
        return fromArrayBuffer(that, object);
      }
    }

    if (object.length) return fromArrayLike(that, object);

    return fromJsonObject(that, object);
  }

  function fromBuffer(that, buffer) {
    var length = checked(buffer.length) | 0;
    that = allocate(that, length);
    buffer.copy(that, 0, 0, length);
    return that;
  }

  function fromArray(that, array) {
    var length = checked(array.length) | 0;
    that = allocate(that, length);
    for (var i = 0; i < length; i += 1) {
      that[i] = array[i] & 255;
    }
    return that;
  }

  // Duplicate of fromArray() to keep fromArray() monomorphic.
  function fromTypedArray(that, array) {
    var length = checked(array.length) | 0;
    that = allocate(that, length);
    // Truncating the elements is probably not what people expect from typed
    // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
    // of the old Buffer constructor.
    for (var i = 0; i < length; i += 1) {
      that[i] = array[i] & 255;
    }
    return that;
  }

  function fromArrayBuffer(that, array) {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      // Return an augmented `Uint8Array` instance, for best performance
      array.byteLength;
      that = Buffer._augment(new Uint8Array(array));
    } else {
      // Fallback: Return an object instance of the Buffer class
      that = fromTypedArray(that, new Uint8Array(array));
    }
    return that;
  }

  function fromArrayLike(that, array) {
    var length = checked(array.length) | 0;
    that = allocate(that, length);
    for (var i = 0; i < length; i += 1) {
      that[i] = array[i] & 255;
    }
    return that;
  }

  // Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
  // Returns a zero-length buffer for inputs that don't conform to the spec.
  function fromJsonObject(that, object) {
    var array;
    var length = 0;

    if (object.type === 'Buffer' && isArray(object.data)) {
      array = object.data;
      length = checked(array.length) | 0;
    }
    that = allocate(that, length);

    for (var i = 0; i < length; i += 1) {
      that[i] = array[i] & 255;
    }
    return that;
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    Buffer.prototype.__proto__ = Uint8Array.prototype;
    Buffer.__proto__ = Uint8Array;
  } else {
    // pre-set for values that may exist in the future
    Buffer.prototype.length = undefined;
    Buffer.prototype.parent = undefined;
  }

  function allocate(that, length) {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      // Return an augmented `Uint8Array` instance, for best performance
      that = Buffer._augment(new Uint8Array(length));
      that.__proto__ = Buffer.prototype;
    } else {
      // Fallback: Return an object instance of the Buffer class
      that.length = length;
      that._isBuffer = true;
    }

    var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1;
    if (fromPool) that.parent = rootParent;

    return that;
  }

  function checked(length) {
    // Note: cannot use `length < kMaxLength` here because that fails when
    // length is NaN (which is otherwise coerced to zero.)
    if (length >= kMaxLength()) {
      throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength().toString(16) + ' bytes');
    }
    return length | 0;
  }

  function SlowBuffer(subject, encoding) {
    if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding);

    var buf = new Buffer(subject, encoding);
    delete buf.parent;
    return buf;
  }

  Buffer.isBuffer = function isBuffer(b) {
    return !!(b != null && b._isBuffer);
  };

  Buffer.compare = function compare(a, b) {
    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
      throw new TypeError('Arguments must be Buffers');
    }

    if (a === b) return 0;

    var x = a.length;
    var y = b.length;

    var i = 0;
    var len = Math.min(x, y);
    while (i < len) {
      if (a[i] !== b[i]) break;

      ++i;
    }

    if (i !== len) {
      x = a[i];
      y = b[i];
    }

    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
  };

  Buffer.isEncoding = function isEncoding(encoding) {
    switch (String(encoding).toLowerCase()) {
      case 'hex':
      case 'utf8':
      case 'utf-8':
      case 'ascii':
      case 'binary':
      case 'base64':
      case 'raw':
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return true;
      default:
        return false;
    }
  };

  Buffer.concat = function concat(list, length) {
    if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.');

    if (list.length === 0) {
      return new Buffer(0);
    }

    var i;
    if (length === undefined) {
      length = 0;
      for (i = 0; i < list.length; i++) {
        length += list[i].length;
      }
    }

    var buf = new Buffer(length);
    var pos = 0;
    for (i = 0; i < list.length; i++) {
      var item = list[i];
      item.copy(buf, pos);
      pos += item.length;
    }
    return buf;
  };

  function byteLength(string, encoding) {
    if (typeof string !== 'string') string = '' + string;

    var len = string.length;
    if (len === 0) return 0;

    // Use a for loop to avoid recursion
    var loweredCase = false;
    for (;;) {
      switch (encoding) {
        case 'ascii':
        case 'binary':
        // Deprecated
        case 'raw':
        case 'raws':
          return len;
        case 'utf8':
        case 'utf-8':
          return utf8ToBytes(string).length;
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return len * 2;
        case 'hex':
          return len >>> 1;
        case 'base64':
          return base64ToBytes(string).length;
        default:
          if (loweredCase) return utf8ToBytes(string).length; // assume utf8
          encoding = ('' + encoding).toLowerCase();
          loweredCase = true;
      }
    }
  }
  Buffer.byteLength = byteLength;

  function slowToString(encoding, start, end) {
    var loweredCase = false;

    start = start | 0;
    end = end === undefined || end === Infinity ? this.length : end | 0;

    if (!encoding) encoding = 'utf8';
    if (start < 0) start = 0;
    if (end > this.length) end = this.length;
    if (end <= start) return '';

    while (true) {
      switch (encoding) {
        case 'hex':
          return hexSlice(this, start, end);

        case 'utf8':
        case 'utf-8':
          return utf8Slice(this, start, end);

        case 'ascii':
          return asciiSlice(this, start, end);

        case 'binary':
          return binarySlice(this, start, end);

        case 'base64':
          return base64Slice(this, start, end);

        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return utf16leSlice(this, start, end);

        default:
          if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
          encoding = (encoding + '').toLowerCase();
          loweredCase = true;
      }
    }
  }

  Buffer.prototype.toString = function toString() {
    var length = this.length | 0;
    if (length === 0) return '';
    if (arguments.length === 0) return utf8Slice(this, 0, length);
    return slowToString.apply(this, arguments);
  };

  Buffer.prototype.equals = function equals(b) {
    if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
    if (this === b) return true;
    return Buffer.compare(this, b) === 0;
  };

  Buffer.prototype.inspect = function inspect() {
    var str = '';
    var max = exports.INSPECT_MAX_BYTES;
    if (this.length > 0) {
      str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
      if (this.length > max) str += ' ... ';
    }
    return '<Buffer ' + str + '>';
  };

  Buffer.prototype.compare = function compare(b) {
    if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
    if (this === b) return 0;
    return Buffer.compare(this, b);
  };

  Buffer.prototype.indexOf = function indexOf(val, byteOffset) {
    if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff;else if (byteOffset < -0x80000000) byteOffset = -0x80000000;
    byteOffset >>= 0;

    if (this.length === 0) return -1;
    if (byteOffset >= this.length) return -1;

    // Negative offsets start from the end of the buffer
    if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0);

    if (typeof val === 'string') {
      if (val.length === 0) return -1; // special case: looking for empty string always fails
      return String.prototype.indexOf.call(this, val, byteOffset);
    }
    if (Buffer.isBuffer(val)) {
      return arrayIndexOf(this, val, byteOffset);
    }
    if (typeof val === 'number') {
      if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
        return Uint8Array.prototype.indexOf.call(this, val, byteOffset);
      }
      return arrayIndexOf(this, [val], byteOffset);
    }

    function arrayIndexOf(arr, val, byteOffset) {
      var foundIndex = -1;
      for (var i = 0; byteOffset + i < arr.length; i++) {
        if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
          if (foundIndex === -1) foundIndex = i;
          if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex;
        } else {
          foundIndex = -1;
        }
      }
      return -1;
    }

    throw new TypeError('val must be string, number or Buffer');
  };

  // `get` is deprecated
  Buffer.prototype.get = function get(offset) {
    console.log('.get() is deprecated. Access using array indexes instead.');
    return this.readUInt8(offset);
  };

  // `set` is deprecated
  Buffer.prototype.set = function set(v, offset) {
    console.log('.set() is deprecated. Access using array indexes instead.');
    return this.writeUInt8(v, offset);
  };

  function hexWrite(buf, string, offset, length) {
    offset = Number(offset) || 0;
    var remaining = buf.length - offset;
    if (!length) {
      length = remaining;
    } else {
      length = Number(length);
      if (length > remaining) {
        length = remaining;
      }
    }

    // must be an even number of digits
    var strLen = string.length;
    if (strLen % 2 !== 0) throw new Error('Invalid hex string');

    if (length > strLen / 2) {
      length = strLen / 2;
    }
    for (var i = 0; i < length; i++) {
      var parsed = parseInt(string.substr(i * 2, 2), 16);
      if (isNaN(parsed)) throw new Error('Invalid hex string');
      buf[offset + i] = parsed;
    }
    return i;
  }

  function utf8Write(buf, string, offset, length) {
    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
  }

  function asciiWrite(buf, string, offset, length) {
    return blitBuffer(asciiToBytes(string), buf, offset, length);
  }

  function binaryWrite(buf, string, offset, length) {
    return asciiWrite(buf, string, offset, length);
  }

  function base64Write(buf, string, offset, length) {
    return blitBuffer(base64ToBytes(string), buf, offset, length);
  }

  function ucs2Write(buf, string, offset, length) {
    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
  }

  Buffer.prototype.write = function write(string, offset, length, encoding) {
    // Buffer#write(string)
    if (offset === undefined) {
      encoding = 'utf8';
      length = this.length;
      offset = 0;
      // Buffer#write(string, encoding)
    } else if (length === undefined && typeof offset === 'string') {
      encoding = offset;
      length = this.length;
      offset = 0;
      // Buffer#write(string, offset[, length][, encoding])
    } else if (isFinite(offset)) {
      offset = offset | 0;
      if (isFinite(length)) {
        length = length | 0;
        if (encoding === undefined) encoding = 'utf8';
      } else {
        encoding = length;
        length = undefined;
      }
      // legacy write(string, encoding, offset, length) - remove in v0.13
    } else {
      var swap = encoding;
      encoding = offset;
      offset = length | 0;
      length = swap;
    }

    var remaining = this.length - offset;
    if (length === undefined || length > remaining) length = remaining;

    if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
      throw new RangeError('attempt to write outside buffer bounds');
    }

    if (!encoding) encoding = 'utf8';

    var loweredCase = false;
    for (;;) {
      switch (encoding) {
        case 'hex':
          return hexWrite(this, string, offset, length);

        case 'utf8':
        case 'utf-8':
          return utf8Write(this, string, offset, length);

        case 'ascii':
          return asciiWrite(this, string, offset, length);

        case 'binary':
          return binaryWrite(this, string, offset, length);

        case 'base64':
          // Warning: maxLength not taken into account in base64Write
          return base64Write(this, string, offset, length);

        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return ucs2Write(this, string, offset, length);

        default:
          if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
          encoding = ('' + encoding).toLowerCase();
          loweredCase = true;
      }
    }
  };

  Buffer.prototype.toJSON = function toJSON() {
    return {
      type: 'Buffer',
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };

  function base64Slice(buf, start, end) {
    if (start === 0 && end === buf.length) {
      return base64.fromByteArray(buf);
    } else {
      return base64.fromByteArray(buf.slice(start, end));
    }
  }

  function utf8Slice(buf, start, end) {
    end = Math.min(buf.length, end);
    var res = [];

    var i = start;
    while (i < end) {
      var firstByte = buf[i];
      var codePoint = null;
      var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

      if (i + bytesPerSequence <= end) {
        var secondByte, thirdByte, fourthByte, tempCodePoint;

        switch (bytesPerSequence) {
          case 1:
            if (firstByte < 0x80) {
              codePoint = firstByte;
            }
            break;
          case 2:
            secondByte = buf[i + 1];
            if ((secondByte & 0xC0) === 0x80) {
              tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;
              if (tempCodePoint > 0x7F) {
                codePoint = tempCodePoint;
              }
            }
            break;
          case 3:
            secondByte = buf[i + 1];
            thirdByte = buf[i + 2];
            if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
              tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;
              if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                codePoint = tempCodePoint;
              }
            }
            break;
          case 4:
            secondByte = buf[i + 1];
            thirdByte = buf[i + 2];
            fourthByte = buf[i + 3];
            if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
              tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;
              if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                codePoint = tempCodePoint;
              }
            }
        }
      }

      if (codePoint === null) {
        // we did not generate a valid codePoint so insert a
        // replacement char (U+FFFD) and advance only 1 byte
        codePoint = 0xFFFD;
        bytesPerSequence = 1;
      } else if (codePoint > 0xFFFF) {
        // encode to utf16 (surrogate pair dance)
        codePoint -= 0x10000;
        res.push(codePoint >>> 10 & 0x3FF | 0xD800);
        codePoint = 0xDC00 | codePoint & 0x3FF;
      }

      res.push(codePoint);
      i += bytesPerSequence;
    }

    return decodeCodePointsArray(res);
  }

  // Based on http://stackoverflow.com/a/22747272/680742, the browser with
  // the lowest limit is Chrome, with 0x10000 args.
  // We go 1 magnitude less, for safety
  var MAX_ARGUMENTS_LENGTH = 0x1000;

  function decodeCodePointsArray(codePoints) {
    var len = codePoints.length;
    if (len <= MAX_ARGUMENTS_LENGTH) {
      return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
    }

    // Decode in chunks to avoid "call stack size exceeded".
    var res = '';
    var i = 0;
    while (i < len) {
      res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
    }
    return res;
  }

  function asciiSlice(buf, start, end) {
    var ret = '';
    end = Math.min(buf.length, end);

    for (var i = start; i < end; i++) {
      ret += String.fromCharCode(buf[i] & 0x7F);
    }
    return ret;
  }

  function binarySlice(buf, start, end) {
    var ret = '';
    end = Math.min(buf.length, end);

    for (var i = start; i < end; i++) {
      ret += String.fromCharCode(buf[i]);
    }
    return ret;
  }

  function hexSlice(buf, start, end) {
    var len = buf.length;

    if (!start || start < 0) start = 0;
    if (!end || end < 0 || end > len) end = len;

    var out = '';
    for (var i = start; i < end; i++) {
      out += toHex(buf[i]);
    }
    return out;
  }

  function utf16leSlice(buf, start, end) {
    var bytes = buf.slice(start, end);
    var res = '';
    for (var i = 0; i < bytes.length; i += 2) {
      res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
    }
    return res;
  }

  Buffer.prototype.slice = function slice(start, end) {
    var len = this.length;
    start = ~~start;
    end = end === undefined ? len : ~~end;

    if (start < 0) {
      start += len;
      if (start < 0) start = 0;
    } else if (start > len) {
      start = len;
    }

    if (end < 0) {
      end += len;
      if (end < 0) end = 0;
    } else if (end > len) {
      end = len;
    }

    if (end < start) end = start;

    var newBuf;
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      newBuf = Buffer._augment(this.subarray(start, end));
    } else {
      var sliceLen = end - start;
      newBuf = new Buffer(sliceLen, undefined);
      for (var i = 0; i < sliceLen; i++) {
        newBuf[i] = this[i + start];
      }
    }

    if (newBuf.length) newBuf.parent = this.parent || this;

    return newBuf;
  };

  /*
   * Need to make sure that buffer isn't trying to write out of bounds.
   */
  function checkOffset(offset, ext, length) {
    if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
    if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
  }

  Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
    offset = offset | 0;
    byteLength = byteLength | 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);

    var val = this[offset];
    var mul = 1;
    var i = 0;
    while (++i < byteLength && (mul *= 0x100)) {
      val += this[offset + i] * mul;
    }

    return val;
  };

  Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
    offset = offset | 0;
    byteLength = byteLength | 0;
    if (!noAssert) {
      checkOffset(offset, byteLength, this.length);
    }

    var val = this[offset + --byteLength];
    var mul = 1;
    while (byteLength > 0 && (mul *= 0x100)) {
      val += this[offset + --byteLength] * mul;
    }

    return val;
  };

  Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 1, this.length);
    return this[offset];
  };

  Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] | this[offset + 1] << 8;
  };

  Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] << 8 | this[offset + 1];
  };

  Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);

    return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
  };

  Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);

    return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
  };

  Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
    offset = offset | 0;
    byteLength = byteLength | 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);

    var val = this[offset];
    var mul = 1;
    var i = 0;
    while (++i < byteLength && (mul *= 0x100)) {
      val += this[offset + i] * mul;
    }
    mul *= 0x80;

    if (val >= mul) val -= Math.pow(2, 8 * byteLength);

    return val;
  };

  Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
    offset = offset | 0;
    byteLength = byteLength | 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);

    var i = byteLength;
    var mul = 1;
    var val = this[offset + --i];
    while (i > 0 && (mul *= 0x100)) {
      val += this[offset + --i] * mul;
    }
    mul *= 0x80;

    if (val >= mul) val -= Math.pow(2, 8 * byteLength);

    return val;
  };

  Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 1, this.length);
    if (!(this[offset] & 0x80)) return this[offset];
    return (0xff - this[offset] + 1) * -1;
  };

  Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length);
    var val = this[offset] | this[offset + 1] << 8;
    return val & 0x8000 ? val | 0xFFFF0000 : val;
  };

  Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 2, this.length);
    var val = this[offset + 1] | this[offset] << 8;
    return val & 0x8000 ? val | 0xFFFF0000 : val;
  };

  Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);

    return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
  };

  Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);

    return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
  };

  Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);
    return ieee754.read(this, offset, true, 23, 4);
  };

  Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 4, this.length);
    return ieee754.read(this, offset, false, 23, 4);
  };

  Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 8, this.length);
    return ieee754.read(this, offset, true, 52, 8);
  };

  Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
    if (!noAssert) checkOffset(offset, 8, this.length);
    return ieee754.read(this, offset, false, 52, 8);
  };

  function checkInt(buf, value, offset, ext, max, min) {
    if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance');
    if (value > max || value < min) throw new RangeError('value is out of bounds');
    if (offset + ext > buf.length) throw new RangeError('index out of range');
  }

  Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset | 0;
    byteLength = byteLength | 0;
    if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0);

    var mul = 1;
    var i = 0;
    this[offset] = value & 0xFF;
    while (++i < byteLength && (mul *= 0x100)) {
      this[offset + i] = value / mul & 0xFF;
    }

    return offset + byteLength;
  };

  Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset | 0;
    byteLength = byteLength | 0;
    if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0);

    var i = byteLength - 1;
    var mul = 1;
    this[offset + i] = value & 0xFF;
    while (--i >= 0 && (mul *= 0x100)) {
      this[offset + i] = value / mul & 0xFF;
    }

    return offset + byteLength;
  };

  Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
    if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
    this[offset] = value & 0xff;
    return offset + 1;
  };

  function objectWriteUInt16(buf, value, offset, littleEndian) {
    if (value < 0) value = 0xffff + value + 1;
    for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
      buf[offset + i] = (value & 0xff << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
    }
  }

  Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = value & 0xff;
      this[offset + 1] = value >>> 8;
    } else {
      objectWriteUInt16(this, value, offset, true);
    }
    return offset + 2;
  };

  Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = value >>> 8;
      this[offset + 1] = value & 0xff;
    } else {
      objectWriteUInt16(this, value, offset, false);
    }
    return offset + 2;
  };

  function objectWriteUInt32(buf, value, offset, littleEndian) {
    if (value < 0) value = 0xffffffff + value + 1;
    for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
      buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 0xff;
    }
  }

  Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset + 3] = value >>> 24;
      this[offset + 2] = value >>> 16;
      this[offset + 1] = value >>> 8;
      this[offset] = value & 0xff;
    } else {
      objectWriteUInt32(this, value, offset, true);
    }
    return offset + 4;
  };

  Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 0xff;
    } else {
      objectWriteUInt32(this, value, offset, false);
    }
    return offset + 4;
  };

  Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) {
      var limit = Math.pow(2, 8 * byteLength - 1);

      checkInt(this, value, offset, byteLength, limit - 1, -limit);
    }

    var i = 0;
    var mul = 1;
    var sub = value < 0 ? 1 : 0;
    this[offset] = value & 0xFF;
    while (++i < byteLength && (mul *= 0x100)) {
      this[offset + i] = (value / mul >> 0) - sub & 0xFF;
    }

    return offset + byteLength;
  };

  Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) {
      var limit = Math.pow(2, 8 * byteLength - 1);

      checkInt(this, value, offset, byteLength, limit - 1, -limit);
    }

    var i = byteLength - 1;
    var mul = 1;
    var sub = value < 0 ? 1 : 0;
    this[offset + i] = value & 0xFF;
    while (--i >= 0 && (mul *= 0x100)) {
      this[offset + i] = (value / mul >> 0) - sub & 0xFF;
    }

    return offset + byteLength;
  };

  Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
    if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
    if (value < 0) value = 0xff + value + 1;
    this[offset] = value & 0xff;
    return offset + 1;
  };

  Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = value & 0xff;
      this[offset + 1] = value >>> 8;
    } else {
      objectWriteUInt16(this, value, offset, true);
    }
    return offset + 2;
  };

  Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = value >>> 8;
      this[offset + 1] = value & 0xff;
    } else {
      objectWriteUInt16(this, value, offset, false);
    }
    return offset + 2;
  };

  Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = value & 0xff;
      this[offset + 1] = value >>> 8;
      this[offset + 2] = value >>> 16;
      this[offset + 3] = value >>> 24;
    } else {
      objectWriteUInt32(this, value, offset, true);
    }
    return offset + 4;
  };

  Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset | 0;
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
    if (value < 0) value = 0xffffffff + value + 1;
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 0xff;
    } else {
      objectWriteUInt32(this, value, offset, false);
    }
    return offset + 4;
  };

  function checkIEEE754(buf, value, offset, ext, max, min) {
    if (value > max || value < min) throw new RangeError('value is out of bounds');
    if (offset + ext > buf.length) throw new RangeError('index out of range');
    if (offset < 0) throw new RangeError('index out of range');
  }

  function writeFloat(buf, value, offset, littleEndian, noAssert) {
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
    }
    ieee754.write(buf, value, offset, littleEndian, 23, 4);
    return offset + 4;
  }

  Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
    return writeFloat(this, value, offset, true, noAssert);
  };

  Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
    return writeFloat(this, value, offset, false, noAssert);
  };

  function writeDouble(buf, value, offset, littleEndian, noAssert) {
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
    }
    ieee754.write(buf, value, offset, littleEndian, 52, 8);
    return offset + 8;
  }

  Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
    return writeDouble(this, value, offset, true, noAssert);
  };

  Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
    return writeDouble(this, value, offset, false, noAssert);
  };

  // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
  Buffer.prototype.copy = function copy(target, targetStart, start, end) {
    if (!start) start = 0;
    if (!end && end !== 0) end = this.length;
    if (targetStart >= target.length) targetStart = target.length;
    if (!targetStart) targetStart = 0;
    if (end > 0 && end < start) end = start;

    // Copy 0 bytes; we're done
    if (end === start) return 0;
    if (target.length === 0 || this.length === 0) return 0;

    // Fatal error conditions
    if (targetStart < 0) {
      throw new RangeError('targetStart out of bounds');
    }
    if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
    if (end < 0) throw new RangeError('sourceEnd out of bounds');

    // Are we oob?
    if (end > this.length) end = this.length;
    if (target.length - targetStart < end - start) {
      end = target.length - targetStart + start;
    }

    var len = end - start;
    var i;

    if (this === target && start < targetStart && targetStart < end) {
      // descending copy from end
      for (i = len - 1; i >= 0; i--) {
        target[i + targetStart] = this[i + start];
      }
    } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
      // ascending copy from start
      for (i = 0; i < len; i++) {
        target[i + targetStart] = this[i + start];
      }
    } else {
      target._set(this.subarray(start, start + len), targetStart);
    }

    return len;
  };

  // fill(value, start=0, end=buffer.length)
  Buffer.prototype.fill = function fill(value, start, end) {
    if (!value) value = 0;
    if (!start) start = 0;
    if (!end) end = this.length;

    if (end < start) throw new RangeError('end < start');

    // Fill 0 bytes; we're done
    if (end === start) return;
    if (this.length === 0) return;

    if (start < 0 || start >= this.length) throw new RangeError('start out of bounds');
    if (end < 0 || end > this.length) throw new RangeError('end out of bounds');

    var i;
    if (typeof value === 'number') {
      for (i = start; i < end; i++) {
        this[i] = value;
      }
    } else {
      var bytes = utf8ToBytes(value.toString());
      var len = bytes.length;
      for (i = start; i < end; i++) {
        this[i] = bytes[i % len];
      }
    }

    return this;
  };

  /**
   * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
   * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
   */
  Buffer.prototype.toArrayBuffer = function toArrayBuffer() {
    if (typeof Uint8Array !== 'undefined') {
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        return new Buffer(this).buffer;
      } else {
        var buf = new Uint8Array(this.length);
        for (var i = 0, len = buf.length; i < len; i += 1) {
          buf[i] = this[i];
        }
        return buf.buffer;
      }
    } else {
      throw new TypeError('Buffer.toArrayBuffer not supported in this browser');
    }
  };

  // HELPER FUNCTIONS
  // ================

  var BP = Buffer.prototype;

  /**
   * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
   */
  Buffer._augment = function _augment(arr) {
    arr.constructor = Buffer;
    arr._isBuffer = true;

    // save reference to original Uint8Array set method before overwriting
    arr._set = arr.set;

    // deprecated
    arr.get = BP.get;
    arr.set = BP.set;

    arr.write = BP.write;
    arr.toString = BP.toString;
    arr.toLocaleString = BP.toString;
    arr.toJSON = BP.toJSON;
    arr.equals = BP.equals;
    arr.compare = BP.compare;
    arr.indexOf = BP.indexOf;
    arr.copy = BP.copy;
    arr.slice = BP.slice;
    arr.readUIntLE = BP.readUIntLE;
    arr.readUIntBE = BP.readUIntBE;
    arr.readUInt8 = BP.readUInt8;
    arr.readUInt16LE = BP.readUInt16LE;
    arr.readUInt16BE = BP.readUInt16BE;
    arr.readUInt32LE = BP.readUInt32LE;
    arr.readUInt32BE = BP.readUInt32BE;
    arr.readIntLE = BP.readIntLE;
    arr.readIntBE = BP.readIntBE;
    arr.readInt8 = BP.readInt8;
    arr.readInt16LE = BP.readInt16LE;
    arr.readInt16BE = BP.readInt16BE;
    arr.readInt32LE = BP.readInt32LE;
    arr.readInt32BE = BP.readInt32BE;
    arr.readFloatLE = BP.readFloatLE;
    arr.readFloatBE = BP.readFloatBE;
    arr.readDoubleLE = BP.readDoubleLE;
    arr.readDoubleBE = BP.readDoubleBE;
    arr.writeUInt8 = BP.writeUInt8;
    arr.writeUIntLE = BP.writeUIntLE;
    arr.writeUIntBE = BP.writeUIntBE;
    arr.writeUInt16LE = BP.writeUInt16LE;
    arr.writeUInt16BE = BP.writeUInt16BE;
    arr.writeUInt32LE = BP.writeUInt32LE;
    arr.writeUInt32BE = BP.writeUInt32BE;
    arr.writeIntLE = BP.writeIntLE;
    arr.writeIntBE = BP.writeIntBE;
    arr.writeInt8 = BP.writeInt8;
    arr.writeInt16LE = BP.writeInt16LE;
    arr.writeInt16BE = BP.writeInt16BE;
    arr.writeInt32LE = BP.writeInt32LE;
    arr.writeInt32BE = BP.writeInt32BE;
    arr.writeFloatLE = BP.writeFloatLE;
    arr.writeFloatBE = BP.writeFloatBE;
    arr.writeDoubleLE = BP.writeDoubleLE;
    arr.writeDoubleBE = BP.writeDoubleBE;
    arr.fill = BP.fill;
    arr.inspect = BP.inspect;
    arr.toArrayBuffer = BP.toArrayBuffer;

    return arr;
  };

  var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

  function base64clean(str) {
    // Node strips out invalid characters like \n and \t from the string, base64-js does not
    str = stringtrim(str).replace(INVALID_BASE64_RE, '');
    // Node converts strings with length < 2 to ''
    if (str.length < 2) return '';
    // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
    while (str.length % 4 !== 0) {
      str = str + '=';
    }
    return str;
  }

  function stringtrim(str) {
    if (str.trim) return str.trim();
    return str.replace(/^\s+|\s+$/g, '');
  }

  function toHex(n) {
    if (n < 16) return '0' + n.toString(16);
    return n.toString(16);
  }

  function utf8ToBytes(string, units) {
    units = units || Infinity;
    var codePoint;
    var length = string.length;
    var leadSurrogate = null;
    var bytes = [];

    for (var i = 0; i < length; i++) {
      codePoint = string.charCodeAt(i);

      // is surrogate component
      if (codePoint > 0xD7FF && codePoint < 0xE000) {
        // last char was a lead
        if (!leadSurrogate) {
          // no lead yet
          if (codePoint > 0xDBFF) {
            // unexpected trail
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
            continue;
          } else if (i + 1 === length) {
            // unpaired lead
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
            continue;
          }

          // valid lead
          leadSurrogate = codePoint;

          continue;
        }

        // 2 leads in a row
        if (codePoint < 0xDC00) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          leadSurrogate = codePoint;
          continue;
        }

        // valid surrogate pair
        codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
      } else if (leadSurrogate) {
        // valid bmp char, but last char was a lead
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
      }

      leadSurrogate = null;

      // encode utf8
      if (codePoint < 0x80) {
        if ((units -= 1) < 0) break;
        bytes.push(codePoint);
      } else if (codePoint < 0x800) {
        if ((units -= 2) < 0) break;
        bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
      } else if (codePoint < 0x10000) {
        if ((units -= 3) < 0) break;
        bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
      } else if (codePoint < 0x110000) {
        if ((units -= 4) < 0) break;
        bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
      } else {
        throw new Error('Invalid code point');
      }
    }

    return bytes;
  }

  function asciiToBytes(str) {
    var byteArray = [];
    for (var i = 0; i < str.length; i++) {
      // Node's code seems to be doing this and not & 0x7F..
      byteArray.push(str.charCodeAt(i) & 0xFF);
    }
    return byteArray;
  }

  function utf16leToBytes(str, units) {
    var c, hi, lo;
    var byteArray = [];
    for (var i = 0; i < str.length; i++) {
      if ((units -= 2) < 0) break;

      c = str.charCodeAt(i);
      hi = c >> 8;
      lo = c % 256;
      byteArray.push(lo);
      byteArray.push(hi);
    }

    return byteArray;
  }

  function base64ToBytes(str) {
    return base64.toByteArray(base64clean(str));
  }

  function blitBuffer(src, dst, offset, length) {
    for (var i = 0; i < length; i++) {
      if (i + offset >= dst.length || i >= src.length) break;
      dst[i + offset] = src[i];
    }
    return i;
  }
  return module.exports;
});
System.registerDynamic("npm:buffer@3.6.0.js", ["npm:buffer@3.6.0/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:buffer@3.6.0/index.js");
  return module.exports;
});
System.registerDynamic('github:jspm/nodelibs-buffer@0.1.0/index.js', ['npm:buffer@3.6.0.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = System._nodeRequire ? System._nodeRequire('buffer') : $__require('npm:buffer@3.6.0.js');
  return module.exports;
});
System.registerDynamic("github:jspm/nodelibs-buffer@0.1.0.js", ["github:jspm/nodelibs-buffer@0.1.0/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("github:jspm/nodelibs-buffer@0.1.0/index.js");
  return module.exports;
});
System.registerDynamic('npm:has-binary@0.1.7/index.js', ['npm:isarray@0.0.1.js', 'github:jspm/nodelibs-buffer@0.1.0.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  (function (Buffer) {
    var isArray = $__require('npm:isarray@0.0.1.js');
    module.exports = hasBinary;
    function hasBinary(data) {
      function _hasBinary(obj) {
        if (!obj) return false;
        if (global.Buffer && global.Buffer.isBuffer && global.Buffer.isBuffer(obj) || global.ArrayBuffer && obj instanceof ArrayBuffer || global.Blob && obj instanceof Blob || global.File && obj instanceof File) {
          return true;
        }
        if (isArray(obj)) {
          for (var i = 0; i < obj.length; i++) {
            if (_hasBinary(obj[i])) {
              return true;
            }
          }
        } else if (obj && 'object' == typeof obj) {
          if (obj.toJSON && 'function' == typeof obj.toJSON) {
            obj = obj.toJSON();
          }
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) {
              return true;
            }
          }
        }
        return false;
      }
      return _hasBinary(data);
    }
  })($__require('github:jspm/nodelibs-buffer@0.1.0.js').Buffer);
  return module.exports;
});
System.registerDynamic("npm:has-binary@0.1.7.js", ["npm:has-binary@0.1.7/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:has-binary@0.1.7/index.js");
  return module.exports;
});
System.registerDynamic('npm:socket.io-client@1.4.5/lib/socket.js', ['npm:socket.io-parser@2.2.6.js', 'npm:component-emitter@1.2.0.js', 'npm:to-array@0.1.4.js', 'npm:socket.io-client@1.4.5/lib/on.js', 'npm:component-bind@1.0.0.js', 'npm:debug@2.2.0.js', 'npm:has-binary@0.1.7.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var parser = $__require('npm:socket.io-parser@2.2.6.js');
  var Emitter = $__require('npm:component-emitter@1.2.0.js');
  var toArray = $__require('npm:to-array@0.1.4.js');
  var on = $__require('npm:socket.io-client@1.4.5/lib/on.js');
  var bind = $__require('npm:component-bind@1.0.0.js');
  var debug = $__require('npm:debug@2.2.0.js')('socket.io-client:socket');
  var hasBin = $__require('npm:has-binary@0.1.7.js');
  module.exports = exports = Socket;
  var events = {
    connect: 1,
    connect_error: 1,
    connect_timeout: 1,
    connecting: 1,
    disconnect: 1,
    error: 1,
    reconnect: 1,
    reconnect_attempt: 1,
    reconnect_failed: 1,
    reconnect_error: 1,
    reconnecting: 1,
    ping: 1,
    pong: 1
  };
  var emit = Emitter.prototype.emit;
  function Socket(io, nsp) {
    this.io = io;
    this.nsp = nsp;
    this.json = this;
    this.ids = 0;
    this.acks = {};
    this.receiveBuffer = [];
    this.sendBuffer = [];
    this.connected = false;
    this.disconnected = true;
    if (this.io.autoConnect) this.open();
  }
  Emitter(Socket.prototype);
  Socket.prototype.subEvents = function () {
    if (this.subs) return;
    var io = this.io;
    this.subs = [on(io, 'open', bind(this, 'onopen')), on(io, 'packet', bind(this, 'onpacket')), on(io, 'close', bind(this, 'onclose'))];
  };
  Socket.prototype.open = Socket.prototype.connect = function () {
    if (this.connected) return this;
    this.subEvents();
    this.io.open();
    if ('open' == this.io.readyState) this.onopen();
    this.emit('connecting');
    return this;
  };
  Socket.prototype.send = function () {
    var args = toArray(arguments);
    args.unshift('message');
    this.emit.apply(this, args);
    return this;
  };
  Socket.prototype.emit = function (ev) {
    if (events.hasOwnProperty(ev)) {
      emit.apply(this, arguments);
      return this;
    }
    var args = toArray(arguments);
    var parserType = parser.EVENT;
    if (hasBin(args)) {
      parserType = parser.BINARY_EVENT;
    }
    var packet = {
      type: parserType,
      data: args
    };
    packet.options = {};
    packet.options.compress = !this.flags || false !== this.flags.compress;
    if ('function' == typeof args[args.length - 1]) {
      debug('emitting packet with ack id %d', this.ids);
      this.acks[this.ids] = args.pop();
      packet.id = this.ids++;
    }
    if (this.connected) {
      this.packet(packet);
    } else {
      this.sendBuffer.push(packet);
    }
    delete this.flags;
    return this;
  };
  Socket.prototype.packet = function (packet) {
    packet.nsp = this.nsp;
    this.io.packet(packet);
  };
  Socket.prototype.onopen = function () {
    debug('transport is open - connecting');
    if ('/' != this.nsp) {
      this.packet({ type: parser.CONNECT });
    }
  };
  Socket.prototype.onclose = function (reason) {
    debug('close (%s)', reason);
    this.connected = false;
    this.disconnected = true;
    delete this.id;
    this.emit('disconnect', reason);
  };
  Socket.prototype.onpacket = function (packet) {
    if (packet.nsp != this.nsp) return;
    switch (packet.type) {
      case parser.CONNECT:
        this.onconnect();
        break;
      case parser.EVENT:
        this.onevent(packet);
        break;
      case parser.BINARY_EVENT:
        this.onevent(packet);
        break;
      case parser.ACK:
        this.onack(packet);
        break;
      case parser.BINARY_ACK:
        this.onack(packet);
        break;
      case parser.DISCONNECT:
        this.ondisconnect();
        break;
      case parser.ERROR:
        this.emit('error', packet.data);
        break;
    }
  };
  Socket.prototype.onevent = function (packet) {
    var args = packet.data || [];
    debug('emitting event %j', args);
    if (null != packet.id) {
      debug('attaching ack callback to event');
      args.push(this.ack(packet.id));
    }
    if (this.connected) {
      emit.apply(this, args);
    } else {
      this.receiveBuffer.push(args);
    }
  };
  Socket.prototype.ack = function (id) {
    var self = this;
    var sent = false;
    return function () {
      if (sent) return;
      sent = true;
      var args = toArray(arguments);
      debug('sending ack %j', args);
      var type = hasBin(args) ? parser.BINARY_ACK : parser.ACK;
      self.packet({
        type: type,
        id: id,
        data: args
      });
    };
  };
  Socket.prototype.onack = function (packet) {
    var ack = this.acks[packet.id];
    if ('function' == typeof ack) {
      debug('calling ack %s with %j', packet.id, packet.data);
      ack.apply(this, packet.data);
      delete this.acks[packet.id];
    } else {
      debug('bad ack %s', packet.id);
    }
  };
  Socket.prototype.onconnect = function () {
    this.connected = true;
    this.disconnected = false;
    this.emit('connect');
    this.emitBuffered();
  };
  Socket.prototype.emitBuffered = function () {
    var i;
    for (i = 0; i < this.receiveBuffer.length; i++) {
      emit.apply(this, this.receiveBuffer[i]);
    }
    this.receiveBuffer = [];
    for (i = 0; i < this.sendBuffer.length; i++) {
      this.packet(this.sendBuffer[i]);
    }
    this.sendBuffer = [];
  };
  Socket.prototype.ondisconnect = function () {
    debug('server disconnect (%s)', this.nsp);
    this.destroy();
    this.onclose('io server disconnect');
  };
  Socket.prototype.destroy = function () {
    if (this.subs) {
      for (var i = 0; i < this.subs.length; i++) {
        this.subs[i].destroy();
      }
      this.subs = null;
    }
    this.io.destroy(this);
  };
  Socket.prototype.close = Socket.prototype.disconnect = function () {
    if (this.connected) {
      debug('performing disconnect (%s)', this.nsp);
      this.packet({ type: parser.DISCONNECT });
    }
    this.destroy();
    if (this.connected) {
      this.onclose('io client disconnect');
    }
    return this;
  };
  Socket.prototype.compress = function (compress) {
    this.flags = this.flags || {};
    this.flags.compress = compress;
    return this;
  };
  return module.exports;
});
System.registerDynamic('npm:socket.io-client@1.4.5/lib/index.js', ['npm:socket.io-client@1.4.5/lib/url.js', 'npm:socket.io-parser@2.2.6.js', 'npm:socket.io-client@1.4.5/lib/manager.js', 'npm:debug@2.2.0.js', 'npm:socket.io-client@1.4.5/lib/socket.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var url = $__require('npm:socket.io-client@1.4.5/lib/url.js');
  var parser = $__require('npm:socket.io-parser@2.2.6.js');
  var Manager = $__require('npm:socket.io-client@1.4.5/lib/manager.js');
  var debug = $__require('npm:debug@2.2.0.js')('socket.io-client');
  module.exports = exports = lookup;
  var cache = exports.managers = {};
  function lookup(uri, opts) {
    if (typeof uri == 'object') {
      opts = uri;
      uri = undefined;
    }
    opts = opts || {};
    var parsed = url(uri);
    var source = parsed.source;
    var id = parsed.id;
    var path = parsed.path;
    var sameNamespace = cache[id] && path in cache[id].nsps;
    var newConnection = opts.forceNew || opts['force new connection'] || false === opts.multiplex || sameNamespace;
    var io;
    if (newConnection) {
      debug('ignoring socket cache for %s', source);
      io = Manager(source, opts);
    } else {
      if (!cache[id]) {
        debug('new io instance for %s', source);
        cache[id] = Manager(source, opts);
      }
      io = cache[id];
    }
    return io.socket(parsed.path);
  }
  exports.protocol = parser.protocol;
  exports.connect = lookup;
  exports.Manager = $__require('npm:socket.io-client@1.4.5/lib/manager.js');
  exports.Socket = $__require('npm:socket.io-client@1.4.5/lib/socket.js');
  return module.exports;
});
System.registerDynamic("npm:socket.io-client@1.4.5.js", ["npm:socket.io-client@1.4.5/lib/index.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  module.exports = $__require("npm:socket.io-client@1.4.5/lib/index.js");
  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/$.to-object.js', ['npm:core-js@1.2.6/library/modules/$.defined.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var defined = $__require('npm:core-js@1.2.6/library/modules/$.defined.js');
  module.exports = function (it) {
    return Object(defined(it));
  };
  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/$.object-sap.js', ['npm:core-js@1.2.6/library/modules/$.export.js', 'npm:core-js@1.2.6/library/modules/$.core.js', 'npm:core-js@1.2.6/library/modules/$.fails.js'], true, function ($__require, exports, module) {
    var define,
        global = this || self,
        GLOBAL = global;
    /* */
    var $export = $__require('npm:core-js@1.2.6/library/modules/$.export.js'),
        core = $__require('npm:core-js@1.2.6/library/modules/$.core.js'),
        fails = $__require('npm:core-js@1.2.6/library/modules/$.fails.js');
    module.exports = function (KEY, exec) {
        var fn = (core.Object || {})[KEY] || Object[KEY],
            exp = {};
        exp[KEY] = exec(fn);
        $export($export.S + $export.F * fails(function () {
            fn(1);
        }), 'Object', exp);
    };
    return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/es6.object.keys.js', ['npm:core-js@1.2.6/library/modules/$.to-object.js', 'npm:core-js@1.2.6/library/modules/$.object-sap.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var toObject = $__require('npm:core-js@1.2.6/library/modules/$.to-object.js');
  $__require('npm:core-js@1.2.6/library/modules/$.object-sap.js')('keys', function ($keys) {
    return function keys(it) {
      return $keys(toObject(it));
    };
  });
  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/fn/object/keys.js', ['npm:core-js@1.2.6/library/modules/es6.object.keys.js', 'npm:core-js@1.2.6/library/modules/$.core.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  $__require('npm:core-js@1.2.6/library/modules/es6.object.keys.js');
  module.exports = $__require('npm:core-js@1.2.6/library/modules/$.core.js').Object.keys;
  return module.exports;
});
System.registerDynamic("npm:babel-runtime@5.8.35/core-js/object/keys.js", ["npm:core-js@1.2.6/library/fn/object/keys.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = { "default": $__require("npm:core-js@1.2.6/library/fn/object/keys.js"), __esModule: true };
  return module.exports;
});
System.register('controller/audio-controller.js', ['npm:babel-runtime@5.8.35/helpers/create-class.js', 'npm:babel-runtime@5.8.35/helpers/class-call-check.js', 'view/dom-helper.js'], function (_export) {
    var _createClass, _classCallCheck, DomHelper, AudioController;

    return {
        setters: [function (_npmBabelRuntime5835HelpersCreateClassJs) {
            _createClass = _npmBabelRuntime5835HelpersCreateClassJs['default'];
        }, function (_npmBabelRuntime5835HelpersClassCallCheckJs) {
            _classCallCheck = _npmBabelRuntime5835HelpersClassCallCheckJs['default'];
        }, function (_viewDomHelperJs) {
            DomHelper = _viewDomHelperJs['default'];
        }],
        execute: function () {
            /**
             * Controls all audio logic
             */
            'use strict';

            AudioController = (function () {
                function AudioController() {
                    _classCallCheck(this, AudioController);

                    this.isMuted = false;
                    this.deathSound = new Audio('assets/death.wav');
                    this.killSound = new Audio('assets/kill.wav');
                    this.foodCollectedSound = new Audio('assets/food-consumed.wav');
                    this.swapSound = new Audio('assets/swap.wav');
                    DomHelper.getVolumeSlider().addEventListener('input', this.updateVolume.bind(this));
                }

                _createClass(AudioController, [{
                    key: 'playDeathSound',
                    value: function playDeathSound() {
                        if (!this.isMuted) {
                            this.deathSound.play();
                        }
                    }
                }, {
                    key: 'playFoodCollectedSound',
                    value: function playFoodCollectedSound() {
                        if (!this.isMuted) {
                            this.foodCollectedSound.play();
                        }
                    }
                }, {
                    key: 'playKillSound',
                    value: function playKillSound() {
                        if (!this.isMuted) {
                            this.killSound.play();
                        }
                    }
                }, {
                    key: 'playSwapSound',
                    value: function playSwapSound() {
                        if (!this.isMuted) {
                            this.swapSound.play();
                        }
                    }
                }, {
                    key: 'updateVolume',
                    value: function updateVolume() {
                        var volume = DomHelper.getVolumeSlider().value;
                        this.deathSound.volume = volume;
                        this.foodCollectedSound.volume = volume;
                        this.killSound.volume = volume;
                        this.swapSound.volume = volume;
                    }
                }, {
                    key: 'toggleMute',
                    value: function toggleMute() {
                        this.isMuted = !this.isMuted;
                    }
                }]);

                return AudioController;
            })();

            _export('default', AudioController);
        }
    };
});
System.register("model/text-to-draw.js", ["npm:babel-runtime@5.8.35/helpers/create-class.js", "npm:babel-runtime@5.8.35/helpers/class-call-check.js"], function (_export) {
    var _createClass, _classCallCheck, TextToDraw;

    return {
        setters: [function (_npmBabelRuntime5835HelpersCreateClassJs) {
            _createClass = _npmBabelRuntime5835HelpersCreateClassJs["default"];
        }, function (_npmBabelRuntime5835HelpersClassCallCheckJs) {
            _classCallCheck = _npmBabelRuntime5835HelpersClassCallCheckJs["default"];
        }],
        execute: function () {
            "use strict";

            TextToDraw = (function () {
                function TextToDraw(text, coordinate, color) {
                    _classCallCheck(this, TextToDraw);

                    this.text = text;
                    this.coordinate = coordinate;
                    this.color = color;
                    this.counter = 0;
                }

                _createClass(TextToDraw, [{
                    key: "incrementCounter",
                    value: function incrementCounter() {
                        this.counter++;
                    }
                }]);

                return TextToDraw;
            })();

            _export("default", TextToDraw);
        }
    };
});
System.register('view/canvas-view.js', ['npm:babel-runtime@5.8.35/helpers/create-class.js', 'npm:babel-runtime@5.8.35/helpers/class-call-check.js', 'npm:babel-runtime@5.8.35/core-js/get-iterator.js', 'config/client-config.js'], function (_export) {
    var _createClass, _classCallCheck, _getIterator, ClientConfig, CanvasView;

    return {
        setters: [function (_npmBabelRuntime5835HelpersCreateClassJs) {
            _createClass = _npmBabelRuntime5835HelpersCreateClassJs['default'];
        }, function (_npmBabelRuntime5835HelpersClassCallCheckJs) {
            _classCallCheck = _npmBabelRuntime5835HelpersClassCallCheckJs['default'];
        }, function (_npmBabelRuntime5835CoreJsGetIteratorJs) {
            _getIterator = _npmBabelRuntime5835CoreJsGetIteratorJs['default'];
        }, function (_configClientConfigJs) {
            ClientConfig = _configClientConfigJs['default'];
        }],
        execute: function () {

            /**
             * Handles all requests related to the canvas
             */
            'use strict';

            CanvasView = (function () {
                function CanvasView(canvas, squareSizeInPixels, imageUploadCanvas, canvasClickHandler) {
                    _classCallCheck(this, CanvasView);

                    this.height = canvas.height;
                    this.width = canvas.width;
                    this.context = canvas.getContext('2d');
                    this.squareSizeInPixels = squareSizeInPixels;
                    this.backgroundImageUploadCanvas = canvas;
                    this.imageUploadCanvas = imageUploadCanvas;
                    this.showGridLines = false;
                    this._initializeClickListeners(canvas, canvasClickHandler);
                }

                _createClass(CanvasView, [{
                    key: 'clear',
                    value: function clear() {
                        this.context.fillStyle = 'black';
                        this.context.globalAlpha = 1;
                        this.context.fillRect(0, 0, this.width, this.height);

                        if (this.backgroundImage) {
                            this.context.drawImage(this.backgroundImage, 0, 0);
                        }

                        if (this.showGridLines) {
                            this.context.strokeStyle = '#2a2a2a';
                            this.context.lineWidth = 0.5;
                            for (var i = this.squareSizeInPixels / 2; i < this.width || i < this.height; i += this.squareSizeInPixels) {
                                // draw horizontal lines
                                this.context.moveTo(i, 0);
                                this.context.lineTo(i, this.height);
                                // draw vertical lines
                                this.context.moveTo(0, i);
                                this.context.lineTo(this.width, i);
                            }
                            this.context.stroke();
                        }
                    }
                }, {
                    key: 'drawImages',
                    value: function drawImages(coordinates, base64Image) {
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = _getIterator(coordinates), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var coordinate = _step.value;

                                this.drawImage(coordinate, base64Image);
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator['return']) {
                                    _iterator['return']();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }
                    }
                }, {
                    key: 'drawImage',
                    value: function drawImage(coordinate, base64Image) {
                        var x = coordinate.x * this.squareSizeInPixels;
                        var y = coordinate.y * this.squareSizeInPixels;
                        var image = new Image();
                        image.src = base64Image;
                        this.context.drawImage(image, x - this.squareSizeInPixels / 2, y - this.squareSizeInPixels / 2, this.squareSizeInPixels, this.squareSizeInPixels);
                    }
                }, {
                    key: 'drawSquares',
                    value: function drawSquares(coordinates, color) {
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = _getIterator(coordinates), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var coordinate = _step2.value;

                                this.drawSquare(coordinate, color);
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                                    _iterator2['return']();
                                }
                            } finally {
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }
                    }
                }, {
                    key: 'drawSquare',
                    value: function drawSquare(coordinate, color) {
                        var x = coordinate.x * this.squareSizeInPixels;
                        var y = coordinate.y * this.squareSizeInPixels;
                        this.context.fillStyle = color;
                        this.context.beginPath();
                        this.context.moveTo(x - this.squareSizeInPixels / 2, y - this.squareSizeInPixels / 2);
                        this.context.lineTo(x + this.squareSizeInPixels / 2, y - this.squareSizeInPixels / 2);
                        this.context.lineTo(x + this.squareSizeInPixels / 2, y + this.squareSizeInPixels / 2);
                        this.context.lineTo(x - this.squareSizeInPixels / 2, y + this.squareSizeInPixels / 2);
                        this.context.closePath();
                        this.context.fill();
                    }
                }, {
                    key: 'drawSquareAround',
                    value: function drawSquareAround(coordinate, color) {
                        var x = coordinate.x * this.squareSizeInPixels;
                        var y = coordinate.y * this.squareSizeInPixels;
                        var lengthAroundSquare = this.squareSizeInPixels * 2;
                        this.context.lineWidth = this.squareSizeInPixels;
                        this.context.strokeStyle = color;
                        this.context.beginPath();
                        this.context.moveTo(x - lengthAroundSquare, y - lengthAroundSquare);
                        this.context.lineTo(x + lengthAroundSquare, y - lengthAroundSquare);
                        this.context.lineTo(x + lengthAroundSquare, y + lengthAroundSquare);
                        this.context.lineTo(x - lengthAroundSquare, y + lengthAroundSquare);
                        this.context.closePath();
                        this.context.stroke();
                    }
                }, {
                    key: 'drawFadingText',
                    value: function drawFadingText(textToDraw, turnsToShow) {
                        this.context.save();
                        this.context.globalAlpha = this._getOpacityFromCounter(textToDraw.counter, turnsToShow);
                        this.context.lineWidth = 1;
                        this.context.strokeStyle = 'black';
                        this.context.fillStyle = textToDraw.color;
                        this.context.font = ClientConfig.CANVAS_TEXT_STYLE;

                        var textWidth = this.context.measureText(textToDraw.text).width;
                        var textHeight = 24;
                        var x = textToDraw.coordinate.x * this.squareSizeInPixels - textWidth / 2;
                        var y = textToDraw.coordinate.y * this.squareSizeInPixels + textHeight / 2;
                        if (x < 0) {
                            x = 0;
                        } else if (x > this.width - textWidth) {
                            x = this.width - textWidth;
                        }
                        if (y < textHeight) {
                            y = textHeight;
                        } else if (y > this.height) {
                            y = this.height;
                        }
                        // Draw text specifying the bottom left corner
                        this.context.strokeText(textToDraw.text, x, y);
                        this.context.fillText(textToDraw.text, x, y);
                        this.context.restore();
                    }
                }, {
                    key: 'clearBackgroundImage',
                    value: function clearBackgroundImage() {
                        delete this.backgroundImage;
                    }
                }, {
                    key: 'setBackgroundImage',
                    value: function setBackgroundImage(backgroundImage) {
                        this.backgroundImage = new Image();
                        this.backgroundImage.src = backgroundImage;
                    }
                }, {
                    key: 'resizeUploadedBackgroundImageAndBase64',
                    value: function resizeUploadedBackgroundImageAndBase64(image, imageType) {
                        var imageToDraw = image;
                        var maxImageWidth = this.backgroundImageUploadCanvas.width;
                        var maxImageHeight = this.backgroundImageUploadCanvas.height;
                        if (imageToDraw.width > maxImageWidth) {
                            imageToDraw.width = maxImageWidth;
                        }
                        if (imageToDraw.height > maxImageHeight) {
                            imageToDraw.height = maxImageHeight;
                        }
                        var imageUploadCanvasContext = this.backgroundImageUploadCanvas.getContext('2d');
                        imageUploadCanvasContext.clearRect(0, 0, maxImageWidth, maxImageHeight);
                        imageUploadCanvasContext.drawImage(imageToDraw, 0, 0, imageToDraw.width, imageToDraw.height);

                        return this.backgroundImageUploadCanvas.toDataURL(imageType);
                    }
                }, {
                    key: 'resizeUploadedImageAndBase64',
                    value: function resizeUploadedImageAndBase64(image, imageType) {
                        var imageToDraw = image;
                        var maxImageWidth = this.imageUploadCanvas.width;
                        var maxImageHeight = this.imageUploadCanvas.height;
                        if (imageToDraw.width > maxImageWidth) {
                            imageToDraw.width = maxImageWidth;
                        }
                        if (imageToDraw.height > maxImageHeight) {
                            imageToDraw.height = maxImageHeight;
                        }
                        var imageUploadCanvasContext = this.imageUploadCanvas.getContext('2d');
                        imageUploadCanvasContext.clearRect(0, 0, maxImageWidth, maxImageHeight);
                        imageUploadCanvasContext.drawImage(imageToDraw, 0, 0, imageToDraw.width, imageToDraw.height);

                        return this.imageUploadCanvas.toDataURL(imageType);
                    }
                }, {
                    key: 'toggleGridLines',
                    value: function toggleGridLines() {
                        this.showGridLines = !this.showGridLines;
                    }

                    // Gets a fade-in/fade-out opacity
                }, {
                    key: '_getOpacityFromCounter',
                    value: function _getOpacityFromCounter(counter, turnsToShow) {
                        if (counter < turnsToShow * 0.1 || counter > turnsToShow * 0.9) {
                            return 0.33;
                        } else if (counter < turnsToShow * 0.2 || counter > turnsToShow * 0.8) {
                            return 0.66;
                        }
                        return 1;
                    }
                }, {
                    key: '_initializeClickListeners',
                    value: function _initializeClickListeners(canvas, canvasClickHandler) {
                        var self = this;
                        canvas.addEventListener('click', function (event) {
                            var x = event.pageX - canvas.offsetLeft;
                            var y = event.pageY - canvas.offsetTop;
                            var xCoord = Math.round(x / self.squareSizeInPixels);
                            var yCoord = Math.round(y / self.squareSizeInPixels);
                            canvasClickHandler(xCoord, yCoord);
                        }, false);
                    }
                }]);

                return CanvasView;
            })();

            _export('default', CanvasView);
        }
    };
});
System.register('view/canvas-factory.js', ['npm:babel-runtime@5.8.35/helpers/create-class.js', 'npm:babel-runtime@5.8.35/helpers/class-call-check.js', 'view/canvas-view.js', 'view/dom-helper.js'], function (_export) {
    var _createClass, _classCallCheck, CanvasView, DomHelper, CanvasFactory;

    return {
        setters: [function (_npmBabelRuntime5835HelpersCreateClassJs) {
            _createClass = _npmBabelRuntime5835HelpersCreateClassJs['default'];
        }, function (_npmBabelRuntime5835HelpersClassCallCheckJs) {
            _classCallCheck = _npmBabelRuntime5835HelpersClassCallCheckJs['default'];
        }, function (_viewCanvasViewJs) {
            CanvasView = _viewCanvasViewJs['default'];
        }, function (_viewDomHelperJs) {
            DomHelper = _viewDomHelperJs['default'];
        }],
        execute: function () {

            /**
             * Constructs CanvasView
             */
            'use strict';

            CanvasFactory = (function () {
                function CanvasFactory() {
                    _classCallCheck(this, CanvasFactory);
                }

                _createClass(CanvasFactory, null, [{
                    key: 'createCanvasView',
                    value: function createCanvasView(squareSizeInPixels, horizontalSquares, verticalSquares, canvasClickHandler) {
                        var canvas = DomHelper.createElement('canvas');
                        canvas.width = horizontalSquares * squareSizeInPixels;
                        canvas.height = verticalSquares * squareSizeInPixels;
                        canvas.style.width = canvas.width + 'px';
                        canvas.style.height = canvas.height + 'px';
                        DomHelper.getGameBoardDiv().appendChild(canvas);
                        var imageUploadCanvas = this._createImageUploadCanvas(squareSizeInPixels);
                        return new CanvasView(canvas, squareSizeInPixels, imageUploadCanvas, canvasClickHandler);
                    }
                }, {
                    key: '_createImageUploadCanvas',
                    value: function _createImageUploadCanvas(squareSizeInPixels) {
                        var canvas = document.createElement('canvas');
                        var roundedSize = Math.floor(squareSizeInPixels);
                        canvas.width = roundedSize;
                        canvas.height = roundedSize;
                        return canvas;
                    }
                }]);

                return CanvasFactory;
            })();

            _export('default', CanvasFactory);
        }
    };
});
System.registerDynamic("npm:core-js@1.2.6/library/modules/$.add-to-unscopables.js", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = function () {/* empty */};
  return module.exports;
});
System.registerDynamic("npm:core-js@1.2.6/library/modules/$.iter-step.js", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = function (done, value) {
    return { value: value, done: !!done };
  };
  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/$.iobject.js', ['npm:core-js@1.2.6/library/modules/$.cof.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var cof = $__require('npm:core-js@1.2.6/library/modules/$.cof.js');
  module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
    return cof(it) == 'String' ? it.split('') : Object(it);
  };
  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/$.to-iobject.js', ['npm:core-js@1.2.6/library/modules/$.iobject.js', 'npm:core-js@1.2.6/library/modules/$.defined.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var IObject = $__require('npm:core-js@1.2.6/library/modules/$.iobject.js'),
      defined = $__require('npm:core-js@1.2.6/library/modules/$.defined.js');
  module.exports = function (it) {
    return IObject(defined(it));
  };
  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/es6.array.iterator.js', ['npm:core-js@1.2.6/library/modules/$.add-to-unscopables.js', 'npm:core-js@1.2.6/library/modules/$.iter-step.js', 'npm:core-js@1.2.6/library/modules/$.iterators.js', 'npm:core-js@1.2.6/library/modules/$.to-iobject.js', 'npm:core-js@1.2.6/library/modules/$.iter-define.js'], true, function ($__require, exports, module) {
  /* */
  'use strict';

  var define,
      global = this || self,
      GLOBAL = global;
  var addToUnscopables = $__require('npm:core-js@1.2.6/library/modules/$.add-to-unscopables.js'),
      step = $__require('npm:core-js@1.2.6/library/modules/$.iter-step.js'),
      Iterators = $__require('npm:core-js@1.2.6/library/modules/$.iterators.js'),
      toIObject = $__require('npm:core-js@1.2.6/library/modules/$.to-iobject.js');
  module.exports = $__require('npm:core-js@1.2.6/library/modules/$.iter-define.js')(Array, 'Array', function (iterated, kind) {
    this._t = toIObject(iterated);
    this._i = 0;
    this._k = kind;
  }, function () {
    var O = this._t,
        kind = this._k,
        index = this._i++;
    if (!O || index >= O.length) {
      this._t = undefined;
      return step(1);
    }
    if (kind == 'keys') return step(0, index);
    if (kind == 'values') return step(0, O[index]);
    return step(0, [index, O[index]]);
  }, 'values');
  Iterators.Arguments = Iterators.Array;
  addToUnscopables('keys');
  addToUnscopables('values');
  addToUnscopables('entries');
  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/web.dom.iterable.js', ['npm:core-js@1.2.6/library/modules/es6.array.iterator.js', 'npm:core-js@1.2.6/library/modules/$.iterators.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  $__require('npm:core-js@1.2.6/library/modules/es6.array.iterator.js');
  var Iterators = $__require('npm:core-js@1.2.6/library/modules/$.iterators.js');
  Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
  return module.exports;
});
System.registerDynamic("npm:core-js@1.2.6/library/modules/$.to-integer.js", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  // 7.1.4 ToInteger
  var ceil = Math.ceil,
      floor = Math.floor;
  module.exports = function (it) {
    return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
  };
  return module.exports;
});
System.registerDynamic("npm:core-js@1.2.6/library/modules/$.defined.js", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  // 7.2.1 RequireObjectCoercible(argument)
  module.exports = function (it) {
    if (it == undefined) throw TypeError("Can't call method on  " + it);
    return it;
  };
  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/$.string-at.js', ['npm:core-js@1.2.6/library/modules/$.to-integer.js', 'npm:core-js@1.2.6/library/modules/$.defined.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var toInteger = $__require('npm:core-js@1.2.6/library/modules/$.to-integer.js'),
      defined = $__require('npm:core-js@1.2.6/library/modules/$.defined.js');
  module.exports = function (TO_STRING) {
    return function (that, pos) {
      var s = String(defined(that)),
          i = toInteger(pos),
          l = s.length,
          a,
          b;
      if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
      a = s.charCodeAt(i);
      return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
    };
  };
  return module.exports;
});
System.registerDynamic("npm:core-js@1.2.6/library/modules/$.library.js", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = true;
  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/$.a-function.js', [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = function (it) {
    if (typeof it != 'function') throw TypeError(it + ' is not a function!');
    return it;
  };
  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/$.ctx.js', ['npm:core-js@1.2.6/library/modules/$.a-function.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var aFunction = $__require('npm:core-js@1.2.6/library/modules/$.a-function.js');
  module.exports = function (fn, that, length) {
    aFunction(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 1:
        return function (a) {
          return fn.call(that, a);
        };
      case 2:
        return function (a, b) {
          return fn.call(that, a, b);
        };
      case 3:
        return function (a, b, c) {
          return fn.call(that, a, b, c);
        };
    }
    return function () {
      return fn.apply(that, arguments);
    };
  };
  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/$.export.js', ['npm:core-js@1.2.6/library/modules/$.global.js', 'npm:core-js@1.2.6/library/modules/$.core.js', 'npm:core-js@1.2.6/library/modules/$.ctx.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var global = $__require('npm:core-js@1.2.6/library/modules/$.global.js'),
      core = $__require('npm:core-js@1.2.6/library/modules/$.core.js'),
      ctx = $__require('npm:core-js@1.2.6/library/modules/$.ctx.js'),
      PROTOTYPE = 'prototype';
  var $export = function (type, name, source) {
    var IS_FORCED = type & $export.F,
        IS_GLOBAL = type & $export.G,
        IS_STATIC = type & $export.S,
        IS_PROTO = type & $export.P,
        IS_BIND = type & $export.B,
        IS_WRAP = type & $export.W,
        exports = IS_GLOBAL ? core : core[name] || (core[name] = {}),
        target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE],
        key,
        own,
        out;
    if (IS_GLOBAL) source = name;
    for (key in source) {
      own = !IS_FORCED && target && key in target;
      if (own && key in exports) continue;
      out = own ? target[key] : source[key];
      exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key] : IS_BIND && own ? ctx(out, global) : IS_WRAP && target[key] == out ? function (C) {
        var F = function (param) {
          return this instanceof C ? new C(param) : C(param);
        };
        F[PROTOTYPE] = C[PROTOTYPE];
        return F;
      }(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
      if (IS_PROTO) (exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
    }
  };
  $export.F = 1;
  $export.G = 2;
  $export.S = 4;
  $export.P = 8;
  $export.B = 16;
  $export.W = 32;
  module.exports = $export;
  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/$.redefine.js', ['npm:core-js@1.2.6/library/modules/$.hide.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = $__require('npm:core-js@1.2.6/library/modules/$.hide.js');
  return module.exports;
});
System.registerDynamic("npm:core-js@1.2.6/library/modules/$.property-desc.js", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };
  return module.exports;
});
System.registerDynamic("npm:core-js@1.2.6/library/modules/$.fails.js", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = function (exec) {
    try {
      return !!exec();
    } catch (e) {
      return true;
    }
  };
  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/$.descriptors.js', ['npm:core-js@1.2.6/library/modules/$.fails.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = !$__require('npm:core-js@1.2.6/library/modules/$.fails.js')(function () {
    return Object.defineProperty({}, 'a', { get: function () {
        return 7;
      } }).a != 7;
  });
  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/$.hide.js', ['npm:core-js@1.2.6/library/modules/$.js', 'npm:core-js@1.2.6/library/modules/$.property-desc.js', 'npm:core-js@1.2.6/library/modules/$.descriptors.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var $ = $__require('npm:core-js@1.2.6/library/modules/$.js'),
      createDesc = $__require('npm:core-js@1.2.6/library/modules/$.property-desc.js');
  module.exports = $__require('npm:core-js@1.2.6/library/modules/$.descriptors.js') ? function (object, key, value) {
    return $.setDesc(object, key, createDesc(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };
  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/$.iter-create.js', ['npm:core-js@1.2.6/library/modules/$.js', 'npm:core-js@1.2.6/library/modules/$.property-desc.js', 'npm:core-js@1.2.6/library/modules/$.set-to-string-tag.js', 'npm:core-js@1.2.6/library/modules/$.hide.js', 'npm:core-js@1.2.6/library/modules/$.wks.js'], true, function ($__require, exports, module) {
  /* */
  'use strict';

  var define,
      global = this || self,
      GLOBAL = global;
  var $ = $__require('npm:core-js@1.2.6/library/modules/$.js'),
      descriptor = $__require('npm:core-js@1.2.6/library/modules/$.property-desc.js'),
      setToStringTag = $__require('npm:core-js@1.2.6/library/modules/$.set-to-string-tag.js'),
      IteratorPrototype = {};
  $__require('npm:core-js@1.2.6/library/modules/$.hide.js')(IteratorPrototype, $__require('npm:core-js@1.2.6/library/modules/$.wks.js')('iterator'), function () {
    return this;
  });
  module.exports = function (Constructor, NAME, next) {
    Constructor.prototype = $.create(IteratorPrototype, { next: descriptor(1, next) });
    setToStringTag(Constructor, NAME + ' Iterator');
  };
  return module.exports;
});
System.registerDynamic("npm:core-js@1.2.6/library/modules/$.has.js", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var hasOwnProperty = {}.hasOwnProperty;
  module.exports = function (it, key) {
    return hasOwnProperty.call(it, key);
  };
  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/$.set-to-string-tag.js', ['npm:core-js@1.2.6/library/modules/$.js', 'npm:core-js@1.2.6/library/modules/$.has.js', 'npm:core-js@1.2.6/library/modules/$.wks.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var def = $__require('npm:core-js@1.2.6/library/modules/$.js').setDesc,
      has = $__require('npm:core-js@1.2.6/library/modules/$.has.js'),
      TAG = $__require('npm:core-js@1.2.6/library/modules/$.wks.js')('toStringTag');
  module.exports = function (it, tag, stat) {
    if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, {
      configurable: true,
      value: tag
    });
  };
  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/$.iter-define.js', ['npm:core-js@1.2.6/library/modules/$.library.js', 'npm:core-js@1.2.6/library/modules/$.export.js', 'npm:core-js@1.2.6/library/modules/$.redefine.js', 'npm:core-js@1.2.6/library/modules/$.hide.js', 'npm:core-js@1.2.6/library/modules/$.has.js', 'npm:core-js@1.2.6/library/modules/$.iterators.js', 'npm:core-js@1.2.6/library/modules/$.iter-create.js', 'npm:core-js@1.2.6/library/modules/$.set-to-string-tag.js', 'npm:core-js@1.2.6/library/modules/$.js', 'npm:core-js@1.2.6/library/modules/$.wks.js'], true, function ($__require, exports, module) {
  /* */
  'use strict';

  var define,
      global = this || self,
      GLOBAL = global;
  var LIBRARY = $__require('npm:core-js@1.2.6/library/modules/$.library.js'),
      $export = $__require('npm:core-js@1.2.6/library/modules/$.export.js'),
      redefine = $__require('npm:core-js@1.2.6/library/modules/$.redefine.js'),
      hide = $__require('npm:core-js@1.2.6/library/modules/$.hide.js'),
      has = $__require('npm:core-js@1.2.6/library/modules/$.has.js'),
      Iterators = $__require('npm:core-js@1.2.6/library/modules/$.iterators.js'),
      $iterCreate = $__require('npm:core-js@1.2.6/library/modules/$.iter-create.js'),
      setToStringTag = $__require('npm:core-js@1.2.6/library/modules/$.set-to-string-tag.js'),
      getProto = $__require('npm:core-js@1.2.6/library/modules/$.js').getProto,
      ITERATOR = $__require('npm:core-js@1.2.6/library/modules/$.wks.js')('iterator'),
      BUGGY = !([].keys && 'next' in [].keys()),
      FF_ITERATOR = '@@iterator',
      KEYS = 'keys',
      VALUES = 'values';
  var returnThis = function () {
    return this;
  };
  module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
    $iterCreate(Constructor, NAME, next);
    var getMethod = function (kind) {
      if (!BUGGY && kind in proto) return proto[kind];
      switch (kind) {
        case KEYS:
          return function keys() {
            return new Constructor(this, kind);
          };
        case VALUES:
          return function values() {
            return new Constructor(this, kind);
          };
      }
      return function entries() {
        return new Constructor(this, kind);
      };
    };
    var TAG = NAME + ' Iterator',
        DEF_VALUES = DEFAULT == VALUES,
        VALUES_BUG = false,
        proto = Base.prototype,
        $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT],
        $default = $native || getMethod(DEFAULT),
        methods,
        key;
    if ($native) {
      var IteratorPrototype = getProto($default.call(new Base()));
      setToStringTag(IteratorPrototype, TAG, true);
      if (!LIBRARY && has(proto, FF_ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
      if (DEF_VALUES && $native.name !== VALUES) {
        VALUES_BUG = true;
        $default = function values() {
          return $native.call(this);
        };
      }
    }
    if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
      hide(proto, ITERATOR, $default);
    }
    Iterators[NAME] = $default;
    Iterators[TAG] = returnThis;
    if (DEFAULT) {
      methods = {
        values: DEF_VALUES ? $default : getMethod(VALUES),
        keys: IS_SET ? $default : getMethod(KEYS),
        entries: !DEF_VALUES ? $default : getMethod('entries')
      };
      if (FORCED) for (key in methods) {
        if (!(key in proto)) redefine(proto, key, methods[key]);
      } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
    }
    return methods;
  };
  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/es6.string.iterator.js', ['npm:core-js@1.2.6/library/modules/$.string-at.js', 'npm:core-js@1.2.6/library/modules/$.iter-define.js'], true, function ($__require, exports, module) {
  /* */
  'use strict';

  var define,
      global = this || self,
      GLOBAL = global;
  var $at = $__require('npm:core-js@1.2.6/library/modules/$.string-at.js')(true);
  $__require('npm:core-js@1.2.6/library/modules/$.iter-define.js')(String, 'String', function (iterated) {
    this._t = String(iterated);
    this._i = 0;
  }, function () {
    var O = this._t,
        index = this._i,
        point;
    if (index >= O.length) return {
      value: undefined,
      done: true
    };
    point = $at(O, index);
    this._i += point.length;
    return {
      value: point,
      done: false
    };
  });
  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/$.is-object.js', [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };
  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/$.an-object.js', ['npm:core-js@1.2.6/library/modules/$.is-object.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var isObject = $__require('npm:core-js@1.2.6/library/modules/$.is-object.js');
  module.exports = function (it) {
    if (!isObject(it)) throw TypeError(it + ' is not an object!');
    return it;
  };
  return module.exports;
});
System.registerDynamic("npm:core-js@1.2.6/library/modules/$.cof.js", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var toString = {}.toString;

  module.exports = function (it) {
    return toString.call(it).slice(8, -1);
  };
  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/$.classof.js', ['npm:core-js@1.2.6/library/modules/$.cof.js', 'npm:core-js@1.2.6/library/modules/$.wks.js'], true, function ($__require, exports, module) {
    var define,
        global = this || self,
        GLOBAL = global;
    /* */
    var cof = $__require('npm:core-js@1.2.6/library/modules/$.cof.js'),
        TAG = $__require('npm:core-js@1.2.6/library/modules/$.wks.js')('toStringTag'),
        ARG = cof(function () {
        return arguments;
    }()) == 'Arguments';
    module.exports = function (it) {
        var O, T, B;
        return it === undefined ? 'Undefined' : it === null ? 'Null' : typeof (T = (O = Object(it))[TAG]) == 'string' ? T : ARG ? cof(O) : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
    };
    return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/$.shared.js', ['npm:core-js@1.2.6/library/modules/$.global.js'], true, function ($__require, exports, module) {
    var define,
        global = this || self,
        GLOBAL = global;
    /* */
    var global = $__require('npm:core-js@1.2.6/library/modules/$.global.js'),
        SHARED = '__core-js_shared__',
        store = global[SHARED] || (global[SHARED] = {});
    module.exports = function (key) {
        return store[key] || (store[key] = {});
    };
    return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/$.uid.js', [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var id = 0,
      px = Math.random();
  module.exports = function (key) {
    return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
  };
  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/$.global.js', [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
  if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/$.wks.js', ['npm:core-js@1.2.6/library/modules/$.shared.js', 'npm:core-js@1.2.6/library/modules/$.uid.js', 'npm:core-js@1.2.6/library/modules/$.global.js'], true, function ($__require, exports, module) {
    var define,
        global = this || self,
        GLOBAL = global;
    /* */
    var store = $__require('npm:core-js@1.2.6/library/modules/$.shared.js')('wks'),
        uid = $__require('npm:core-js@1.2.6/library/modules/$.uid.js'),
        Symbol = $__require('npm:core-js@1.2.6/library/modules/$.global.js').Symbol;
    module.exports = function (name) {
        return store[name] || (store[name] = Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
    };
    return module.exports;
});
System.registerDynamic("npm:core-js@1.2.6/library/modules/$.iterators.js", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = {};
  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/core.get-iterator-method.js', ['npm:core-js@1.2.6/library/modules/$.classof.js', 'npm:core-js@1.2.6/library/modules/$.wks.js', 'npm:core-js@1.2.6/library/modules/$.iterators.js', 'npm:core-js@1.2.6/library/modules/$.core.js'], true, function ($__require, exports, module) {
    var define,
        global = this || self,
        GLOBAL = global;
    /* */
    var classof = $__require('npm:core-js@1.2.6/library/modules/$.classof.js'),
        ITERATOR = $__require('npm:core-js@1.2.6/library/modules/$.wks.js')('iterator'),
        Iterators = $__require('npm:core-js@1.2.6/library/modules/$.iterators.js');
    module.exports = $__require('npm:core-js@1.2.6/library/modules/$.core.js').getIteratorMethod = function (it) {
        if (it != undefined) return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
    };
    return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/$.core.js', [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var core = module.exports = { version: '1.2.6' };
  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/modules/core.get-iterator.js', ['npm:core-js@1.2.6/library/modules/$.an-object.js', 'npm:core-js@1.2.6/library/modules/core.get-iterator-method.js', 'npm:core-js@1.2.6/library/modules/$.core.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var anObject = $__require('npm:core-js@1.2.6/library/modules/$.an-object.js'),
      get = $__require('npm:core-js@1.2.6/library/modules/core.get-iterator-method.js');
  module.exports = $__require('npm:core-js@1.2.6/library/modules/$.core.js').getIterator = function (it) {
    var iterFn = get(it);
    if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
    return anObject(iterFn.call(it));
  };
  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/fn/get-iterator.js', ['npm:core-js@1.2.6/library/modules/web.dom.iterable.js', 'npm:core-js@1.2.6/library/modules/es6.string.iterator.js', 'npm:core-js@1.2.6/library/modules/core.get-iterator.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  $__require('npm:core-js@1.2.6/library/modules/web.dom.iterable.js');
  $__require('npm:core-js@1.2.6/library/modules/es6.string.iterator.js');
  module.exports = $__require('npm:core-js@1.2.6/library/modules/core.get-iterator.js');
  return module.exports;
});
System.registerDynamic("npm:babel-runtime@5.8.35/core-js/get-iterator.js", ["npm:core-js@1.2.6/library/fn/get-iterator.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = { "default": $__require("npm:core-js@1.2.6/library/fn/get-iterator.js"), __esModule: true };
  return module.exports;
});
System.register('config/client-config.js', [], function (_export) {
    /**
     * Client Settings constants
     */
    'use strict';

    return {
        setters: [],
        execute: function () {
            _export('default', {
                FPS: 60,
                TURNS_TO_FLASH_AFTER_SPAWN: 10,
                TURNS_TO_SHOW_FOOD_TEXT: 20,
                TIME_TO_SHOW_KILL_MESSAGE_IN_MS: 3000,
                CANVAS_TEXT_STYLE: 'bold 24px PressStart2P',
                SPAWN_FLASH_COLOR: 'white',
                WALL_COLOR: 'gray',
                IO: {
                    INCOMING: {
                        NEW_STATE: 'game update',
                        NEW_PLAYER_INFO: 'new player info',
                        NEW_BACKGROUND_IMAGE: 'new background image',
                        BOARD_INFO: 'board info',
                        NOTIFICATION: {
                            GENERAL: 'general notification',
                            FOOD_COLLECTED: 'food collected',
                            KILL: 'kill notification',
                            KILLED_EACH_OTHER: 'killed each other notification',
                            RAN_INTO_WALL: 'ran into wall notification',
                            SUICIDE: 'suicide notification',
                            YOU_DIED: 'you died',
                            YOU_MADE_A_KILL: 'you made a kill'
                        }
                    },
                    OUTGOING: {
                        BOT_CHANGE: 'bot change',
                        COLOR_CHANGE: 'player changed color',
                        FOOD_CHANGE: 'food change',
                        SPEED_CHANGE: 'speed change',
                        START_LENGTH_CHANGE: 'start length change',
                        JOIN_GAME: 'join game',
                        SPECTATE_GAME: 'spectate game',
                        CLEAR_UPLOADED_BACKGROUND_IMAGE: 'clear uploaded background image',
                        BACKGROUND_IMAGE_UPLOAD: 'background image upload',
                        CLEAR_UPLOADED_IMAGE: 'clear uploaded image',
                        IMAGE_UPLOAD: 'image upload',
                        NEW_PLAYER: 'new player',
                        NAME_CHANGE: 'player changed name',
                        KEY_DOWN: 'key down',
                        CANVAS_CLICKED: 'canvas clicked'
                    }
                },
                MAX_NAME_LENGTH: 10,
                INCREMENT_CHANGE: {
                    INCREASE: 'increase',
                    DECREASE: 'decrease',
                    RESET: 'reset'
                },
                LOCAL_STORAGE: {
                    PLAYER_IMAGE: 'node-multiplayer-snake-player-image',
                    PLAYER_NAME: 'node-multiplayer-snake-player-name'
                }
            });
        }
    };
});
System.registerDynamic("npm:core-js@1.2.6/library/modules/$.js", [], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var $Object = Object;
  module.exports = {
    create: $Object.create,
    getProto: $Object.getPrototypeOf,
    isEnum: {}.propertyIsEnumerable,
    getDesc: $Object.getOwnPropertyDescriptor,
    setDesc: $Object.defineProperty,
    setDescs: $Object.defineProperties,
    getKeys: $Object.keys,
    getNames: $Object.getOwnPropertyNames,
    getSymbols: $Object.getOwnPropertySymbols,
    each: [].forEach
  };
  return module.exports;
});
System.registerDynamic('npm:core-js@1.2.6/library/fn/object/define-property.js', ['npm:core-js@1.2.6/library/modules/$.js'], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  var $ = $__require('npm:core-js@1.2.6/library/modules/$.js');
  module.exports = function defineProperty(it, key, desc) {
    return $.setDesc(it, key, desc);
  };
  return module.exports;
});
System.registerDynamic("npm:babel-runtime@5.8.35/core-js/object/define-property.js", ["npm:core-js@1.2.6/library/fn/object/define-property.js"], true, function ($__require, exports, module) {
  var define,
      global = this || self,
      GLOBAL = global;
  /* */
  module.exports = { "default": $__require("npm:core-js@1.2.6/library/fn/object/define-property.js"), __esModule: true };
  return module.exports;
});
System.registerDynamic("npm:babel-runtime@5.8.35/helpers/create-class.js", ["npm:babel-runtime@5.8.35/core-js/object/define-property.js"], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  var _Object$defineProperty = $__require("npm:babel-runtime@5.8.35/core-js/object/define-property.js")["default"];
  exports["default"] = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        _Object$defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();
  exports.__esModule = true;
  return module.exports;
});
System.registerDynamic("npm:babel-runtime@5.8.35/helpers/class-call-check.js", [], true, function ($__require, exports, module) {
  /* */
  "use strict";

  var define,
      global = this || self,
      GLOBAL = global;
  exports["default"] = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  exports.__esModule = true;
  return module.exports;
});
System.register('view/dom-helper.js', ['npm:babel-runtime@5.8.35/helpers/create-class.js', 'npm:babel-runtime@5.8.35/helpers/class-call-check.js'], function (_export) {
    var _createClass, _classCallCheck, DomHelper;

    return {
        setters: [function (_npmBabelRuntime5835HelpersCreateClassJs) {
            _createClass = _npmBabelRuntime5835HelpersCreateClassJs['default'];
        }, function (_npmBabelRuntime5835HelpersClassCallCheckJs) {
            _classCallCheck = _npmBabelRuntime5835HelpersClassCallCheckJs['default'];
        }],
        execute: function () {
            /**
             * DOM manipulation helper
             */
            'use strict';

            DomHelper = (function () {
                function DomHelper() {
                    _classCallCheck(this, DomHelper);
                }

                _createClass(DomHelper, null, [{
                    key: 'blurActiveElement',
                    value: function blurActiveElement() {
                        document.activeElement.blur();
                    }
                }, {
                    key: 'clearKillMessagesDivText',
                    value: function clearKillMessagesDivText() {
                        this.setKillMessagesDivText('');
                    }
                }, {
                    key: 'createElement',
                    value: function createElement(elementName) {
                        return document.createElement(elementName);
                    }
                }, {
                    key: 'getBackgroundImageUploadElement',
                    value: function getBackgroundImageUploadElement() {
                        return document.getElementById('background-image-upload');
                    }
                }, {
                    key: 'getBody',
                    value: function getBody() {
                        return document.body;
                    }
                }, {
                    key: 'getClearUploadedBackgroundImageButton',
                    value: function getClearUploadedBackgroundImageButton() {
                        return document.getElementById('clearUploadedBackgroundImageButton');
                    }
                }, {
                    key: 'getClearUploadedImageButton',
                    value: function getClearUploadedImageButton() {
                        return document.getElementById('clearUploadedImageButton');
                    }
                }, {
                    key: 'getChangeColorButton',
                    value: function getChangeColorButton() {
                        return document.getElementById('changePlayerColorButton');
                    }
                }, {
                    key: 'getChangeNameButton',
                    value: function getChangeNameButton() {
                        return document.getElementById('changePlayerNameButton');
                    }
                }, {
                    key: 'getDecreaseBotsButton',
                    value: function getDecreaseBotsButton() {
                        return document.getElementById('decreaseBotsButton');
                    }
                }, {
                    key: 'getDecreaseFoodButton',
                    value: function getDecreaseFoodButton() {
                        return document.getElementById('decreaseFoodButton');
                    }
                }, {
                    key: 'getDecreaseSpeedButton',
                    value: function getDecreaseSpeedButton() {
                        return document.getElementById('decreaseSpeedButton');
                    }
                }, {
                    key: 'getDecreaseStartLengthButton',
                    value: function getDecreaseStartLengthButton() {
                        return document.getElementById('decreaseStartLengthButton');
                    }
                }, {
                    key: 'getFullScreenButton',
                    value: function getFullScreenButton() {
                        return document.getElementById('full-screen-button');
                    }
                }, {
                    key: 'getGameBoardDiv',
                    value: function getGameBoardDiv() {
                        return document.getElementById('game-board');
                    }
                }, {
                    key: 'getImageUploadElement',
                    value: function getImageUploadElement() {
                        return document.getElementById('image-upload');
                    }
                }, {
                    key: 'getIncreaseBotsButton',
                    value: function getIncreaseBotsButton() {
                        return document.getElementById('increaseBotsButton');
                    }
                }, {
                    key: 'getIncreaseFoodButton',
                    value: function getIncreaseFoodButton() {
                        return document.getElementById('increaseFoodButton');
                    }
                }, {
                    key: 'getIncreaseSpeedButton',
                    value: function getIncreaseSpeedButton() {
                        return document.getElementById('increaseSpeedButton');
                    }
                }, {
                    key: 'getIncreaseStartLengthButton',
                    value: function getIncreaseStartLengthButton() {
                        return document.getElementById('increaseStartLengthButton');
                    }
                }, {
                    key: 'getNotificationsDiv',
                    value: function getNotificationsDiv() {
                        return document.getElementById('notifications');
                    }
                }, {
                    key: 'getPlayerNameElement',
                    value: function getPlayerNameElement() {
                        return document.getElementById('player-name');
                    }
                }, {
                    key: 'getPlayOrWatchButton',
                    value: function getPlayOrWatchButton() {
                        return document.getElementById('play-or-watch-button');
                    }
                }, {
                    key: 'getResetBotsButton',
                    value: function getResetBotsButton() {
                        return document.getElementById('resetBotsButton');
                    }
                }, {
                    key: 'getResetFoodButton',
                    value: function getResetFoodButton() {
                        return document.getElementById('resetFoodButton');
                    }
                }, {
                    key: 'getResetSpeedButton',
                    value: function getResetSpeedButton() {
                        return document.getElementById('resetSpeedButton');
                    }
                }, {
                    key: 'getResetStartLengthButton',
                    value: function getResetStartLengthButton() {
                        return document.getElementById('resetStartLengthButton');
                    }
                }, {
                    key: 'getToggleGridLinesButton',
                    value: function getToggleGridLinesButton() {
                        return document.getElementById('toggleGridLinesButton');
                    }
                }, {
                    key: 'getToggleSoundButton',
                    value: function getToggleSoundButton() {
                        return document.getElementById('toggleSoundButton');
                    }
                }, {
                    key: 'getVolumeSlider',
                    value: function getVolumeSlider() {
                        return document.getElementById('volumeSlider');
                    }
                }, {
                    key: 'hideInvalidPlayerNameLabel',
                    value: function hideInvalidPlayerNameLabel() {
                        document.getElementById('invalid-player-name-label').style.display = 'none';
                    }
                }, {
                    key: 'setChangeNameButtonText',
                    value: function setChangeNameButtonText(text) {
                        this.getChangeNameButton().innerHTML = text;
                    }
                }, {
                    key: 'setCurrentFoodAmountLabelText',
                    value: function setCurrentFoodAmountLabelText(text) {
                        document.getElementById('currentFoodAmount').innerHTML = text;
                    }
                }, {
                    key: 'setCurrentNumberOfBotsLabelText',
                    value: function setCurrentNumberOfBotsLabelText(text) {
                        document.getElementById('currentNumberOfBots').innerHTML = text;
                    }
                }, {
                    key: 'setCurrentSpeedLabelText',
                    value: function setCurrentSpeedLabelText(text) {
                        document.getElementById('currentSpeed').innerHTML = text;
                    }
                }, {
                    key: 'setCurrentStartLengthLabelText',
                    value: function setCurrentStartLengthLabelText(text) {
                        document.getElementById('currentStartLength').innerHTML = text;
                    }
                }, {
                    key: 'setKillMessagesDivText',
                    value: function setKillMessagesDivText(text) {
                        document.getElementById('kill-messages').innerHTML = text;
                    }
                }, {
                    key: 'setPlayerNameElementColor',
                    value: function setPlayerNameElementColor(color) {
                        this.getPlayerNameElement().style.color = color;
                    }
                }, {
                    key: 'setPlayerNameElementReadOnly',
                    value: function setPlayerNameElementReadOnly(readOnly) {
                        this.getPlayerNameElement().readOnly = readOnly;
                    }
                }, {
                    key: 'setPlayerNameElementValue',
                    value: function setPlayerNameElementValue(value) {
                        this.getPlayerNameElement().value = value;
                    }
                }, {
                    key: 'setPlayerStatsDivText',
                    value: function setPlayerStatsDivText(text) {
                        document.getElementById('player-stats').innerHTML = text;
                    }
                }, {
                    key: 'setToggleSoundButtonText',
                    value: function setToggleSoundButtonText(text) {
                        this.getToggleSoundButton().textContent = text;
                    }
                }, {
                    key: 'setPlayOrWatchButtonText',
                    value: function setPlayOrWatchButtonText(text) {
                        this.getPlayOrWatchButton().textContent = text;
                    }
                }, {
                    key: 'showAllContent',
                    value: function showAllContent() {
                        document.getElementById('cover').style.visibility = 'visible';
                    }
                }, {
                    key: 'showInvalidPlayerNameLabel',
                    value: function showInvalidPlayerNameLabel() {
                        document.getElementById('invalid-player-name-label').style.display = 'inline';
                    }
                }, {
                    key: 'toggleFullScreenMode',
                    value: function toggleFullScreenMode() {
                        if (document.fullScreenElement && document.fullScreenElement !== null || !document.mozFullScreen && !document.webkitIsFullScreen) {
                            if (document.documentElement.requestFullScreen) {
                                document.documentElement.requestFullScreen();
                            } else if (document.documentElement.mozRequestFullScreen) {
                                document.documentElement.mozRequestFullScreen();
                            } else if (document.documentElement.webkitRequestFullScreen) {
                                document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                            }
                        } else {
                            if (document.cancelFullScreen) {
                                document.cancelFullScreen();
                            } else if (document.mozCancelFullScreen) {
                                document.mozCancelFullScreen();
                            } else if (document.webkitCancelFullScreen) {
                                document.webkitCancelFullScreen();
                            }
                        }
                    }
                }]);

                return DomHelper;
            })();

            _export('default', DomHelper);
        }
    };
});
System.register('view/game-view.js', ['npm:babel-runtime@5.8.35/helpers/create-class.js', 'npm:babel-runtime@5.8.35/helpers/class-call-check.js', 'npm:babel-runtime@5.8.35/core-js/get-iterator.js', 'config/client-config.js', 'view/dom-helper.js'], function (_export) {
    var _createClass, _classCallCheck, _getIterator, ClientConfig, DomHelper, ENTER_KEYCODE, SPACE_BAR_KEYCODE, UP_ARROW_KEYCODE, DOWN_ARROW_KEYCODE, GameView;

    return {
        setters: [function (_npmBabelRuntime5835HelpersCreateClassJs) {
            _createClass = _npmBabelRuntime5835HelpersCreateClassJs['default'];
        }, function (_npmBabelRuntime5835HelpersClassCallCheckJs) {
            _classCallCheck = _npmBabelRuntime5835HelpersClassCallCheckJs['default'];
        }, function (_npmBabelRuntime5835CoreJsGetIteratorJs) {
            _getIterator = _npmBabelRuntime5835CoreJsGetIteratorJs['default'];
        }, function (_configClientConfigJs) {
            ClientConfig = _configClientConfigJs['default'];
        }, function (_viewDomHelperJs) {
            DomHelper = _viewDomHelperJs['default'];
        }],
        execute: function () {
            'use strict';

            ENTER_KEYCODE = 13;
            SPACE_BAR_KEYCODE = 32;
            UP_ARROW_KEYCODE = 38;
            DOWN_ARROW_KEYCODE = 40;

            /**
             * Handles all requests related to the display of the game, not including the canvas
             */

            GameView = (function () {
                function GameView(backgroundImageUploadCallback, botChangeCallback, foodChangeCallback, imageUploadCallback, joinGameCallback, keyDownCallback, muteAudioCallback, playerColorChangeCallback, playerNameUpdatedCallback, spectateGameCallback, speedChangeCallback, startLengthChangeCallback, toggleGridLinesCallback) {
                    _classCallCheck(this, GameView);

                    this.isChangingName = false;
                    this.backgroundImageUploadCallback = backgroundImageUploadCallback;
                    this.imageUploadCallback = imageUploadCallback;
                    this.joinGameCallback = joinGameCallback;
                    this.keyDownCallback = keyDownCallback;
                    this.muteAudioCallback = muteAudioCallback;
                    this.playerNameUpdatedCallback = playerNameUpdatedCallback;
                    this.spectateGameCallback = spectateGameCallback;
                    this._initEventHandling(botChangeCallback, foodChangeCallback, muteAudioCallback, playerColorChangeCallback, speedChangeCallback, startLengthChangeCallback, toggleGridLinesCallback);
                }

                _createClass(GameView, [{
                    key: 'ready',
                    value: function ready() {
                        // Show everything when ready
                        DomHelper.showAllContent();
                    }
                }, {
                    key: 'setKillMessageWithTimer',
                    value: function setKillMessageWithTimer(message) {
                        DomHelper.setKillMessagesDivText(message);
                        if (this.killMessagesTimeout) {
                            clearTimeout(this.killMessagesTimeout);
                        }
                        this.killMessagesTimeout = setTimeout(DomHelper.clearKillMessagesDivText.bind(DomHelper), ClientConfig.TIME_TO_SHOW_KILL_MESSAGE_IN_MS);
                    }
                }, {
                    key: 'setMuteStatus',
                    value: function setMuteStatus(isMuted) {
                        var text = undefined;
                        if (isMuted) {
                            text = 'Unmute';
                        } else {
                            text = 'Mute';
                        }
                        DomHelper.setToggleSoundButtonText(text);
                    }
                }, {
                    key: 'showFoodAmount',
                    value: function showFoodAmount(foodAmount) {
                        DomHelper.setCurrentFoodAmountLabelText(foodAmount);
                    }
                }, {
                    key: 'showKillMessage',
                    value: function showKillMessage(killerName, victimName, killerColor, victimColor, victimLength) {
                        this.setKillMessageWithTimer('<span style=\'color: ' + killerColor + '\'>' + killerName + '</span> killed ' + ('<span style=\'color: ' + victimColor + '\'>' + victimName + '</span>') + (' and grew by <span style=\'color: ' + killerColor + '\'>' + victimLength + '</span>'));
                    }
                }, {
                    key: 'showKilledEachOtherMessage',
                    value: function showKilledEachOtherMessage(victimSummaries) {
                        var victims = '';
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = _getIterator(victimSummaries), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var victimSummary = _step.value;

                                victims += '<span style=\'color: ' + victimSummary.color + '\'>' + victimSummary.name + '</span> ';
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator['return']) {
                                    _iterator['return']();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }

                        this.setKillMessageWithTimer(victims + ' have killed each other');
                    }
                }, {
                    key: 'showRanIntoWallMessage',
                    value: function showRanIntoWallMessage(playerName, playerColor) {
                        this.setKillMessageWithTimer('<span style=\'color: ' + playerColor + '\'>' + playerName + '</span> ran into a wall');
                    }
                }, {
                    key: 'showSuicideMessage',
                    value: function showSuicideMessage(victimName, victimColor) {
                        this.setKillMessageWithTimer('<span style=\'color: ' + victimColor + '\'>' + victimName + '</span> committed suicide');
                    }
                }, {
                    key: 'showNotification',
                    value: function showNotification(notification, playerColor) {
                        var notificationDiv = DomHelper.getNotificationsDiv();
                        var formattedNotification = '<div><span class=\'time-label\'>' + new Date().toLocaleTimeString() + ' - </span>' + ('<span style=\'color: ' + playerColor + '\'>' + notification + '<span/></div>');
                        notificationDiv.innerHTML = formattedNotification + notificationDiv.innerHTML;
                    }
                }, {
                    key: 'showNumberOfBots',
                    value: function showNumberOfBots(numberOfBots) {
                        DomHelper.setCurrentNumberOfBotsLabelText(numberOfBots);
                    }
                }, {
                    key: 'showPlayerStats',
                    value: function showPlayerStats(playerStats) {
                        var formattedScores = '<div class="player-stats-header"><span class="image"></span>' + '<span class="name">Name</span>' + '<span class="stat">Score</span>' + '<span class="stat">High</span>' + '<span class="stat">Kills</span>' + '<span class="stat">Deaths</span></div>';
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = _getIterator(playerStats), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var playerStat = _step2.value;

                                var playerImageElement = '';
                                if (playerStat.base64Image) {
                                    playerImageElement = '<img src=' + playerStat.base64Image + ' class=\'player-stats-image\'></img>';
                                }
                                formattedScores += '<div class=\'player-stats-content\'><span class=\'image\'>' + playerImageElement + '</span>' + ('<span class=\'name\' style=\'color: ' + playerStat.color + '\'>' + playerStat.name + '</span>') + ('<span class=\'stat\'>' + playerStat.score + '</span>') + ('<span class=\'stat\'>' + playerStat.highScore + '</span>') + ('<span class=\'stat\'>' + playerStat.kills + '</span>') + ('<span class=\'stat\'>' + playerStat.deaths + '</span></div>');
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                                    _iterator2['return']();
                                }
                            } finally {
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }

                        DomHelper.setPlayerStatsDivText(formattedScores);
                    }
                }, {
                    key: 'showSpeed',
                    value: function showSpeed(speed) {
                        DomHelper.setCurrentSpeedLabelText(speed);
                    }
                }, {
                    key: 'showStartLength',
                    value: function showStartLength(startLength) {
                        DomHelper.setCurrentStartLengthLabelText(startLength);
                    }
                }, {
                    key: 'updatePlayerName',
                    value: function updatePlayerName(playerName, playerColor) {
                        DomHelper.setPlayerNameElementValue(playerName);
                        if (playerColor) {
                            DomHelper.setPlayerNameElementColor(playerColor);
                        }
                    }

                    /*******************
                     *  Event handling *
                     *******************/

                }, {
                    key: '_handleChangeNameButtonClick',
                    value: function _handleChangeNameButtonClick() {
                        if (this.isChangingName) {
                            this._saveNewPlayerName();
                        } else {
                            DomHelper.setChangeNameButtonText('Save');
                            DomHelper.setPlayerNameElementReadOnly(false);
                            DomHelper.getPlayerNameElement().select();
                            this.isChangingName = true;
                        }
                    }
                }, {
                    key: '_handleKeyDown',
                    value: function _handleKeyDown(e) {
                        // Prevent keyboard scrolling default behavior
                        if (e.keyCode === UP_ARROW_KEYCODE || e.keyCode === DOWN_ARROW_KEYCODE || e.keyCode === SPACE_BAR_KEYCODE && e.target === DomHelper.getBody()) {
                            e.preventDefault();
                        }

                        // When changing names, save new name on enter
                        if (e.keyCode === ENTER_KEYCODE && this.isChangingName) {
                            this._saveNewPlayerName();
                            DomHelper.blurActiveElement();
                            return;
                        }

                        if (!this.isChangingName) {
                            this.keyDownCallback(e.keyCode);
                        }
                    }
                }, {
                    key: '_handleBackgroundImageUpload',
                    value: function _handleBackgroundImageUpload() {
                        var _this = this;

                        var uploadedBackgroundImageAsFile = DomHelper.getBackgroundImageUploadElement().files[0];
                        if (uploadedBackgroundImageAsFile) {
                            (function () {
                                // Convert file to image
                                var image = new Image();
                                var self = _this;
                                image.onload = function () {
                                    self.backgroundImageUploadCallback(image, uploadedBackgroundImageAsFile.type);
                                };
                                image.src = URL.createObjectURL(uploadedBackgroundImageAsFile);
                            })();
                        }
                    }
                }, {
                    key: '_handleImageUpload',
                    value: function _handleImageUpload() {
                        var _this2 = this;

                        var uploadedImageAsFile = DomHelper.getImageUploadElement().files[0];
                        if (uploadedImageAsFile) {
                            (function () {
                                // Convert file to image
                                var image = new Image();
                                var self = _this2;
                                image.onload = function () {
                                    self.imageUploadCallback(image, uploadedImageAsFile.type);
                                };
                                image.src = URL.createObjectURL(uploadedImageAsFile);
                            })();
                        }
                    }
                }, {
                    key: '_handlePlayOrWatchButtonClick',
                    value: function _handlePlayOrWatchButtonClick() {
                        var command = DomHelper.getPlayOrWatchButton().textContent;
                        if (command === 'Play') {
                            DomHelper.setPlayOrWatchButtonText('Watch');
                            this.joinGameCallback();
                        } else {
                            DomHelper.setPlayOrWatchButtonText('Play');
                            this.spectateGameCallback();
                        }
                    }
                }, {
                    key: '_saveNewPlayerName',
                    value: function _saveNewPlayerName() {
                        var playerName = DomHelper.getPlayerNameElement().value;
                        if (playerName && playerName.trim().length > 0 && playerName.length <= ClientConfig.MAX_NAME_LENGTH) {
                            this.playerNameUpdatedCallback(playerName);
                            DomHelper.setChangeNameButtonText('Change Name');
                            DomHelper.setPlayerNameElementReadOnly(true);
                            this.isChangingName = false;
                            DomHelper.hideInvalidPlayerNameLabel();
                        } else {
                            DomHelper.showInvalidPlayerNameLabel();
                        }
                    }
                }, {
                    key: '_initEventHandling',
                    value: function _initEventHandling(botChangeCallback, foodChangeCallback, muteAudioCallback, playerColorChangeCallback, speedChangeCallback, startLengthChangeCallback, toggleGridLinesCallback) {
                        // Player controls
                        DomHelper.getChangeColorButton().addEventListener('click', playerColorChangeCallback);
                        DomHelper.getChangeNameButton().addEventListener('click', this._handleChangeNameButtonClick.bind(this));
                        DomHelper.getPlayerNameElement().addEventListener('blur', this._saveNewPlayerName.bind(this));
                        DomHelper.getImageUploadElement().addEventListener('change', this._handleImageUpload.bind(this));
                        DomHelper.getClearUploadedImageButton().addEventListener('click', this.imageUploadCallback);
                        DomHelper.getBackgroundImageUploadElement().addEventListener('change', this._handleBackgroundImageUpload.bind(this));
                        DomHelper.getClearUploadedBackgroundImageButton().addEventListener('click', this.backgroundImageUploadCallback);
                        DomHelper.getPlayOrWatchButton().addEventListener('click', this._handlePlayOrWatchButtonClick.bind(this));
                        DomHelper.getToggleGridLinesButton().addEventListener('click', toggleGridLinesCallback);
                        DomHelper.getToggleSoundButton().addEventListener('click', muteAudioCallback);
                        DomHelper.getFullScreenButton().addEventListener('click', DomHelper.toggleFullScreenMode);
                        window.addEventListener('keydown', this._handleKeyDown.bind(this), true);

                        // Admin controls
                        DomHelper.getIncreaseBotsButton().addEventListener('click', botChangeCallback.bind(this, ClientConfig.INCREMENT_CHANGE.INCREASE));
                        DomHelper.getDecreaseBotsButton().addEventListener('click', botChangeCallback.bind(this, ClientConfig.INCREMENT_CHANGE.DECREASE));
                        DomHelper.getResetBotsButton().addEventListener('click', botChangeCallback.bind(this, ClientConfig.INCREMENT_CHANGE.RESET));
                        DomHelper.getIncreaseFoodButton().addEventListener('click', foodChangeCallback.bind(this, ClientConfig.INCREMENT_CHANGE.INCREASE));
                        DomHelper.getDecreaseFoodButton().addEventListener('click', foodChangeCallback.bind(this, ClientConfig.INCREMENT_CHANGE.DECREASE));
                        DomHelper.getResetFoodButton().addEventListener('click', foodChangeCallback.bind(this, ClientConfig.INCREMENT_CHANGE.RESET));
                        DomHelper.getIncreaseSpeedButton().addEventListener('click', speedChangeCallback.bind(this, ClientConfig.INCREMENT_CHANGE.INCREASE));
                        DomHelper.getDecreaseSpeedButton().addEventListener('click', speedChangeCallback.bind(this, ClientConfig.INCREMENT_CHANGE.DECREASE));
                        DomHelper.getResetSpeedButton().addEventListener('click', speedChangeCallback.bind(this, ClientConfig.INCREMENT_CHANGE.RESET));
                        DomHelper.getIncreaseStartLengthButton().addEventListener('click', startLengthChangeCallback.bind(this, ClientConfig.INCREMENT_CHANGE.INCREASE));
                        DomHelper.getDecreaseStartLengthButton().addEventListener('click', startLengthChangeCallback.bind(this, ClientConfig.INCREMENT_CHANGE.DECREASE));
                        DomHelper.getResetStartLengthButton().addEventListener('click', startLengthChangeCallback.bind(this, ClientConfig.INCREMENT_CHANGE.RESET));
                    }
                }]);

                return GameView;
            })();

            _export('default', GameView);
        }
    };
});
System.register('controller/game-controller.js', ['npm:babel-runtime@5.8.35/helpers/create-class.js', 'npm:babel-runtime@5.8.35/helpers/class-call-check.js', 'npm:babel-runtime@5.8.35/core-js/get-iterator.js', 'npm:babel-runtime@5.8.35/core-js/object/keys.js', 'config/client-config.js', 'controller/audio-controller.js', 'model/text-to-draw.js', 'view/canvas-factory.js', 'view/game-view.js'], function (_export) {
    var _createClass, _classCallCheck, _getIterator, _Object$keys, ClientConfig, AudioController, TextToDraw, CanvasFactory, GameView, GameController;

    return {
        setters: [function (_npmBabelRuntime5835HelpersCreateClassJs) {
            _createClass = _npmBabelRuntime5835HelpersCreateClassJs['default'];
        }, function (_npmBabelRuntime5835HelpersClassCallCheckJs) {
            _classCallCheck = _npmBabelRuntime5835HelpersClassCallCheckJs['default'];
        }, function (_npmBabelRuntime5835CoreJsGetIteratorJs) {
            _getIterator = _npmBabelRuntime5835CoreJsGetIteratorJs['default'];
        }, function (_npmBabelRuntime5835CoreJsObjectKeysJs) {
            _Object$keys = _npmBabelRuntime5835CoreJsObjectKeysJs['default'];
        }, function (_configClientConfigJs) {
            ClientConfig = _configClientConfigJs['default'];
        }, function (_controllerAudioControllerJs) {
            AudioController = _controllerAudioControllerJs['default'];
        }, function (_modelTextToDrawJs) {
            TextToDraw = _modelTextToDrawJs['default'];
        }, function (_viewCanvasFactoryJs) {
            CanvasFactory = _viewCanvasFactoryJs['default'];
        }, function (_viewGameViewJs) {
            GameView = _viewGameViewJs['default'];
        }],
        execute: function () {

            /**
             * Controls all game logic
             */
            'use strict';

            GameController = (function () {
                function GameController() {
                    _classCallCheck(this, GameController);

                    this.gameView = new GameView(this.backgroundImageUploadCallback.bind(this), this.botChangeCallback.bind(this), this.foodChangeCallback.bind(this), this.imageUploadCallback.bind(this), this.joinGameCallback.bind(this), this.keyDownCallback.bind(this), this.muteAudioCallback.bind(this), this.playerColorChangeCallback.bind(this), this.playerNameUpdatedCallback.bind(this), this.spectateGameCallback.bind(this), this.speedChangeCallback.bind(this), this.startLengthChangeCallback.bind(this), this.toggleGridLinesCallback.bind(this));
                    this.audioController = new AudioController();
                    this.players = [];
                    this.food = {};
                    this.textsToDraw = [];
                    this.walls = [];
                }

                _createClass(GameController, [{
                    key: 'connect',
                    value: function connect(io) {
                        this.socket = io();
                        this._initializeSocketIoHandlers();
                        var storedName = localStorage.getItem(ClientConfig.LOCAL_STORAGE.PLAYER_NAME);
                        var storedBase64Image = localStorage.getItem(ClientConfig.LOCAL_STORAGE.PLAYER_IMAGE);
                        this.socket.emit(ClientConfig.IO.OUTGOING.NEW_PLAYER, storedName, storedBase64Image);
                    }
                }, {
                    key: 'renderGame',
                    value: function renderGame() {
                        this.canvasView.clear();
                        for (var foodId in this.food) {
                            if (({}).hasOwnProperty.call(this.food, foodId)) {
                                var food = this.food[foodId];
                                this.canvasView.drawSquare(food.coordinate, food.color);
                            }
                        }

                        this.canvasView.drawSquares(this.walls, ClientConfig.WALL_COLOR);

                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = _getIterator(this.players), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var player = _step.value;

                                if (player.segments.length === 0) {
                                    continue;
                                }
                                // Flash around where you have just spawned
                                if ('/#' + this.socket.id === player.id && player.moveCounter <= ClientConfig.TURNS_TO_FLASH_AFTER_SPAWN && player.moveCounter % 2 === 0) {
                                    this.canvasView.drawSquareAround(player.segments[0], ClientConfig.SPAWN_FLASH_COLOR);
                                }

                                if (player.base64Image) {
                                    this.canvasView.drawImages(player.segments, player.base64Image);
                                } else {
                                    this.canvasView.drawSquares(player.segments, player.color);
                                }
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator['return']) {
                                    _iterator['return']();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }

                        for (var i = this.textsToDraw.length - 1; i >= 0; i--) {
                            var textToDraw = this.textsToDraw[i];
                            if (textToDraw.counter === ClientConfig.TURNS_TO_SHOW_FOOD_TEXT) {
                                this.textsToDraw.splice(i, 1);
                            } else {
                                this.canvasView.drawFadingText(textToDraw, ClientConfig.TURNS_TO_SHOW_FOOD_TEXT);
                                textToDraw.incrementCounter();
                            }
                        }

                        var self = this;
                        // Run in a loop
                        setTimeout(function () {
                            requestAnimationFrame(self.renderGame.bind(self));
                        }, 1000 / ClientConfig.FPS);
                    }

                    /*******************
                     *  View Callbacks *
                     *******************/

                }, {
                    key: 'botChangeCallback',
                    value: function botChangeCallback(option) {
                        this.socket.emit(ClientConfig.IO.OUTGOING.BOT_CHANGE, option);
                    }
                }, {
                    key: 'foodChangeCallback',
                    value: function foodChangeCallback(option) {
                        this.socket.emit(ClientConfig.IO.OUTGOING.FOOD_CHANGE, option);
                    }
                }, {
                    key: 'backgroundImageUploadCallback',
                    value: function backgroundImageUploadCallback(image, imageType) {
                        if (!(image && imageType)) {
                            this.socket.emit(ClientConfig.IO.OUTGOING.CLEAR_UPLOADED_BACKGROUND_IMAGE);
                            return;
                        }
                        var resizedBase64Image = this.canvasView.resizeUploadedBackgroundImageAndBase64(image, imageType);
                        this.socket.emit(ClientConfig.IO.OUTGOING.BACKGROUND_IMAGE_UPLOAD, resizedBase64Image);
                    }
                }, {
                    key: 'canvasClicked',
                    value: function canvasClicked(x, y) {
                        this.socket.emit(ClientConfig.IO.OUTGOING.CANVAS_CLICKED, x, y);
                    }

                    // optional resizedBase64Image
                }, {
                    key: 'imageUploadCallback',
                    value: function imageUploadCallback(image, imageType, resizedBase64Image) {
                        if (!(image && imageType)) {
                            this.socket.emit(ClientConfig.IO.OUTGOING.CLEAR_UPLOADED_IMAGE);
                            localStorage.removeItem(ClientConfig.LOCAL_STORAGE.PLAYER_IMAGE);
                            return;
                        }
                        var newResizedBase64Image = undefined;
                        if (resizedBase64Image) {
                            newResizedBase64Image = resizedBase64Image;
                        } else {
                            newResizedBase64Image = this.canvasView.resizeUploadedImageAndBase64(image, imageType);
                        }
                        this.socket.emit(ClientConfig.IO.OUTGOING.IMAGE_UPLOAD, newResizedBase64Image);
                        localStorage.setItem(ClientConfig.LOCAL_STORAGE.PLAYER_IMAGE, newResizedBase64Image);
                    }
                }, {
                    key: 'joinGameCallback',
                    value: function joinGameCallback() {
                        this.socket.emit(ClientConfig.IO.OUTGOING.JOIN_GAME);
                    }
                }, {
                    key: 'keyDownCallback',
                    value: function keyDownCallback(keyCode) {
                        this.socket.emit(ClientConfig.IO.OUTGOING.KEY_DOWN, keyCode);
                    }
                }, {
                    key: 'muteAudioCallback',
                    value: function muteAudioCallback() {
                        this.audioController.toggleMute();
                        this.gameView.setMuteStatus(this.audioController.isMuted);
                    }
                }, {
                    key: 'playerColorChangeCallback',
                    value: function playerColorChangeCallback() {
                        this.socket.emit(ClientConfig.IO.OUTGOING.COLOR_CHANGE);
                    }
                }, {
                    key: 'playerNameUpdatedCallback',
                    value: function playerNameUpdatedCallback(name) {
                        this.socket.emit(ClientConfig.IO.OUTGOING.NAME_CHANGE, name);
                        localStorage.setItem(ClientConfig.LOCAL_STORAGE.PLAYER_NAME, name);
                    }
                }, {
                    key: 'spectateGameCallback',
                    value: function spectateGameCallback() {
                        this.socket.emit(ClientConfig.IO.OUTGOING.SPECTATE_GAME);
                    }
                }, {
                    key: 'speedChangeCallback',
                    value: function speedChangeCallback(option) {
                        this.socket.emit(ClientConfig.IO.OUTGOING.SPEED_CHANGE, option);
                    }
                }, {
                    key: 'startLengthChangeCallback',
                    value: function startLengthChangeCallback(option) {
                        this.socket.emit(ClientConfig.IO.OUTGOING.START_LENGTH_CHANGE, option);
                    }
                }, {
                    key: 'toggleGridLinesCallback',
                    value: function toggleGridLinesCallback() {
                        this.canvasView.toggleGridLines();
                    }

                    /*******************************
                     *  socket.io handling methods *
                     *******************************/

                }, {
                    key: '_createBoard',
                    value: function _createBoard(board) {
                        this.canvasView = CanvasFactory.createCanvasView(board.SQUARE_SIZE_IN_PIXELS, board.HORIZONTAL_SQUARES, board.VERTICAL_SQUARES, this.canvasClicked.bind(this));
                        this.canvasView.clear();
                        this.gameView.ready();
                        this.renderGame();
                    }
                }, {
                    key: '_handleBackgroundImage',
                    value: function _handleBackgroundImage(backgroundImage) {
                        if (backgroundImage) {
                            this.canvasView.setBackgroundImage(backgroundImage);
                        } else {
                            this.canvasView.clearBackgroundImage();
                        }
                    }
                }, {
                    key: '_handleFoodCollected',
                    value: function _handleFoodCollected(text, coordinate, color, isSwap) {
                        this.textsToDraw.unshift(new TextToDraw(text, coordinate, color));
                        if (isSwap) {
                            this.audioController.playSwapSound();
                        } else {
                            this.audioController.playFoodCollectedSound();
                        }
                    }
                }, {
                    key: '_handleNewGameData',
                    value: function _handleNewGameData(gameData) {
                        this.players = gameData.players;
                        this.food = gameData.food;
                        this.walls = gameData.walls;
                        this.gameView.showFoodAmount(_Object$keys(gameData.food).length);
                        this.gameView.showSpeed(gameData.speed);
                        this.gameView.showStartLength(gameData.startLength);
                        this.gameView.showNumberOfBots(gameData.numberOfBots);
                        this.gameView.showPlayerStats(gameData.playerStats);
                    }
                }, {
                    key: '_initializeSocketIoHandlers',
                    value: function _initializeSocketIoHandlers() {
                        this.socket.on(ClientConfig.IO.INCOMING.NEW_PLAYER_INFO, this.gameView.updatePlayerName);
                        this.socket.on(ClientConfig.IO.INCOMING.BOARD_INFO, this._createBoard.bind(this));
                        this.socket.on(ClientConfig.IO.INCOMING.NEW_STATE, this._handleNewGameData.bind(this));
                        this.socket.on(ClientConfig.IO.INCOMING.NEW_BACKGROUND_IMAGE, this._handleBackgroundImage.bind(this));
                        this.socket.on(ClientConfig.IO.INCOMING.NOTIFICATION.FOOD_COLLECTED, this._handleFoodCollected.bind(this));
                        this.socket.on(ClientConfig.IO.INCOMING.NOTIFICATION.GENERAL, this.gameView.showNotification);
                        this.socket.on(ClientConfig.IO.INCOMING.NOTIFICATION.KILL, this.gameView.showKillMessage.bind(this.gameView));
                        this.socket.on(ClientConfig.IO.INCOMING.NOTIFICATION.KILLED_EACH_OTHER, this.gameView.showKilledEachOtherMessage.bind(this.gameView));
                        this.socket.on(ClientConfig.IO.INCOMING.NOTIFICATION.RAN_INTO_WALL, this.gameView.showRanIntoWallMessage.bind(this.gameView));
                        this.socket.on(ClientConfig.IO.INCOMING.NOTIFICATION.SUICIDE, this.gameView.showSuicideMessage.bind(this.gameView));
                        this.socket.on(ClientConfig.IO.INCOMING.NOTIFICATION.YOU_DIED, this.audioController.playDeathSound.bind(this.audioController));
                        this.socket.on(ClientConfig.IO.INCOMING.NOTIFICATION.YOU_MADE_A_KILL, this.audioController.playKillSound.bind(this.audioController));
                    }
                }]);

                return GameController;
            })();

            _export('default', GameController);
        }
    };
});
System.register('main.js', ['npm:socket.io-client@1.4.5.js', 'controller/game-controller.js'], function (_export) {
  'use strict';

  var io, GameController, gameController;
  return {
    setters: [function (_npmSocketIoClient145Js) {
      io = _npmSocketIoClient145Js['default'];
    }, function (_controllerGameControllerJs) {
      GameController = _controllerGameControllerJs['default'];
    }],
    execute: function () {
      gameController = new GameController();

      gameController.connect(io);
    }
  };
});
//# sourceMappingURL=build.js.map