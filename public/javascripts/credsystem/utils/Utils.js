Utils.postToURL = function(url, jsonData, optionalValue) {
  var form = document.createElement("form");
  form.setAttribute("method", "post");
  form.setAttribute("action", url);
	
  if(jsonData != null) {
    var dataField = document.createElement("input");
    dataField.setAttribute("type", "hidden");
    dataField.setAttribute("name", "data");
    dataField.setAttribute("value", jsonData);
    form.appendChild(dataField);
  }
	
  if(optionalValue != null) {
    var optionalField = document.createElement("input");
    optionalField.setAttribute("type", "hidden");
    optionalField.setAttribute("name", "optional");
    optionalField.setAttribute("value", optionalValue);
    form.appendChild(optionalField);
  }

  document.body.appendChild(form);
  form.submit();
};

Utils.stringToByteArray = function(string) {
	var array = new Array();
	var i;
	for(i=0; i<string.length; i++) {
		array.push(string.charCodeAt(i));
	}
	return array;
};


/**
 * Operations on strings.
 */

Utils.trimString = function(string) {
	return string.replace(/^\s+|\s+$/g, "");
};

Utils.removeStringLastChars = function(string, n) {
	return string.substr(0, string.length - n);
};

Utils.removeStringLastChar = function(string) {
	return Utils.removeStringLastChars(string, 1);
};

Utils.stringStartsWith = function(string, prefix) {
	return string.indexOf(prefix) == 0;
};

/*
 * Operations for the views.
 */

Utils.updateProgression = function(percentage, msg) {
	var progressBarContainer = document.getElementById("progression_container");
	progressBarContainer.setAttribute("class", "progress");
	progressBarContainer.setAttribute("style", "display:inline;");

	var msgContainer = document.getElementById("msg_container");
	if(msgContainer == null) {
		var msgContainer = document.createElement("p");
		msgContainer.setAttribute("id", "msg_container");
		var msg = document.createTextNode(msg);
		msgContainer.appendChild(msg);
		progressBarContainer.appendChild(msgContainer);
	}

	if(percentage == 100) {
		progressBarContainer.removeChild(msgContainer);
	}

	var progressBar = document.getElementById("progress_bar");
	if(progressBar == null) {
		var progressBar = document.createElement("div");
		progressBar.setAttribute("class", "bar");
		progressBar.setAttribute("id", "progress_bar");
		progressBarContainer.appendChild(progressBar);
	}
	progressBar.setAttribute("style", "width:" + percentage + "%;");
};