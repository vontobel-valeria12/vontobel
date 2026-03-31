/* eslint-disable no-undef */
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/body-pix');

let net = null;

async function loadModel() {
    if (!net) {
        net = await bodyPix.load({
            architecture: 'MobileNetV1',
            outputStride: 16,
            multiplier: 0.75,
            quantBytes: 2
        });
        console.log("Modell geladen!");
    }
}

loadModel();

self.onmessage = async (e) => {
    const { imageData } = e.data;
    if (!net) await loadModel();

    const segmentation = await net.segmentPerson(imageData, {
        internalResolution: 'medium',
        segmentationThreshold: 0.7
    });

    const { width, height } = imageData;
    const bytes = new Uint8ClampedArray(width * height * 4);

    for (let i = 0; i < segmentation.data.length; i++) {
        const n = i * 4;
        const isForeground = segmentation.data[i] === 1;
        bytes[n] = imageData.data[n];
        bytes[n + 1] = imageData.data[n + 1];
        bytes[n + 2] = imageData.data[n + 2];
        bytes[n + 3] = isForeground ? 255 : 0; 
    }

    self.postMessage({ processedImageData: bytes, width, height }, [bytes.buffer]);
};