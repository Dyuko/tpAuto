import * as THREE from './threejs/resources/threejs/r122/build/three.module.js';
import {OrbitControls} from './threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import {RectAreaLightUniformsLib} from './threejs/resources/threejs/r122/examples/jsm/lights/RectAreaLightUniformsLib.js';
import {RectAreaLightHelper} from './threejs/resources/threejs/r122/examples/jsm/helpers/RectAreaLightHelper.js';
import {GUI} from './threejs/../3rdparty/dat.gui.module.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});
  RectAreaLightUniformsLib.init();
  // Configuraciones iniciales de la cámara
  const fov = 45;
  const aspect = 2; 
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(-10, 10, 10);
  // OrbitControls
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();
  // Escena
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('skyblue');

  // Se crea el grupo auto, todo el grupo puede ser rotado, escalado 
  const auto = new THREE.Group();

  // Material de la Carrocería
  const materialCarroceria = new THREE.MeshPhysicalMaterial();
  let hue = Math.random(); const saturation = 1; const luminance = .5;
  materialCarroceria.color.setHSL(hue, saturation, luminance);
  // Material de Vidrios
  const materialVidrio = new THREE.MeshPhysicalMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3
  });
  hue = Math.random();
  materialVidrio.color.setHSL(hue, saturation, luminance);
  // Material del fondo del parachoques - Se ve por el hueco delantero
  const materialFondoParachoques = new THREE.MeshPhysicalMaterial();
  hue = Math.random();
  materialFondoParachoques.color.setHSL(hue, saturation, luminance);
  // Material para los faros
  const materialFaros = new THREE.MeshPhysicalMaterial();
  hue = Math.random();
  materialFaros.color.setHSL(hue, saturation, luminance);
  // Material para los neumáticos
  const materialNeumaticos = new THREE.MeshPhysicalMaterial();
  hue = Math.random();
  materialNeumaticos.color.setHSL(hue, saturation, luminance);
  // Material Llantas
  const materialLlantas = new THREE.MeshPhysicalMaterial();
  hue = Math.random();
  materialLlantas.color.setHSL(hue, saturation, luminance);
  // Material Asientos
  const materialAsientos = new THREE.MeshPhysicalMaterial();
  hue = Math.random();
  materialAsientos.color.setHSL(hue, saturation, luminance);
  // Material Volante
  const materialVolante = new THREE.MeshPhysicalMaterial();
  hue = Math.random();
  materialVolante.color.setHSL(hue, saturation, luminance);
  // Material alfombra
  const materialAlfombra = new THREE.MeshPhysicalMaterial({side: THREE.DoubleSide});
  hue = Math.random();
  materialAlfombra.color.setHSL(hue, saturation, luminance);

  // Piso de la escena - Carga una textura
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

  // Crea un nuevo cubo 
  function nuevoCube(material, {width, height, depth, positionX, positionY, positionZ, rotationX, rotationY, rotationZ}) {
    const geometry = new THREE.BoxBufferGeometry( width, height, depth);
    const cube = new THREE.Mesh( geometry, material);
    cube.position.set(positionX, positionY, positionZ);
    cube.rotation.set(rotationX, rotationY, rotationZ);
    auto.add(cube);
  }

  // Crea un nuevo cilindro
  function nuevoCylinder(material, {radiusTop, radiusBottom, height, radialSegments, positionX, positionY, positionZ, rotationX, rotationY, rotationZ}) {
    const geometry = new THREE.CylinderBufferGeometry(
      radiusTop, radiusBottom, height, radialSegments);
    const cylinder = new THREE.Mesh( geometry, material);
    cylinder.position.set(positionX, positionY, positionZ);
    cylinder.rotation.set(rotationX, rotationY, rotationZ);
    auto.add(cylinder);
  }

  // Crea un nuevo Torus (dona)
  function nuevoTorus(material, {radius, tube, radialSegments, tubularSegments, arc, positionX, positionY, positionZ, rotationX, rotationY, rotationZ}) {
    const geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc);
    const torus = new THREE.Mesh( geometry, material);
    torus.position.set(positionX, positionY, positionZ);
    torus.rotation.set(rotationX, rotationY, rotationZ);
    auto.add(torus);
  }

  // Crea un cubo pasandole sus ocho coordenadas
  /*
    6----7
    /|   /|
  2----3 |
  | |  | |
  | 4--|-5
  |/   |/
  0----1
  */
  function nuevoCubeIrregular(material, matrizCoordenadas) {
    const geometry = new THREE.Geometry();
    let i;
    for(i=0; i<=7; i++) {
      geometry.vertices.push(
        new THREE.Vector3(matrizCoordenadas[i][0], matrizCoordenadas[i][1],  matrizCoordenadas[i][2])
      );
    }
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
    const cube = new THREE.Mesh(geometry, material);
    auto.add(cube);
  }

  // Crea un nuevo Plano 2D
  function nuevoPlane(material, {width, height, positionX, positionY, positionZ, rotationX, rotationY, rotationZ}) {
    const geometry = new THREE.PlaneBufferGeometry(width, height);
    const plane= new THREE.Mesh( geometry, material);
    plane.position.set(positionX, positionY, positionZ);
    plane.rotation.set(rotationX, rotationY, rotationZ);
    auto.add(plane);
  }

  // Techo
  {
    const dims = {width:2.948957, height:0.1, depth:2.600055, positionX:0, positionY:6.54837, positionZ:-1.068131, rotationX:0, rotationY:0, rotationZ:0};
    nuevoCube(materialCarroceria, dims);
  }

  // Capo
  {
    const dims = {width:2.948957, height:0.1, depth:2.185710874138892, positionX:0, positionY:3.90355, positionZ:1.7934965, rotationX:0.0767945, rotationY:0, rotationZ:0};
    nuevoCube(materialCarroceria, dims);
  }

  // Chapería Lateral
  {
    // Parte trasera: Es un cubo Perfecto
    {
      // Izquierda
      const dims = {width:0.034, height:1.600610, depth:3.761848, positionX:-1.47448, positionY:3.216545, positionZ:-1.082516, rotationX:0, rotationY:0, rotationZ:0};
      nuevoCube(materialCarroceria, dims);
      // Derecha
      dims.positionX = dims.positionX * -1;
      nuevoCube(materialCarroceria, dims);
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
        nuevoCubeIrregular(materialCarroceria, matrizCoordenadas);
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
        nuevoCubeIrregular(materialCarroceria, matrizCoordenadas);    
      }
    }
  }

  // Piso
  {
    const dims = {width:2.948957, height:0.1, depth:5.841903, positionX:0, positionY:2.41624, positionZ:-0.04249, rotationX:0, rotationY:0, rotationZ:0};
    nuevoCube(materialCarroceria, dims);
  }

  // Parte trasera - Parachoques trasero
  {
    const dims = {width:2.948957, height:1.600610, depth:0.1, positionX:0, positionY:3.216545, positionZ:-2.96344, rotationX:0, rotationY:0, rotationZ:0};
    nuevoCube(materialCarroceria, dims);
  }

  // Parte trasera superior - Plano horizontal debajo del vidrio trasero
  {
    const dims = {width:2.948957, height:0.03, depth:0.6, positionX:0, positionY:4.016855, positionZ:-2.63307, rotationX:0, rotationY:0, rotationZ:0};
    nuevoCube(materialCarroceria, dims);
  }

  //Sujetadores de vidrios - Los marcos del vidrio
  {
    // Columnas verticales traseras
    {
      // Izquierda
      const dims = {width:0.088641, height:2.535097, depth:0.088641, positionX:-1.43016, positionY:5.28261, positionZ:-2.386775, rotationX:0, rotationY:0, rotationZ:0};
      nuevoCube(materialCarroceria, dims);
      // Derecha
      dims.positionX = dims.positionX * -1;
      nuevoCube(materialCarroceria, dims);
    }
    // Columnas verticales delanteras
    {
      // Izquierda
      const dims = {width:0.088641, height:2.577096, depth:0.088641, positionX:-1.43599, positionY:5.28261, positionZ:0.4827995, rotationX:-0.18, rotationY:0, rotationZ:0};
      nuevoCube(materialCarroceria, dims);
      // Derecha
      dims.positionX = dims.positionX * -1;
      nuevoCube(materialCarroceria, dims);
    }
    // Columnas horizontales traseras
    {
      // Inferior
      const dims = {width:2.948957, height:0.088641, depth:0.088641, positionX:0, positionY:4.03465, positionZ:-2.386775, rotationX:0, rotationY:0, rotationZ:0};
      nuevoCube(materialCarroceria, dims);
      // Superior
      dims.positionY = 6.54837;
      nuevoCube(materialCarroceria, dims);
    }
    // Columnas horizontales delanteras
    {
      // Inferior
      const dims = {width:2.948957, height:0.088641, depth:0.088641, positionX:0, positionY:4.03465, positionZ:0.7, rotationX:0, rotationY:0, rotationZ:0};
      nuevoCube(materialCarroceria, dims);
      // Superior
      dims.positionY = 6.54837;
      dims.positionZ = 0.245;
      nuevoCube(materialCarroceria, dims);
    }
    //Columna horizontal lateral inferior
    {
      // Izquierda
      const dims = {width:0.088641, height:0.088641, depth:3.1, positionX:-1.43599, positionY:4.03465, positionZ:-0.851201, rotationX:0, rotationY:0, rotationZ:0};
      nuevoCube(materialCarroceria, dims);
      // Derecha
      dims.positionX = dims.positionX * -1;
      nuevoCube(materialCarroceria, dims);
    } 
  }
  // Vidrios
  {
    // Vidrio trasero
    {
      const dims = {width:2.791871, height:2.435868, depth:0.05, positionX:0.00583, positionY:5.264985, positionZ:-2.36688, rotationX:0, rotationY:0, rotationZ:0};
      nuevoCube(materialVidrio, dims);
    }
    // Vidrio delantero
    {
      const dims = {width:2.791871, height:2.58, depth:0.05, positionX:0.00583, positionY:5.253615, positionZ:0.4706235, rotationX:-0.175, rotationY:0, rotationZ:0};
      nuevoCube(materialVidrio, dims);
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
      nuevoCubeIrregular(materialVidrio, matrizCoordenadas);    
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
      nuevoCubeIrregular(materialVidrio, matrizCoordenadas);    
    }

    // Base Plano Parachoques - Se ve a través del hueco delantero
    {
      const dims = {width:2.948957, height:1.374007, positionX:0, positionY:3.103245, positionZ:2.77932, rotationX:0, rotationY:0, rotationZ:0};
      nuevoPlane(materialFondoParachoques, dims);
    }
    // Parachoques: Está compuesto de varios cubos
    {
      // Bajo los faros
      {
        const dims = {width:0.885046, height:1.374007, depth:0.1, positionX:1.0319565, positionY:3.103245, positionZ:2.83, rotationX:0, rotationY:0, rotationZ:0};
        nuevoCube(materialCarroceria, dims);
        dims.positionX = dims.positionX * -1;
        nuevoCube(materialCarroceria, dims);
      }
      // En el medio
      { 
        const dims = {width:1.178865, height:0.336341, depth:0.1, positionX:0, positionY:3.62208, positionZ:2.83, rotationX:0, rotationY:0, rotationZ:0};
        nuevoCube(materialCarroceria, dims);
        dims.positionY = 2.667755;
        dims.height = 0.503162;
        nuevoCube(materialCarroceria, dims);  
      }
      {
        const dims = {width:1.178865, height:0.080768, depth:0.1, positionX:0, positionY:3.304105, positionZ:2.83, rotationX:0, rotationY:0, rotationZ:0};
        nuevoCube(materialCarroceria, dims);     
        dims.positionY = 3.089025;
        nuevoCube(materialCarroceria, dims);
      }
    }
  }
  // Faros
  {
    // Derecho
    const dims = {radiusTop:0.285, radiusBottom:0.285, height: 0.14, radialSegments: 50, positionX: 1.02, positionY: 3.16157, positionZ: 2.89718, rotationX:1.5708, rotationY:0, rotationZ:0};
    nuevoCylinder(materialFaros, dims);
    // Izquierdo
    dims.positionX = dims.positionX * -1;
    nuevoCylinder(materialFaros, dims);
  }
  // Neumáticos
  {
    // Delanteras
    {
      // Izquierda
      const dims = {radiusTop:0.34, radiusBottom:0.34, height: 0.31, radialSegments: 50, positionX: -1.496305, positionY: 2.371045, positionZ: 1.10043, rotationX:0, rotationY:0, rotationZ:1.5708};
      nuevoCylinder(materialNeumaticos, dims);
      // Derecha
      dims.positionX = dims.positionX * -1;
      nuevoCylinder(materialNeumaticos, dims);
    }
    // Traseras
    {
      // Izquierda
      const dims = {radiusTop:0.34, radiusBottom:0.34, height: 0.31, radialSegments: 50, positionX: -1.496305, positionY: 2.371045, positionZ: -2.20148, rotationX:0, rotationY:0, rotationZ:1.5708};
      nuevoCylinder(materialNeumaticos, dims);
      // Derecha
      dims.positionX = dims.positionX * -1;
      nuevoCylinder(materialNeumaticos, dims);
    }
  }
  // Llantas
  {
    // Delanteras
    {
      // Izquierda
      const dims = {radiusTop:0.195, radiusBottom:0.195, height: 0.18, radialSegments: 50, positionX: -1.56489, positionY: 2.373645, positionZ: 1.10043, rotationX:0, rotationY:0, rotationZ:1.5708};
      nuevoCylinder(materialLlantas, dims);
      // Derecha
      dims.positionX = dims.positionX * -1;
      nuevoCylinder(materialLlantas, dims);
    }
    // Traseras
    {
      // Izquierda
      const dims = {radiusTop:0.195, radiusBottom:0.195, height: 0.18, radialSegments: 50, positionX: -1.56489, positionY: 2.373645, positionZ: -2.20148, rotationX:0, rotationY:0, rotationZ:1.5708};
      nuevoCylinder(materialLlantas, dims);
      // Derecha
      dims.positionX = dims.positionX * -1;
      nuevoCylinder(materialLlantas, dims);
    }
  }

  // Guardafangos
  {
    //Traseros
    {
      // Izquierda
      const dims = {radius:0.4, tube:0.13, radialSegments:10, tubularSegments:13, arc:3.1, positionX:-1.56489, positionY:2.373645, positionZ:-2.20148, rotationX:0, rotationY:1.5708, rotationZ:0};
      nuevoTorus(materialCarroceria, dims);
      // Derecha
      dims.positionX = dims.positionX * -1;
      nuevoTorus(materialCarroceria, dims);
    }
    // Delanteros
    {
      // Izquierda
      const dims = {radius:0.4, tube:0.13, radialSegments:10, tubularSegments:13, arc:3.1, positionX:-1.56489, positionY:2.373645, positionZ:1.10043, rotationX:0, rotationY:1.5708, rotationZ:0};
      nuevoTorus(materialCarroceria, dims);
      // Derecha
      dims.positionX = dims.positionX * -1;
      nuevoTorus(materialCarroceria, dims);
    }
  }

  // Asiento derecho
    {
    // Espalda
    {
      const dims = {width:1.263832, height:2.16, depth:0.2928, positionX:0.6419, positionY:4.13126, positionZ:-0.990024, rotationX:0, rotationY:0, rotationZ:0};
      nuevoCube(materialAsientos, dims);
    }
    // Trasero
    {
      const dims = {width:1.263832, height:0.4, depth:1.33, positionX:0.6419, positionY:3.25804, positionZ:-0.4714465, rotationX:0, rotationY:0, rotationZ:0};
      nuevoCube(materialAsientos, dims);
    }
    // Portabrazos
    {
      // Derecha
      const dims = {width:0.1931, height:0.7, depth:1.2, positionX:1.181645, positionY:3.47, positionZ:-0.50, rotationX:0, rotationY:0, rotationZ:0};
      nuevoCube(materialAsientos, dims);
      // Izquierda
      dims.positionX = 0.1042;
      nuevoCube(materialAsientos, dims);
    }
  }
  // Asiento izquierdo
  {
    // Espalda
    {
      const dims = {width:1.263832, height:2.16, depth:0.2928, positionX:-0.6419, positionY:4.13126, positionZ:-0.990024, rotationX:0, rotationY:0, rotationZ:0};
      nuevoCube(materialAsientos, dims);
    }
    // Trasero
    {
      const dims = {width:1.263832, height:0.4, depth:1.33, positionX:-0.6419, positionY:3.25804, positionZ:-0.4714465, rotationX:0, rotationY:0, rotationZ:0};
      nuevoCube(materialAsientos, dims);
    }
    // Portabrazos
    {
      // Derecha
      const dims = {width:0.1931, height:0.7, depth:1.2, positionX:-1.181645, positionY:3.47, positionZ:-0.50, rotationX:0, rotationY:0, rotationZ:0};
      nuevoCube(materialAsientos, dims);
      // Izquierda
      dims.positionX = -0.1042;
      nuevoCube(materialAsientos, dims);
    }
  }
  //Volante
  {
    // Torus
    {
      const dims = {radius:0.3, tube:0.05, radialSegments:10, tubularSegments:20, arc:6.3, positionX:0.830285, positionY:3.99368, positionZ:0.356679, rotationX:0, rotationY:0, rotationZ:0};
      nuevoTorus(materialVolante, dims);      
    }
    // La "Y" del volante
    {
      {
        const dims = {width:0.11, height:0.32, depth:0.02, positionX:0.9, positionY:4.081625, positionZ:0.3538985, rotationX:0, rotationY:0, rotationZ:-0.78};
        nuevoCube(materialVolante, dims);
      }
      {
        const dims = {width:0.11, height:0.32, depth:0.02, positionX:0.75, positionY:4.081625, positionZ:0.3538985, rotationX:0, rotationY:0, rotationZ:0.78};
        nuevoCube(materialVolante, dims);
      }
      {
        const dims = {width:0.11, height:0.32, depth:0.02, positionX:0.75, positionY:4.081625, positionZ:0.3538985, rotationX:0, rotationY:0, rotationZ:0.78};
        nuevoCube(materialVolante, dims);
      }
      {
        const dims = {width:0.11, height:0.32, depth:0.02, positionX:0.830285, positionY:3.9, positionZ:0.3538985, rotationX:0, rotationY:0, rotationZ:0};
        nuevoCube(materialVolante, dims);
      }
    }
    // El tronco
    {
      const dims = {width:0.06, height:0.06, depth:0.35, positionX:0.830285, positionY:4, positionZ:0.55, rotationX:0.2, rotationY:0, rotationZ:0};
      nuevoCube(materialVolante, dims);
    }
  }

  // Alfombra
  {
    const dims = {width:2.948957, height:5.841903, positionX:0, positionY:2.85, positionZ:-0.04249, rotationX:1.5708, rotationY:0, rotationZ:0};
    nuevoPlane(materialAlfombra,dims);
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

  function handleColorChange( color ) {

    return function ( value ) {

      if ( typeof value === 'string' ) {

        value = value.replace( '#', '0x' );

      }

      color.setHex( value );

    };

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
      const folder = gui.addFolder('Cámara: Fov, Near, Far');
      folder.add(camera, 'fov', 1, 180).onChange(updateCamera);
      const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
      folder.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
      folder.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera);
    }

    
    // Folder Parámetros de la fuente de luz
    {
      const folder = gui.addFolder('Luz: Color, Intensity, Width, Height');
      folder.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
      folder.add(light, 'intensity', 0, 10, 0.01);
      folder.add(light, 'width', 0, 50).onChange(updateLight);
      folder.add(light, 'height', 0, 50).onChange(updateLight);
    }

    // Folder Posición de la Fuente de Luz
    {
      const folder = gui.addFolder('Luz: Posición x, y, z');
      folder.add(light.position, 'x', -30, 30).onChange(updateLight);
      folder.add(light.position, 'y', -100, 100).onChange(updateLight);
      folder.add(light.position, 'z', -30, 30).onChange(updateLight);
    }

    // Folder Rotación de la fuente de Luz
    {
      const folder = gui.addFolder('Luz: Rotación x, y, z');
      folder.add(new DegRadHelper(light.rotation, 'x'), 'value', -180, 180).name('Rotación en x').onChange(updateLight);
      folder.add(new DegRadHelper(light.rotation, 'y'), 'value', -180, 180).name('Rotación en y').onChange(updateLight);
      folder.add(new DegRadHelper(light.rotation, 'z'), 'value', -180, 180).name('Rotación en z').onChange(updateLight);
    }

    // Folder Posición del auto
    {
      const folder = gui.addFolder('Auto: Posición x, y, z');
      folder.add(new DegRadHelper(auto.position, 'x'), 'value', -180, 180).name('Posición x').onChange(updateLight);
      folder.add(new DegRadHelper(auto.position, 'y'), 'value', -180, 180).name('Posición y').onChange(updateLight);
      folder.add(new DegRadHelper(auto.position, 'z'), 'value', -180, 180).name('Posición z').onChange(updateLight);
    }

    // Folder Rotación del auto
    {
      const folder = gui.addFolder('Auto: Rotación x, y, z');
      folder.add(new DegRadHelper(auto.rotation, 'x'), 'value', -180, 180).name('Rotación en x').onChange(updateLight);
      folder.add(new DegRadHelper(auto.rotation, 'y'), 'value', -180, 180).name('Rotación en y').onChange(updateLight);
      folder.add(new DegRadHelper(auto.rotation, 'z'), 'value', -180, 180).name('Rotación en z').onChange(updateLight);
    }

    // Folder Material Carrocería
    {
      const folder = gui.addFolder( 'Carrocería: Propiedades del Material' );

      folder.add( materialCarroceria, 'transparent' );
      folder.add( materialCarroceria, 'opacity', 0, 1 ).step( 0.01 );
      folder.add( materialCarroceria, 'depthTest' );
      folder.add( materialCarroceria, 'depthWrite' );
      folder.add( materialCarroceria, 'visible' );

      const data = {
        color: materialCarroceria.color.getHex(),
        emissive: materialCarroceria.emissive.getHex()
      };

      folder.addColor( data, 'color' ).onChange( handleColorChange( materialCarroceria.color ) );
      folder.addColor( data, 'emissive' ).onChange( handleColorChange( materialCarroceria.emissive ) );

      folder.add( materialCarroceria, 'roughness', 0, 1 );
      folder.add( materialCarroceria, 'metalness', 0, 1 );
      folder.add( materialCarroceria, 'reflectivity', 0, 1 );
      folder.add( materialCarroceria, 'clearcoat', 0, 1 ).step( 0.01 );
      folder.add( materialCarroceria, 'clearcoatRoughness', 0, 1 ).step( 0.01 );
      folder.add( materialCarroceria, 'wireframe' );
      folder.add( materialCarroceria, 'wireframeLinewidth', 0, 10 );
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
