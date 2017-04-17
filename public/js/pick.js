var lastChecked = -Infinity;
var isScheduled = false;
var minTimeBetween = 1000;
var states = ["success", "warning", "danger"];
var active = -1;

window.onload = function() {
  var el = $("#nameField")[0];
  el.oninput = checkInputField;
  el.onpropertychange = checkInputField;
};

function checkInputField(event) {
  var value = event.target.value.trim();
  if (! value.length) {
    return;
  } else {
    event.target.value = value;
  }
  var currentTime = Date.now();
  if (currentTime - lastChecked > minTimeBetween) {
    lastChecked = currentTime;
    $.get("/validateusername/" + value, function(res) {
      active = states.indexOf(res);
      updateDisplay();
    });
  } else if (! isScheduled) {
    isScheduled = true;
    window.setTimeout(function() {
      isScheduled = false;
      checkInputField(event);
    }, currentTime - lastChecked);
  }
}

function updateDisplay() {
  var nameField = $("#nameField");
  var groupElement = $("#username-form-group");
  states.forEach(function(state, index) {
    var isActive = index === active;
    $("#" + state + "-feedback")[0].style.display = isActive ? "block" : "none";
    console.log(isActive);
    groupElement[isActive ? "addClass" : "removeClass"]("has-" + state);
    nameField[isActive ? "addClass" : "removeClass"]("form-control-" + state);
  });
}