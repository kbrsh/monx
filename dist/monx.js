/**
 * Monx v0.1.1
 * Copyright 2017 Kabir Shah
 * Released under the MIT License
 * https://github.com/KingPixil/monx
 */

(function(root, factory) {
  /* ======= Global Monx ======= */
  (typeof module === "object" && module.exports) ? module.exports = factory() : root.Monx = factory();
}(this, function() {
    var MoonDestroy = null;
    var target = null;
    var tested = {};
    
    var initState = function(store) {
      var currentInstance = null;
      var instances = store.instances;
      var map = store.map;
      var state = store.state;
      var _state = store._state;
    
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
    
      // Initialize Reactive State
      initState(this);
    }
    
    Monx.prototype.dispatch = function(name, payload) {
      this.actions[name](this.state, payload);
    }
    
    Monx.prototype.install = function(instance) {
      // Remove store when destroyed
      var store = this;
      instance.destroy = function() {
        var instances = store.instances;
        instances.splice(instances.indexOf(this), 1);
        MoonDestroy.apply(this, arguments);
      }
    
      // Add to set of instances to update
      this.instances.push(instance);
    }
    
    Monx.init = function(Moon) {
      var MoonRender = Moon.prototype.render;
      MoonDestroy = Moon.prototype.destroy;
      
      Moon.prototype.render = function() {
        var name = null;
        var dom = null;
        var store = null;
    
        if((store = this.$options.store) !== undefined) {
          this.$data.store = store;
          store.install(this);
    
          if(tested[(name = this.$name)] !== true) {
            // Mark this component as tested
            tested[name] = true;
    
            // Setup target to capture dependencies
            target = name;
    
            // Mount
            dom = MoonRender.apply(this, arguments);
    
            // Stop capturing dependencies
            target = null;
          } else {
            dom = MoonRender.apply(this, arguments);
          }
        } else {
          dom = MoonRender.apply(this, arguments);
        }
    
        this.render = MoonRender;
        return dom;
      }
    }
    
    return Monx;
}));
