let MoonDestroy;

//=require ./util/util.js

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
  }

  // Remove store when destroyed
  instance.destroy = function() {
    let instances = store.instances;
    instances.splice(instances.indexOf(this), 1);
    delete store.map[name];
    MoonDestroy.apply(this, arguments);
  }

  // Add to set of instances to update
  store.instances.push(instance);

  // Add to dependency map
  store.map[name] = {};
}

Monx.init = function(Moon) {
  MoonDestroy = Moon.prototype.destroy;
}
