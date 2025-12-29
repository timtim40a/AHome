import { AmbientLight, DirectionalLight, PointLight, SpotLight } from 'three'

function createLights() {
    const light = new AmbientLight('white', 0.5)
    const spotlight = new SpotLight('orchid', 8) // TODO

    light.position.set(0, 0, 0)
    spotlight.position.set(-0.3, -1, 2)

    light.add(spotlight)
    return light
}

export { createLights }
