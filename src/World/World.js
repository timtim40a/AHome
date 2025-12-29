import { Color } from 'three/src/Three.Core.js'
import { createCamera } from './components/camera.js'
import { createCube, rotateCube } from './components/cube.js'
import { createScene } from './components/scene.js'

import { createRenderer } from './systems/renderer.js'
import { Resizer } from './systems/Resizer.js'
import { createLights } from './components/lights.js'
import { Loop } from './systems/Loop.js'

let camera
let scene
let renderer
let loop

class World {
    // 1. Create an instance of the World app
    constructor(container) {
        camera = createCamera()
        scene = createScene()
        renderer = createRenderer()
        loop = new Loop(camera, scene, renderer)
        container.append(renderer.domElement)

        const cube = createCube(2, 2, 2)

        const cube2 = createCube(1, 1, 1, new Color('coral'))
        cube2.position.x = 2

        const light = createLights()

        loop.updatables.push(cube, cube2)

        scene.add(cube, cube2, light)

        const resizer = new Resizer(container, camera, renderer)
    }

    // 2. Render the scene
    render() {
        renderer.render(scene, camera)
    }

    start() {
        loop.start()
    }

    stop() {
        loop.stop()
    }
}

export { World }
