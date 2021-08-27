var express = require('express');
var app = express();
var app_port = 3000;

app.listen(app_port, function(){
    console.log('Server is running on port ' + app_port);
});

app.get('/',function(req,res){

    const fetch = require('node-fetch');

    fetch('http://api.citybik.es/v2/networks')
        .then( res => res.json() )
        .then(json => showCityBikeLocations(json, res));

});

function showCityBikeLocations(data, res){
    
    var googleMapUrl = 'https://www.google.com/maps/search/?api=1&query=';
    var counter = 1;
    var max = 10;
    var htmlBody = `<html>
                          <style>
                            table, th, tr, td{
                                border: 1px solid #eee;
                                font-size: 12px;
                            }
                            h2, td{
                                text-align:center;
                            }
                          </style>
                          <body>
                                <h2>City Bikes Locations</h2>
                                <table style="width:100%;">
                                       <thead>
                                              <th>City</th>
                                              <th>Country</th>
                                              <th>Location on Map</th>
                                        </thead>
                                        <tbody>`;

    for(var record in data.networks) {
        if(counter < max){
            let latitude = data.networks[record].location.latitude; 
            let longitude = data.networks[record].location.longitude; 
            htmlBody += `<tr>
                            <td>${data.networks[record].location.city}</td>
                            <td>${data.networks[record].location.country}</td>
                            <td><a href="${googleMapUrl + data.networks[record].location.latitude},${data.networks[record].location.longitude}" target="_blank">Click here to see exact location</a></td>
                            </tr>
                        `;
            counter++;
        }
    }    
    htmlBody += `</tbody></table></body></html>`;
    res.send(htmlBody);
}