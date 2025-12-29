import { BoxGeometry, Mesh, MeshPhysicalMaterial, Group } from 'three'

function createWindows(
    cubeWidth,
    cubeHeight,
    cubeDepth,
    gridWidth,
    gridHeight,
    windowAspectRatio,
    windowSizeFactor
) {
    const windows = new Group()

    // Calculate window dimensions based on independent aspect ratio
    const baseWindowSize = Math.min(cubeWidth, cubeHeight) * windowSizeFactor
    const windowWidth = baseWindowSize * Math.sqrt(windowAspectRatio)
    const windowHeight = baseWindowSize / Math.sqrt(windowAspectRatio)
    const windowDepth = cubeDepth * 0.01 // Thin windows

    // Create window geometry (will be adjusted if needed)
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

    // Ensure windows don't intersect by checking if they're too large for the grid
    const maxAllowedWidth = spacingX * 0.8 // Leave 20% margin for spacing
    const maxAllowedHeight = spacingY * 0.8 // Leave 20% margin for spacing

    // Adjust window size if it would cause intersections
    let adjustedWindowWidth = Math.min(windowWidth, maxAllowedWidth)
    let adjustedWindowHeight = Math.min(windowHeight, maxAllowedHeight)

    // Maintain aspect ratio when adjusting size
    const sizeRatio = Math.min(
        maxAllowedWidth / windowWidth,
        maxAllowedHeight / windowHeight
    )
    if (sizeRatio < 1) {
        adjustedWindowWidth = windowWidth * sizeRatio
        adjustedWindowHeight = windowHeight * sizeRatio
    }

    // Create new geometry with adjusted dimensions
    const adjustedGeometry = new BoxGeometry(
        adjustedWindowWidth,
        adjustedWindowHeight,
        windowDepth
    )

    // Create windows in a grid on the front face
    for (let i = 1; i <= gridWidth; i++) {
        for (let j = 1; j <= gridHeight; j++) {
            const window = new Mesh(
                adjustedGeometry,
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
