let VS_SHADER_SOURCE; //顶点着色器代码
let FS_SHADER_SOURCE; //片段着色器代码

function createShader(gl: WebGLRenderingContext, type: GLenum, source:string): WebGLShader | null {
	const shader = gl.createShader(type);
	if (shader) {
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
		if (success) {
			return shader;
		}

		console.log(gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
	}

	return null;
}

function createProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram | null {
	const program = gl.createProgram() as WebGLProgram;
	if (program) {
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		gl.linkProgram(program);
		let success = gl.getProgramParameter(program, gl.LINK_STATUS);
		if (success) {
			return program;
		}
	}

	console.log(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);

	return null;
}

function start(gl: WebGLRenderingContext) {

	///////////////
	// 1. 初始化
	///////////////

	let vs = createShader(gl, gl.VERTEX_SHADER, VS_SHADER_SOURCE) as WebGLShader;
	let fs = createShader(gl, gl.FRAGMENT_SHADER, FS_SHADER_SOURCE) as WebGLShader;

	let program = createProgram(gl, vs, fs) as WebGLProgram;

	//从着色器中获取属性变量a_position所在的位置
	let positionAttributeLocation = gl.getAttribLocation(program, "a_position");

	// 创建一个缓冲，属性值将从缓冲中获取数据
	let positionBuffer = gl.createBuffer();

	// 绑定一个数据源到绑定点，然后可以引用绑定点指向该数据源
	// 所以让我们来绑定位置信息缓冲
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	const positions = [
	0, 0,
	0, 0.5,
	0.7, 0,
	];

	//复制positions数据到GPU的positionBuffer对象上（对应的绑定点是ARRAY_BUFFER）
	//STATIC_DRAW代表不会经常改变这些数据
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);


	///////////////
	// 2. 渲染
	///////////////

	// WebGL的裁剪空间对应至canvas尺寸
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	//清空画布
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.useProgram(program);

	// 启用属性
	gl.enableVertexAttribArray(positionAttributeLocation);

	// 将绑定点绑定到缓冲数据（positionBuffer）
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// 告诉属性如何从positionBuffer中读取数据 (ARRAY_BUFFER)
	const size = 2;          // 每次迭代运行提取两个单位数据
	const type = gl.FLOAT;   // 每个单位的数据类型是32位浮点型
	const normalize = false; // 不需要归一化数据
	const stride = 0;        // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)，每次迭代运行多少内存到下一个数据开始点
	const offset = 0;        // 从缓冲起始位置开始读取
	gl.vertexAttribPointer(
		positionAttributeLocation, size, type, normalize, stride, offset);

	// 绘制
	const primitiveType = gl.TRIANGLES;
	const offsetDraw = 0;
	const count = 3;
	gl.drawArrays(primitiveType, offsetDraw, count);
}

function loadShaderFile(gl: WebGLRenderingContext, fileName: string, shader: GLenum) {
	let request = new XMLHttpRequest();

	request.onreadystatechange = function() {
		if (request.readyState === 4 /**Completed */ && request.status !== 404) {
			onLoadShader(gl, request.responseText, shader);
		}
	}

	request.open('GET', fileName, true);
	request.send();
}

function onLoadShader(gl: WebGLRenderingContext, fileString: string, type: GLenum) {
	if (type == gl.VERTEX_SHADER) {
		VS_SHADER_SOURCE = fileString;
	}else if (type == gl.FRAGMENT_SHADER) {
		FS_SHADER_SOURCE = fileString;
	}

	if (VS_SHADER_SOURCE && FS_SHADER_SOURCE) {
		start(gl);
	}
}

function main() {
	 /** @type {HTMLCanvasElement} */
	const canvas = document.createElement('canvas');
	if (!canvas) {
		console.log("Failed to get webgl canvas!");
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

	console.log("Hello WebGL!");

	loadShaderFile(gl, 'ColoredTriangle.vert', gl.VERTEX_SHADER);
	loadShaderFile(gl, 'ColoredTriangle.frag', gl.FRAGMENT_SHADER);

}