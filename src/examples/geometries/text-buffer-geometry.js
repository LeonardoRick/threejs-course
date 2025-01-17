import { getRendererSceneCanvas, setupDefaultCameraAndScene } from '../../utils';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { DoubleSide, Mesh, MeshNormalMaterial, TorusGeometry } from 'three';
import { applyOrbitControl } from '../cameras';
const canvasId = 'default-webgl';
// 3D Text notes:
// site to convert fonts to a typeface.js font: https://gero3.github.io/facetype.js/

// - Curve segments: segments related to curved letters such as: 0, o, e
// - Bevel segments: segments related to the edge of 3d letters and appear on every sharp corner to soft it.
// - Bounding: How much space is taken by a geometry

export function threeDText() {
    const [renderer, scene, canvas] = getRendererSceneCanvas(canvasId);
    // const material = new MeshMatcapMaterial();
    const material = new MeshNormalMaterial();
    const fontLoader = new FontLoader();
    material.flatShading = true;
    material.side = DoubleSide;
    fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
        const textGeometry = new TextGeometry('Leonardo Rick', {
            font,
            size: 0.5,
            height: 0.2,
            curveSegments: 5,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 4,
        });

        /* MANUALLY CENTER CALCULATING BEVEL VALUES */
        // textGeometry.computeBoundingBox(); // anble bounding on text geometry
        // const { x, y, z } = textGeometry.boundingBox.max;
        // // the decimal subtractions is to compensate the diference generated by the bevel segments in each vertex.
        // // The initial center of the figure is the first letter left-bottom, but it do not consider the bevel segments.
        // // if we console.log(textGeometry.boundingBox) we can see that the min and max differ from each other from 0.02
        // // on x and y and 0.03 on z vertex. If you notice, thats the values we used on bevelSize and bevelThickness respectively.
        // // Subtracting this values on the repositions will give us the perfect centered text
        // console.log('before: ', textGeometry.boundingBox);
        // textGeometry.translate(-(x - 0.02) * 0.5, -(y - 0.02) * 0.5, -(z - 0.03) * 0.5);
        // console.log('after: ', textGeometry.boundingBox);

        textGeometry.center();
        // to center, instead of moving the Mesh, we are going to move the whole geometry with translate. which moves every vertice
        const text = new Mesh(textGeometry, material);
        const camera = setupDefaultCameraAndScene(scene, renderer, { mesh: text });

        // adding multiple donuts on the screen. Leave the geometry outside of the for loop to optimize it
        const torusGeometry = new TorusGeometry(0.3, 0.2, 20, 45);
        for (let i = 0; i < 300; i++) {
            const torus = new Mesh(torusGeometry, material);
            torus.position.x = (Math.random() - 0.5) * 15;
            torus.position.y = (Math.random() - 0.5) * 15;
            torus.position.z = (Math.random() - 0.5) * 15;

            // Math.PI = half a rotation (180 deg)
            torus.rotation.x = Math.random() * Math.PI;
            torus.rotation.y = Math.random() * Math.PI;

            // We need to use a sigle value because we don't want distorted donuts
            const scale = Math.random();
            torus.scale.set(scale, scale, scale);

            scene.add(torus);
        }
        applyOrbitControl(camera, canvas, renderer, scene);
    });
}
