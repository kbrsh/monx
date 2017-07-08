const initState = function(store) {
  let currentInstance = null;
  let instances = store.instances;
  let map = store.map;
  let state = store.state;
  let _state = store._state;

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

const defineProperty = function(obj, prop, value, def) {
  if(value === undefined) {
    obj[prop] = def;
  } else {
    obj[prop] = value;
  }
}
