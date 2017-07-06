/**
 * Monx v0.0.1
 * Copyright 2017 Kabir Shah
 * Released under the MIT License
 * https://github.com/KingPixil/monx
 */

(function(root, factory) {
  /* ======= Global Monx ======= */
  (typeof module === "object" && module.exports) ? module.exports = factory() : root.Monx = factory();
}(this, function() {
    var Moon = null;
    
    var defineProperty = function(obj, prop, value, def) {
      if(value === undefined) {
        obj[prop] = def;
      } else {
        obj[prop] = value;
      }
    }
    
    
    function Monx(options) {
      // Setup state
      this.state = {};
      defineProperty(this, "_state", options.state, {});
    
      // Setup actions
      defineProperty(this, "actions", options.actions, {});
    
      // Setup instance
      this.instance = null;
    }
    
    Monx.prototype.dispatch = function(name, payload) {
      this.actions[name](this.state, payload);
    }
    
    Monx.prototype.install = function(instance) {
      this.instance = instance;
    
      var state = this.state;
      var _state = this._state;
      var loop = function ( key ) {
        Object.defineProperty(state, key, {
          get: function() {
            return _state[key];
          },
          set: function(value) {
            _state[key] = value;
            instance.build();
          }
        });
      };
    
      for(var key in _state) loop( key );
    }
    
    Monx.init = function(_Moon) {
      Moon = _Moon;
    
      var MoonInit = Moon.prototype.init;
      Moon.prototype.init = function() {
        if(this.$options.store !== undefined) {
          var store = this.$options.store;
          this.$data.store = store;
          store.install(this);
        }
    
        MoonInit.apply(this, arguments);
      }
    }
    
    return Monx;
}));
