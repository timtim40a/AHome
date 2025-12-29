import { ConeGeometry, Mesh, MeshStandardMaterial } from 'three'

function createPyramidRoof(baseSize, randomOffset, height, colour) {
    // Create a cone geometry with 4 sides for a square pyramid
    const geometry = new ConeGeometry(
        Math.sqrt(Math.pow(baseSize, 2) * 2) / 2 + randomOffset, // Radius to fit base
        height,
        4,
        8
    )

    // Create a material
    const material = new MeshStandardMaterial({ color: colour })

    // Create the mesh
    const pyramid = new Mesh(geometry, material)

    pyramid.rotation.y = Math.PI / 4 // Rotate to align with cube

    return pyramid
}

export { createPyramidRoof }
