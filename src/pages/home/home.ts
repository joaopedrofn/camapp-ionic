import { Component } from '@angular/core';
import { 
	NavController, 
	ModalController, 
	PopoverController, 
	ViewController,
	NavParams	 
} from 'ionic-angular';
import {
	GoogleMaps,
	GoogleMap,
	GoogleMapsEvent,
	GoogleMapOptions,
	CameraPosition,
	MarkerOptions,
	Marker,
	HtmlInfoWindow
} from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { NativeStorage } from '@ionic-native/native-storage';
import { 
	DeviceMotion, 
	DeviceMotionAccelerationData 
} from '@ionic-native/device-motion';
import { Image } from '../image/image';

@Component({
	templateUrl: 'infoWindow.html'
})
export class InfoWindow{
	picture: any;
	constructor(
		public viewController: ViewController, 
		public navParams: NavParams, 
		public modalController: ModalController
	){
		this.picture = navParams.get('picture');
	}
	close(){
		this.viewController.dismiss();
	}
	openModal(picture){
		const modal = this.modalController.create(Image, {image: picture});
		modal.present();
	}
}


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
		map: GoogleMap;
		watchId: any;
		position: any;
  constructor(
  		public navCtrl: NavController, 
  		public geolocation: Geolocation, 
  		public camera: Camera, 
  		public nativeStorage: NativeStorage,
  		public deviceMotion: DeviceMotion,
  		public modalController: ModalController,
  		public popverController: PopoverController
  	) {
		// nativeStorage.clear();
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
  			this.geolocation.getCurrentPosition().then((position) => {
  				this.deviceMotion.getCurrentAcceleration().then((acc) => {
  					const newPic = {
  						file: imageData,
  						position: {
  							lat: position.coords.latitude,
  							lng: position.coords.longitude
  						},
  						acc
  					};
  					pictures.push(newPic);
  					this.nativeStorage.setItem('pictures', pictures);
  					this.addMarker(newPic);
  				});
  			});
  		}).catch(( err ) => {
  			this.geolocation.getCurrentPosition().then((position) => {
  				this.deviceMotion.getCurrentAcceleration().then((acc) => {
  					const newPic = {
  						file: imageData,
  						position: {
  							lat: position.coords.latitude,
  							lng: position.coords.longitude
  						},
  						acc
  					};
  					this.nativeStorage.setItem('pictures', [newPic]);
  					this.addMarker(newPic);
  				});
  			});
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
  addMarker(picture: any){
  	let popover = this.popverController.create(InfoWindow, {picture});
  	this.map.addMarker({
  		animation: 'DROP',
  		position: picture['position']
  	}).then((marker: Marker) => {
  		marker.addEventListener(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
  			popover.present({ ev: 'click'});
  		});
  	});
  }
  
  loadMap(){
  	let mapOptions = {
  		camera: this.position
  	};
  	this.map = GoogleMaps.create('map_canvas', mapOptions);
  	this.map.one(GoogleMapsEvent.MAP_READY).then(()=>{
  			console.log("Map Ready!");
  			this.nativeStorage.getItem('pictures').then((pictures) => {
  				for(let picture of pictures){
  					this.addMarker(picture);
  				}
  			});
  	}).catch((err) => {
  			alert(err.message);
  	});
  }
  testPopover(){
  	const popover = this.popverController.create(InfoWindow, {
  		picture: {
  			file: "teste",
  			acc: {
  				x: "x",
  				y: "y",
  				z: "z"
  			}
  		}
  	});
  	popover.present();
  }
}
