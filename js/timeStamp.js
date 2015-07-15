function  FormatTime(timeStamp){
	this.time = new Date(timeStamp);
}

FormatTime.prototype.getDayName = function(timeStamp){
	var time = new Date(timeStamp);

	var days = ['Sun', 'Mon', 'Tues', 'Weds', 'Thur', 'Fri', 'Sat'];

	return days[ time.getDay() ];
}

