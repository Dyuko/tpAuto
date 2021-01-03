import * as THREE from './threejs/resources/threejs/r122/build/three.module.js';
import {OrbitControls} from './threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import {RectAreaLightUniformsLib} from './threejs/resources/threejs/r122/examples/jsm/lights/RectAreaLightUniformsLib.js';
import {RectAreaLightHelper} from './threejs/resources/threejs/r122/examples/jsm/helpers/RectAreaLightHelper.js';
import {GUI} from './threejs/../3rdparty/dat.gui.module.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});
  RectAreaLightUniformsLib.init();

  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('black');

  // Se crea el grupo auto, todo el grupo puede ser rotado, escalado 
  const auto = new THREE.Group();

  // Modulo: Plano
  {
    const planeSize = 40;

    const loader = new THREE.TextureLoader();
    const texture = loader.load('./threejs/resources/images/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);
  }

  function nuevoMeshPhysicalMaterial() {
    const material = new THREE.MeshPhysicalMaterial({
      side: THREE.DoubleSide,
    });

    const hue = Math.random();
    const saturation = 1;
    const luminance = .5;
    material.color.setHSL(hue, saturation, luminance);

    return material;
  }

  // Techo
  {
    const width = 2.948957;
    const height = 0.1;
    const depth = 2.600055;
    const geometry = new THREE.BoxBufferGeometry( width, height, depth);
    const cube = new THREE.Mesh( geometry, nuevoMeshPhysicalMaterial());
    cube.position.set(0, 6.54837, -1.068131);
    auto.add(cube);
  }

  // Capo
  {
    const width = 2.94896;
    const height = 0.1;
    const depth = 2.185710874138892;
    const geometry = new THREE.BoxBufferGeometry( width, height, depth);
    const cube = new THREE.Mesh( geometry, nuevoMeshPhysicalMaterial());
    cube.position.set(0, 3.90355, 1.7934965);
    cube.rotation.set(0.0767945,0,0);
    auto.add(cube);
  }

  // Chapería Derecha
  {
    // Parte trasera: Es un rectángulo Perfecto
    {
      const width = 0.1;
      const height = 1.600610;
      const depth = 3.761848;
      const geometry = new THREE.BoxBufferGeometry( width, height, depth);
      const cube = new THREE.Mesh( geometry, nuevoMeshPhysicalMaterial());
      cube.position.set(1.47448, 3.216545, -1.082516,);
      auto.add(cube);
    }
    // Parte delantera: Es un cuadrilátero irregular
    {
      //https://threejsfundamentals.org/threejs/lessons/threejs-custom-geometry.html
      const geometry = new THREE.Geometry();
      geometry.vertices.push(
        new THREE.Vector3(1.3975, 2.41624,  2.87846),  // 0
        new THREE.Vector3(1.47448, 2.41624,  2.87846),  // 1
        
        new THREE.Vector3(1.3975,  3.79025,  2.87846),  // 2
        new THREE.Vector3(1.47448, 3.79025,  2.87846),  // 3
        
        new THREE.Vector3(1.3975, 2.41624, 0.798408),  // 4
        new THREE.Vector3(1.47448, 2.41624, 0.798408),  // 5
        
        new THREE.Vector3(1.3975,  4.01685, 0.798408),  // 6
        new THREE.Vector3(1.47448,  4.01685, 0.798408),  // 7
        
      );
        /*
        6----7
        /|   /|
      2----3 |
      | |  | |
      | 4--|-5
      |/   |/
      0----1
        */
      geometry.faces.push(
        // front
        new THREE.Face3(0, 3, 2),
        new THREE.Face3(0, 1, 3),
        // right
        new THREE.Face3(1, 7, 3),
        new THREE.Face3(1, 5, 7),
        // back
        new THREE.Face3(5, 6, 7),
        new THREE.Face3(5, 4, 6),
        // left
        new THREE.Face3(4, 2, 6),
        new THREE.Face3(4, 0, 2),
        // top
        new THREE.Face3(2, 7, 6),
        new THREE.Face3(2, 3, 7),
        // bottom
        new THREE.Face3(4, 1, 0),
        new THREE.Face3(4, 5, 1),
      );
      
      // Calcular las normales
      geometry.computeFaceNormals();
      geometry.computeVertexNormals();
      
      const cube = new THREE.Mesh(geometry, nuevoMeshPhysicalMaterial());
      auto.add(cube);
    }

  }
  // Chapería Izquierda
  {
    // Parte trasera: Es un rectángulo Perfecto
    {
      const width = 0.1;
      const height = 1.600610;
      const depth = 3.761848;
      const geometry = new THREE.BoxBufferGeometry( width, height, depth);
      const cube = new THREE.Mesh( geometry, nuevoMeshPhysicalMaterial());
      cube.position.set(-1.47448, 3.216545, -1.082516,);
      auto.add(cube);
    }
    // Parte delantera: Es un cuadrilátero irregular
    {
      //https://threejsfundamentals.org/threejs/lessons/threejs-custom-geometry.html
      const geometry = new THREE.Geometry();
      geometry.vertices.push(
        new THREE.Vector3(-1.3975, 2.41624,  2.87846),  // 0
        new THREE.Vector3(-1.47448, 2.41624,  2.87846),  // 1
        
        new THREE.Vector3(-1.3975,  3.79025,  2.87846),  // 2
        new THREE.Vector3(-1.47448, 3.79025,  2.87846),  // 3
        
        new THREE.Vector3(-1.3975, 2.41624, 0.798408),  // 4
        new THREE.Vector3(-1.47448, 2.41624, 0.798408),  // 5
        
        new THREE.Vector3(-1.3975,  4.01685, 0.798408),  // 6
        new THREE.Vector3(-1.47448,  4.01685, 0.798408),  // 7
        
      );
        /*
        6----7
        /|   /|
      2----3 |
      | |  | |
      | 4--|-5
      |/   |/
      0----1
        */
      geometry.faces.push(
        // front
        new THREE.Face3(0, 3, 2),
        new THREE.Face3(0, 1, 3),
        // right
        new THREE.Face3(1, 7, 3),
        new THREE.Face3(1, 5, 7),
        // back
        new THREE.Face3(5, 6, 7),
        new THREE.Face3(5, 4, 6),
        // left
        new THREE.Face3(4, 2, 6),
        new THREE.Face3(4, 0, 2),
        // top
        new THREE.Face3(2, 7, 6),
        new THREE.Face3(2, 3, 7),
        // bottom
        new THREE.Face3(4, 1, 0),
        new THREE.Face3(4, 5, 1),
      );
      
      // Calcular las normales
      geometry.computeFaceNormals();
      geometry.computeVertexNormals();
      
      const cube = new THREE.Mesh(geometry, nuevoMeshPhysicalMaterial());
      auto.add(cube);
    }

  }

  // Piso
  {
    const width = 2.948957;
    const height = 0.1;
    const depth = 5.841903;
    const geometry = new THREE.BoxBufferGeometry( width, height, depth);
    const cube = new THREE.Mesh( geometry, nuevoMeshPhysicalMaterial());
    cube.position.set(0, 2.41624, -0.04249);
    auto.add(cube);
  }

  // Parte trasera
  {
    const width = 2.948957;
    const height = 1.600610;
    const depth = 0.1;
    const geometry = new THREE.BoxBufferGeometry( width, height, depth);
    const cube = new THREE.Mesh( geometry, nuevoMeshPhysicalMaterial());
    cube.position.set(0,3.216545, -2.96344);
    auto.add(cube);
  }

  // Agrega el grupo auto a la escena
  scene.add(auto);

  class ColorGUIHelper {
    constructor(object, prop) {
      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
      this.object[this.prop].set(hexString);
    }
  }

  class DegRadHelper {
    constructor(obj, prop) {
      this.obj = obj;
      this.prop = prop;
    }
    get value() {
      return THREE.MathUtils.radToDeg(this.obj[this.prop]);
    }
    set value(v) {
      this.obj[this.prop] = THREE.MathUtils.degToRad(v);
    }
  }

  function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
    folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
    folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
    folder.open();
  }

  {
    const color = 0xFFFFFF;
    const intensity = 5;
    const width = 12;
    const height = 4;
    const light = new THREE.RectAreaLight(color, intensity, width, height);
    light.position.set(0, 10, 0);
    light.rotation.x = THREE.MathUtils.degToRad(-90);
    scene.add(light);

    const helper = new RectAreaLightHelper(light);
    light.add(helper);

    function updateLight() {
      helper.update();
    }

    const gui = new GUI();
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    gui.add(light, 'intensity', 0, 10, 0.01);
    gui.add(light, 'width', 0, 20).onChange(updateLight);
    gui.add(light, 'height', 0, 20).onChange(updateLight);
    gui.add(new DegRadHelper(light.rotation, 'x'), 'value', -180, 180).name('x rotation').onChange(updateLight);
    gui.add(new DegRadHelper(light.rotation, 'y'), 'value', -180, 180).name('y rotation').onChange(updateLight);
    gui.add(new DegRadHelper(light.rotation, 'z'), 'value', -180, 180).name('z rotation').onChange(updateLight);

    makeXYZGUI(gui, light.position, 'position', updateLight);
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render() {

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
