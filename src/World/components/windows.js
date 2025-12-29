import { BoxGeometry, Mesh, MeshStandardMaterial, Group } from 'three'

function createWindows(
    cubeWidth,
    cubeHeight,
    cubeDepth,
    gridSize,
    windowColour
) {
    const windows = new Group()

    // Calculate window dimensions (smaller than cube)
    const windowWidth = cubeWidth * 0.2
    const windowHeight = cubeHeight * 0.15
    const windowDepth = cubeDepth * 0.05 // Thin windows

    // Create window geometry
    const geometry = new BoxGeometry(windowWidth, windowHeight, windowDepth)
    const material = new MeshStandardMaterial({ color: windowColour })

    // Calculate spacing
    const spacingX = cubeWidth / (gridSize + 1)
    const spacingY = cubeHeight / (gridSize + 1)

    // Create windows in a grid on the front face
    for (let i = 1; i <= gridSize; i++) {
        for (let j = 1; j <= gridSize; j++) {
            const window = new Mesh(geometry, material)

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
