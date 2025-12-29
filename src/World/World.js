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
import { createGround } from './components/ground.js'

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

        // Enable shadows in the renderer
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = 2 // PCFSoftShadowMap

        const light = createLights()

        // Create and add ground
        const ground = createGround()
        scene.add(ground)

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

        // Enable shadow casting on the cube
        cube.castShadow = true

        // Add windows as children of the cube
        // Calculate aspect ratio to determine window grid distribution
        const aspectRatio = cubeHeight / cubeWidth

        // Base grid sizes (1-6 for each dimension)
        let baseGridWidth = Math.floor(Math.random() * 5) + 3
        let baseGridHeight = Math.floor(Math.random() * 5) + 3

        // Adjust based on building proportions
        if (aspectRatio > 1.2) {
            // Tall and thin building - favor more rows, fewer columns
            baseGridHeight = Math.max(
                baseGridHeight,
                Math.floor(baseGridHeight * 1.5)
            )
            baseGridWidth = Math.min(
                baseGridWidth,
                Math.max(1, Math.floor(baseGridWidth * 0.7))
            )
        } else if (aspectRatio < 0.8) {
            // Low and wide building - favor more columns, fewer rows
            baseGridWidth = Math.max(
                baseGridWidth,
                Math.floor(baseGridWidth * 1.5)
            )
            baseGridHeight = Math.min(
                baseGridHeight,
                Math.max(1, Math.floor(baseGridHeight * 0.7))
            )
        }

        // Ensure minimum of 1 for each dimension
        const gridWidth = Math.max(1, baseGridWidth)
        const gridHeight = Math.max(1, baseGridHeight)

        // Generate random window properties independent of cube dimensions
        const windowAspectRatio = Math.random() * 1 + 0.2 // Random aspect ratio between 0.5 and 2.5
        const windowSizeFactor = Math.random() * 0.25 + 0.25 // Random size factor between 0.05 and 0.2

        const windows = createWindows(
            cubeWidth,
            cubeHeight,
            cubeDepth,
            gridWidth,
            gridHeight,
            windowAspectRatio,
            windowSizeFactor
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
            pyramidRoof.castShadow = true
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
            flatRoof.castShadow = true
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
