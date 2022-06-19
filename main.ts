function main() {
	 /** @type {HTMLCanvasElement} */
	const canvas = document.createElement('canvas');
	if (!canvas) {
		console.log("failed to get webgl canvas");
		return;
	}

	let descendant = document.querySelector('body');
	if (!descendant) {
		return;
	}
	descendant.appendChild(canvas);

	/** @type {WebGLRenderingContext} */
	const gl = canvas.getContext('webgl');
	if (!gl) return;

	console.log("Hello WebGL");

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
}