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
    var target = null;
    var tested = {};
    
    var notify = function(key, value) {
      
    }
    
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
    
      // Setup instances
      this.instances = [];
    
      // Setup dependency map
      this.map = {};
    }
    
    Monx.prototype.dispatch = function(name, payload) {
      this.actions[name](this.state, payload);
    }
    
    Monx.prototype.install = function(instance) {
      var name = null;
      var currentInstance = null;
      var instances = this.instances;
      var map = this.map;
    
      // Add to set of instances to update
      instances.push(instance);
    
      // Initialize reactive state
      var state = this.state;
      var _state = this._state;
      var loop = function ( key ) {
        Object.defineProperty(state, key, {
          get: function() {
            if(target !== null) {
              if(map[target] === undefined) {
                map[target] = {};
              }
    
              map[target][key] = true;
            }
    
            return _state[key];
          },
          set: function(value) {
            _state[key] = value;
    
            for(var i = 0; i < instances.length; i++) {
              if(map[(currentInstance = instances[i]).$name][key] === true) {
                currentInstance.build();
              }
            }
          }
        });
      };
    
      for(var key in _state) loop( key );
    }
    
    Monx.init = function(_Moon) {
      Moon = _Moon;
    
      var MoonInit = Moon.prototype.init;
      var MoonMount = Moon.prototype.mount;
    
      Moon.prototype.init = function() {
        var store = null;
        if((store = this.$options.store) !== undefined) {
          this.$data.store = store;
          store.install(this);
        }
    
        MoonInit.apply(this, arguments);
      }
    
      Moon.prototype.mount = function() {
        var name = null;
        var store = null;
        if(this.$options.store !== undefined && tested[(name = this.$name)] !== true) {
          // Mark this component as tested
          tested[name] = true;
    
          // Setup target to capture dependencies
          target = name;
    
          // Mount
          MoonMount.apply(this, arguments);
    
          // Stop capturing dependencies
          target = null;
        } else {
          MoonMount.apply(this, arguments);
        }
      }
    }
    
    return Monx;
}));
