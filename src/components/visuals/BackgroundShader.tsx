import { useRef, useEffect } from 'react'

export function BackgroundShader() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const gl = canvas.getContext('webgl')
        if (!gl) return

        // Vertex shader
        const vsSource = `
            attribute vec4 aVertexPosition;
            void main() {
                gl_Position = aVertexPosition;
            }
        `

        // Fragment shader (Foggy/Dark Atmosphere)
        const fsSource = `
            precision mediump float;
            uniform float uTime;
            uniform vec2 uResolution;

            // Noise function
            float random (in vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }

            float noise (in vec2 st) {
                vec2 i = floor(st);
                vec2 f = fract(st);
                float a = random(i);
                float b = random(i + vec2(1.0, 0.0));
                float c = random(i + vec2(0.0, 1.0));
                float d = random(i + vec2(1.0, 1.0));
                vec2 u = f * f * (3.0 - 2.0 * f);
                return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
            }

            void main() {
                vec2 st = gl_FragCoord.xy / uResolution.xy;
                float t = uTime * 0.1;
                
                // Create moving fog layers
                float n1 = noise(st * 3.0 + vec2(t * 0.2, t * 0.1));
                float n2 = noise(st * 6.0 - vec2(t * 0.3, t * 0.2));
                
                float fog = mix(n1, n2, 0.5);
                
                // Dark color palette (Deep Blue/Black/Purple)
                vec3 color = mix(vec3(0.05, 0.05, 0.1), vec3(0.1, 0.05, 0.15), fog);
                
                // Vignette
                float dist = distance(st, vec2(0.5));
                color *= 1.0 - dist * 0.8;

                gl_FragColor = vec4(color, 1.0);
            }
        `

        // Shader compilation helpers
        function loadShader(gl: WebGLRenderingContext, type: number, source: string) {
            const shader = gl.createShader(type)
            if (!shader) return null
            gl.shaderSource(shader, source)
            gl.compileShader(shader)
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader))
                gl.deleteShader(shader)
                return null
            }
            return shader
        }

        const shaderProgram = gl.createProgram()
        if (!shaderProgram) return

        const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
        const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

        if (!vertexShader || !fragmentShader) return

        gl.attachShader(shaderProgram, vertexShader)
        gl.attachShader(shaderProgram, fragmentShader)
        gl.linkProgram(shaderProgram)

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            return
        }

        const positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        const positions = [
            -1.0, 1.0,
            1.0, 1.0,
            -1.0, -1.0,
            1.0, -1.0,
        ]
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

        const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition')
        const uTime = gl.getUniformLocation(shaderProgram, 'uTime')
        const uResolution = gl.getUniformLocation(shaderProgram, 'uResolution')

        let startTime = Date.now()
        let animationFrameId: number

        function render() {
            if (!gl || !canvas) return

            // Resize canvas
            const displayWidth = canvas.clientWidth
            const displayHeight = canvas.clientHeight
            if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
                canvas.width = displayWidth
                canvas.height = displayHeight
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
            }

            gl.clearColor(0.0, 0.0, 0.0, 1.0)
            gl.clear(gl.COLOR_BUFFER_BIT)

            gl.useProgram(shaderProgram)

            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
            gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0)
            gl.enableVertexAttribArray(vertexPosition)

            gl.uniform1f(uTime, (Date.now() - startTime) / 1000)
            gl.uniform2f(uResolution, canvas.width, canvas.height)

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

            animationFrameId = requestAnimationFrame(render)
        }

        render()

        return () => {
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 h-full w-full opacity-50 pointer-events-none"
        />
    )
}
