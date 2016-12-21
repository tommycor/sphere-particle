

#define M_PI 3.1415926535897932384626433832795
#define DIST 300.0

uniform float time;

attribute float size;

void main() {
	vec2 fakePosition   = vec2( position.x, position.y );
	vec3 newPosition	= vec3( .0, .0, .0 );

	fakePosition.x = snoise( vec2( position.x, time * .001 ) );
	fakePosition.y = snoise( vec2( position.y, time * .001 ) );

	float angle1 = 2. * M_PI * fakePosition.x;
	float angle2 = acos( fakePosition.y * 2. - 1. );

	newPosition.x = DIST * sin( angle1 ) * cos( angle2 );
	newPosition.y = DIST * sin( angle1 ) * sin( angle2 );
	newPosition.z = DIST * cos( angle1 );

	vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1. );

	gl_PointSize = size * ( 500. / - mvPosition.z );

    gl_Position = projectionMatrix * mvPosition;
}