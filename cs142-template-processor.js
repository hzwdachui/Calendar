'use strict';
function Cs142TemplateProcessor(template) {
	// this template will be used in this class 
	this.template = template;
}	
Cs142TemplateProcessor.prototype.fillIn = function (dictionary) {
	// using regexp to find parathesis to fill in
	var pattern = /{{[^{]*}}/g;  
	var str = this.template;
	// using string.match() and string.replace() methods
	var words = str.match(pattern);
	var key;
	for(var i=0;i < words.length;i++) {
		key = words[i].replace("{{", "").replace("}}", "");
		str = str.replace(words[i], dictionary[key] || "");
	}
	return str;
};

