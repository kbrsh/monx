/**
 * Monx v0.1.1
 * Copyright 2017-2018 Kabir Shah
 * Released under the MIT License
 * https://github.com/kbrsh/monx
 */

const initState = function(store) {
  let state = store.state;
  let _state = store._state;

  let instances = store.instances;
  let map = store.map;

  for(let key in _state) {
    Object.defineProperty(state, key, {
      get: function() {
        const target = store.target;
        if(target !== undefined) {
          map[target][key] = true;
        }

        return _state[key];
      },
      set: function(value) {
        _state[key] = value;

        for(let i = 0; i < instances.length; i++) {
          let currentInstance = instances[i];
          if(map[currentInstance.name][key] === true) {
            currentInstance.build();
          }
        }
      },
      enumerable: true
    });
  }
};

const defineProperty = function(obj, prop, value, def) {
  if(value === undefined) {
    obj[prop] = def;
  } else {
    obj[prop] = value;
  }
};

let MoonDestroy;

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
};

Monx.prototype.init = function(instance) {
  const name = instance.name;
  let store = this;

  // Add store to data
  instance.data.store = store;

  // Capture dependencies
  const render = instance.render;
  instance.render = function() {
    store.target = name;
    const dom = render.apply(this, arguments);
    store.target = undefined;
    return dom;
  };

  // Remove store when destroyed
  instance.destroy = function() {
    let instances = store.instances;
    instances.splice(instances.indexOf(this), 1);
    delete store.map[name];
    MoonDestroy.apply(this, arguments);
  };

  // Add to set of instances to update
  store.instances.push(instance);

  // Add to dependency map
  store.map[name] = {};
};

Monx.init = function(Moon) {
  MoonDestroy = Moon.prototype.destroy;
};

export default Monx;
