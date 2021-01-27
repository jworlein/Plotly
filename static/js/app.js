//global
var global_data = [];

$(document).ready(function() {
    onInit();

    // Event listener
    $('#selDataset').change(function() {
        doWork();
    });
});

function onInit() {
    d3.json("samples.json").then((data) => {
        // save data to global
        global_data = data;

        //make filter
        makeFilters(data);
        doWork();
    });
}

function doWork() {
    //show/hide
    $('#progress_gif').show();
    $('#plots').hide();

    // grab item in dropdown
    var sampleData = parseInt($("#selDataset").val());

    // filter the metadata
    var metadata = global_data.metadata.filter(x => x.id === sampleData)[0];

    // filter the sample data 
    var sample_data = global_data.samples.filter(x => x.id == sampleData)[0];

    // build charts
    makePanel(metadata);
    makePlots(sample_data, metadata);
}

function makePlots(sample_data, metadata) {
    $('#progress_gif').hide();
    $('#plots').show();

    makeBar(sample_data);
    makeBubble(sample_data);
    makeGauge(metadata);
}

function makeFilters(data) {
    // populate the dropdown of IDs
    data.names.forEach(function(val) {
        var newOption = `<option>${val}</option>`;
        $('#selDataset').append(newOption);
    });
}

function makePanel(metadata) {
    //wipe the panel clean
    $("#sample-metadata").empty();

    // build that div
    Object.entries(metadata).forEach(function(key_value, index) {
        var entry = `<span><b>${key_value[0]}:</b> ${key_value[1]}</span><br>`;
        $("#sample-metadata").append(entry);
    });
}

function makeBar(sample_data) {
    //make bar chart
    var y_labels = sample_data.otu_ids.slice(0, 10).reverse().map(x => `OTU ID: ${x}`); // make string
    var trace = {
        x: sample_data.sample_values.slice(0, 10).reverse(),
        y: y_labels,
        text: sample_data.otu_labels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: "h"
        
    };

    var layout = {
        title: "<b>Top Bacteria Present in Subject Belly Button</b>",
        xaxis: { title: "<b>Amount of Bacteria</b>",automargin: true },
        yaxis: { title: "<b>Bacteria ID</b>", automargin: true, standoff: 400 }
    }

    var traces = [trace];

    Plotly.newPlot('bar', traces, layout);
}

function makeBubble(sample_data) {
    // make bubble plot   otu_ids are strings
    var trace = {
        x: sample_data.otu_ids,
        y: sample_data.sample_values,
        mode: 'markers',
        marker: {
            size: sample_data.sample_values,
            color: sample_data.otu_ids
        },
        text: sample_data.otu_labels
    };

    var traces = [trace];

    var layout = {
        title: "<b>Amount of Bacteria Present in Subject Belly Button</b>",
        xaxis: { title: "<b>Bacteria ID</b>" },
        yaxis: { title: "<b>Amount of Bacteria</b>" }
    }

    Plotly.newPlot('bubble', traces, layout);
}

function makeGauge(metadata) {
//max washings
    var max_wfreq = 10;

    // make Gauge Chart
    var trace = {
        domain: { x: [0, 1], y: [0, 1] },
        value: metadata.wfreq,
        title: { text: "<b>Belly Button Washing Frequency</b>" },
        type: "indicator",
        gauge: {
            axis: { range: [null, max_wfreq] },
            steps: [
                { range: [0, 7], color: "lightgray" },
                { range: [7, 10], color: "gray" }
            ],
            threshold: {
                line: { color: "red", width: 4 },
                thickness: 0.75,
                value: 2
            }
        },
        mode: "gauge+number"
    };
    var traces = [trace];

    var layout = {}
    Plotly.newPlot('gauge', traces, layout);
}