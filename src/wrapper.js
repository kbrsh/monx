(function(root, factory) {
  /* ======= Global Monx ======= */
  if(typeof module === "undefined") {
    root.Monx = factory();
  } else {
    module.exports = factory();
  }
}(this, function() {
    //=require ../dist/monx.js
    return Monx;
}));
