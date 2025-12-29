const setSize = (container, camera, renderer) => {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()

    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
}

class Resizer {
    constructor(container, camera, renderer, controls = null) {
        this.controls = controls

        // Set the camera's aspect ratio
        camera.aspect = container.clientWidth / container.clientHeight

        // Update the camera's projection matrix
        camera.updateProjectionMatrix()

        // update the size of the renderer AND the canvas
        renderer.setSize(container.clientWidth, container.clientHeight)

        // set the pixel ratio (for mobile devices)
        renderer.setPixelRatio(window.devicePixelRatio)

        setSize(container, camera, renderer)

        window.addEventListener('resize', () => {
            setSize(container, camera, renderer)
            this.onResize()
        })
    }

    onResize() {
        if (this.controls) {
            this.controls.update()
        }
    }
}

export { Resizer }
