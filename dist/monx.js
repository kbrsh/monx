/**
 * Monx v0.1.1
 * Copyright 2017 Kabir Shah
 * Released under the MIT License
 * https://github.com/kbrsh/monx
 */

(function(root, factory) {
  /* ======= Global Monx ======= */
  if(typeof module === "undefined") {
    root.Monx = factory();
  } else {
    module.exports = factory();
  }
}(this, function() {
    var MoonDestroy;
    
    var initState = function(store) {
      var state = store.state;
      var _state = store._state;
    
      var instances = store.instances;
      var map = store.map;
    
      var loop = function ( key ) {
        Object.defineProperty(state, key, {
          get: function() {
            var target = store.target;
            if(target !== undefined) {
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
              var currentInstance = instances[i];
              if(map[currentInstance.name][key] === true) {
                currentInstance.build();
              }
            }
          }
        });
      };
    
      for(var key in _state) loop( key );
    }
    
    var defineProperty = function(obj, prop, value, def) {
      if(value === undefined) {
        obj[prop] = def;
      } else {
        obj[prop] = value;
      }
    }
    
    
    function Monx(options) {
      // State
      this.state = {};
      defineProperty(this, "_state", options.state, {});
    
      // Actions
      defineProperty(this, "actions", options.actions, {});
    
      // Instances
      this.instances = [];
    
      // Dependency map
      this.map = {};
    
      // Component to capture
      this.target = undefined;
    
      // Initialize reactive state
      initState(this);
    }
    
    Monx.prototype.dispatch = function(name, payload) {
      this.actions[name](this.state, payload);
    }
    
    Monx.prototype.init = function(instance) {
      var name = instance.name;
      var store = this;
    
      // Add store to data
      instance.data.store = store;
    
      // Capture dependencies
      var render = instance.render;
      instance.render = function() {
        store.target = name;
        var dom = render.apply(this, arguments);
        store.target = undefined;
        return dom;
      }
    
      // Remove store when destroyed
      instance.destroy = function() {
        var instances = store.instances;
        instances.splice(instances.indexOf(this), 1);
        MoonDestroy.apply(this, arguments);
      }
    
      // Add to set of instances to update
      store.instances.push(instance);
    }
    
    Monx.init = function(Moon) {
      MoonDestroy = Moon.prototype.destroy;
    }
    
    return Monx;
}));
