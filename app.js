// Delgets deer ajillah controller
var uiController = (function () {})();

//Sanhuutei ajillah controller
var financeController = (function () {})();

// Programiin holbogch controller
var appController = (function (uiController, financeController) {
  var ctrlAddItem = function () {
    // 1. Oruulah ugugdliig delgetsees haij olno.
    // 2. Olj avsan ugugdluudee sanhuugiin controllert damjuulj tend hadgalna.
    // 3. Olj avsan ugugdluudee web deer gargana
    // 4. Tusviig tootsoolno
    // 5. Etssiin uldegdel, tootsoog delgetsend gargana
  };

  document.querySelector(".add__btn").addEventListener("click", function () {
    ctrlAddItem();
  });

  document.addEventListener("keypress", function (event) {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });
})(uiController, financeController);
