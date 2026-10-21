import { useState, useRef } from 'react'
import type { ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useTexture } from '@react-three/drei'
import { EquirectangularReflectionMapping, SRGBColorSpace } from 'three'
import type { Mesh } from 'three'

const colores = ['tomato', 'royalblue', 'gold', 'limegreen']

type FiguraProps = {
  position: [number, number, number]
  alClic: () => void
  children: ReactNode
}

function Figura({ position, alClic, children }: FiguraProps) {
  const figura = useRef<Mesh>(null)
  const [color, setColor] = useState(0)
  const [encima, setEncima] = useState(false)

  useFrame((_, delta) => {
    if (figura.current) {
      figura.current.rotation.y += delta
    }
  })

  return (
    <mesh
      ref={figura}
      position={position}
      scale={encima ? 1.4 : 1}
      onPointerOver={() => setEncima(true)}
      onPointerOut={() => setEncima(false)}
      onClick={() => {
        setColor((c) => (c + 1) % colores.length)
        alClic()
      }}
    >
      {children}
      <meshStandardMaterial color={colores[color]} />
    </mesh>
  )
}

function Fondo360() {
  const textura = useTexture('/360.jpg', (t) => {
    t.mapping = EquirectangularReflectionMapping
    t.colorSpace = SRGBColorSpace
  })
  return <Environment map={textura} background />
}

function App() {
  const [clics, setClics] = useState(0)
  const sumar = () => setClics((n) => n + 1)

  return (
    <>
      <Canvas camera={{ fov: 75, position: [0, 0, 0.1] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 3, 2]} intensity={1.5} />
        <Fondo360 />

        <Figura position={[0, 0, -3]} alClic={sumar}>
          <boxGeometry args={[1, 1, 1]} />
        </Figura>

        <Figura position={[-5.5, -0.5, -4]} alClic={sumar}>
          <sphereGeometry args={[0.8, 32, 32]} />
        </Figura>

        <Figura position={[0, -2, 0]} alClic={sumar}>
          <coneGeometry args={[0.8, 1.6, 32]} />
        </Figura>

        <Figura position={[0, 0, 5]} alClic={sumar}>
          <torusGeometry args={[0.7, 0.3, 16, 48]} />
        </Figura>

        <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={-0.4} />
      </Canvas>

      <div
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 10,
          padding: '8px 16px',
          borderRadius: 8,
          background: 'rgba(0, 0, 0, 0.6)',
          color: '#fff',
          fontSize: 32,
          fontWeight: 'bold',
          pointerEvents: 'none',
        }}
      >
        Clics: {clics}
      </div>
    </>
  )
}

export default App