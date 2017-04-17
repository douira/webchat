var lastChecked = -Infinity;
var isScheduled = false;
var minTimeBetween = 1000;

window.onload = function() {
  var el = document.getElementById("nameField");
  el.oninput = checkInputField;
  el.onpropertychange = checkInputField;
};

function checkInputField(event) {
  var currentTime = Date.now();
  if (currentTime - lastChecked > minTimeBetween) {
    lastChecked = currentTime;
    var element = event.target;
    var value = element.value;
    console.log();
  } else if (! isScheduled) {
    isScheduled = true;
    window.setTimeout(function() {
      isScheduled = false;
      checkInputField(event);
    }, currentTime - lastChecked);
  }
}