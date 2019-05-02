var CatDogChart = function(input)  {

    // load in arguments from config object
    this.input = input;

    // create the chart
    this.draw();
}


CatDogChart.prototype.draw = function() {
    // Define dimensions of vis
    this.margin = { top: 30, right: 50, bottom: 40, left: 140 };
    this.width  = 450 - this.margin.left - this.margin.right;
    this.height = this.input.height - this.margin.top  - this.margin.bottom;

    // Create canvas
    var Canvas = d3.select(this.input.div_element)
                    .append("svg")
                    .attr("width",  2*(this.width  + this.margin.left + this.margin.right))
                    .attr("height", this.height + this.margin.top  + this.margin.bottom)
                    
    this.catCanvas = Canvas
                        .append("g")
                        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
                        .attr("id", "catCanvas");

    this.dogCanvas = Canvas
                        .append("g")
                        .attr("transform", "translate(" + (2*this.margin.left+this.width) + "," + this.margin.top + ")")
                        .attr("id", "dogCanvas");

    this.addAxes();
    this.addHeadersAndLabels();
}

CatDogChart.prototype.addAxes = function() {
    // Make y scale
    this.yScale = d3.scaleBand()
        .rangeRound([0, this.height])
        .padding(0.1);

    // Make x scale
    this.xScale = d3.scaleLinear()
        .range([0, this.width]);    
    
    // Make y-axis and add to canvas
    this.yAxis = d3.axisLeft(this.yScale)

    this.yAxisHandleForUpdateCat = this.catCanvas.append("g")
        .attr("class", "y axis")
        .call(this.yAxis);

    this.yAxisHandleForUpdateDog = this.dogCanvas.append("g")
        .attr("class", "y axis")
        .call(this.yAxis);
    
    // Make y-axis and add to canvas
    let formatPercent = d3.format(".0%")

    this.xAxis = d3.axisBottom(this.xScale)
        .tickFormat(formatPercent)
    
    // add x-axis to both canvas
    this.xAxisHandleForUpdateCat = this.catCanvas.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height +")")
        .call(this.xAxis);
    
    this.xAxisHandleForUpdateDog = this.dogCanvas.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height +")")
        .call(this.xAxis);
}           

CatDogChart.prototype.addHeadersAndLabels = function() {
    // insert header for the graph
    d3.select(this.input.div_element)
        .insert("h6", "svg")
        .text(this.input.header);

    // add x-axis labels
    this.catCanvas.append("text")
        //.style("font", "26px arial")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", this.width/2)
        .attr("y", this.height + this.margin.bottom - 5)
        .text("% of Cats");

    this.dogCanvas.append("text")
        //.style("font", "26px arial")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", this.width/2)
        .attr("y", this.height + this.margin.bottom - 5)
        .text("% of Dogs");

    // add y-axis label
    this.catCanvas.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -this.margin.left)
        .attr("x", - (this.height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(this.input.yAxisLabel);

    /*
    // insert sub-headers
    this.catCanvas.insert("text")
    			.text("Cat")
    			.attr("x", this.width/2);
    
    this.dogCanvas.insert("text")
    			.text("Dog")
    			.attr("x", this.width/2);
	*/
}   

CatDogChart.prototype.updateBars = function(labels, data, animal) {
    var chart_this = this;  // for d3 anonymous functions

    //var bars = null;
    if (animal == "Cat") {
        bars = this.catCanvas.selectAll(".bar").data(data);
        
        this.yAxisHandleForUpdateCat.call(chart_this.yAxis);
        this.xAxisHandleForUpdateCat.call(chart_this.xAxis.ticks(5));
    } else {
        bars = this.dogCanvas.selectAll(".bar").data(data);
        
        this.yAxisHandleForUpdateDog.call(chart_this.yAxis);
        this.xAxisHandleForUpdateDog.call(chart_this.xAxis.ticks(5));
    }

    // Remove old ones
    bars.exit().remove();

    bars.enter()
      .append("rect")
        .attr("class", "bar")
        .attr("y", function(d,i) { return chart_this.yScale( labels[i] ); })
        .attr("height", chart_this.yScale.bandwidth())
        .attr("x", 0)
        .attr("width", function(d,i) { return chart_this.xScale(d); })
        .attr("fill", d=> animal=="Dog" ? this.input.color(0):this.input.color(1) )
      .append("title")
      	.text( d=> d3.format(".1%")(d) )
        .merge(bars);

    bars
        .transition().duration(250)
        .attr("y", function(d,i) { return chart_this.yScale( labels[i] ); })
        .attr("height", chart_this.yScale.bandwidth())
        .attr("x", 0)
        .attr("width", function(d,i) { return chart_this.xScale(d); })
        .attr("fill", d=> animal=="Dog" ? this.input.color(0):this.input.color(1) )
      .select("title")
        .text( d=> d3.format(".1%")(d) );
}

CatDogChart.prototype.updateChart = function(data) {
    // First update the axis domains to match new data
    this.yScale.domain(data.Labels);
    
    let catMax = data.CatPerc.reduce( (a,b) => Math.max(a,b) );
    let dogMax = data.DogPerc.reduce( (a,b) => Math.max(a,b) ); 
    this.xScale.domain( [0, Math.max(catMax, dogMax)] ).nice();

    this.updateBars(data.Labels, data.CatPerc, "Cat");
    this.updateBars(data.Labels, data.DogPerc, "Dog");
}



/*

*/