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
let possibleRoofColors = [0xeb6e34, 0xebf0f2, 0x6b3115, 0x234201, 0x616161] // DarkRed, Brown, ForestGreen, DarkBlue
let possibleBuildingColors = [0xf5f5dc, 0xffefd5, 0xd2b48c, 0xdeb887, 0xa0522d] // Beige, PapayaWhip, Tan, BurlyWood, Sienna

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
        const cubeDepth = cubeWidth
        const cubeColor = new Color(
            possibleBuildingColors[
                Math.floor(Math.random() * possibleBuildingColors.length)
            ]
        )

        // Create cube (house base)
        const cube = createCube(cubeWidth, cubeHeight, cubeDepth, cubeColor)
        cube.position.set(
            0, // Consistent x position
            cubeHeight / 2, // Position at ground level
            0 // Consistent z position
        )

        // Add windows as children of the cube
        const gridSize = Math.floor(Math.random() * 6) + 2 // 1-3 windows per side
        const windows = createWindows(
            cubeWidth,
            cubeHeight,
            cubeDepth,
            gridSize
        )
        cube.add(windows)

        // Add roof as child of the cube (either pyramid or flat)
        const usePyramidRoof = Math.random() > 0.5
        const roofRandomOffset = Math.random() * 0.2
        const roofColor = new Color(
            possibleRoofColors[
                Math.floor(Math.random() * possibleRoofColors.length)
            ]
        )

        if (usePyramidRoof) {
            const roofHeight = Math.random() * 1 + 0.5 // 0.5-1.5
            const pyramidRoof = createPyramidRoof(
                cubeWidth,
                roofRandomOffset,
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
                roofRandomOffset,
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
