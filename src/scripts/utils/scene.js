var config = require('../utils/config');
var raf = require('../utils/raf');
var Plane = require('../objects/plane');
var Box = require('../objects/box');

function Scene() {

	this.render = this.render.bind(this);

	this.scene = null;
	this.camera = null;
	this.renderer = null;
	this.ambient = null;

	this.container = config.canvas.element;
	this.ratio = window.innerWidth / window.innerHeight;

	this.cube = null;
	this.plane = null;
}

Scene.prototype.init = function() {

	//// INIT
	this.scene = new THREE.Scene();

	this.camera = new THREE.PerspectiveCamera(45, this.ratio, 0.1, 2000);
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

	//// MESH
	this.plane = new Plane(config.plane);
	this.plane.init();

	this.box = new Box(config.box);
	this.box.coordonates();
	this.updatePlaneUniforms();
	this.box.init();

	//// ADD OBJECTS TO SCENE
	this.scene.add( this.ambient );
	this.scene.add( this.plane.mesh );
	this.scene.add( this.box.mesh );

	//// ADD CANVAS TO DOM
	this.container.appendChild(this.renderer.domElement);

	//// REGIST RENDERER
	raf.register(this.render);
	raf.start();
}

Scene.prototype.render = function() {

	this.renderer.render(this.scene, this.camera);

}

Scene.prototype.updatePlaneUniforms = function() {
	
	this.plane.uniforms.xMin.value = this.box.xMin;
	this.plane.uniforms.xMax.value = this.box.xMax;
	this.plane.uniforms.yMin.value = this.box.yMin;
	this.plane.uniforms.yMax.value = this.box.yMax;
}

module.exports = new Scene();