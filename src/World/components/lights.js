import { AmbientLight, DirectionalLight, PointLight, SpotLight } from 'three'

function createLights() {
    const light = new AmbientLight('white', 0.7)
    const dirlight = new DirectionalLight('orange', 4) // TODO

    light.position.set(0, 0, 0)
    dirlight.position.set(0.5, 2, 0)

    light.add(dirlight)
    return light
}

export { createLights }
