// http://openweathermap.org/api
(function(){
	_.templateSettings.variable = "rc";

	var weatherApp = {
		isValCity: false,
		curURL: "https://api.openweathermap.org/data/2.5/weather",
		dataBase: { units: 'imperial', count: 10 },
		qData: {},

		checkValType: function(location){
			this.isValCity = isNaN(location);
		},
		setQueryData: function(location){
			if ( this.isValCity ) {
				this.qData = $.extend( this.dataBase, { q: location } );
			} else {
				this.qData = $.extend( this.dataBase, { zip: location } );
			};
		},

		displayCurData: function(response){
			var $city = $( ".city-name" ),
				$curTemp = $( ".current-temp" );

			console.log(response);
			// $city.text( response.name );
			// $curTemp.html( response.main.temp + "&deg;" );
		},

		getData: function(){

			return $.getJSON(this.curURL, this.qData);

		},

		runWeatherApp: function(location){
			this.checkValType(location);
			this.setQueryData(location);
			$.when(
				this.getData()
			).done(function(data){
				weatherApp.displayCurData(data);
			});
		}
	};

	var $form = $( "#location-form" ),
		$input = $( "#location-val" );

	$input.focus();

	$form.on('submit', function(){
		var location = $.trim( $input.val() );

		weatherApp.runWeatherApp(location);

		$input.val("");

		return false;
	});

})();