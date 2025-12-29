import { PlaneGeometry, Mesh, MeshLambertMaterial } from 'three'

function createGround() {
    // Create a large plane for the ground
    const geometry = new PlaneGeometry(50, 50)

    // Use the same color as the scene background
    const material = new MeshLambertMaterial({ color: 0x222222 })

    // Create the mesh
    const ground = new Mesh(geometry, material)

    // Rotate to horizontal and position below the buildings
    ground.rotation.x = -Math.PI / 2
    ground.position.y = 0

    // Enable shadow receiving
    ground.receiveShadow = true

    return ground
}

export { createGround }
