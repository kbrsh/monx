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
          let currentInstance = instances[i];
          if(map[currentInstance.name][key] === true) {
            currentInstance.build();
          }
        }
      }
    });
  }
}

const defineProperty = function(obj, prop, value, def) {
  if(value === undefined) {
    obj[prop] = def;
  } else {
    obj[prop] = value;
  }
}
