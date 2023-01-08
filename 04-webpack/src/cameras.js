import { OrthographicCamera, PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
    animateExternalMeshWithClock,
    loopAnimation,
} from './basic-animations';
import { getRedCubeSetup } from './utils';

const canvasId = 'default-webgl';
export function perspectiveCameraExample() {
    const [renderer, scene, mesh, _] = getRedCubeSetup(canvasId);
    // the last two values on PerspectiveCamera constructor is 'near' and 'far'. We can set the 'far' value properly to
    // not renderer elements that are to far from the camera, for ex: mountains when we have a village. Once the
    // mountain reaches the specified value, its not rendered anymore.
    // To test it, change the last value to a value lower than pCamera.position.z and the cube will disapear
    const pCamera = new PerspectiveCamera(75, 800 / 600, 0.1, 100);
    pCamera.position.z = 3;
    scene.add(pCamera);
    renderer.render(scene, pCamera);
}

export function ortogarphicCameraExample() {
    const [renderer, scene, mesh] = getRedCubeSetup(canvasId);
    // far elements has the same perspective than close ones
    const aspectRatio = 800 / 600;
    const oCamera = new OrthographicCamera(
        -1 * aspectRatio,
        1 * aspectRatio,
        1,
        -1,
        0.1,
        100
    );
    oCamera.position.x = 2;
    oCamera.position.y = 2;
    oCamera.position.z = 3;
    oCamera.lookAt(mesh.position);
    renderer.render(scene, oCamera);
    animateExternalMeshWithClock(mesh, renderer, scene, oCamera);
}

export function movePerspectiveCameraWithMouseExample() {
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
    };
    const cursor = {
        x: 0,
        y: 0,
    };
    const [renderer, scene, mesh, camera] = getRedCubeSetup(
        canvasId,
        sizes.width,
        sizes.height,
        false
    );
    renderer.render(scene, camera);
    // // get mouse position
    window.addEventListener('mousemove', (event) => {
        // dividing the value by the size of our viewport, we can have a more precise position related
        // to the object. this way, when I resize my browser window, the value will be consistent
        cursor.x = -(event.clientX / sizes.width - 0.5);
        cursor.y = event.clientY / sizes.height - 0.5;
    });
    loopAnimation(renderer, scene, camera, () => {
        // we use math.sin and math.cos combined to get the horizontal rotation animation.
        // we use Math.PI bacause we ant a full object rotation
        // we multiply it by 3 just to put the camera a little bit far from the cube
        camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
        camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
        camera.position.y = cursor.y * 5;
        camera.lookAt(mesh.position);
    });
}

export function orbitControlsExample() {
    const [renderer, scene, _mesh, camera] = getRedCubeSetup(canvasId);
    const canvas = document.getElementById(canvasId);
    applyOrbitControl(camera, canvas, renderer, scene);
}

export function applyOrbitControl(camera, canvas, renderer, scene) {
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.update();
    function animate() {
        requestAnimationFrame(animate);
        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}
