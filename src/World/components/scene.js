import { Color, Scene } from 'three'

function createScene() {
    const scene = new Scene()

    scene.background = new Color(0x222222)

    return scene
}

export { createScene }
