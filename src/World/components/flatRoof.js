import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three'

function createFlatRoof(width, depth, height, colour) {
    // Create a box geometry for the flat roof
    const geometry = new BoxGeometry(width, height, depth)

    // Create a material
    const material = new MeshStandardMaterial({ color: colour })

    // Create the mesh
    const flatRoof = new Mesh(geometry, material)

    return flatRoof
}

export { createFlatRoof }
