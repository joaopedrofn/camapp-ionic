import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-image',
  templateUrl: 'image.html'
})
export class Image{
	image: any;
	constructor(public navParams: NavParams, public viewCtrl: ViewController){
		this.image = navParams.get('image');
	}
	close(){
		this.viewCtrl.dismiss();
	}
}