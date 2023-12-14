class GPURenderer {
    #adapter;
    #device;
    #context;
	constructor(canvas) {
		this.canvas = canvas;
	}

	async init() {
		// Request GPU
		if (!navigator.gpu) {
			const errorMessage = "WebGPU not supported on this browser.";
			alert(errorMessage);
			throw new Error(errorMessage);
		}

		// Request Adapter
		this.#adapter = await navigator.gpu.requestAdapter();
		if (!this.#adapter) {
			const errorMessage = "No appropriate GPUAdapter found.";
			alert(errorMessage);
			throw new Error(errorMessage);
		}

		// Request Device
		this.#device = await this.#adapter.requestDevice();

		// Configure context on canvas
		this.#context = this.canvas.getContext("webgpu");
		const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
		this.#context.configure({
			device: this.#device,
			format: canvasFormat,
		});
	}

    beginCommandEncoder(callbackFunction) {
        if (!callbackFunction) {
            const errorMessage = "callbackFunction type is not appropriate. Need type (encoder) => void";
			alert(errorMessage);
			throw new Error(errorMessage);
        }
        const encoder = this.#device.createCommandEncoder();
        callbackFunction(this.#device, encoder, this.#context);
    }
}
