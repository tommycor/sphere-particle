import threejs from "three-js";
const THREE = threejs();

import config 	from '../utils/config';
import getIntersectionMouse from '../utils/getIntersectionMouse';

module.exports = function() {

	this.geometry = null;
	this.material = null;
	this.mesh = null;

	this.geometry = new THREE.PlaneGeometry( config.plane.width, config.plane.height, 1, 1 );
	this.material = new THREE.MeshBasicMaterial( {
		wireframe: 		config.plane.wireframe,
		opacity: 		config.plane.opacity,
		transparent: 	config.plane.opacity == 1 ? false : true
	});
	this.mesh = new THREE.Mesh( this.geometry, this.material );
	this.mesh.position.set(0, 0, 0);

	this.getIntersection = function( event, camera ) {
		return getIntersectionMouse( event, this.mesh, camera );
	}

};