#define MAX_EXP 200
#define MAX_DIST 200.
#define MAX_Time 10.

#define EXP_TIME_POWER 1.5
#define EXP_TIME_VELOCITY 3.

#define EXP_DIST_POWER 2.5
#define EXP_DIST_VELOCITY .04 //smallest number = bigger explosion

uniform float explosionsTime[ MAX_EXP ];
uniform vec2 explosionsPos[ MAX_EXP ];
uniform int explosionsIndex;
uniform sampler2D map;

varying float dist;

void main() {
	float timeFactor = 1.;
	float distFactor = 1.;
	float alpha 	 = .5;

	gl_FragColor = texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) );
	gl_FragColor = gl_FragColor * vec4( 1., 1., 1., .5 );

	for( int i = 0 ; i < MAX_EXP ; i++ ) {

		if( i >= explosionsIndex ) {
			break;
		}

		if( dist <= MAX_DIST ) {

			timeFactor = ( .5 * exp( -5. * explosionsTime[i] ) ) + .5;
			// distFactor = 1. + ( dist ) / ( MAX_DIST * 4. );
			distFactor = ( .5 * exp( -0.005 * dist ) ) + .5;

			alpha = timeFactor * distFactor;

		}

	}

	gl_FragColor = gl_FragColor * vec4( 1., 1., 1., alpha );

}
