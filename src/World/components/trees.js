import {
    CylinderGeometry,
    SphereGeometry,
    Mesh,
    MeshLambertMaterial,
    Group,
} from 'three'
import { Color } from 'three'

function createTree() {
    const tree = new Group()

    // Tree trunk - brown cylinder (smaller)
    const trunkHeight = Math.random() * 0.8 + 0.5 // 0.5-1.3 units (much smaller)
    const trunkRadius = Math.random() * 0.05 + 0.03 // 0.03-0.08 units (much smaller)
    const trunkGeometry = new CylinderGeometry(
        trunkRadius,
        trunkRadius * 1.2,
        trunkHeight,
        8
    )
    const trunkMaterial = new MeshLambertMaterial({ color: 0x8b4513 }) // Brown
    const trunk = new Mesh(trunkGeometry, trunkMaterial)
    trunk.position.y = trunkHeight / 2
    trunk.castShadow = true
    tree.add(trunk)

    // Choose one consistent foliage color for this tree
    const foliageColors = [
        0x228b22, 0x32cd32, 0x006400, 0xff6347, 0xffa500, 0xdc143c,
    ] // Green and autumn colors
    const treeFoliageColor =
        foliageColors[Math.floor(Math.random() * foliageColors.length)]

    // Foliage - multiple ellipsoids (smaller)
    const foliageCount = Math.floor(Math.random() * 3) + 2 // 2-4 foliage pieces
    for (let i = 0; i < foliageCount; i++) {
        // Create ellipsoid (stretched sphere) - smaller
        const foliageRadiusX = Math.random() * 0.3 + 0.2 // 0.2-0.5 (much smaller)
        const foliageRadiusY = Math.random() * 0.3 + 0.3 // 0.3-0.6 (much smaller)
        const foliageRadiusZ = Math.random() * 0.3 + 0.2 // 0.2-0.5 (much smaller)

        const foliageGeometry = new SphereGeometry(1, 8, 6)
        foliageGeometry.scale(foliageRadiusX, foliageRadiusY, foliageRadiusZ)

        const foliageMaterial = new MeshLambertMaterial({
            color: treeFoliageColor,
        }) // Use consistent color
        const foliage = new Mesh(foliageGeometry, foliageMaterial)

        // Position foliage at top of trunk with some randomness
        const baseHeight = trunkHeight + Math.random() * 0.2
        foliage.position.set(
            (Math.random() - 0.5) * 0.2, // Smaller horizontal offset
            baseHeight + Math.random() * 0.2, // Smaller height variation
            (Math.random() - 0.5) * 0.2 // Smaller depth offset
        )

        foliage.castShadow = true
        tree.add(foliage)
    }

    return tree
}

export { createTree }
