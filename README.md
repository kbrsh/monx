# Monx

Clean State Management for Moon

### Features

* :balloon: Lightweight - 598 bytes minified and gzipped
* :zap: Performant - analyzes dependencies and updates view accordingly
* :bulb: Simple - just dispatch actions to update the state

### Installation

With NPM:

```sh
$ npm install monx
```

CDN:

```html
<script src="https://unpkg.com/monx"></script>
```

### Usage

Initialize the plugin with:

```js
Moon.use(Monx);
```

Then, create your store:

```js
const store = new Monx({
  state: {
    count: 1
  },
  actions: {
    increment: function(state, payload) {
      state.count += payload;
    }
  }
});
```

Each store has a state, which is the source of truth for all components with it injected. A store can only change the state through an **action**. An action can be asynchronous or synchronous, and will result in components depending on the property to be updated.

To inject the store into a component (or the root instance), use the `store` option.

```js
new Moon({
  el: "#app",
  template: `<div id="app">
    <h1>{{store.state.count}}</h1>
    <button m-on:click="increment">Increment</button>
  </div>`,
  methods: {
    increment: function() {
      store.dispatch("increment", 1);
    }
  },
  store: store
});
```

The given example has a state for a count, which multiple components can be injected with and share. When the user clicks the button, the increment method will be called on the root component, resulting in an action being dispatched to the store.

The action is called with a payload, which is an optional second argument to the `dispatch` method. The `increment` action then increments the count. Finally, Monx will search for instances that depend on `count`, and update them.

### License

Licensed under the [MIT License](https://kingpixil.github.io/license) by [Kabir Shah](https://kabir.ml)
