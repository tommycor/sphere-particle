import threejs 				from "three-js";
const THREE = threejs();

import config 				from '../utils/config';
import raf 					from '../utils/raf';
import mapper 				from '../utils/mapper';

module.exports = {

	init: function() {

		this.render  		= this.render.bind(this);
		this.onClick 		= this.onClick.bind(this);
		this.onResize  		= this.onResize.bind(this);
		this.onMove			= this.onMove.bind(this);
		this.clock   		= new THREE.Clock();
		this.cameraPos		= new THREE.Vector3( config.camera.position.x, config.camera.position.y, config.camera.position.z );
		this.currentCameraPos = new THREE.Vector3( this.cameraPos.x, this.cameraPos.y, this.cameraPos.z );

		this.plane   		= null;
		this.explosionsPos 	= [];
		this.explosionsTime = [];

		// KEEP THIS SHIT
		// ADD VALUES IN A PREDEFINED LENGTH ARRAY
		// POP THE LASTS AND UNSHIFT THE NEW ONES
		for( let i = 0 ; i < config.particles.maxExplosions - 1 ; i++ ) {
			this.explosionsPos[i]  = new THREE.Vector2( 0, 0, 0 );
			this.explosionsTime[i] = 100;
			this.explosionsIndex   = 0;
		}

		//// INIT
		this.scene 	   = new THREE.Scene();
		this.container = config.canvas.element;

		this.camera 		   = new THREE.PerspectiveCamera(45, this.ratio, 15, 3000);
		this.camera.position.x = config.camera.position.x;
		this.camera.position.y = config.camera.position.y;
		this.camera.position.z = config.camera.position.z;
		this.camera.lookAt(config.camera.target);

		if ( config.axisHelper ) {
			this.axisHelper =  new THREE.AxisHelper( 5 );
			this.scene.add( this.axisHelper );
		}

		//// RENDERER
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setClearColor(config.canvas.color, 1.0);
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		//// AMBIANT LIGHT
		this.ambient = new THREE.AmbientLight( config.lights.ambient.color );

		//// ADD OBJECTS TO SCENE
		this.scene.add( this.ambient );

		//// ADD CANVAS TO DOM
		this.container.appendChild( this.renderer.domElement );

		this.createParticles();

		//// REGIST RENDERER
		raf.register( this.render );
		raf.start();
		this.onResize();

		window.addEventListener( 'click', this.onClick );
		window.addEventListener( 'resize', this.onResize );
		window.addEventListener( 'mousemove', this.onMove );
	},

	createParticles: function() {
		this.uniforms = {
			time: { type: 'f', value: 0.0 },
			map: { type: 't', value: THREE.ImageUtils.loadTexture(config.particles.texture) },

		}

		this.geometry 	= new THREE.BufferGeometry();
		this.vertices 	= new Float32Array( config.particles.count * 3 );
		this.sizes 		= new Float32Array( config.particles.count );

		for( let i = 0 ; i < config.particles.count ; i++ ) {

			// let angle1 = Math.random() * Math.PI * 2;
			// let angle2 = Math.acos( Math.random() * 2 - 1 );
			// let dist   = 400;

			// let pX = dist * Math.sin( angle1 ) * Math.cos( angle2 );
			// let pY = dist * Math.sin( angle1 ) * Math.sin( angle2 );
			// let pZ = dist * Math.cos( angle1 );

			// this.vertices[i * 3] = pX;
			// this.vertices[i * 3 + 1] = pY;
			// this.vertices[i * 3 + 2] = pZ;

			this.vertices[i * 3] = Math.random();
			this.vertices[i * 3 + 1] = Math.random();
			this.vertices[i * 3 + 2] = 0;

			this.sizes[ i ] = 1;
		}

		this.geometry.addAttribute( 'position', new THREE.BufferAttribute( this.vertices, 3 ) );
		this.geometry.addAttribute( 'size', new THREE.BufferAttribute( this.sizes, 1 ) );

		this.material = new THREE.ShaderMaterial( {
			uniforms: this.uniforms,
			transparent: true,
			vertexShader: require('../shaders/noises/noise2D.glsl') + require('../shaders/particles.vertex.glsl'),
			fragmentShader: require('../shaders/particles.fragment.glsl')
		});

		this.particleSystem = new THREE.Points( this.geometry, this.material );

		this.scene.add(this.particleSystem);
	},

	onClick: function( event ) {
	},

	onMove: function( event ) {
		this.cameraPos.x = event.clientX - this.halfWidth;
		this.cameraPos.y = event.clientY - this.halfHeight;
	},

	onResize: function() {
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.ratio = window.innerWidth / window.innerHeight;

		this.camera.aspect = this.ratio;
		this.camera.updateProjectionMatrix();

		this.halfWidth = window.innerWidth * .5;
		this.halfHeight = window.innerHeight * .5;
	},

	render: function() {
		let delta = this.clock.getDelta();

		this.currentCameraPos.x += ( ( this.cameraPos.x * .7) - this.currentCameraPos.x ) * 0.01;
		this.currentCameraPos.y += ( ( this.cameraPos.y * .8) - this.currentCameraPos.y ) * 0.01;

		this.camera.position.set( this.currentCameraPos.x, this.currentCameraPos.y, this.currentCameraPos.z );
		this.camera.lookAt(config.camera.target);

		this.uniforms.time.value += delta;

		this.renderer.render(this.scene, this.camera);
	}

};