import { BoxGeometry, Mesh, MeshStandardMaterial, Group } from 'three'

function createWindows(cubeWidth, cubeHeight, cubeDepth, gridSize) {
    const windows = new Group()

    // Calculate window dimensions (smaller than cube)
    const windowWidth = cubeWidth / (gridSize + 2)
    const windowHeight = cubeHeight / (gridSize + 2)
    const windowDepth = cubeDepth * 0.01 // Thin windows

    // Create window geometry
    const geometry = new BoxGeometry(windowWidth, windowHeight, windowDepth)
    const materialDark = new MeshStandardMaterial({ color: 0x000000 })
    const materialYellow = new MeshStandardMaterial({ color: 0xffff00 })

    // Calculate spacing
    const spacingX = cubeWidth / (gridSize + 1)
    const spacingY = cubeHeight / (gridSize + 1)

    // Create windows in a grid on the front face
    for (let i = 1; i <= gridSize; i++) {
        for (let j = 1; j <= gridSize; j++) {
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
