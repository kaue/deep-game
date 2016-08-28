System.config({
  baseURL: "./js",
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },
  bundles: {
    "build.js": [
      "main.js",
      "controller/game-controller.js",
      "view/game-view.js",
      "view/dom-helper.js",
      "npm:babel-runtime@5.8.35/helpers/class-call-check.js",
      "npm:babel-runtime@5.8.35/helpers/create-class.js",
      "npm:babel-runtime@5.8.35/core-js/object/define-property.js",
      "npm:core-js@1.2.6/library/fn/object/define-property.js",
      "npm:core-js@1.2.6/library/modules/$.js",
      "config/client-config.js",
      "npm:babel-runtime@5.8.35/core-js/get-iterator.js",
      "npm:core-js@1.2.6/library/fn/get-iterator.js",
      "npm:core-js@1.2.6/library/modules/core.get-iterator.js",
      "npm:core-js@1.2.6/library/modules/$.core.js",
      "npm:core-js@1.2.6/library/modules/core.get-iterator-method.js",
      "npm:core-js@1.2.6/library/modules/$.iterators.js",
      "npm:core-js@1.2.6/library/modules/$.wks.js",
      "npm:core-js@1.2.6/library/modules/$.global.js",
      "npm:core-js@1.2.6/library/modules/$.uid.js",
      "npm:core-js@1.2.6/library/modules/$.shared.js",
      "npm:core-js@1.2.6/library/modules/$.classof.js",
      "npm:core-js@1.2.6/library/modules/$.cof.js",
      "npm:core-js@1.2.6/library/modules/$.an-object.js",
      "npm:core-js@1.2.6/library/modules/$.is-object.js",
      "npm:core-js@1.2.6/library/modules/es6.string.iterator.js",
      "npm:core-js@1.2.6/library/modules/$.iter-define.js",
      "npm:core-js@1.2.6/library/modules/$.set-to-string-tag.js",
      "npm:core-js@1.2.6/library/modules/$.has.js",
      "npm:core-js@1.2.6/library/modules/$.iter-create.js",
      "npm:core-js@1.2.6/library/modules/$.hide.js",
      "npm:core-js@1.2.6/library/modules/$.descriptors.js",
      "npm:core-js@1.2.6/library/modules/$.fails.js",
      "npm:core-js@1.2.6/library/modules/$.property-desc.js",
      "npm:core-js@1.2.6/library/modules/$.redefine.js",
      "npm:core-js@1.2.6/library/modules/$.export.js",
      "npm:core-js@1.2.6/library/modules/$.ctx.js",
      "npm:core-js@1.2.6/library/modules/$.a-function.js",
      "npm:core-js@1.2.6/library/modules/$.library.js",
      "npm:core-js@1.2.6/library/modules/$.string-at.js",
      "npm:core-js@1.2.6/library/modules/$.defined.js",
      "npm:core-js@1.2.6/library/modules/$.to-integer.js",
      "npm:core-js@1.2.6/library/modules/web.dom.iterable.js",
      "npm:core-js@1.2.6/library/modules/es6.array.iterator.js",
      "npm:core-js@1.2.6/library/modules/$.to-iobject.js",
      "npm:core-js@1.2.6/library/modules/$.iobject.js",
      "npm:core-js@1.2.6/library/modules/$.iter-step.js",
      "npm:core-js@1.2.6/library/modules/$.add-to-unscopables.js",
      "view/canvas-factory.js",
      "view/canvas-view.js",
      "model/text-to-draw.js",
      "controller/audio-controller.js",
      "npm:babel-runtime@5.8.35/core-js/object/keys.js",
      "npm:core-js@1.2.6/library/fn/object/keys.js",
      "npm:core-js@1.2.6/library/modules/es6.object.keys.js",
      "npm:core-js@1.2.6/library/modules/$.object-sap.js",
      "npm:core-js@1.2.6/library/modules/$.to-object.js",
      "npm:socket.io-client@1.4.5.js",
      "npm:socket.io-client@1.4.5/lib/index.js",
      "npm:socket.io-client@1.4.5/lib/socket.js",
      "npm:has-binary@0.1.7.js",
      "npm:has-binary@0.1.7/index.js",
      "github:jspm/nodelibs-buffer@0.1.0.js",
      "github:jspm/nodelibs-buffer@0.1.0/index.js",
      "npm:buffer@3.6.0.js",
      "npm:buffer@3.6.0/index.js",
      "npm:isarray@1.0.0.js",
      "npm:isarray@1.0.0/index.js",
      "npm:ieee754@1.1.6.js",
      "npm:ieee754@1.1.6/index.js",
      "npm:base64-js@0.0.8.js",
      "npm:base64-js@0.0.8/lib/b64.js",
      "npm:isarray@0.0.1.js",
      "npm:isarray@0.0.1/index.js",
      "npm:debug@2.2.0.js",
      "npm:debug@2.2.0/browser.js",
      "npm:debug@2.2.0/debug.js",
      "npm:ms@0.7.1.js",
      "npm:ms@0.7.1/index.js",
      "npm:component-bind@1.0.0.js",
      "npm:component-bind@1.0.0/index.js",
      "npm:socket.io-client@1.4.5/lib/on.js",
      "npm:to-array@0.1.4.js",
      "npm:to-array@0.1.4/index.js",
      "npm:component-emitter@1.2.0.js",
      "npm:component-emitter@1.2.0/index.js",
      "npm:socket.io-parser@2.2.6.js",
      "npm:socket.io-parser@2.2.6/index.js",
      "npm:socket.io-parser@2.2.6/is-buffer.js",
      "npm:socket.io-parser@2.2.6/binary.js",
      "npm:component-emitter@1.1.2.js",
      "npm:component-emitter@1.1.2/index.js",
      "npm:json3@3.3.2.js",
      "npm:json3@3.3.2/lib/json3.js",
      "npm:socket.io-client@1.4.5/lib/manager.js",
      "npm:backo2@1.0.2.js",
      "npm:backo2@1.0.2/index.js",
      "npm:indexof@0.0.1.js",
      "npm:indexof@0.0.1/index.js",
      "npm:engine.io-client@1.6.8.js",
      "npm:engine.io-client@1.6.8/index.js",
      "npm:engine.io-client@1.6.8/lib/index.js",
      "npm:engine.io-parser@1.2.4.js",
      "npm:engine.io-parser@1.2.4/lib/browser.js",
      "npm:blob@0.0.4.js",
      "npm:blob@0.0.4/index.js",
      "npm:utf8@2.1.0.js",
      "npm:utf8@2.1.0/utf8.js",
      "npm:after@0.8.1.js",
      "npm:after@0.8.1/index.js",
      "npm:base64-arraybuffer@0.1.2.js",
      "npm:base64-arraybuffer@0.1.2/lib/base64-arraybuffer.js",
      "npm:arraybuffer.slice@0.0.6.js",
      "npm:arraybuffer.slice@0.0.6/index.js",
      "npm:has-binary@0.1.6.js",
      "npm:has-binary@0.1.6/index.js",
      "npm:engine.io-parser@1.2.4/lib/keys.js",
      "npm:engine.io-client@1.6.8/lib/socket.js",
      "npm:engine.io-client@1.6.8/lib/transport.js",
      "npm:parseqs@0.0.2.js",
      "npm:parseqs@0.0.2/index.js",
      "npm:parsejson@0.0.1.js",
      "npm:parsejson@0.0.1/index.js",
      "npm:parseuri@0.0.4.js",
      "npm:parseuri@0.0.4/index.js",
      "npm:engine.io-client@1.6.8/lib/transports/index.js",
      "npm:engine.io-client@1.6.8/lib/transports/websocket.js",
      "npm:yeast@0.1.2.js",
      "npm:yeast@0.1.2/index.js",
      "npm:component-inherit@0.0.3.js",
      "npm:component-inherit@0.0.3/index.js",
      "npm:engine.io-client@1.6.8/lib/transports/polling-jsonp.js",
      "npm:engine.io-client@1.6.8/lib/transports/polling.js",
      "npm:engine.io-client@1.6.8/lib/xmlhttprequest.js",
      "npm:has-cors@1.1.0.js",
      "npm:has-cors@1.1.0/index.js",
      "npm:engine.io-client@1.6.8/lib/transports/polling-xhr.js",
      "npm:socket.io-client@1.4.5/lib/url.js"
    ]
  },

  map: {
    "babel": "npm:babel-core@5.8.35",
    "babel-runtime": "npm:babel-runtime@5.8.35",
    "core-js": "npm:core-js@1.2.6",
    "socket.io-client": "npm:socket.io-client@1.4.5",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.6.0"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.2"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:babel-runtime@5.8.35": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:benchmark@1.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:better-assert@1.0.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "callsite": "npm:callsite@1.0.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:buffer@3.6.0": {
      "base64-js": "npm:base64-js@0.0.8",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "ieee754": "npm:ieee754@1.1.6",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:core-js@1.2.6": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:debug@2.2.0": {
      "ms": "npm:ms@0.7.1"
    },
    "npm:engine.io-client@1.6.8": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "component-emitter": "npm:component-emitter@1.1.2",
      "component-inherit": "npm:component-inherit@0.0.3",
      "debug": "npm:debug@2.2.0",
      "engine.io-parser": "npm:engine.io-parser@1.2.4",
      "has-cors": "npm:has-cors@1.1.0",
      "indexof": "npm:indexof@0.0.1",
      "parsejson": "npm:parsejson@0.0.1",
      "parseqs": "npm:parseqs@0.0.2",
      "parseuri": "npm:parseuri@0.0.4",
      "yeast": "npm:yeast@0.1.2"
    },
    "npm:engine.io-parser@1.2.4": {
      "after": "npm:after@0.8.1",
      "arraybuffer.slice": "npm:arraybuffer.slice@0.0.6",
      "base64-arraybuffer": "npm:base64-arraybuffer@0.1.2",
      "blob": "npm:blob@0.0.4",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "has-binary": "npm:has-binary@0.1.6",
      "utf8": "npm:utf8@2.1.0"
    },
    "npm:has-binary@0.1.6": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "isarray": "npm:isarray@0.0.1"
    },
    "npm:has-binary@0.1.7": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "isarray": "npm:isarray@0.0.1"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:parsejson@0.0.1": {
      "better-assert": "npm:better-assert@1.0.2"
    },
    "npm:parseqs@0.0.2": {
      "better-assert": "npm:better-assert@1.0.2"
    },
    "npm:parseuri@0.0.4": {
      "better-assert": "npm:better-assert@1.0.2"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:socket.io-client@1.4.5": {
      "backo2": "npm:backo2@1.0.2",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "component-bind": "npm:component-bind@1.0.0",
      "component-emitter": "npm:component-emitter@1.2.0",
      "debug": "npm:debug@2.2.0",
      "engine.io-client": "npm:engine.io-client@1.6.8",
      "has-binary": "npm:has-binary@0.1.7",
      "indexof": "npm:indexof@0.0.1",
      "object-component": "npm:object-component@0.0.3",
      "parseuri": "npm:parseuri@0.0.4",
      "socket.io-parser": "npm:socket.io-parser@2.2.6",
      "to-array": "npm:to-array@0.1.4"
    },
    "npm:socket.io-parser@2.2.6": {
      "benchmark": "npm:benchmark@1.0.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "component-emitter": "npm:component-emitter@1.1.2",
      "debug": "npm:debug@2.2.0",
      "isarray": "npm:isarray@0.0.1",
      "json3": "npm:json3@3.3.2"
    },
    "npm:utf8@2.1.0": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    }
  }
});
