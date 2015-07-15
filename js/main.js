// http://openweathermap.org/api
(function(){
	_.templateSettings.variable = "rc";

	var weatherApp = {
		queryData: {},

		displayCurrent: function(data){
			var $city = $( ".city-name" ).eq(0),
				$curTime = $( ".current-time" ).eq(0),
				$curTemp = $( ".current-temp" ).eq(0);

			$city.html( data[0].name );
			// console.log( new Date().getTimezoneOffset() );
			// console.log( new Date().getHours() );
			// console.log( new Date().getMinutes() );
			console.log( Date.now() );
			$curTime.text( Date.now() );
			$curTemp.html( Math.round( data[0].main.temp ) + "&deg;" );
		},

		displayExtended: function(data){
			var $extended = $( "#extended-data" ),
				rawData = data[0].list,
				templateData = this.processData( rawData ),
				template = _.template( $( "script.template" ).html() );

			$extended.empty();
			$extended.append( template( templateData ) );
		},

		getCurrent: function(){
			var URL = "http://api.openweathermap.org/data/2.5/weather",
				data = this.queryData;

			return $.getJSON(URL, data);
		},

		getExtended: function(){
			var URL = "http://api.openweathermap.org/data/2.5/forecast/daily",
				data = $.extend( this.queryData, { cnt: 10 } );

			return $.getJSON(URL, data);
		},

		processData: function(data){
			var newObj = {},
				newArr = [];

			$.each(data, function(){
				var timeStamp = ( this.dt * 1000 );

				newArr.push({
					dayOfWeek: formatTime.getDayName( timeStamp ),
					date: null,
					tempMax: Math.round(this.temp.max),
					tempMin: Math.round(this.temp.min)
				});
			});

			newObj = { listItems: newArr };

			return newObj;
		},

		runWeatherApp: function(location){
			this.setQueryData(location);
			this.getExtended();
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

			if ( isNaN( location ) ){
				this.queryData = $.extend( {}, units, city );
			} else {
				this.queryData = $.extend( {}, units, zip );
			};
		}
	};

	var $form = $( "#location-form" ),
		$input = $( "#location-val" ).focus(),
		formatTime = new FormatTime();

	$form.on('submit', function(){
		var location = $.trim( $input.val() );

		weatherApp.runWeatherApp(location);

		$input.val("");

		return false;
	});

})();