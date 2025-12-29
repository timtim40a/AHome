import { Color } from 'three'
import { createCamera } from './components/camera.js'
import { createCameraControls } from './components/cameraControls.js'
import { createCube, rotateCube } from './components/cube.js'
import { createScene } from './components/scene.js'

import { createRenderer } from './systems/renderer.js'
import { Resizer } from './systems/Resizer.js'
import { createLights } from './components/lights.js'
import { Loop } from './systems/Loop.js'
import { createPyramidRoof } from './components/pyramidRoof.js'
import { createWindows } from './components/windows.js'
import { createFlatRoof } from './components/flatRoof.js'

let camera
let scene
let renderer
let loop
let houses = [] // Array to track generated houses
let controls // Camera controls

class World {
    // 1. Create an instance of the World app
    constructor(container) {
        camera = createCamera()
        scene = createScene()
        renderer = createRenderer()
        loop = new Loop(camera, scene, renderer)
        container.append(renderer.domElement)

        // Create camera controls
        controls = createCameraControls(camera, renderer.domElement)
        controls.tick = () => controls.update()

        const light = createLights()

        scene.add(light)

        const resizer = new Resizer(container, camera, renderer, controls)

        // Set up house generation button
        this.setupHouseGenerator()

        // Add controls to updatables for smooth damping
        loop.updatables.push(controls)
    }

    setupHouseGenerator() {
        const button = document.getElementById('generate-house-btn')
        if (button) {
            button.addEventListener('click', () => this.generateRandomHouse())
        }
    }

    generateRandomHouse() {
        // Remove previous houses
        houses.forEach((house) => {
            scene.remove(house.cube)
            loop.updatables = loop.updatables.filter(
                (item) => item !== house.cube
            )
        })
        houses = []

        // Generate random parameters
        const cubeWidth = Math.random() * 2 + 1 // 1-3
        const cubeHeight = Math.random() * 2 + 1 // 1-3
        const cubeDepth = Math.random() * 2 + 1 // 1-3
        const cubeColor = new Color(Math.random(), Math.random(), Math.random())

        // Create cube (house base)
        const cube = createCube(cubeWidth, cubeHeight, cubeDepth, cubeColor)
        cube.position.set(
            0, // Consistent x position
            cubeHeight / 2, // Position at ground level
            0 // Consistent z position
        )

        // Add windows as children of the cube
        const gridSize = Math.floor(Math.random() * 3) + 1 // 1-3 windows per side
        const windowColor = new Color(
            Math.random() * 0.5,
            Math.random() * 0.5,
            Math.random() * 0.5
        ) // Darker colors
        const windows = createWindows(
            cubeWidth,
            cubeHeight,
            cubeDepth,
            gridSize,
            windowColor
        )
        cube.add(windows)

        // Add roof as child of the cube (either pyramid or flat)
        const usePyramidRoof = Math.random() > 0.5
        const roofColor = new Color(Math.random(), Math.random(), Math.random())

        if (usePyramidRoof) {
            const roofHeight = Math.random() * 1 + 0.5 // 0.5-1.5
            const pyramidRoof = createPyramidRoof(
                cubeWidth,
                roofHeight,
                roofColor
            )
            pyramidRoof.position.set(0, cubeHeight / 2 + roofHeight / 2, 0)
            cube.add(pyramidRoof)
        } else {
            const roofHeight = Math.random() * 0.5 + 0.2 // 0.2-0.7
            const flatRoof = createFlatRoof(
                cubeWidth,
                cubeDepth,
                roofHeight,
                roofColor
            )
            flatRoof.position.set(0, cubeHeight / 2 + roofHeight / 2, 0)
            cube.add(flatRoof)
        }

        // Add to scene and tracking
        scene.add(cube)
        //loop.updatables.push(cube)
        houses.push({ cube: cube })
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
