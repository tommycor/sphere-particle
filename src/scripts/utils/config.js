import threejs from "three-js";
const THREE = threejs();


var config = {
	
	canvas: {
		element : document.getElementById('container'),
		color : 0x1a2033
	},
	
	camera: {
		position : new THREE.Vector3(0, 0, 500),
		target : new THREE.Vector3(0, 0, 0)
	},

	axisHelper: false,
	
	lights: {
		ambient: {
			color : 0xffffff
		} 
	},

	particles: {
		count: 500000,
		maxExplosions: 100,
		texture : "./assets/medias/smoke_3.png"
	},

	drawField: {
		maxHeight: 600,
		maxWidth: 600,
		maxDepth: 150,
		mitigator: .3
	},

	plane: {
		width: 700,
		height: 700,
		wireframe: true,
		opacity: 0,
	}
	
}


module.exports = config;