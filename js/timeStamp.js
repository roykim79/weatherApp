function FormatTime(timeStamp){
	this.time = new Date(timeStamp);
}

FormatTime.prototype.getDayName = function(timeStamp){
	var time = new Date(timeStamp),
		days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	return days[ time.getDay() ];
}

FormatTime.prototype.getMonthAndDay = function(timeStamp){
	var time = new Date(timeStamp),
		months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	return (months[ time.getMonth() ] + " " + time.getDate());
}

FormatTime.prototype.getTimeOfDay = function(timeStamp){
	var arr = timeStamp.split(" "),
		arr2 = arr[0].split(":").splice(0, 2).join(":");

	return ( arr2 + " " + arr[1] );
}