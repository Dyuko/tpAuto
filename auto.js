import * as THREE from './threejs/resources/threejs/r122/build/three.module.js';
import {OrbitControls} from './threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import {RectAreaLightUniformsLib} from './threejs/resources/threejs/r122/examples/jsm/lights/RectAreaLightUniformsLib.js';
import {RectAreaLightHelper} from './threejs/resources/threejs/r122/examples/jsm/helpers/RectAreaLightHelper.js';
import {GUI} from './threejs/../3rdparty/dat.gui.module.js';

function main() {
  // Medidas globales del auto
  const anchoAuto = 2.948957;
  const anchoColumnaSujetaVidrio = 0.088641;

  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});
  RectAreaLightUniformsLib.init();

  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(-10, 10, 10);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('black');

  // Se crea el grupo auto, todo el grupo puede ser rotado, escalado 
  const auto = new THREE.Group();

  // Modulo: Piso de la escena
  {
    const planeSize = 40;

    const loader = new THREE.TextureLoader();
    const texture = loader.load('./threejs/resources/images/piso.jpg');
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
    mesh.position.set(0,2.03124,0);
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

  function nuevoMeshPhysicalMaterialVidrio() {
    const material = new THREE.MeshPhysicalMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3

    });
    return material;
  }

  function nuevoCube({width, height, depth, positionX, positionY, positionZ, rotationX, rotationY, rotationZ, booleanVidrio= false}) {
    const geometry = new THREE.BoxBufferGeometry( width, height, depth);
    let cube;
    if(booleanVidrio) {
      cube = new THREE.Mesh( geometry, nuevoMeshPhysicalMaterialVidrio());
    }
    else
    {
      cube = new THREE.Mesh( geometry, nuevoMeshPhysicalMaterial());
    }
    cube.position.set(positionX, positionY, positionZ);
    cube.rotation.set(rotationX, rotationY, rotationZ);
    auto.add(cube);
  }

  function nuevoCylinder({radiusTop, radiusBottom, height, radialSegments, positionX, positionY, positionZ, rotationX, rotationY, rotationZ, booleanVidrio= false}) {
    const geometry = new THREE.CylinderBufferGeometry(
      radiusTop, radiusBottom, height, radialSegments);
    let cylinder;
    if(booleanVidrio) {
      cylinder = new THREE.Mesh( geometry, nuevoMeshPhysicalMaterialVidrio());
    }
    else
    {
      cylinder = new THREE.Mesh( geometry, nuevoMeshPhysicalMaterial());
    }
    cylinder.position.set(positionX, positionY, positionZ);
    cylinder.rotation.set(rotationX, rotationY, rotationZ);
    auto.add(cylinder);
  }

  function nuevoTorus({radius, tube, radialSegments, tubularSegments, arc, positionX, positionY, positionZ, rotationX, rotationY, rotationZ, booleanVidrio= false}) {
    const geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc);
    let cylinder;
    if(booleanVidrio) {
      cylinder = new THREE.Mesh( geometry, nuevoMeshPhysicalMaterialVidrio());
    }
    else
    {
      cylinder = new THREE.Mesh( geometry, nuevoMeshPhysicalMaterial());
    }
    cylinder.position.set(positionX, positionY, positionZ);
    cylinder.rotation.set(rotationX, rotationY, rotationZ);
    auto.add(cylinder);
  }

  //https://threejsfundamentals.org/threejs/lessons/threejs-custom-geometry.html
  function nuevoCubeIrregular(matrizCoordenadas, booleanVidrio=false) {
    const geometry = new THREE.Geometry();
    let i;
    for(i=0; i<=7; i++) {
      geometry.vertices.push(
        new THREE.Vector3(matrizCoordenadas[i][0], matrizCoordenadas[i][1],  matrizCoordenadas[i][2])
      );
    }
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
    let cube;
    if(booleanVidrio) {
      cube = new THREE.Mesh(geometry, nuevoMeshPhysicalMaterialVidrio());
    }
    else {
      cube = new THREE.Mesh(geometry, nuevoMeshPhysicalMaterial());
    }
    auto.add(cube);

  }

  function nuevoPlane({width, height, positionX, positionY, positionZ, rotationX, rotationY, rotationZ, booleanVidrio= false}) {
    const geometry = new THREE.PlaneBufferGeometry(width, height);
    let plane;
    if(booleanVidrio) { 
      plane = new THREE.Mesh( geometry, nuevoMeshPhysicalMaterialVidrio());
    }
    else
    {
      plane = new THREE.Mesh( geometry, nuevoMeshPhysicalMaterial());
    }
    plane.position.set(positionX, positionY, positionZ);
    plane.rotation.set(rotationX, rotationY, rotationZ);
    auto.add(plane);
  }

  // Techo
  {
    const dims = {width:anchoAuto, height:0.1, depth:2.600055, positionX:0, positionY:6.54837, positionZ:-1.068131, rotationX:0, rotationY:0, rotationZ:0};
    nuevoCube(dims);
  }

  // Capo
  {
    const dims = {width:anchoAuto, height:0.1, depth:2.185710874138892, positionX:0, positionY:3.90355, positionZ:1.7934965, rotationX:0.0767945, rotationY:0, rotationZ:0};
    nuevoCube(dims);
  }

  // Chapería Lateral
  {
    // Parte trasera: Es un cubo Perfecto
    {
      // Izquierda
      const dims = {width:0.034, height:1.600610, depth:3.761848, positionX:-1.47448, positionY:3.216545, positionZ:-1.082516, rotationX:0, rotationY:0, rotationZ:0};
      nuevoCube(dims);
      // Derecha
      dims.positionX = dims.positionX * -1;
      nuevoCube(dims);
    }
    // Parte delantera: Es un cubo irregular
    {
      //Izquierda
      {
        const matrizCoordenadas = [
                              [-1.47448, 2.41624,  2.87846],
                              [-1.3975, 2.41624,  2.87846],
                              [-1.47448, 3.79025,  2.87846],
                              [-1.3975,  3.79025,  2.87846],
                              [-1.47448, 2.41624, 0.798408],
                              [-1.3975, 2.41624, 0.798408],
                              [-1.47448,  4.01685, 0.798408],
                              [-1.3975,  4.01685, 0.798408]
                            ];
        nuevoCubeIrregular(matrizCoordenadas);
      }
      // Derecha
      {
        const matrizCoordenadas = [
                              [1.3975, 2.41624,  2.87846],  // 0
                              [1.47448, 2.41624,  2.87846],  // 1
                              [1.3975,  3.79025,  2.87846],  // 2
                              [1.47448, 3.79025,  2.87846],  // 3
                              [1.3975, 2.41624, 0.798408],  // 4
                              [1.47448, 2.41624, 0.798408],  // 5
                              [1.3975,  4.01685, 0.798408],  // 6
                              [1.47448,  4.01685, 0.798408]  // 7
                            ];
        nuevoCubeIrregular(matrizCoordenadas);    
      }
    }
  }

  // Piso
  {
    const dims = {width:anchoAuto, height:0.1, depth:5.841903, positionX:0, positionY:2.41624, positionZ:-0.04249, rotationX:0, rotationY:0, rotationZ:0};
    nuevoCube(dims);
  }

  // Parte trasera
  {
    const dims = {width:anchoAuto, height:1.600610, depth:0.1, positionX:0, positionY:3.216545, positionZ:-2.96344, rotationX:0, rotationY:0, rotationZ:0};
    nuevoCube(dims);
  }

  // Parte trasera superior
  {
    const dims = {width:anchoAuto, height:0.03, depth:0.6, positionX:0, positionY:4.016855, positionZ:-2.63307, rotationX:0, rotationY:0, rotationZ:0};
    nuevoCube(dims);
  }

  //Sujetadores de vidrios
  // Columnas verticales traseras
  {
    // Izquierda
    const dims = {width:anchoColumnaSujetaVidrio, height:2.535097, depth:anchoColumnaSujetaVidrio, positionX:-1.43016, positionY:5.28261, positionZ:-2.386775, rotationX:0, rotationY:0, rotationZ:0};
    nuevoCube(dims);
    // Derecha
    dims.positionX = dims.positionX * -1;
    nuevoCube(dims);
  }
  // Columnas verticales delanteras
  {
    // Izquierda
    const dims = {width:anchoColumnaSujetaVidrio, height:2.577096, depth:anchoColumnaSujetaVidrio, positionX:-1.43599, positionY:5.28261, positionZ:0.4827995, rotationX:-0.18, rotationY:0, rotationZ:0};
    nuevoCube(dims);
    // Derecha
    dims.positionX = dims.positionX * -1;
    nuevoCube(dims);
  }
  // Columnas horizontales traseras
  {
    // Inferior
    const dims = {width:anchoAuto, height:anchoColumnaSujetaVidrio, depth:anchoColumnaSujetaVidrio, positionX:0, positionY:4.03465, positionZ:-2.386775, rotationX:0, rotationY:0, rotationZ:0};
    nuevoCube(dims);
    // Superior
    dims.positionY = 6.54837;
    nuevoCube(dims);
  }
  // Columnas horizontales delanteras
  {
    // Inferior
    const dims = {width:anchoAuto, height:anchoColumnaSujetaVidrio, depth:anchoColumnaSujetaVidrio, positionX:0, positionY:4.03465, positionZ:0.7, rotationX:0, rotationY:0, rotationZ:0};
    nuevoCube(dims);
    // Superior
    dims.positionY = 6.54837;
    dims.positionZ = 0.245;
    nuevoCube(dims);
  }
  //Columna horizontal lateral inferior
  {
    // Izquierda
    const dims = {width:anchoColumnaSujetaVidrio, height:anchoColumnaSujetaVidrio, depth:3.1, positionX:-1.43599, positionY:4.03465, positionZ:-0.851201, rotationX:0, rotationY:0, rotationZ:0};
    nuevoCube(dims);
    // Derecha
    dims.positionX = dims.positionX * -1;
    nuevoCube(dims);
  } 

  // Vidrios
  {
    // Vidrio trasero
    {
      const dims = {width:2.791871, height:2.435868, depth:0.05, positionX:0.00583, positionY:5.264985, positionZ:-2.36688, rotationX:0, rotationY:0, rotationZ:0, booleanVidrio:true};
      nuevoCube(dims);
    }
    // Vidrio delantero
    {
      const dims = {width:2.791871, height:2.58, depth:0.05, positionX:0.00583, positionY:5.253615, positionZ:0.4706235, rotationX:-0.175, rotationY:0, rotationZ:0, booleanVidrio:true};
      nuevoCube(dims);
    }
    // Vidrio izquierdo
    {
      const matrizCoordenadas = [
        [-1.40164, 4.05245,  0.708534],  // 0
        [-1.47460, 4.05245,  0.708534],  // 1

        [-1.40164, 6.5,  0.24],  // 2
        [-1.47460, 6.5,  0.24],  // 3

        [-1.40164, 4.05245, -2.40378],  // 4
        [-1.47460, 4.05245, -2.40378],  // 5

        [-1.40164,  6.5, -2.40378],  // 6
        [-1.47460,  6.5, -2.40378]  // 7
      ];
      nuevoCubeIrregular(matrizCoordenadas, true);    
    }
    // Vidrio derecho
    {
      const matrizCoordenadas = [
        [1.40164, 4.05245,  0.708534],  // 0
        [1.47460, 4.05245,  0.708534],  // 1

        [1.40164, 6.5,  0.24],  // 2
        [1.47460, 6.5,  0.24],  // 3

        [1.40164, 4.05245, -2.40378],  // 4
        [1.47460, 4.05245, -2.40378],  // 5

        [1.40164,  6.5, -2.40378],  // 6
        [1.47460,  6.5, -2.40378]  // 7
      ];
      nuevoCubeIrregular(matrizCoordenadas, true);    
    }

    // Base Plano Parachoques
    {
      const dims = {width:anchoAuto, height:1.374007, positionX:0, positionY:3.103245, positionZ:2.77932, rotationX:0, rotationY:0, rotationZ:0};
      nuevoPlane(dims);
    }
    // Parachoques: Está compuesto de varios cubos
    {
      // Bajo los faros
      {
        const dims = {width:0.885046, height:1.374007, depth:0.1, positionX:1.0319565, positionY:3.103245, positionZ:2.83, rotationX:0, rotationY:0, rotationZ:0};
        nuevoCube(dims);
        dims.positionX = dims.positionX * -1;
        nuevoCube(dims);
      }
      // En el medio
      { 
        const dims = {width:1.178865, height:0.336341, depth:0.1, positionX:0, positionY:3.62208, positionZ:2.83, rotationX:0, rotationY:0, rotationZ:0};
        nuevoCube(dims);
        dims.positionY = 2.667755;
        dims.height = 0.503162;
        nuevoCube(dims);    
      }
      {
        const dims = {width:1.178865, height:0.080768, depth:0.1, positionX:0, positionY:3.304105, positionZ:2.83, rotationX:0, rotationY:0, rotationZ:0};
        nuevoCube(dims);     
        dims.positionY = 3.089025;
        nuevoCube(dims); 
      }
    }
  }
  // Faros
  {
    // Derecho
    const dims = {radiusTop:0.285, radiusBottom:0.285, height: 0.14, radialSegments: 50, positionX: 1.02, positionY: 3.16157, positionZ: 2.89718, rotationX:1.5708, rotationY:0, rotationZ:0};
    nuevoCylinder(dims);
    dims.positionX = dims.positionX * -1;
    nuevoCylinder(dims);
  }
  // Neumáticos
  {
    // Delanteras
    {
      // Izquierda
      const dims = {radiusTop:0.34, radiusBottom:0.34, height: 0.31, radialSegments: 50, positionX: -1.496305, positionY: 2.371045, positionZ: 1.10043, rotationX:0, rotationY:0, rotationZ:1.5708};
      nuevoCylinder(dims);
      // Derecha
      dims.positionX = dims.positionX * -1;
      nuevoCylinder(dims);
    }
    // Traseras
    {
      // Izquierda
      const dims = {radiusTop:0.34, radiusBottom:0.34, height: 0.31, radialSegments: 50, positionX: -1.496305, positionY: 2.371045, positionZ: -2.20148, rotationX:0, rotationY:0, rotationZ:1.5708};
      nuevoCylinder(dims);
      // Derecha
      dims.positionX = dims.positionX * -1;
      nuevoCylinder(dims);
    }
  }
  // Llantas
  {
    // Delanteras
    {
      // Izquierda
      const dims = {radiusTop:0.195, radiusBottom:0.195, height: 0.18, radialSegments: 50, positionX: -1.56489, positionY: 2.373645, positionZ: 1.10043, rotationX:0, rotationY:0, rotationZ:1.5708};
      nuevoCylinder(dims);
      // Derecha
      dims.positionX = dims.positionX * -1;
      nuevoCylinder(dims);
    }
    // Traseras
    {
      // Izquierda
      const dims = {radiusTop:0.195, radiusBottom:0.195, height: 0.18, radialSegments: 50, positionX: -1.56489, positionY: 2.373645, positionZ: -2.20148, rotationX:0, rotationY:0, rotationZ:1.5708};
      nuevoCylinder(dims);
      // Derecha
      dims.positionX = dims.positionX * -1;
      nuevoCylinder(dims);
    }
  }

  // Guardafangos
  {
    //Traseros
    {
      // Izquierda
      const dims = {radius:0.4, tube:0.13, radialSegments:10, tubularSegments:13, arc:3.1, positionX:-1.56489, positionY:2.373645, positionZ:-2.20148, rotationX:0, rotationY:1.5708, rotationZ:0};
      nuevoTorus(dims);
      // Derecha
      dims.positionX = dims.positionX * -1;
      nuevoTorus(dims);
    }
    // Delanteros
    {
      // Izquierda
      const dims = {radius:0.4, tube:0.13, radialSegments:10, tubularSegments:13, arc:3.1, positionX:-1.56489, positionY:2.373645, positionZ:1.10043, rotationX:0, rotationY:1.5708, rotationZ:0};
      nuevoTorus(dims);
      // Derecha
      dims.positionX = dims.positionX * -1;
      nuevoTorus(dims);
    }
  }

  // Asiento derecho
    {
    // Espalda
    {
      const dims = {width:1.263832, height:2.16, depth:0.2928, positionX:0.6419, positionY:4.13126, positionZ:-0.990024, rotationX:0, rotationY:0, rotationZ:0};
      nuevoCube(dims);
    }
    // Trasero
    {
      const dims = {width:1.263832, height:0.4, depth:1.33, positionX:0.6419, positionY:3.25804, positionZ:-0.4714465, rotationX:0, rotationY:0, rotationZ:0};
      nuevoCube(dims);
    }
    // Portabrazos
    {
      // Derecha
      const dims = {width:0.1931, height:0.7, depth:1.2, positionX:1.181645, positionY:3.47, positionZ:-0.50, rotationX:0, rotationY:0, rotationZ:0};
      nuevoCube(dims);
      // Izquierda
      dims.positionX = 0.1042;
      nuevoCube(dims);
    }
  }
  // Asiento izquierdo
  {
    // Espalda
    {
      const dims = {width:1.263832, height:2.16, depth:0.2928, positionX:-0.6419, positionY:4.13126, positionZ:-0.990024, rotationX:0, rotationY:0, rotationZ:0};
      nuevoCube(dims);
    }
    // Trasero
    {
      const dims = {width:1.263832, height:0.4, depth:1.33, positionX:-0.6419, positionY:3.25804, positionZ:-0.4714465, rotationX:0, rotationY:0, rotationZ:0};
      nuevoCube(dims);
    }
    // Portabrazos
    {
      // Derecha
      const dims = {width:0.1931, height:0.7, depth:1.2, positionX:-1.181645, positionY:3.47, positionZ:-0.50, rotationX:0, rotationY:0, rotationZ:0};
      nuevoCube(dims);
      // Izquierda
      dims.positionX = -0.1042;
      nuevoCube(dims);
    }
  }
  //Volante
  {
    // Torus
    {
      const dims = {radius:0.3, tube:0.05, radialSegments:10, tubularSegments:20, arc:6.3, positionX:0.830285, positionY:3.99368, positionZ:0.356679, rotationX:0, rotationY:0, rotationZ:0};
      nuevoTorus(dims);      
    }
    // La "Y" del volante
    {
      {
        const dims = {width:0.11, height:0.32, depth:0.02, positionX:0.9, positionY:4.081625, positionZ:0.3538985, rotationX:0, rotationY:0, rotationZ:-0.78};
        nuevoCube(dims);
      }
      {
        const dims = {width:0.11, height:0.32, depth:0.02, positionX:0.75, positionY:4.081625, positionZ:0.3538985, rotationX:0, rotationY:0, rotationZ:0.78};
        nuevoCube(dims);
      }
      {
        const dims = {width:0.11, height:0.32, depth:0.02, positionX:0.75, positionY:4.081625, positionZ:0.3538985, rotationX:0, rotationY:0, rotationZ:0.78};
        nuevoCube(dims);
      }
      {
        const dims = {width:0.11, height:0.32, depth:0.02, positionX:0.830285, positionY:3.9, positionZ:0.3538985, rotationX:0, rotationY:0, rotationZ:0};
        nuevoCube(dims);
      }
    }
    // El tronco
    {
      const dims = {width:0.06, height:0.06, depth:0.35, positionX:0.830285, positionY:4, positionZ:0.55, rotationX:0.2, rotationY:0, rotationZ:0};
      nuevoCube(dims);
    }
  }

  // Alfombra
  {
    const dims = {width:anchoAuto, height:5.841903, positionX:0, positionY:2.85, positionZ:-0.04249, rotationX:1.5708, rotationY:0, rotationZ:0};
    nuevoPlane(dims);
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

  // MinMaxGUIHelperpara el near y far
  class MinMaxGUIHelper {
    constructor(obj, minProp, maxProp, minDif) {
      this.obj = obj;
      this.minProp = minProp;
      this.maxProp = maxProp;
      this.minDif = minDif;
    }
    get min() {
      return this.obj[this.minProp];
    }
    set min(v) {
      this.obj[this.minProp] = v;
      this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
    }
    get max() {
      return this.obj[this.maxProp];
    }
    set max(v) {
      this.obj[this.maxProp] = v;
      this.min = this.min;  // esto llamará al min setter
    }
  }

  function updateCamera() {
    camera.updateProjectionMatrix();
  }

  {
    const color = 0xFFFFFF;
    const intensity = 2.04;
    const width = 20;
    const height = 20;
    const light = new THREE.RectAreaLight(color, intensity, width, height);
    light.position.set(0, 13, 0);
    light.rotation.x = THREE.MathUtils.degToRad(-90);
    scene.add(light);

    const helper = new RectAreaLightHelper(light);
    light.add(helper);

    function updateLight() {
      helper.update();
    }

    const gui = new GUI();
    // Folder Parámetros de la Cámara
    {
      const folder = gui.addFolder('Parámetros de la Cámara');
      folder.add(camera, 'fov', 1, 180).onChange(updateCamera);
      const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
      folder.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
      folder.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera);
    }

    
    // Folder Parámetros de la fuente de luz
    {
      const folder = gui.addFolder('Parámetros de la Fuente de Luz');
      folder.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
      folder.add(light, 'intensity', 0, 10, 0.01);
      folder.add(light, 'width', 0, 50).onChange(updateLight);
      folder.add(light, 'height', 0, 50).onChange(updateLight);
      //folder.open();
    }

    // Folder Rotación de la fuente de Luz
    {
      const folder = gui.addFolder('Rotación de la Fuente de Luz');
      folder.add(new DegRadHelper(light.rotation, 'x'), 'value', -180, 180).name('x rotation').onChange(updateLight);
      folder.add(new DegRadHelper(light.rotation, 'y'), 'value', -180, 180).name('y rotation').onChange(updateLight);
      folder.add(new DegRadHelper(light.rotation, 'z'), 'value', -180, 180).name('z rotation').onChange(updateLight);
      //folder.open();
    }

    // Folder Posición de la Fuente de Luz
    {
      const folder = gui.addFolder('Posición de la Fuente de Luz');
      folder.add(light.position, 'x', -30, 30).onChange(updateLight);
      folder.add(light.position, 'y', -100, 100).onChange(updateLight);
      folder.add(light.position, 'z', -30, 30).onChange(updateLight);
      //folder.open();
    }
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
