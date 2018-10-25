var pre_questions = [
	"Do you see any cones or berries?",
	"Can you determine the tree height in meters?",
	"Do you have a ruler to measure the leaves and cones in mm?"];

var result = "";
var current_index = 0;
var current_ques = 1;

const Taxa = ["Order", "Family", "Genus", "Species"];
var numTaxa = 0;
var classString = "";

function init() {
	document.getElementById("post").style.display = "none";
	document.getElementById("reset_btn").style.display = "none";
	document.getElementById("final").style.display = "none";

	display_pre_question();
}

// Display the 3 questions prior to opening the actual tree
// This consists of the question itself, and the question #
function display_pre_question() {
	if(current_index == 0) {
		document.getElementById("back").style.display = "none";
	}
	else {
		document.getElementById("back").style.display = "block";
	}
	var el = document.getElementById("pre_question");
	el.innerHTML = pre_questions[current_index];
	var num = document.getElementById("pre_num");
	num.innerHTML = "ε" + String(current_index + 1);
}

// Display the question after opening the tree
function display_post_question() {
	var el = document.getElementById("post_question");
	el.innerHTML = tree_nodes[current_id - 1]["q"];
	var num = document.getElementById("post_num");
	num.innerHTML = current_ques;
}

// The function that is called when the user inputs yes/no to the first 3 pre_questions
function pre_answers(answer) {
	// Disable button clicks during the animation
	var buttons = document.getElementsByTagName('button');
	for(var i = 0; i < buttons.length; i++) {
			buttons[i].disabled = true;
	}
	fade_effect();
	setTimeout(function() {
		// Increment the pre-question index
		current_index++;
		// A 1 represents yes in the json file, a 0 represents no
		if(answer == true) {
			dataURL += "1";
		}
		else {
			dataURL += "0";
		}

		// If all 3 questions have been asked, get the json file, and replace the "pre" section
		if(current_index == 3) {
			dataURL += ".json";
			console.log(dataURL);
			var el = document.getElementById("pre");
			el.style.display = "none";
			getData(dataURL);
			var post = document.getElementById("post");
			post.style.display = "block";
		}
		// Else get the next pre-question
		else if(current_index < 3) {
			display_pre_question();
		}

		// Re-enable the buttons
		for(var i = 0; i < buttons.length; i++) {
				buttons[i].disabled = false;
		}
	}, 500);
}

// Load the buttons for a post-question depending on how many children there are
function load_buttons() {
	// Remove the top image from the previous question if there is one
	var top = document.getElementById("top_image");
	if(top) {
		top.remove();
	}

	var obj = tree_nodes[current_id - 1]["children"];
	var old_spn = document.getElementById("old");
	if(old_spn) {
		old_spn.parentNode.removeChild(old_spn);
	}

	var spn = document.createElement("span");
	post_buttons.appendChild(spn);
	spn.id = "old";
	spn.className = "buttonFitter";

	var questionType = 0;
	var prop_count = 0;
	var prop_list = [];
	// Generate a list of properties before cycling through them again
	for(var property in obj) {
		if(obj.hasOwnProperty(property)) {
			prop_list.push(property);
			prop_count++;
		}
	}

	// The second time the properties are cycled through, a dictionary of
	// property:keyword pairs are generated
	prop_dict = {};
	for(var property in obj) {
		if(obj.hasOwnProperty(property)) {
			var keyword;
			// If it is a "greater than question", the appropriate answers should be
			// "yes" and no", same for "is it in a range", the text for these buttons
			// should be centered
			if((property != "Less than" && prop_list.includes("Less than"))
				|| (property != "Not inside" && prop_list.includes("Not inside"))) {
				keyword = "Yes";
				questionType = 1;
			}
			else if(property == "Less than" || property == "Not inside") {
				keyword = "No";
			}
			// The same thing for True/False questions, but these have an image on top
			else if(property == "TRUE") {
				keyword = "Yes";
				questionType = 2;
			}
			else if(property == "FALSE") {
				keyword = "No"
			}
			// Different case: For this question, the keywords stay the same,
			// but the display should also have an image on top (also, this is
			// different from the 2 case, because the font size needs to be smaller)
			else if(property == "Uniform") {
				keyword = "Uniform"
				questionType = 3;
			}
			else {
				keyword = property;
			}

			prop_dict[property] = keyword;
		}
	}

	for(var property in obj) {
		if(obj.hasOwnProperty(property)) {
			var btn = document.createElement("BUTTON");

			// If it is a regular question, draw images on the buttons
			if(questionType < 1) {
				var multi;
				if(tree_nodes[current_id - 1]["fname"] == "Bark color") {
					multi = 0.42;
				}
				else {
					multi = 0.52;
				}
				var img_url = "images/" + prop_dict[property] + ".png"
				var img_offset = spn.offsetWidth - multi*window.innerHeight/prop_count;
				img_offset /= (window.innerHeight)/100;

				btn.style = "background-image: url('" + img_url + "'); \
				background-repeat: no-repeat; \
    		background-position: left " + String(img_offset) + "vh center; background-size: auto 100%;";
			}
			// Create a new button with appropriate text and the ability to
			// call the next question
			var pcss;
			if(prop_count == 2 && questionType < 1) {
				pcss = "<p style = 'width: 40%; text-align: center;'>";
			}
			else {
				pcss = "<p>";
			}
			btn.innerHTML = pcss + prop_dict[property] + "</p>";
			btn.next_id = obj[property];
			btn.onclick = function() {
				var buttons = document.getElementsByTagName("button");
				for(var i = 0; i < buttons.length; i++) {
						buttons[i].disabled = true;
				}
				current_ques++;
				prev_id.push(current_id);
				current_id = this.next_id;
				fade_effect();
				setTimeout(function() {
					ask_for_decision();
					show_results();
					var buttons = document.getElementsByTagName("button")
					for(var i = 0; i < buttons.length; i++) {
							buttons[i].disabled = false;
					}
				}, 500);
			};

			// If it is a yes/no question, format it as so
			if(questionType == 1 || questionType == 2) {
				btn.className = "buttonYN";
			}
			else if(questionType == 3) {
				btn.className = "buttonStripes"
			}

			spn.appendChild(btn);
		}
	}
	if(questionType == 2 || questionType == 3) {
		// Make the range for the buttons lower, so there is room for an image
		document.getElementById("post_buttons").style = "top: 45%; height: 32.622%";

		// Add the image
		var top_image = document.createElement("div");
		top_image.style = "position: absolute; display: block; left: 5%; \
		top: 17.622%; height: 24.567%; width: 90%";
		top_image.id = "top_image";
		document.getElementById("post").appendChild(top_image);

		var new_img = document.createElement("img");
		new_img.src = "images/" + tree_nodes[current_id - 1]["fname"] + ".png";
		new_img.style = "display: block; margin: auto; height: 100%";
		top_image.appendChild(new_img);
	}
	else {
		// Reset the css in case it was changed
		document.getElementById("post_buttons").style = "top: 17.622%; height: 60%";
	}
}

function show_results() {
	var obj = tree_nodes[current_id - 1]["r"];
	for(var property in obj) {
		if(obj.hasOwnProperty(property)) {
			if(numTaxa < 4) {
				classString += (Taxa[numTaxa] + ": " + property);
				if(numTaxa < 3) {
					classString += "<br>";
				}
			}
			else {
				classString += (" or " + property);
			}
			numTaxa++;
		}
	}

	var result_text = document.getElementById("result_text");
	result_text.innerHTML = classString;
}

function final_layout() {
	var commonArray = tree_nodes[current_id - 1]["cname"];
	var commonText = document.getElementById("commonText");
	var str;

	if(commonArray.length == 1) {
		str = commonArray[0];
	}
	else {
		str = "";
		for(var i = 0; i < commonArray.length; i++) {
			if(i != commonArray.length - 1) {
				str += commonArray[i] + " or ";
			}
			else {
				str += commonArray[i];
			}
		}
	}

	commonText.innerHTML = str + "!";

	// Show an image of the plant(s)
	for(var i = 0; i < commonArray.length; i++) {
		var finalImage = document.getElementById("finalImage")
		var new_img = document.createElement("img");
		new_img.src = "images/Plants/" + tree_nodes[current_id - 1]["cname"][i] + ".png";
		new_img.id = "fimage";
		if(commonArray.length == 1) {
			new_img.style = "display: block; margin: auto; height: 100%";
		}
		else {
			new_img.style = "position: absolute; display: block; width: 40%; left: \
			" + String(i*60) + "%; top: 25%";
		}
		finalImage.appendChild(new_img);
	}

	// Modify the position of the results box
	var results = document.getElementById("results")
	results.style = "top: 53.433%; left: 5%; width: 88%;";
}

function reset() {
	fade_effect();
	setTimeout(function() {
		document.getElementById("post").style.display = "block";

		document.getElementById("final").style.display = "none";
		document.getElementById("backbtn").style.display = "block";

		var reset_btn = document.getElementById("reset_btn");
		reset_btn.disabled = true;
		reset_btn.style.display = "none";

		// Change back the position of the results box
		var results = document.getElementById("results")
		results.style = "top: 80.433%; left: 40%; width: 53%;";

		// Remove the image(s)
		if(tree_nodes[current_id - 1]["cname"]) {
			for(var i = 0; i < tree_nodes[current_id - 1]["cname"].length; i++) {
				var fimage = document.getElementById("fimage");
				fimage.parentNode.removeChild(fimage);
			}
		}

		prev_id = [];
		current_id = 1;
		current_ques = 1;

		numTaxa = 0;
		classString = "";

		var result_text = document.getElementById("result_text");
		result_text.innerHTML = "";

		ask_for_decision();
	}, 500);
}

function go_back() {
	document.getElementById("backbtn").disabled = true;
	if(current_id == 1) {
		if(current_index == 3) {
			dataURL = dataURL.slice(0, -6);
			setTimeout(function() {document.getElementById("post").style.display = "none";
			document.getElementById("pre").style.display = "block";}, 500);
		}
		else {
			dataURL = dataURL.slice(0, -1);
		}
		current_index--;

		fade_effect();
		setTimeout(function() {
			display_pre_question();
			document.getElementById("backbtn").disabled = false;
		}, 500);
	}
	else {
		var buttons = document.getElementsByTagName('button');
		for(var i = 0; i < buttons.length; i++) {
				buttons[i].disabled = true;
		}

		// Delete the results found at this node
		var obj = tree_nodes[current_id - 1]["r"];
		if(obj) {
			var index = numTaxa - Object.keys(obj).length;
			numTaxa -= Object.keys(obj).length;
			for(var property in obj) {
				if(obj.hasOwnProperty(property)) {
						classString = classString.replace((Taxa[index] + ": " + property
						+ "<br>"), "");
						document.getElementById("result_text").innerHTML = classString;
						index++;
					}
				}
			}

		current_ques--;
		current_id = prev_id[prev_id.length - 1];
		prev_id.pop();
		fade_effect();
		setTimeout(function () {
			ask_for_decision();
			buttons = document.getElementsByTagName("button");
			for(var i = 0; i < buttons.length; i++) {
					buttons[i].disabled = false;
			}
		}, 500);
	}
}

function fade_effect() {
	document.getElementById("fadebox").style = "opacity: 0";
	setTimeout(function() {
		document.getElementById("fadebox").style = "opacity: 1";
	}, 500);
}
