import { AmbientLight, DirectionalLight, PointLight, SpotLight } from 'three'

function createLights() {
    const light = new AmbientLight('white', 0.7)
    const dirlight = new DirectionalLight('orange', 4)

    light.position.set(0, 0, 0)
    dirlight.position.set(0.5, 2, 1)

    // Enable shadow casting on directional light
    dirlight.castShadow = true

    // Configure shadow properties
    dirlight.shadow.mapSize.width = 2048
    dirlight.shadow.mapSize.height = 2048
    dirlight.shadow.camera.near = 0.5
    dirlight.shadow.camera.far = 50
    dirlight.shadow.camera.left = -10
    dirlight.shadow.camera.right = 10
    dirlight.shadow.camera.top = 10
    dirlight.shadow.camera.bottom = -10

    light.add(dirlight)
    return light
}

export { createLights }
