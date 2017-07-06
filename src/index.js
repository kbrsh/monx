let Moon = null;

//=require ./util/util.js

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

  let state = this.state;
  let _state = this._state;
  for(let key in _state) {
    Object.defineProperty(state, key, {
      get: function() {
        return _state[key];
      },
      set: function(value) {
        _state[key] = value;
        instance.build();
      }
    });
  }
}

Monx.init = function(_Moon) {
  Moon = _Moon;

  let MoonInit = Moon.prototype.init;
  Moon.prototype.init = function() {
    if(this.$options.store !== undefined) {
      let store = this.$options.store;
      this.$data.store = store;
      store.install(this);
    }

    MoonInit.apply(this, arguments);
  }
}
