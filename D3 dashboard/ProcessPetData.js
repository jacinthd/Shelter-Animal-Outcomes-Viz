var ProcessPetData = function(dataset)  {

  this.countByAnimalType = d3.nest()
                  .key(d => d.AnimalType)
                  .rollup(v => v.length)
                  .entries(dataset); 

  this.countBySubtype = d3.nest()
				  .key(d => d.OutcomeType)
				  .key(d => d.OutcomeSubtype)
          .key(d => d.AnimalType)
				  .rollup(v => v.length)
				  .entries(dataset);

	this.OutcomeType = this.countBySubtype.map( elem => elem.key );

	// Group by AgeInYears
  this.countByAge = d3.nest()
    .key(d => d.OutcomeType)
    .key(d => d.AgeInYears)
    .key(d => d.AnimalType)
    .rollup(v => v.length)
    .entries(dataset); 

  // Group by Hour
  this.countByHour = d3.nest()
    .key(d => d.OutcomeType)
    .key(d => d.Hour)
    .key(d => d.AnimalType)
    .rollup(v => v.length)
    .entries(dataset);

  this.sortData();
}

ProcessPetData.prototype.sortData = function() {
	// data is array of objects, so sort age from small to large for each element object
	this.countByAge.forEach( d => d.values.sort( (a,b) => a.key - b.key ) );
   
  // Sort hour from early to late
  this.countByHour.forEach( d => d.values.sort( (a,b) => a.key - b.key ) );
}

ProcessPetData.prototype.getOutcomeType = function(option) {
	return this.OutcomeType;                   
}

ProcessPetData.prototype.splitNestedData = function(nestedData) {
  let data = nestedData.values;
  
  let labels = data.map( elem => elem.key == "" ? "Null":elem.key );
  let counts = data.map( elem => elem.values );

  let catPerc = this.calculateAnimalPerc(counts, "Cat");
  let dogPerc = this.calculateAnimalPerc(counts, "Dog");

  return {
    Labels: labels,
    CatPerc: catPerc,
    DogPerc: dogPerc,
  }
}

ProcessPetData.prototype.filterOutcomeType = function(option) {
	let idx = this.OutcomeType.indexOf(option);
   
	return {
		Subtype: this.splitNestedData(this.countBySubtype[idx]),  // filter for outcome subtype data

		Age: this.splitNestedData(this.countByAge[idx]),  // filter for age data

    Hour: this.splitNestedData(this.countByHour[idx])  // filter for hour data
	};                   
}



ProcessPetData.prototype.calculateAnimalPerc = function(countArr, Animal) {
	// the data structure is array of array of objects

	// search within element arrays of objects for objects which matches the correct key
	let countObj = countArr.map( elem => elem.find( d => d.key == Animal ) );

  //another map is used on returned objects to get the actual values
  let counts_nullaszero = countObj.map( obj => obj!=null ? obj.value:0 );
  
  //get percentage
  let counts_sum = counts_nullaszero.reduce( (a,b) => a+b );
  let perc = counts_nullaszero.map( elem => elem/counts_sum)

  return perc;
}

ProcessPetData.prototype.getAnimalTypeData = function() {
  let labels = this.countByAnimalType.map( elem => elem.key );
  let counts = this.countByAnimalType.map( elem => elem.value );

  return {
    Labels: labels,
    Counts: counts
  }
}

