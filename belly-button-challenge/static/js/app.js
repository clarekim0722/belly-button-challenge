//Declare variables for selected option and dataset 
var option = "";
var dataSet ;

//Initialize the visualization
function init() {
  //Fetch the data from samples.json
  d3.json("samples.json").then(function(data){
    dataSet = data; //Store the fetched data in the global dataSet variable 

    console.log(dataSet); // Log the dataset to the console 
    
    //Display initial visualizations for the first sample (ID 940)
    displayMetaData(940,dataSet);
    displayHBarChart(940,dataSet);
    displayBubbleChart(940,dataSet);

    // Populate the dropdown mkenu with sample names     
    var optionMenu = d3.select("#selDataset");

    data.names.forEach(function(name){
      optionMenu.append("option").text(name);
    });
 })
}

//Helper function to unpack rows from data 
function unpack(rows, index) {
    return rows.map(function(row) {
      return row[index];
    });
  }

// Function to handle changes in the selected option 
function optionChanged(value) {
    option = value; // Update the global option with the new value 
    //Display visualization for the newly selected sample 
    displayMetaData(option,dataSet);
    displayHBarChart(option,dataSet);
    displayBubbleChart(option,dataSet);
}

//Display metadata for the selected sample 
function displayMetaData(option,dataSet) {
    
    //Filter the metadata
    var mtdata = dataSet.metadata.filter(row => row.id == option);
    //Display the metadata 
    d3.select("#sample-metadata").html(displayObject(mtdata[0]));
        
}

// Helper function to display a metadata object as HTML 
function displayObject(obj) {
    var str = ""; // Initialize the display string 
    Object.entries(obj).forEach(([key,value]) => {
        str += `<br>${key}:${value}</br>`;
        if(key=="wfreq"){
            buildGauge(value);
            console.log("gauge value is:" +value);
        }
        
    });
    return str;
}

// Display a horizontal  bar chart for the selected sample 
function displayHBarChart(option,dataSet) {
    // Filter the samples data 
    var barData = dataSet.samples.filter(sample => sample.id == option);
    console.log(barData);
    
    // Extract OTU IDs and format them for display 
    var y = barData.map(row =>row.otu_ids);  
    var y1 =[];
    for(i=0;i<y[0].length;i++){
        y1.push(`OTU ${y[0][i]}`);
    }

    //Extract sample values and OTU labels 
    var x = barData.map(row =>(row.sample_values));
    var text = barData.map(row =>row.otu_labels);
    
    // Prepare the trace for the bar chart 
    var trace = {
        x:x[0].slice(0,10),
        y:y1.slice(0,10),
        text:text[0].slice(0,10),
        type:"bar",
        orientation:"h",
        
    };
    // Prepare the data and layout for the plot 
    var data = [trace];
    var layout = {
        yaxis: {
            autorange: "reversed" 
        }
    }

    Plotly.newPlot("bar",data,layout);
}

// Display a bubble chart 
function displayBubbleChart(option,dataSet) {

    var barData = dataSet.samples.filter(sample => sample.id == option);
    console.log(barData); 

    var x = barData.map(row =>row.otu_ids); 
    var y = barData.map(row =>row.sample_values); 
    var text = barData.map(row =>row.otu_labels);
    var marker_size = barData.map(row =>row.sample_values);
    var marker_color = barData.map(row =>row.otu_ids);
    
    console.log(x[0]);
    console.log(y[0]);
    console.log(text);
    
    var trace1 = {
        x:x[0],
        y:y[0],
        text: text[0],
        mode:"markers",
        marker: {
            color: marker_color[0],
            size: marker_size[0],
            colorscale: "Earth"
        }
        
    };

    var data = [trace1];

    var layout = {
        xaxis:{
            title: "OTU ID"
        }

    };

    Plotly.newPlot("bubble",data,layout);

}



init();