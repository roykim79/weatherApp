// http://openweathermap.org/api
// http://openweathermap.org/weather-conditions
// ****************************************************************************

(function(){
	_.templateSettings.variable = "rc";

	var weatherApp = {
		queryData: {},
		myData: {
			current: {"coord":{"lon":-71.06,"lat":42.36},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"base":"cmc stations","main":{"temp":66.51,"pressure":1011,"humidity":94,"temp_min":63,"temp_max":75.2},"wind":{"speed":3.24,"deg":23.0037},"clouds":{"all":75},"dt":1437019973,"sys":{"type":1,"id":1801,"message":0.0116,"country":"US","sunrise":1437038493,"sunset":1437092317},"id":4930956,"name":"Boston","cod":200},
			extended: {"city":{"id":4930956,"name":"Boston","coord":{"lon":-71.059769,"lat":42.358429},"country":"US","population":0},"cod":"200","message":0.0276,"cnt":7,"list":[{"dt":1436976000,"temp":{"day":67.64,"min":67.64,"max":67.64,"night":67.64,"eve":67.64,"morn":67.64},"pressure":1021.52,"humidity":90,"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"speed":10.26,"deg":52,"clouds":92,"rain":0.39},{"dt":1437062400,"temp":{"day":69.6,"min":61.41,"max":70.48,"night":61.41,"eve":70.48,"morn":65.73},"pressure":1027.32,"humidity":67,"weather":[{"id":800,"main":"Clear","description":"sky is clear","icon":"02d"}],"speed":12.2,"deg":31,"clouds":8},{"dt":1437148800,"temp":{"day":75.58,"min":57.51,"max":77.74,"night":67.08,"eve":77.56,"morn":57.51},"pressure":1031.07,"humidity":53,"weather":[{"id":800,"main":"Clear","description":"sky is clear","icon":"01d"}],"speed":2.31,"deg":130,"clouds":0},{"dt":1437235200,"temp":{"day":78.03,"min":64.06,"max":81.09,"night":73.51,"eve":80.98,"morn":64.06},"pressure":1027.1,"humidity":58,"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02d"}],"speed":8.55,"deg":199,"clouds":24},{"dt":1437321600,"temp":{"day":83.86,"min":72.36,"max":83.86,"night":72.36,"eve":80.47,"morn":75.92},"pressure":1014.3,"humidity":0,"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"speed":6,"deg":250,"clouds":62,"rain":0.9},{"dt":1437408000,"temp":{"day":82.29,"min":72.72,"max":82.29,"night":72.72,"eve":76.3,"morn":75.6},"pressure":1011.31,"humidity":0,"weather":[{"id":502,"main":"Rain","description":"heavy intensity rain","icon":"10d"}],"speed":5.66,"deg":170,"clouds":50,"rain":12.46},{"dt":1437494400,"temp":{"day":78.33,"min":71.53,"max":78.33,"night":71.53,"eve":76.68,"morn":73.63},"pressure":1007.87,"humidity":0,"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"speed":8.75,"deg":280,"clouds":1,"rain":1.34}]}
		},

		displayCurrent: function(data){
			var $city = $( ".city-name" ).eq(0),
				$curCond = $( ".current .icon" ).eq(0),
				$curTime = $( ".current-time" ).eq(0),
				$curTemp = $( ".current-temp" ).eq(0),
				$curDesc = $( ".current .description" ).eq(0),
				$curHigh = $( ".current .high" ).eq(0),
				$curLow = $( ".current .low" ).eq(0),
				now = new Date(),
				curTime = now.toLocaleTimeString();

			$city.html( data.name );
			// $city.html( data[0].name );	//*****+ PRELOADED API CALL ON  *****+
			$curCond.attr( 'src', this.getIconURL( data.weather[0].icon ) );
			$curTime.html( formatTime.getTimeOfDay( curTime) );
			$curTemp.html( Math.round( data.main.temp ) + "<sup><small>&deg;F</small></sup>" );	
			$curDesc.text( data.weather[0].main );	
			$curHigh.html( Math.round( data.main.temp_max ) + "&deg;" );	
			$curLow.html( Math.round( data.main.temp_min ) + "&deg;" );	
			// $curTemp.html( Math.round( data[0].main.temp ) + "&deg;" );	//*****+ PRELOADED API CALL ON  *****+
		},

		displayExtended: function(data){
			var $extended = $( "#extended-data" ),
				rawData = data.list,
				// rawData = data[0].list,	//*****+ PRELOADED API CALL ON  *****+
				templateData = this.processData( rawData ),
				template = _.template( $( "script.template" ).html() );

			$extended.empty();
			$extended.append( template( templateData ) );
		},

		getCurrent: function(){
			var URL = "http://api.openweathermap.org/data/2.5/weather",
				data = this.queryData;

			return this.myData.current;
			// return $.getJSON(URL, data);	//*****+ PRELOADED API CALL ON  *****+
		},

		getExtended: function(){
			var URL = "http://api.openweathermap.org/data/2.5/forecast/daily",
				data = $.extend( this.queryData, { cnt: 10 } );

			return this.myData.extended;
			// return $.getJSON(URL, data);	//*****+ PRELOADED API CALL ON  *****+
		},

		getIconURL: function(code){
			return "http://openweathermap.org/img/w/" + code +".png"
		},

		processData: function(data){
			var newObj = { listItems: [] };

			$.each(data, function(){
				var timeStamp = ( this.dt * 1000 );

				newObj.listItems.push({
					dayOfWeek: formatTime.getDayName( timeStamp ),
					date: formatTime.getMonthAndDay( timeStamp ),
					condition: weatherApp.getIconURL( this.weather[0].icon ),
					tempMax: Math.round( this.temp.max ),
					tempMin: Math.round( this.temp.min ),
					description: this.weather[0].main
				});
			});

			return newObj;
		},

		runWeatherApp: function(location){
			this.setQueryData(location);
			$.when(
				this.getCurrent(),
				this.getExtended()
			).done( function(curData, extData){
				weatherApp.displayCurrent( curData );
				weatherApp.displayExtended( extData );
			});
		},

		setQueryData: function(location){
			var units = { units: 'imperial' },
				city = { q: location },
				zip = { zip: location };

			if ( typeof location == 'object' ) {
				var coords = {
					lat: location.coords.latitude,
					lon: location.coords.longitude
				};

				this.queryData = $.extend( {}, units, coords );
			}
			else if ( isNaN( location ) ){
				this.queryData = $.extend( {}, units, city );
			} else {
				this.queryData = $.extend( {}, units, zip );
			};
		}
	};

	var $form = $( "#location-form" ),
		$input = $( "#location-val" ),
		formatTime = new FormatTime(),
		getLocation = new GetLocation();

	if( !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		$input.focus();
	}
	// location based search on page load

	// if ( navigator.geolocation ) {
	// 	navigator.geolocation.getCurrentPosition(function(position){
	// 		weatherApp.runWeatherApp( position );
	// 	});
	// } else {}
	weatherApp.runWeatherApp(  );
	$form.on('submit', function(){
		var location = $.trim( $input.val() );

		weatherApp.runWeatherApp(location);

		$input.val("").blur(); // gets rid of suggestion box

		if( !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			$input.focus();
		}
		return false;
	});

})();