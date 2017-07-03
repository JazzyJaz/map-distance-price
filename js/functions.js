var map;
var panel;
var initialize;
var calculate;
var direction;


initialize = function(){
  var paris = new google.maps.LatLng(48.856614, 2.352222); 
  var myOptions = {
    zoom      : 11,
    center    : paris,
    mapTypeId : google.maps.MapTypeId.ROADMAP, // HYBRID, ROADMAP, SATELLITE, TERRAIN
    maxZoom   : 20,
    scrollwheel:false
  };
  
  map      = new google.maps.Map(document.getElementById('map'), myOptions);
  panel    = document.getElementById('panel');
  
/*  var marker = new google.maps.Marker({
    position : paris,
    map      : map,
    title    : "Paris"
  });
*/

  
  direction = new google.maps.DirectionsRenderer({
    map   : map,
    panel : panel // Dom element pour afficher les instructions d'itinéraire
  });

  google.maps.event.addListener(map, 'click', function(event){
            this.setOptions({scrollwheel:true});
        });   

      google.maps.event.addListener(map, 'mouseout', function(event){
            this.setOptions({scrollwheel:false});
        }); 

      google.maps.event.addListener(map, 'mouseover', function(event){
            this.setOptions({scrollwheel:false});
        }); 

      google.maps.event.addListener(map, 'click', function(event){
            this.setOptions({scrollwheel:true});
        }); 

};

calculate = function(){
    origin      = document.getElementById('origin').value; // Le point de départ
    destination = document.getElementById('destination').value; // Le point d'arrivé
    if(origin && destination){
        var request = {
            origin      : origin,
            destination : destination,
            travelMode  : google.maps.DirectionsTravelMode.DRIVING // Mode de conduite
        }
        var directionsService = new google.maps.DirectionsService(); // Service de calcul d'itinéraire
        directionsService.route(request, function(response, status){ // Envoie de la requête pour calculer le parcours
            if(status == google.maps.DirectionsStatus.OK){
                direction.setDirections(response); // Trace l'itinéraire sur la carte et les différentes étapes du parcours
            }
        });
    }
};


function CalculDistance()
{
  // récupération des champs
  var origin=document.forms[0].origin.value;
  var destination=document.forms[0].destination.value;
   
  // requête DistanceMatrix
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
    origins: [origin],
    destinations: [destination],
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false
    }, callback);
}
  
function callback(response, status)
{
  if (status != google.maps.DistanceMatrixStatus.OK)
  {
    alert('Erreur : ' + status); // msg er
  }
  else
  {
    //réponses du serveur (
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;
    for (var i = 0; i < origins.length; i++)
    {
      var results = response.rows[i].elements;
      var dep = origins[i];
      if(dep!='')
      {
        for (var j = 0; j < results.length; j++)
        {
          var element = results[j];
          var statut = element.status;
          var arr = destinations[j];
          if(statut=='OK')
          {
            document.getElementById('prixcalcule').style.display = 'block';
            var dist = element.distance.value;
            document.forms[0].distance.value= parseInt(dist/1000) * 2; // distance en km * prix
          }
          else if(statut=='NOT_FOUND')
          {
            alert("L'adresse d'arrivée n'est pas reconnu.");
          }
          else if(statut=='ZERO_RESULTS')
          {
            alert("Impossible de calculer la distance");
          }
        }
      }
      else
      {
        alert("L'adresse de départ n'est pas reconnu.");
      }
    }
  }
}

initialize();