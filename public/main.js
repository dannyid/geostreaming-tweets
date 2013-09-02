$(function(){


//show map 
var map = new L.Map('map');
    
var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/c730b9720ac14a97b9f2f1e269905f49/997/256/{z}/{x}/{y}.png',
	cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
	cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttribution});
map.setView(new L.LatLng(51.505, -0.1),3); //lat long pair
 //[bbox=-0.489,51.28,0.236,51.686].
map.addLayer(cloudmade);

 ui.notify('One moment please', 'Watching for incoming tweets, it may take up to a minute')
       .effect('slide')
	.hide(10000);
var socket = io.connect();

	socket.on('tweet', function(e) {
		var data = e;
		var latlng = new L.LatLng(data.coordinates[1],data.coordinates[0]);
		var m = new L.Marker(latlng);
		var label_str = '<a href = "http://twitter.com/';
		label_str+=data.screen_name+'"> <img src="'+data.pic
		label_str+='" class="profile" /></a> <div id="text">'+data.text+'</div>';		m.bindPopup(label_str).openPopup();		    
		map.addLayer(m);	

		//add notfication
		ui.notify(data.screen_name, data.text).effect('slide');
	});



  var getTimestamp = function(time)
    {
        //--------------------------------------------------------------
        // http://af-design.com/blog/2009/02/10/twitter-like-timestamps/
        //--------------------------------------------------------------
        //from https://groups.google.com/forum/?fromgroups#!topic/twitter-development-talk/pp1DlJVcu7Y

	var system_date = new Date(time).toLocaleTimeString();
        var user_date = new Date();
	return system_date;
//        var diff = Math.floor((user_date - system_date) / 1000);
 //       var result="";
//	if (diff <= 1) return "just now";
       
//       	if (diff < 60) return diff+ " seconds ago";	
//	if (diff<120 && diff>60 ) return "1 minute and " +diff%60+ " seconds ago";
//	if (diff>120) {
//		result+= Math.floor(diff/60) + " minutes and " + diff%60+ " seconds ago";
  //     		return result; 
//		}

    }

       
});

