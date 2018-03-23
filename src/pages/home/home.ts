import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {
	GoogleMaps,
	GoogleMap,
	GoogleMapsEvent,
	GoogleMapOptions,
	CameraPosition,
	MarkerOptions,
	Marker
} from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
		map: GoogleMap;
		watchId: any;
		position: any;
  constructor(public navCtrl: NavController, public geolocation: Geolocation) {
		
  }
  ionViewDidLoad(){
  	this.geolocation.getCurrentPosition().then((position) => {
  				alert("não erro");
  				this.position = {
  					target: {
  						lat: position.coords.latitude,
  						lng: position.coords.longitude
  					},
  					zoom: 15,
  					tilt: 30
  				};
  				this.loadMap();
  			}).catch((err) => {
  				alert("erro");
  			});
  	
  }
  loadMap(){
  	let mapOptions = {
  		camera: this.position
  	};
  	this.map = GoogleMaps.create('map_canvas', mapOptions);
  	this.map.one(GoogleMapsEvent.MAP_READY).then(()=>{
  			console.log("Map Ready!");
  	}).catch((err) => {
  			alert(err.message);
  	});
  }

}
