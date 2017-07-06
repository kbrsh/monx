(function(root, factory) {
  /* ======= Global Monx ======= */
  (typeof module === "object" && module.exports) ? module.exports = factory() : root.Monx = factory();
}(this, function() {
    //=require ../dist/monx.js
    return Monx;
}));
