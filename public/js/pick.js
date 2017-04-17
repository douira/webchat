var lastChecked = -Infinity;
var checkIsScheduled = false;
var minTimeBetween = 1000;
var states = ["success", "warning", "danger"];
var warningMessage = "";
var active = -1;
var module = {};
var buttonEnabled = false;

window.onload = function() {
  var el = $("#name-field")[0];
  el.oninput = checkInputField;
  el.onpropertychange = checkInputField;
  checkInputField({target: el});
};

function checkInputField(event) {
  var value = event.target.value.trim();
  event.target.value = value;
  var validationResponse = module.exports(value);
  if (validationResponse) {
    warningMessage = validationResponse;
    active = 1;
    updateDisplay();
    setCheckSchedulingStatus(false);
  } else {
    //we need to ask the server
    var currentTime = Date.now();
    if (currentTime - lastChecked > minTimeBetween) {
      setCheckSchedulingStatus(true);
      lastChecked = currentTime;
      $.get("/validateusername/" + value, function(res) {
        setCheckSchedulingStatus(false);
        active = states.indexOf(res);
        if (active === 1) {
          warningMessage = "invalid format";
        }
        updateDisplay();
      });
    } else if (! checkIsScheduled) {
      setCheckSchedulingStatus(true);
      console.log("postponed check");
      window.setTimeout(function() {
        checkInputField(event);
      }, minTimeBetween - (currentTime - lastChecked));
    } else {
      console.log("already waiting for check");
    }
  }
}

function setCheckSchedulingStatus(state) {
  checkIsScheduled = state;
  console.log("updated to", state);
  updateButton();
}

function updateButton() {
  $("#submit-button").attr("disabled", active || checkIsScheduled ? " " : null);
}

function updateDisplay() {
  var nameField = $("#name-field");
  var groupElement = $("#username-form-group");
  states.forEach(function(state, index) {
    var isActive = index === active;
    $("#" + state + "-feedback")[0].style.display = isActive ? "block" : "none";
    groupElement[isActive ? "addClass" : "removeClass"]("has-" + state);
    nameField[isActive ? "addClass" : "removeClass"]("form-control-" + state);
  });
  if (active === 1) {
    $("#warning-reason").text(warningMessage);
  }
  updateButton();
}