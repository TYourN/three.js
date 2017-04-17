// xxj 2015.9.1
// 创建一个天空盒
// 传入参数： 天空纹理路径，天空盒大小，天空盒向上位移量（正Y轴为上方向）
// 返回：天空盒Mesh
// 注意：天空盒纹理只有一副，里面包含盒子的六个面纹理，需使用canvas画布分别获得

createSkyBox = function( texture_url, scale, height){
	var cubeMap = new THREE.CubeTexture( [] );
	cubeMap.format = THREE.RGBFormat;
	cubeMap.flipY = false;

	var loader = new THREE.ImageLoader();
	loader.load( texture_url, function ( image ) {
		var size = Math.floor(image.height / 3);
		var getSide = function ( x, y ) {

			var canvas = document.createElement( 'canvas' );
			canvas.width = size;
			canvas.height = size;

			var context = canvas.getContext( '2d' );
			context.drawImage( image, -x * size, -y * size );

			return canvas;

		};

		cubeMap.images[ 0 ] = getSide( 2, 1 ); // px 左
		cubeMap.images[ 1 ] = getSide( 0, 1 ); // nx 右
		cubeMap.images[ 2 ] = getSide( 1, 0 ); // py 上
		cubeMap.images[ 3 ] = getSide( 1, 2 ); // ny 下
		cubeMap.images[ 4 ] = getSide( 1, 1 ); // pz 前
		cubeMap.images[ 5 ] = getSide( 3, 1 ); // nz 后

		cubeMap.needsUpdate = true;

	} );

	var cubeShader = THREE.ShaderLib['cube'];
	cubeShader.uniforms['tCube'].value = cubeMap;

	var skyBoxMaterial = new THREE.ShaderMaterial( {
		fragmentShader: cubeShader.fragmentShader,
		vertexShader: cubeShader.vertexShader,
		uniforms: cubeShader.uniforms,
		depthWrite: false,
		side: THREE.BackSide
	});

	var skyBox = new THREE.Mesh(
		new THREE.BoxGeometry( scale, scale, scale ),
		skyBoxMaterial
	);
	skyBox.position.y = height;

	return skyBox;
}