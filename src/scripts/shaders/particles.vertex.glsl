#define MAX_EXP 200
#define MAX_DIST 200.
#define MAX_Time 10.

#define EXP_TIME_POWER 30.
#define EXP_TIME_VELOCITY 3.

#define EXP_DIST_POWER 10.
#define EXP_DIST_VELOCITY .03 //smallest number = bigger explosion

uniform float explosionsTime[ MAX_EXP ];
uniform vec2 explosionsPos[ MAX_EXP ];
uniform int explosionsIndex;

varying float dist;

attribute float size;

void main() {
	float timeFactor = .0;
	float distFactor = .0;

	vec3 director 	 = vec3(0, 0, 0);
	vec3 newPosition = position;

	for( int i = 0 ; i < MAX_EXP ; i++ ) {

		if( i >= explosionsIndex ) {
			break;
		}

		dist = distance( vec3( explosionsPos[i], .0 ), newPosition );

		if( dist <= MAX_DIST ) {
			
			director 	= normalize( newPosition - vec3( explosionsPos[i], .0 ) );

			// http://www.md.ucl.ac.be/didac/physique/didacphys/rappels/math/fonctions/expon.html#expon
			// y = a . (1 - exp(-b . x))
			timeFactor	= EXP_TIME_POWER * ( 1. - exp( -EXP_TIME_VELOCITY * explosionsTime[i]) );

			// http://www.md.ucl.ac.be/didac/physique/didacphys/rappels/math/fonctions/expon.html#expon
			//  y = a . exp(-b . x)
			distFactor	= EXP_DIST_POWER * exp( -EXP_DIST_VELOCITY * dist );

			if( distFactor < .0 ) {
				distFactor = .0;
			}

			newPosition = newPosition + director * timeFactor * distFactor;
		}
	}

	vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1. );

	gl_PointSize = size * ( 300. / - mvPosition.z );


    gl_Position = projectionMatrix * mvPosition;
}