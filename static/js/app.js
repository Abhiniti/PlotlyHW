function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
	var url = `/metadata/${sample}`;
	
	// Fetch the JSON data and console log it
	d3.json(url).then(function(data) {
	  //console.log(data);
	  
	  //update metadata
	  d3.select("#sample-metadata").html(
	"<ul><li><b>Age: </b>" + data.AGE + "</li>" 
	+ "<li><b>BBType: </b>" + data.BBTYPE + "</li>"
	+ "<li><b>Ethnicity: </b>" + data.ETHNICITY + "</li>"
	+ "<li><b>Gender: </b>" + data.GENDER + "</li>"
	+ "<li><b>Location: </b>" + data.LOCATION + "</li>"
	+ "<li><b>WFREQ: </b>" + data.WFREQ + "</li>"
	+ "<li><b>Sample number: </b>" + data.sample + "</li></ul>");
	  
	  
	});
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
	var url = `/samples/${sample}`;
	
		d3.json(url).then(function(data) {
		//convert to accessible list
		var JsonDict = new Array();
		for (var i = 0; i < data.sample_values.length; i++){
			var dict = {};
			dict['otu_ids'] = data.otu_ids[i];
			dict['otu_labels'] = data.otu_labels[i];
			dict['sample_values'] = data.sample_values[i];
			
			JsonDict.push(dict);
		}
		//sort values
		JsonDict.sort(function(a, b) {
		return parseFloat(b.sample_values) - parseFloat(a.sample_values);
		});
		

	var slicedValues = JsonDict.slice(0,10);
	
	var Values = [];
	var Labels = [];
	var adjustedValues = [];
	var Text = [];
	for (var j = 0; j < slicedValues.length; j++){
	  Values.push(slicedValues[j].sample_values);
	  Labels.push(slicedValues[j].otu_ids);
	  adjustedValues.push(slicedValues[j].sample_values*0.3);
	  Text.push(slicedValues[j].otu_labels);
	}
	  
	  //pie chart
	var data1 = [{
		values: Values,
		labels: Labels,
		text: Text,
		textposition: 'inside',
		type: "pie",
	}];

	var layout1 = {
		title:"Breakdown of Sample Values in Selected Sample ID",
		height: 600,
		width: 800,
		showlegend: false
	};

  Plotly.plot("pie", data1, layout1);
 
console.log(Labels); 
console.log(Values); 
    //bubble chart
	var data2 = [{
	x: Labels,
	y: Values,
	mode: "markers",
	type: "scatter",
	name: "high jump",
	text: Text,
	marker: {
	color: "#2077b4",
	symbol: "circle",
	size: adjustedValues
	}}];
  
	var layout2 = {
		title:"Sample Values vs. Otu_ID",
		xaxis: {
			title: 'Otu_ID'
		},
		yaxis: {
			title: 'Sample Values'
		}, 
		showlegend: false
	};

Plotly.plot("bubble", data2, layout2);

	 //end of d3 
	});
//end of function
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
