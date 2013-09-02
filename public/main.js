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
      var system_date = new Date(time).toLocaleTimeString();
      var user_date = new Date();
      return system_date;
    }
});

