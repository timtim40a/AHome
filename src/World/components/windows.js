import { BoxGeometry, Mesh, MeshPhysicalMaterial, Group } from 'three'

function createWindows(
    cubeWidth,
    cubeHeight,
    cubeDepth,
    gridWidth,
    gridHeight
) {
    const windows = new Group()

    // Calculate window dimensions (smaller than cube)
    const windowWidth = cubeWidth / (gridWidth + 2)
    const windowHeight = cubeHeight / (gridHeight + 2)
    const windowDepth = cubeDepth * 0.01 // Thin windows

    // Create window geometry
    const geometry = new BoxGeometry(windowWidth, windowHeight, windowDepth)
    const materialDark = new MeshPhysicalMaterial({ color: 0x000000 })
    const materialYellow = new MeshPhysicalMaterial({
        color: 0x222211, // base darkish window
        emissive: 'yellow', // warm light color
        emissiveIntensity: 3.0,
    })

    // Calculate spacing
    const spacingX = cubeWidth / (gridWidth + 1)
    const spacingY = cubeHeight / (gridHeight + 1)

    // Create windows in a grid on the front face
    for (let i = 1; i <= gridWidth; i++) {
        for (let j = 1; j <= gridHeight; j++) {
            const window = new Mesh(
                geometry,
                Math.random() < 0.5 ? materialDark : materialYellow
            )
            // Position on front face
            window.position.set(
                -cubeWidth / 2 + i * spacingX,
                -cubeHeight / 2 + j * spacingY,
                cubeDepth / 2 + windowDepth / 2
            )

            windows.add(window)
        }
    }

    return windows
}

export { createWindows }
