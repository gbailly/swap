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

Utils.trimString = function(string) {
	return string.replace(/^\s+|\s+$/g, "");
};

Utils.removeStringLastChars = function(string, n) {
	return string.substr(0, string.length - n);
};

Utils.removeStringLastChar = function(string) {
	return Utils.removeStringLastChars(string, 1);
};