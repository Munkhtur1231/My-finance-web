// Delgets deer ajillah controller
var uiController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: ".income__list",
    expensesList: ".expenses__list",
    incomeLabel: ".budget__income--value",
    expeseLabel: ".budget__expenses--value",
    tusuvLabel: ".budget__value",
    percenageLabel: ".budget__expenses--percentage",
    containerDiv: ".container",
    expensePercentageLabel: ".item__percentage",
    dateLabel: ".budget__title--month",
  };

  var nodeListForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  var formatBudget = function (too, type) {
    too = too.toString();
    if (too[0] === "-") too = too.substr(1, too.length - 1);
    var x = too.split("").reverse().join("");
    var y = "";
    var count = 1;
    for (var i = 0; i < x.length; i++) {
      y += x[i];
      if (count % 3 === 0) y += ",";
      count++;
    }
    x = y.split("").reverse().join("");
    if (x[0] === ",") x = x.substr(1, x.length - 1);
    if (type === "inc") x = "+ " + x;
    else x = "- " + x;
    return x;
  };

  return {
    displayDate: function () {
      var today = new Date();
      document.querySelector(DOMstrings.dateLabel).textContent =
        today.getFullYear() +
        " оны " +
        (today.getMonth() + 1) +
        " сарын өрхийн санхүү";
    },

    changeType: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputType +
          ", " +
          DOMstrings.inputDescription +
          ", " +
          DOMstrings.inputValue
      );
      nodeListForEach(fields, function (el) {
        el.classList.toggle("red-focus");
      });
      document.querySelector(DOMstrings.addBtn).classList.toggle("red");
    },

    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // inc exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        // String iig too ruu horvuulne
        value: parseInt(document.querySelector(DOMstrings.inputValue).value),
      };
    },
    getDOMstrings: function () {
      return DOMstrings;
    },
    clearFields: function () {
      // querySelectorAll -> DOM-oos olon element shuuj avaad list bolgon ugdug
      var fields = document.querySelectorAll(
        DOMstrings.inputDescription + "," + DOMstrings.inputValue
      );

      // Convert List to Array ---> list-d slice gedeg funkts baihgui tul array-iin udamshilaas slice funktsiig call ashiglan this zaagchiig tuhain list ruu zaalgaj uurchlun duudna.
      var fieldsArray = Array.prototype.slice.call(fields);

      // Array-iin element bur buyu --> forEach(array dotorh 1 element, heddeh element, array uuruu) gej hereglene
      fieldsArray.forEach(function (el, index, array) {
        el.value = "";
      });

      // DOM iin element bur deer focus geh funkts bdg teriig duudaj cursor iig tuhgain element-d avaachna
      fieldsArray[0].focus();
    },

    tusviigUzuuleh: function (tusuv) {
      var type;
      if (tusuv.tusuv >= 0) type = "inc";
      else type = "exp";
      document.querySelector(DOMstrings.tusuvLabel).textContent = formatBudget(
        tusuv.tusuv,
        type
      );
      document.querySelector(DOMstrings.incomeLabel).textContent = formatBudget(
        tusuv.totalInc,
        "inc"
      );
      document.querySelector(DOMstrings.expeseLabel).textContent = formatBudget(
        tusuv.totalExp,
        "exp"
      );
      if (tusuv.huvi > 1000) {
        document.querySelector(DOMstrings.percenageLabel).textContent =
          "+1000%";
      } else {
        document.querySelector(DOMstrings.percenageLabel).textContent =
          tusuv.huvi + "%";
      }
    },

    addListItem: function (item, type) {
      // Orlogo zarlagiin elementiig aguulsan html elementiig beltgene
      var html, list;
      if (type === "inc") {
        list = DOMstrings.incomeList;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        list = DOMstrings.expensesList;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // Ter html dotroo orlogo zarlagiin utguudiig replace ashiglaj uurchilnu
      html = html.replace("%id%", item.id);
      html = html.replace("$$DESCRIPTION$$", item.description);
      html = html.replace("$$VALUE$$", formatBudget(item.value, type));
      // Beltgesen html ee DOM  ruu hiij ugnu
      document.querySelector(list).insertAdjacentHTML("beforeend", html);
    },

    displayPercentages: function (allPercentages) {
      var elements = document.querySelectorAll(
        DOMstrings.expensePercentageLabel
      );
      // Element bolgonii huvid zarlagiin huviig massivaas avch shivj oruulah
      nodeListForEach(elements, function (el, index) {
        el.textContent = allPercentages[index] + "%";
      });
    },

    deleteListItem: function (id) {
      var el = document.getElementById(id);
      el.parentNode.removeChild(el);
    },
  };
})();

//Sanhuutei ajillah controller
var financeController = (function () {
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calPercentage = function (totalIncoming) {
    if (totalIncoming > 0)
      this.percentage = Math.round((this.value / totalIncoming) * 100);
    else this.percentage = 0;
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  var calculateTotal = function (type) {
    var sum = 0;
    data.items[type].forEach(function (el) {
      sum += el.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    items: {
      inc: [],
      exp: [],
    },
    totals: {
      inc: 0,
      exp: 0,
    },
    tusuv: 0,

    huvi: 0,
  };

  return {
    tusuvTootsooloh: function () {
      // Niit orlogiin niilber
      calculateTotal("inc");
      // Niit zarlagiin niilber
      calculateTotal("exp");

      // Tusviig shineer tootsoolno
      data.tusuv = data.totals.inc - data.totals.exp;

      // Orlogo zarlagiin huviig tootsoolno
      if (data.totals.exp > 0)
        data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
      else data.huvi = 0;
    },

    calculatePercentages: function () {
      data.items.exp.forEach(function (el) {
        el.calPercentage(data.totals.inc);
      });
    },

    getPercentages: function () {
      var allPercentages = data.items.exp.map(function (el) {
        return el.getPercentage();
      });

      return allPercentages;
    },

    tusviigAvah: function () {
      return {
        tusuv: data.tusuv,
        huvi: data.huvi,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
      };
    },

    deleteItem: function (type, id) {
      var ids = data.items[type].map(function (el) {
        return el.id;
      });

      var index = ids.indexOf(id);
      if (index !== -1) {
        data.items[type].splice(index, 1);
      }
    },

    addItem: function (type, description, value) {
      var item, id;
      if (data.items[type].length === 0) id = 1;
      else {
        id = data.items[type][data.items[type].length - 1].id + 1;
      }
      if (type === "inc") {
        item = new Income(id, description, value);
      } else {
        item = new Expense(id, description, value);
      }
      data.items[type].push(item);
      return item;
    },
    seeData: function () {
      return data;
    },
  };
})();

// Programiin holbogch controller
var appController = (function (uiController, financeController) {
  var ctrlAddItem = function () {
    // 1. Oruulah ugugdliig delgetsees haij olno.
    var input = uiController.getInput();

    if (input.description !== "" && input.value !== "") {
      // 2. Olj avsan ugugdluudee sanhuugiin controllert damjuulj tend hadgalna.
      var item = financeController.addItem(
        input.type,
        input.description,
        input.value
      );
      // 3. Olj avsan ugugdluudee web deer gargana
      uiController.addListItem(item, input.type);
      uiController.clearFields();

      // Tusviig shineer tootsoolood delgetsend uzuulne
      updateTusuv();
    }
  };

  var updateTusuv = function () {
    // 4. Tusviig tootsoolno
    financeController.tusuvTootsooloh();
    // 5. Etssiin uldegdel
    var tusuv = financeController.tusviigAvah();
    // 6. tootsoog delgetsend gargana
    uiController.tusviigUzuuleh(tusuv);
    // 7. Huviig tootsoolno
    financeController.calculatePercentages();
    // 8. Elementuudiin huviig huleej avna
    var allPercentages = financeController.getPercentages();
    // 9. Delgetsend gargana
    uiController.displayPercentages(allPercentages);
  };

  var setupEventListeners = function () {
    var DOM = uiController.getDOMstrings();
    document.querySelector(DOM.addBtn).addEventListener("click", function () {
      ctrlAddItem();
    });

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document
      .querySelector(DOM.containerDiv)
      .addEventListener("click", function (event) {
        var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (id) {
          var arr = id.split("-");
          var type = arr[0];
          var itemId = parseInt(arr[1]);
          // 1. Sanhuugiin modulaas type, id ashiglan ustgana
          financeController.deleteItem(type, itemId);
          // 2. Delgets deerees ene elementiig ustgana
          uiController.deleteListItem(id);
          // 3. Uldegdel tootsoog shineshilj haruulna.
          updateTusuv();
        }
      });

    document
      .querySelector(DOM.inputType)
      .addEventListener("change", uiController.changeType);
  };

  return {
    init: function () {
      console.log("Application started");
      uiController.tusviigUzuuleh({
        tusuv: 0,
        huvi: 0,
        totalInc: 0,
        totalExp: 0,
      });
      uiController.displayDate();
      setupEventListeners();
    },
  };
})(uiController, financeController);

appController.init();
