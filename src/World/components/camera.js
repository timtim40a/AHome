import { PerspectiveCamera } from 'three'
import { degToRad } from 'three/src/math/MathUtils.js'

function createCamera() {
    const camera = new PerspectiveCamera(
        35, // fov = Field Of View
        1, // aspect ratio (dummy value)
        0.1, // near clipping plane
        100 // far clipping plane
    )

    // move the camera back so we can view the scene
    camera.position.set(0, 0, 10)
    camera.rotation.set(degToRad(0), degToRad(0), degToRad(160))

    return camera
}

export { createCamera }
