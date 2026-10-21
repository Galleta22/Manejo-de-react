import { useState, useRef, Suspense } from 'react'
import type { ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useTexture } from '@react-three/drei'
import { EquirectangularReflectionMapping, SRGBColorSpace } from 'three'
import type { Mesh } from 'three'

const colores = ['#ff4d4d', '#3b82f6', '#facc15', '#22c55e', '#a855f7', '#06b6d4']

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
      figura.current.rotation.y += delta * 0.9
      figura.current.rotation.x += delta * 0.4
    }
  })

  return (
    <mesh
      ref={figura}
      position={position}
      scale={encima ? 1.35 : 1}
      onPointerOver={() => setEncima(true)}
      onPointerOut={() => setEncima(false)}
      onClick={() => {
        setColor((c) => (c + 1) % colores.length)
        alClic()
      }}
    >
      {children}
      <meshStandardMaterial
        color={colores[color]}
        roughness={0.25}
        metalness={0.3}
      />
    </mesh>
  )
}

function Fondo360({ url }: { url: string }) {
  const textura = useTexture(url, (t) => {
    t.mapping = EquirectangularReflectionMapping
    t.colorSpace = SRGBColorSpace
  })
  return <Environment map={textura} background />
}

function App() {
  const [clics, setClics] = useState(0)
  const [entorno, setEntorno] = useState<'/gamer_room.jpg' | '/selva.jpg'>('/gamer_room.jpg')
  const sumar = () => setClics((n) => n + 1)

  return (
    <>
      <Canvas camera={{ fov: 75, position: [0, 0, 0.1] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 2]} intensity={1.5} />
        <directionalLight position={[-3, -2, -2]} intensity={0.5} />

        <Suspense fallback={null}>
          <Fondo360 url={entorno} />
        </Suspense>

        {/* 1. Nudo Toroidal (Frente) */}
        <Figura position={[0, 0, -3.5]} alClic={sumar}>
          <torusKnotGeometry args={[0.55, 0.18, 128, 32]} />
        </Figura>

        {/* 2. Icosaedro - Cristal poligonal (Izquierda) */}
        <Figura position={[-4, 0.2, -1]} alClic={sumar}>
          <icosahedronGeometry args={[0.85, 0]} />
        </Figura>

        {/* 3. Dodecaedro - 12 caras pentagonales (Derecha) */}
        <Figura position={[3.8, 0.2, -1]} alClic={sumar}>
          <dodecahedronGeometry args={[0.8, 0]} />
        </Figura>

        {/* 4. Cápsula espacial (Atrás) */}
        <Figura position={[0, 0.4, 4]} alClic={sumar}>
          <capsuleGeometry args={[0.45, 0.9, 16, 32]} />
        </Figura>

        <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={-0.4} />
      </Canvas>

      {/* Panel Superior: Contador de clics y Selector de Entorno */}
      <div
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div
          style={{
            padding: '10px 20px',
            borderRadius: 12,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#fff',
            fontSize: 28,
            fontWeight: 700,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            userSelect: 'none',
          }}
        >
          Clics: <span style={{ color: '#38bdf8' }}>{clics}</span>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 8,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(10px)',
            padding: '6px',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <button
            onClick={() => setEntorno('/gamer_room.jpg')}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
              transition: 'all 0.2s ease',
              background: entorno === '/gamer_room.jpg' ? '#8b5cf6' : 'transparent',
              color: '#fff',
            }}
          >
            🎮 Cuarto Gamer
          </button>
          <button
            onClick={() => setEntorno('/selva.jpg')}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
              transition: 'all 0.2s ease',
              background: entorno === '/selva.jpg' ? '#10b981' : 'transparent',
              color: '#fff',
            }}
          >
            🌿 Selva
          </button>
        </div>
      </div>
    </>
  )
}

export default App