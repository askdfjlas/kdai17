var dataURL = "data/";

var tree_nodes = [];
var prev_id = [];
var current_id = 1;

//general ajax request
function requestData (url, callbackfunction)
{
    var ajax = new XMLHttpRequest();

	//attach event handler to be executed when event is done
	ajax.onreadystatechange = function ()
	{
		if(ajax.readyState === 4 && ajax.status == 200)
			callbackfunction (ajax);
	}

	ajax.open("GET", url, true);
	ajax.send (null);
}


// when app starts - brings the corresponding
// decision tree from the server
// callback function - puts tree into an array
// and calls ask_questions
function getData (url)
{
    try
    {
        requestData (url, init_tree);
    }
    catch (e)
    {
        alert ("Requesting data error");
        console.log (e.title + "\n" +e.message);
    }
}

//callback function for getData
function init_tree (ajax)
{
    tree_nodes = JSON.parse(ajax.responseText);

	console.log ("Total number of nodes: "+ tree_nodes.length);
	ask_for_decision (0);
  show_results();
}

function ask_for_decision ()
{
    if(tree_nodes[current_id - 1]["q"] != null) {
      display_post_question();
      load_buttons();
    }
    else {
      document.getElementById("reset_btn").style.display = "block";
      document.getElementById("post").style.display = "none";
      document.getElementById("backbtn").style.display = "none";
      document.getElementById("final").style.display = "block";

      final_layout();
    }
}
