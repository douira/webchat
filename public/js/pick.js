var lastChecked = -Infinity; //timestamp of checking the name's validity
var checkIsScheduled = false; //set to true when waiting for the server to respond with name validity
var minTimeBetween = 1000; //time between validating the name with the server
var states = ["success", "warning", "danger"]; //possible states of name validity
var warningMessage = ""; //specific warning message displayed for the warning state
var active = -1; //which one of the states is active, also determines the color and icon of the view field
var module = {}; //fake node module for using usernameValidator.js
var buttonEnabled = false; //disabled the button until name is validated
var value = ""; //current contents of the name field

//setup as soon as we can be sure that everything we need is in place
window.onload = function() {
  //get the input field and attach change handlers
  var el = $("#name-field")[0];
  el.oninput = checkInputField;
  el.onpropertychange = checkInputField;

  //do initital check
  checkInputField({target: el});

  //attach click handler on button
  $("#submit-button").click(sendForm);
};

//actually registers the chosen name and moves the browser back to the main chat page
function sendForm() {
  //send name to /registername to select it for the user's session
  $.post("/registername", {
    name: value
  }, function() {
    //more browser to main page after name has been set
    window.location.href = "/";
  });
}

//handler for change of the name inout field
function checkInputField(event) {
  //get the entered user name
  value = event.target.value.trim();

  //return trimmed user name, user shouldn't have to remove spaced manually
  event.target.value = value;

  //get preliminary name validation, only name itself
  var validationResponse = module.exports(value);

  //if validation response if something, then the name is invalid
  if (validationResponse) {
    warningMessage = validationResponse;
    active = 1;
    updateDisplay();
    setCheckSchedulingStatus(false);
  } else { //name is ok, we need to ask the server now
    //get current time and check if we shoudl aks the server now or wait
    var currentTime = Date.now();
    if (currentTime - lastChecked > minTimeBetween) {
      //waiting for server now
      setCheckSchedulingStatus(true);

      //now is the last time we checked because we're doing it right now
      lastChecked = currentTime;

      //send get request to validation endpoint
      $.get("/validateusername/" + value, function(res) {
        //not waiting anymore, we have response now
        setCheckSchedulingStatus(false);

        //set active state to responded state
        active = states.indexOf(res);

        //if the server responds with a warning then the client validated the name differently from the server, use inconclusive warning message
        if (active === 1) {
          warningMessage = "invalid format";
        }

        //update display with new state
        updateDisplay();
      });
    } else if (! checkIsScheduled) {
      //waiting to send request to server
      setCheckSchedulingStatus(true);

      //set a timer to check again in the remaining time we have to wait
      window.setTimeout(function() {
        checkInputField(event);
      }, minTimeBetween - (currentTime - lastChecked));
    }
  }
}

//sets wether or not we're waiting for the server to respond
function setCheckSchedulingStatus(state) {
  checkIsScheduled = state;
  updateButton();
}

//updates the disabled state of the button according to the set state
function updateButton() {
  //disabled when we're waiting or the name isn't ok
  $("#submit-button").attr("disabled", active || checkIsScheduled ? " " : null);
}

//updates the name field and the info text
function updateDisplay() {
  //get the elements we want to work with
  var nameField = $("#name-field");
  var groupElement = $("#username-form-group");

  //remove inactive states and add the active state
  states.forEach(function(state, index) {
    //is true when the current state is the active one
    var isActive = index === active;

    //remove or add the current state styles
    $("#" + state + "-feedback")[0].style.display = isActive ? "block" : "none";
    groupElement[isActive ? "addClass" : "removeClass"]("has-" + state);
    nameField[isActive ? "addClass" : "removeClass"]("form-control-" + state);
  });

  //add wanring reason text if applicable
  if (active === 1) {
    $("#warning-reason").text(warningMessage);
  }

  //update the button state with everythign else, active state may have changed as cause for calling this function
  updateButton();
}