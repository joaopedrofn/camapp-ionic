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
import { Camera, CameraOptions } from '@ionic-native/camera';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
		map: GoogleMap;
		watchId: any;
		position: any;
  constructor(public navCtrl: NavController, public geolocation: Geolocation, public camera: Camera, public nativeStorage: NativeStorage) {
		
  }

  takePicture(){
  	const cameraOptions = {
  		quality: 100,
  		destinationType: this.camera.DestinationType.FILE_URI,
  		encodingType: this.camera.EncodingType.JPEG,
  		mediaType: this.camera.MediaType.PICTURE,
  		saveToPhotoAlbum: true
  	};
  	this.camera.getPicture(cameraOptions).then((imageData) => {
  		this.nativeStorage.getItem('pictures').then(( pictures ) => {
  			pictures.push({file: imageData});
  			this.nativeStorage.setItem('pictures', pictures);
  			alert(pictures);
  		}).catch(( err ) => {
  			this.nativeStorage.setItem('pictures', [{file: imageData}]);
  			alert(err);
  		});
  	}).catch((err) => {
  		alert(err.message);
  	});
  }

  ionViewDidLoad(){
  	this.geolocation.getCurrentPosition().then((position) => {
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
