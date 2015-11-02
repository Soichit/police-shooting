
var drawMap = function() {
	var map = L.map('container').setView([35, -100], 4);
	var layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
	layer.addTo(map);
	getData(map);
}

// Function for getting data
var getData = function(map) {
	$.get( "data/response.json", function( data ) {
		customBuild(data, map);
	});
}	

// Loop through your data and add the appropriate layers and points
var customBuild = function(data, map) {
	parsedData = JSON.parse(data);
	//console.log(data);
	//var gender = L.layerGroup([male, female, unknown]);
	var male = new L.LayerGroup([]);
	var female = new L.LayerGroup([]);
	var unknown = new L.LayerGroup([]);

	var count1 = 0;
	var count2 = 0;
	var count3 = 0;
	var count4 = 0;

	for (i = 0; i < parsedData.length; i++) {
		if (parsedData[i]["Hit or Killed?"] == 'Killed') {
			var circle = new L.circleMarker([parsedData[i].lat, parsedData[i].lng], {color:'red'});
			circle.setRadius(13);
		} else {
			var circle = new L.circleMarker([parsedData[i].lat, parsedData[i].lng], {color:'blue'});
		}
		

		circle.bindPopup(parsedData[i].Summary);
		if (parsedData[i]["Victim's Gender"] == 'Male') {
			circle.addTo(male);
			if (parsedData[i]["Race"] == 'White') {
				count1++;
			} else {
				count3++;
			}
		} else {
			if (parsedData[i]["Victim's Gender"] == 'Female'){
				circle.addTo(female);
			} else {
				circle.addTo(unknown);
			}
			if (parsedData[i]["Race"] == 'White') {
				count2++;
			} else {
				count4++;
			}
		}
	}
	
	male.addTo(map);
	female.addTo(map);
	unknown.addTo(map);

	var layers = {
		"male": male,
		"female": female,
		"unknown": unknown
	}
  	L.control.layers(null, layers).addTo(map);
  	table(count1, count2, count3, count4);
}

var table = function(count1, count2, count3, count4){
	if ($("#myTable tbody").length == 0) {
		$("#myTable").append("<tbody></tbody>");
	}
	$("#myTable tbody").append( "<tr>" + "<td><b>White</b></td>" + "<td>" + count1 + "</td>" + "<td>" + count2 + "</td>" + "</tr>" );
	$("#myTable tbody").append( "<tr>" + "<td><b>Non-White</b></td>" + "<td>" + count3 + "</td>" + "<td>" + count4 + "</td>" + "</tr>" );
}


