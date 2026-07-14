"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export type BodyRegion = "head" | "torso" | "limbs";

const PRIMARY = "#574eb1";
const DIM = "#d7d5e6";

function BodyMesh({ focusRegion }: { focusRegion: BodyRegion | null }) {
  const color = (region: BodyRegion) => (focusRegion === region ? PRIMARY : DIM);

  return (
    <group position={[0, -0.35, 0]}>
      <mesh position={[0, 1.55, 0]} castShadow>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color={color("head")} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.26, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.09, 0.14, 16]} />
        <meshStandardMaterial color={color("head")} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.72, 0]} castShadow>
        <capsuleGeometry args={[0.32, 0.55, 8, 16]} />
        <meshStandardMaterial color={color("torso")} roughness={0.5} />
      </mesh>
      <mesh position={[-0.52, 0.68, 0]} rotation={[0, 0, 0.16]} castShadow>
        <capsuleGeometry args={[0.08, 0.72, 8, 16]} />
        <meshStandardMaterial color={color("limbs")} roughness={0.5} />
      </mesh>
      <mesh position={[0.52, 0.68, 0]} rotation={[0, 0, -0.16]} castShadow>
        <capsuleGeometry args={[0.08, 0.72, 8, 16]} />
        <meshStandardMaterial color={color("limbs")} roughness={0.5} />
      </mesh>
      <mesh position={[-0.16, -0.22, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.88, 8, 16]} />
        <meshStandardMaterial color={color("limbs")} roughness={0.5} />
      </mesh>
      <mesh position={[0.16, -0.22, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.88, 8, 16]} />
        <meshStandardMaterial color={color("limbs")} roughness={0.5} />
      </mesh>
    </group>
  );
}

export default function BodyModel3D({ focusRegion }: { focusRegion: BodyRegion | null }) {
  return (
    <Canvas camera={{ position: [0, 0.18, 4.8], fov: 36 }} shadows>
      <ambientLight intensity={0.75} />
      <directionalLight position={[2, 3, 2]} intensity={0.9} castShadow />
      <directionalLight position={[-2, 1, -2]} intensity={0.35} />
      <Suspense fallback={null}>
        <BodyMesh focusRegion={focusRegion} />
      </Suspense>
      <OrbitControls
        target={[0, 0.18, 0]}
        enablePan={false}
        enableZoom
        minDistance={3.2}
        maxDistance={7}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate
        autoRotateSpeed={1.8}
      />
    </Canvas>
  );
}
