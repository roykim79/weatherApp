function GetLocation(){

}

GetLocation.prototype.locator = function(){
	if ( navigator.geolocation ) {
		navigator.geolocation.getCurrentPosition(function(position){
			return (position.coords);
		});
	} else {
		console.log("Who are you hiding from!");
	}
}

GetLocation.prototype.returnLocation = function(position){
	// console.log("obj");
	return (position.coords);
	// return null;
}