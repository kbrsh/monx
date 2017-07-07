let Moon = null;
let target = null;
let tested = {};

//=require ./util/util.js

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
  let currentInstance = null;
  let instances = this.instances;
  let map = this.map;

  // Add to set of instances to update
  instances.push(instance);

  // Initialize reactive state
  let state = this.state;
  let _state = this._state;
  for(let key in _state) {
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

        for(let i = 0; i < instances.length; i++) {
          if(map[(currentInstance = instances[i]).$name][key] === true) {
            currentInstance.build();
          }
        }
      }
    });
  }
}

Monx.init = function(_Moon) {
  Moon = _Moon;

  let MoonInit = Moon.prototype.init;
  let MoonRender = Moon.prototype.render;

  Moon.prototype.init = function() {
    let store = null;
    if((store = this.$options.store) !== undefined) {
      this.$data.store = store;
      store.install(this);
    }

    MoonInit.apply(this, arguments);
  }

  Moon.prototype.render = function() {
    let name = null;
    let dom = null;

    if(this.$options.store !== undefined && tested[(name = this.$name)] !== true) {
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

    this.render = MoonRender;
    return dom;
  }
}
