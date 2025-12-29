import { Color, Group } from 'three'
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
import { createTree } from './components/trees.js'

let camera
let scene
let renderer
let loop
let houses = [] // Array to track generated houses
let ground // Reference to the ground object
let treesGroup // Group to hold all trees
let controls // Camera controls
let light // Reference to the main light
let possibleRoofColors = [0xeb6e34, 0xebf0f2, 0x6b3115, 0x234201, 0x616161] // DarkRed, Brown, ForestGreen, DarkBlue
let possibleWinterRoofColors = [
    0xf5f5f5, 0xe8e8e8, 0xd3d3d3, 0xb0c4de, 0x778899,
] // Very light greys and bluish grey
let possibleBuildingColors = [0xf5f5dc, 0xffefd5, 0xd2b48c, 0xdeb887, 0xa0522d] // Beige, PapayaWhip, Tan, BurlyWood, Sienna
let currentSeason = 0 // 0: Autumn, 1: Winter, 2: Spring, 3: Summer

function getFoliageColorForSeason(season) {
    switch (season) {
        case 'winter':
            return 0xffffff // White for winter
        case 'spring':
            return Math.random() < 0.5 ? 0x00ff00 : 0xff69b4 // Lime or pink for spring
        case 'summer':
            return 0x228b22 // Green for summer
        case 'autumn':
        default:
            // Original autumn colors
            const foliageColors = [
                0x228b22, 0x32cd32, 0x006400, 0xff6347, 0xffa500, 0xdc143c,
            ] // Green and autumn colors
            return foliageColors[
                Math.floor(Math.random() * foliageColors.length)
            ]
    }
}

function createTrees(count = 5, season = 'autumn') {
    const trees = new Group()

    for (let i = 0; i < count; i++) {
        const tree = createTree(season)

        // Position trees randomly around the scene (closer since trees are smaller)
        const angle = (i / count) * Math.PI * 2
        const distance = Math.random() * 6 + 3 // 3-9 units from center (closer)
        tree.position.set(
            Math.cos(angle) * distance,
            0,
            Math.sin(angle) * distance
        )

        // Add slight rotation variation
        tree.rotation.y = Math.random() * Math.PI * 2

        trees.add(tree)
    }

    return trees
}

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

        light = createLights()

        // Create and add ground
        ground = createGround()
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

        // Set up season slider
        const seasonSlider = document.getElementById('season-slider')
        const seasonLabel = document.getElementById('season-label')
        if (seasonSlider && seasonLabel) {
            const seasonNames = ['Autumn', 'Winter', 'Spring', 'Summer']
            seasonLabel.textContent = seasonNames[currentSeason]

            seasonSlider.addEventListener('input', (event) => {
                currentSeason = parseInt(event.target.value)
                seasonLabel.textContent = seasonNames[currentSeason]

                // Update tree colors for the new season without regenerating house
                this.updateSeasonVisuals()
            })
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

        // Remove previous trees
        if (treesGroup) {
            scene.remove(treesGroup)
        }

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
        const isWinter = currentSeason === 1 // 1 is winter
        const roofColorPalette = isWinter
            ? possibleWinterRoofColors
            : possibleRoofColors
        const roofColor = new Color(
            roofColorPalette[
                Math.floor(Math.random() * roofColorPalette.length)
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

        // Generate new trees
        const seasonNames = ['autumn', 'winter', 'spring', 'summer']
        const currentSeasonName = seasonNames[currentSeason]
        treesGroup = createTrees(
            Math.floor(Math.random() * 4) + 4,
            currentSeasonName
        ) // 4-7 trees
        scene.add(treesGroup)

        // Add to scene and tracking
        scene.add(cube)
        //loop.updatables.push(cube)
        houses.push({ cube: cube })
    }

    updateSeasonVisuals() {
        // Update scene background based on season
        const seasonBackgrounds = {
            0: 0x222222, // Autumn - warm brown
            1: 0x222222, // Winter - light blue-white
            2: 0x98b4f4, // Spring - pale blue
            3: 0xf3d690, // Summer - orange
        }
        const seasonGround = {
            0: 0x222222, // Autumn - dark brown
            1: 0xdddddd, // Winter - light grey (snowy)
            2: 0x207b38, // Spring - green
            3: 0x006400, // Summer - dark green
        }
        scene.background = new Color(seasonBackgrounds[currentSeason])
        ground.material.color.setHex(seasonGround[currentSeason])

        light.children.forEach((child) => {
            if (child.isDirectionalLight) {
                // Adjust light color and intensity based on season
                const seasonLightSettings = {
                    0: { color: 0xf38630, intensity: 4 }, // Autumn
                    1: { color: 0xd36620, intensity: 3 }, // Winter
                    2: { color: 0xeeeebb, intensity: 5 }, // Spring
                    3: { color: 0xffa142, intensity: 5 }, // Summer
                }
                child.color.setHex(seasonLightSettings[currentSeason].color)
                child.intensity = seasonLightSettings[currentSeason].intensity
            }
        })

        // Update tree foliage colors for the new season
        if (treesGroup) {
            const seasonNames = ['autumn', 'winter', 'spring', 'summer']
            const currentSeasonName = seasonNames[currentSeason]

            treesGroup.children.forEach((tree) => {
                // Skip the trunk (first child) and update foliage colors
                for (let i = 1; i < tree.children.length; i++) {
                    const foliage = tree.children[i]
                    if (foliage.material) {
                        foliage.material.color.setHex(
                            getFoliageColorForSeason(currentSeasonName)
                        )
                    }
                }
            })
        }
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
