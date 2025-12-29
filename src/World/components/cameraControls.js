import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

function createCameraControls(camera, canvas) {
    const controls = new OrbitControls(camera, canvas)

    // Configure controls
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = true
    controls.enablePan = true

    // Set some reasonable limits
    controls.minDistance = 5
    controls.maxDistance = 50
    controls.maxPolarAngle = Math.PI * 0.49 // Prevent camera from going below ground

    return controls
}

export { createCameraControls }
