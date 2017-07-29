let MoonDestroy = null;
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

  // Initialize Reactive State
  initState(this);
}

Monx.prototype.dispatch = function(name, payload) {
  this.actions[name](this.state, payload);
}

Monx.prototype.install = function(instance) {
  // Remove store when destroyed
  let store = this;
  instance.destroy = function() {
    let instances = store.instances;
    instances.splice(instances.indexOf(this), 1);
    MoonDestroy.apply(this, arguments);
  }

  // Add to set of instances to update
  this.instances.push(instance);
}

Monx.init = function(Moon) {
  const MoonRender = Moon.prototype.render;
  MoonDestroy = Moon.prototype.destroy;
  
  Moon.prototype.render = function() {
    let name = null;
    let dom = null;
    let store = null;

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
