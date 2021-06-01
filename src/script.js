import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
// scene.background = new THREE.CubeTextureLoader()
//   .setPath("/cubemap/")
//   .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);

/**
 * fonts
 */

const fontLoader = new THREE.FontLoader();
fontLoader.load("/fonts/Poppins_Bold.json", (font) => {
  const textGeometry = new THREE.TextGeometry("Hello, Rishita Here", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  textGeometry.center();
  const textMaterial = new THREE.MeshNormalMaterial();
  //const material = new THREE.MeshMatcapMaterial({ matcap: matCapTexture });
  const text = new THREE.Mesh(textGeometry, textMaterial);
  text.position.set(0, 2, 0);
  scene.add(text);
  /**
   * object
   */
  const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45);
  const coneGeometry = new THREE.ConeBufferGeometry(0.5, 2.2, 32);

  for (let i = 0; i < 500; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);
    //const cone = new THREE.Mesh(coneGeometry, textMaterial);

    donut.position.x = (Math.random() - 0.5) * 50;
    donut.position.y = (Math.random() - 0.5) * 50;
    donut.position.z = (Math.random() - 0.5) * 50;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.Y = Math.random() * Math.PI;

    // const scale = Math.random();
    // donut.scale.set(scale, scale, scale);

    // cone.position.x = (Math.random() - 0.5) * 25;
    // cone.position.y = (Math.random() - 0.5) * 25;
    // cone.position.z = (Math.random() - 0.5) * 25;

    // cone.scale.set(scale, scale, scale);

    scene.add(donut);
  }
});

// Objects
const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64);
const boxGeometry = new THREE.BoxBufferGeometry(0.75, 0.75, 0.75);
const sphereGeometry = new THREE.SphereBufferGeometry(0.5, 22, 22);
const planeGeometry = new THREE.PlaneBufferGeometry(15, 15);
// Materials

const material = new THREE.MeshStandardMaterial();

// Mesh
const sphere = new THREE.Mesh(sphereGeometry, material);
const box = new THREE.Mesh(boxGeometry, material);
const torus = new THREE.Mesh(torusGeometry, material);
const plane = new THREE.Mesh(planeGeometry, material);

sphere.castShadow = true;
box.castShadow = true;
torus.castShadow = true;
plane.receiveShadow = true;

scene.add(sphere, box, plane, torus);

// positions
sphere.position.x = -1.5;
torus.position.x = 1.5;
plane.position.y = -0.85;
plane.rotation.x = -Math.PI * 0.35;
// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.6);
directionalLight.position.set(2, 2, -1);
scene.add(directionalLight);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 8;

directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.left = -2;

directionalLight.shadow.radius = 15;

const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
directionalLightCameraHelper.visible = false;
scene.add(directionalLightCameraHelper);

const hemisphereLight = new THREE.HemisphereLight("#f00", "#00f", 0.3);
scene.add(hemisphereLight);

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 3, 2, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);

const spotLight = new THREE.SpotLight(
  "#78ff00",
  0.5,
  6,
  Math.PI * 0.2,
  0.25,
  1
);
spotLight.position.set(0, 2, 2);
spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.fov = 30;

spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 8;

scene.add(spotLight.target);
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightCameraHelper.visible = false;
scene.add(spotLightCameraHelper);

const pointLight = new THREE.PointLight(0xff9000, 0.8, 3, 2);
pointLight.position.set(-1, 1, 0);
pointLight.castShadow = true;

pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;

pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;

scene.add(pointLight);

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
pointLightCameraHelper.visible = false;
scene.add(pointLightCameraHelper);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  sphere.rotation.x = elapsedTime * 0.1;
  box.rotation.x = elapsedTime * 0.1;
  torus.rotation.x = elapsedTime * 0.1;
  box.rotation.y = elapsedTime * 0.15;
  torus.rotation.y = elapsedTime * 0.15;

  // Update Orbital Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
