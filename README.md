# Monx

Clean State Management for Moon

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

Each store has a state, which is the source of truth for all components with it injected.

```js
```

### License

Licensed under the [MIT License](https://kingpixil.github.io/license) by [Kabir Shah](https://kabir.ml)
