import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three'

function createCube(w, h, d, colour) {
    // create a geometry
    const geometry = new BoxGeometry(w, h, d)

    // create a default (white) Basic material
    const material = new MeshStandardMaterial({ color: colour })

    // create a Mesh containing the geometry and material
    const cube = new Mesh(geometry, material)

    // cube.tick = (delta) => {
    //     rotateCube(cube, delta)
    // }

    return cube
}

function rotateCube(cube, delta) {
    cube.rotation.x += delta * 0.2
    cube.rotation.y += delta * 0.4
}

export { createCube, rotateCube }
