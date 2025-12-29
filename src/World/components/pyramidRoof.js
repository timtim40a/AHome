import { ConeGeometry, Mesh, MeshStandardMaterial } from 'three'

function createPyramidRoof(baseSize, height, colour) {
    // Create a cone geometry with 4 sides for a square pyramid
    const geometry = new ConeGeometry(baseSize / 2, height, 4)

    // Create a material
    const material = new MeshStandardMaterial({ color: colour })

    // Create the mesh
    const pyramid = new Mesh(geometry, material)

    return pyramid
}

export { createPyramidRoof }
