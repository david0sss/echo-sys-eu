"use client"

import { useEffect, useRef, useCallback } from "react"
import createGlobe, { type COBEOptions } from "cobe"
import { useMotionValue, useSpring } from "motion/react"

const MOVEMENT_DAMPING = 1400

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 1,
  diffuse: 1.2,
  mapSamples: 16000,
  mapBrightness: 2, // Less bright base map points
  baseColor: [0.2, 0.2, 0.2],
  markerColor: [61 / 255, 129 / 255, 227 / 255],
  glowColor: [0, 0, 0], // Remove atmospheric glow
  markers: [
    { location: [25.2048, 55.2708], size: 0.06 }, // Dubai
    { location: [50.4501, 30.5234], size: 0.06 }, // Kyiv
    { location: [52.2297, 21.0122], size: 0.06 }, // Poland
    { location: [50.8503, 4.3517], size: 0.06 },  // Belgium
    { location: [51.5074, -0.1278], size: 0.06 }, // UK
  ],
}

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string
  config?: COBEOptions
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(0)
  const widthRef = useRef(0)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null)
  // Visibility gating — pause WebGL RAF when globe is off-screen
  const isVisibleRef = useRef(false)

  const r = useMotionValue(0)
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  })

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab"
    }
  }

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      r.set(r.get() + delta / MOVEMENT_DAMPING)
    }
  }

  const initGlobe = useCallback(() => {
    if (!canvasRef.current) return

    // Destroy previous globe if exists
    if (globeRef.current) {
      globeRef.current.destroy()
    }

    widthRef.current = canvasRef.current.offsetWidth

    if (widthRef.current === 0) return

    const globe = createGlobe(canvasRef.current, {
      ...config,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      onRender: (state) => {
        // Skip render work when globe is off-screen
        if (!isVisibleRef.current) return
        if (!pointerInteracting.current) phiRef.current += 0.003
        state.phi = phiRef.current + rs.get()
        state.width = widthRef.current * 2
        state.height = widthRef.current * 2
      },
    })

    globeRef.current = globe

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1"
      }
    }, 0)
  }, [config, rs])

  useEffect(() => {
    initGlobe()

    const onResize = () => {
      if (canvasRef.current) {
        widthRef.current = canvasRef.current.offsetWidth
      }
    }

    window.addEventListener("resize", onResize)

    // Pause onRender work when globe is scrolled out of view
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
      },
      { rootMargin: '200px' }
    )
    if (canvasRef.current) visibilityObserver.observe(canvasRef.current)

    return () => {
      if (globeRef.current) {
        globeRef.current.destroy()
      }
      window.removeEventListener("resize", onResize)
      visibilityObserver.disconnect()
    }
  }, [initGlobe])

  return (
    <div
      className={className}
      style={{ position: "relative" }}
    >
      <canvas
        className={"w-full h-full opacity-0 transition-opacity duration-500"}
        style={{ contain: "layout paint size" }}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX
          updatePointerInteraction(e.clientX)
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  )
}
