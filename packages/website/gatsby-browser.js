import "core-js/stable";
import "regenerator-runtime/runtime";
import "normalize.css";
import "./src/main.css";
import "./src/prism.css";

if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}
