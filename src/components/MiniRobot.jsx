import React, { useRef, useMemo, useState, useEffect, useCallback, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Bounds, useAnimations } from '@react-three/drei';
import robotModelUrl from '../assets/model/mini_robot_eyes_v6.glb';
import { useRobotBrain } from './robot/useRobotBrain';
import RobotSpeechBubble from './robot/RobotSpeechBubble';

// Preload the GLTF model so it loads eagerly when component mounts
useGLTF.preload(robotModelUrl);

// Hook providing a single source of truth for the robot's size and corner offset
function getRobotDimensions() {
  if (typeof window === 'undefined') {
    return { size: 194, offset: 32 };
  }
  const width = window.innerWidth;
  if (width >= 1024) {
    return { size: 194, offset: 32 }; // Desktop (>= 1024px)
  }
  if (width >= 768) {
    return { size: 128, offset: 24 }; // Tablet (768px to 1023px)
  }
  return { size: 123, offset: 16 }; // Mobile (< 768px)
}

function useRobotSize() {
  const [dimensions, setDimensions] = useState(getRobotDimensions);

  useEffect(() => {
    const handleResize = () => {
      setDimensions((prev) => {
        const next = getRobotDimensions();
        if (prev.size !== next.size || prev.offset !== next.offset) {
          return next;
        }
        return prev;
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
}

function RobotInner({ updateFrame }) {
  const { scene, animations } = useGLTF(robotModelUrl);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const { actions } = useAnimations(animations, clonedScene);

  // Outer group: strictly dedicated to the continuous floating sine wave
  const floatGroupRef = useRef();
  // Inner group: strictly dedicated to unpredictable behaviors (resets cleanly to base)
  const behaviorGroupRef = useRef();

  // Eye mesh & Namaste hands mesh references and morph target maps
  const eyeMeshRef = useRef(null);
  const handsMeshRef = useRef(null);
  const currentWeightsRef = useRef({});
  const currentHandsWeightsRef = useRef({});

  // Frame targets updated by the brain
  const transformStateRef = useRef({
    targetPos: [0, 0, 0],
    targetRot: [0, 0, 0],
    targetScale: [1, 1, 1],
    isRevolve: false,
    revolveAngle: 0,
    revolveDir: 1,
    revolveCompleted: false,
  });

  // Revolve motion tracking refs (persisted across frames without React re-renders)
  const revolveActiveRef = useRef(false);
  const revolveDirRef = useRef(1);
  const finishingRevolveRef = useRef(false);
  const finishTargetAngleRef = useRef(0);

  const morphTargetStateRef = useRef({
    targetWeights: { eyes_default: 1.0 },
  });

  // Track error and namaste action playback
  const lastPlayedErrorRef = useRef(false);
  const lastPlayedNamasteRef = useRef(false);

  // Find eye mesh and namaste hands mesh with morph targets in clonedScene
  useEffect(() => {
    if (!clonedScene) return;
    clonedScene.traverse((child) => {
      if (child.isMesh && child.morphTargetDictionary && child.morphTargetInfluences) {
        if (child.name === 'namaste_hands' || child.name.includes('namaste')) {
          handsMeshRef.current = child;
          const initialHandsWeights = {};
          Object.keys(child.morphTargetDictionary).forEach((key) => {
            initialHandsWeights[key] = 0;
            const idx = child.morphTargetDictionary[key];
            child.morphTargetInfluences[idx] = 0;
          });
          currentHandsWeightsRef.current = initialHandsWeights;
        } else {
          eyeMeshRef.current = child;
          const initialWeights = {};
          Object.keys(child.morphTargetDictionary).forEach((key) => {
            initialWeights[key] = key === 'eyes_default' ? 1.0 : 0;
          });
          currentWeightsRef.current = initialWeights;
        }
      }
    });
  }, [clonedScene]);

  useFrame((state, delta) => {
    // 1. Continuous smooth floating sine motion (always running, period = 2.5s, amplitude ≈ 0.025 units)
    if (floatGroupRef.current) {
      const floatY = Math.sin((state.clock.elapsedTime / 2.5) * Math.PI * 2) * 0.025;
      floatGroupRef.current.position.y = floatY;
    }

    // 2. Update Brain state
    if (updateFrame) {
      updateFrame(delta, transformStateRef.current, morphTargetStateRef.current);
    }

    // 3. Smooth damped interpolation on behavior group transforms (no snapping, no half-scale/tilt)
    const inner = behaviorGroupRef.current;
    if (inner) {
      const tf = transformStateRef.current;
      const dampRate = 22; // Responsive, smooth follow
      const dampFactor = 1 - Math.exp(-dampRate * delta);

      inner.position.x += (tf.targetPos[0] - inner.position.x) * dampFactor;
      inner.position.y += (tf.targetPos[1] - inner.position.y) * dampFactor;
      inner.position.z += (tf.targetPos[2] - inner.position.z) * dampFactor;

      inner.rotation.x += (tf.targetRot[0] - inner.rotation.x) * dampFactor;

      // Revolve motion: continuous one-directional full 360° rotation around Y
      if (tf.isRevolve) {
        revolveActiveRef.current = true;
        revolveDirRef.current = tf.revolveDir || 1;
        finishingRevolveRef.current = false;
        finishTargetAngleRef.current = 0;
        // Direct driving from revolve progress - NO DAMPING!
        inner.rotation.y = tf.revolveAngle;
      } else if (tf.revolveCompleted) {
        // Silently normalize angle in a single frame (2*PI == 0 visually, no visible jump)
        inner.rotation.y = 0;
        revolveActiveRef.current = false;
        finishingRevolveRef.current = false;
        finishTargetAngleRef.current = 0;
        tf.revolveCompleted = false;
      } else if (revolveActiveRef.current || finishingRevolveRef.current) {
        // Interrupted revolve: smoothly continue in the same direction to the full-turn end, never rewind
        revolveActiveRef.current = false;
        finishingRevolveRef.current = true;
        const targetAngle = finishTargetAngleRef.current || (revolveDirRef.current * Math.PI * 2);
        finishTargetAngleRef.current = targetAngle;
        const diff = targetAngle - inner.rotation.y;
        const finishDampRate = 14;
        const finishDampFactor = 1 - Math.exp(-finishDampRate * delta);
        inner.rotation.y += diff * finishDampFactor;
        if (Math.abs(diff) < 0.03) {
          inner.rotation.y = 0; // Silently normalize to 0
          finishingRevolveRef.current = false;
          finishTargetAngleRef.current = 0;
        }
      } else {
        // Standard damped return-to-base and peek_turn rotation
        inner.rotation.y += (tf.targetRot[1] - inner.rotation.y) * dampFactor;
      }

      inner.rotation.z += (tf.targetRot[2] - inner.rotation.z) * dampFactor;

      inner.scale.x += (tf.targetScale[0] - inner.scale.x) * dampFactor;
      inner.scale.y += (tf.targetScale[1] - inner.scale.y) * dampFactor;
      inner.scale.z += (tf.targetScale[2] - inner.scale.z) * dampFactor;
    }

    // 4. Smooth morph target interpolation for eyes and namaste hands
    const targetWeights = morphTargetStateRef.current.targetWeights;

    // Play GLB Error action clip if error is active
    const isError = (targetWeights.eyes_error || 0) > 0.5;
    if (isError && !lastPlayedErrorRef.current && actions && actions.Error) {
      lastPlayedErrorRef.current = true;
      actions.Error.reset().setLoop(THREE.LoopOnce, 1);
      actions.Error.clampWhenFinished = true;
      actions.Error.play();
    } else if (!isError && lastPlayedErrorRef.current) {
      lastPlayedErrorRef.current = false;
      if (actions && actions.Error) {
        actions.Error.fadeOut(0.3);
      }
    }

    // Play GLB Namaste action clip if namaste is active
    const isNamaste = (targetWeights.eyes_namaste || 0) > 0.5 || (targetWeights.hands_namaste || 0) > 0.5;
    if (isNamaste && !lastPlayedNamasteRef.current && actions && actions.Namaste) {
      lastPlayedNamasteRef.current = true;
      actions.Namaste.reset().setLoop(THREE.LoopOnce, 1);
      actions.Namaste.clampWhenFinished = true;
      actions.Namaste.play();
    } else if (!isNamaste && lastPlayedNamasteRef.current) {
      lastPlayedNamasteRef.current = false;
      if (actions && actions.Namaste) {
        actions.Namaste.fadeOut(0.3);
      }
    }

    if (eyeMeshRef.current) {
      const eyeMesh = eyeMeshRef.current;
      const dict = eyeMesh.morphTargetDictionary;
      const influences = eyeMesh.morphTargetInfluences;
      const currentWeights = currentWeightsRef.current;

      // Blink vs expression damping rate
      const isBlink =
        (targetWeights.blink_both || 0) > 0.5 ||
        (targetWeights.blink_left || 0) > 0.5 ||
        (targetWeights.blink_right || 0) > 0.5;
      const dampRate = isBlink ? 28 : 10;
      const dampFactor = 1 - Math.exp(-dampRate * delta);

      for (const key of Object.keys(dict)) {
        const idx = dict[key];
        const targetVal = targetWeights[key] || 0;
        const curVal = currentWeights[key] || 0;
        const nextVal = curVal + (targetVal - curVal) * dampFactor;
        currentWeights[key] = nextVal;
        influences[idx] = nextVal;
      }
    }

    if (handsMeshRef.current) {
      const handsMesh = handsMeshRef.current;
      const dict = handsMesh.morphTargetDictionary;
      const influences = handsMesh.morphTargetInfluences;
      const currentHandsWeights = currentHandsWeightsRef.current;
      const dampRate = 12; // Responsive, smooth follow
      const dampFactor = 1 - Math.exp(-dampRate * delta);

      for (const key of Object.keys(dict)) {
        const idx = dict[key];
        const targetVal = targetWeights[key] || 0;
        const curVal = currentHandsWeights[key] || 0;
        const nextVal = curVal + (targetVal - curVal) * dampFactor;
        currentHandsWeights[key] = nextVal;
        influences[idx] = nextVal;
      }
    }
  });

  return (
    <group ref={floatGroupRef}>
      <group ref={behaviorGroupRef}>
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}

export const MiniRobot = () => {
  const { size, offset } = useRobotSize();
  const speechBubbleRef = useRef(null);

  const handleRobotClick = useCallback(() => {
    speechBubbleRef.current?.trigger();
  }, []);

  const handleRobotError = useCallback(() => {
    speechBubbleRef.current?.dismiss();
  }, []);

  const { updateFrame, handlers } = useRobotBrain({
    onRobotClick: handleRobotClick,
    onRobotError: handleRobotError,
  });

  return (
    <>
      <RobotSpeechBubble
        ref={speechBubbleRef}
        robotSize={size}
        robotOffset={offset}
      />
      <div
        style={{
          position: 'fixed',
          zIndex: 40,
          pointerEvents: 'auto',
          overflow: 'visible',
          width: `${size}px`,
          height: `${size}px`,
          right: `calc(${offset}px + env(safe-area-inset-right, 0px))`,
          bottom: `calc(${offset}px + env(safe-area-inset-bottom, 0px))`,
          userSelect: 'none',
          WebkitUserSelect: 'none',
          touchAction: 'manipulation',
          cursor: 'pointer',
        }}
        aria-label="Interactive 3D Mini Robot"
        {...handlers}
      >
        <Canvas
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          camera={{ position: [0, 0, 2], fov: 45 }}
          style={{ width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}
        >
          <ambientLight intensity={1.6} />
          <directionalLight position={[4, 5, 4]} intensity={2.2} />
          <Suspense fallback={null}>
            <Bounds key={size} fit margin={1.6}>
              <RobotInner updateFrame={updateFrame} />
            </Bounds>
          </Suspense>
        </Canvas>
      </div>
    </>
  );
};

export default MiniRobot;
