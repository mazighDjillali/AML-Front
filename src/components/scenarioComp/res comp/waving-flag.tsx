"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const vertexShader = `
  uniform float time;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float waveFrequency = 3.0;
    float waveAmplitude = 0.05;
    float waveSpeed = 5.0;
    float waveOffset = 0.0;
    float waveHeight = sin(pos.x * waveFrequency + time * waveSpeed + waveOffset) * waveAmplitude;
    pos.y += waveHeight;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  varying vec2 vUv;

  void main() {
    vec4 texColor = texture2D(uTexture, vUv);
    gl_FragColor = texColor;
  }
`;

interface WavingFlagProps {
  textureUrl: string;
  width?: number;
  height?: number;
}

export const WavingFlag: React.FC<WavingFlagProps> = ({
  textureUrl,
  width = 400,
  height = 300,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    flag: THREE.Mesh | null;
    animationId: number | null;
  } | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mountRef.current || sceneRef.current) return;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    sceneRef.current = {
      scene,
      camera,
      renderer,
      flag: null,
      animationId: null,
    };

    const loader = new THREE.TextureLoader();
    loader.load(
      textureUrl,
      (texture) => {
        if (!sceneRef.current || !mountRef.current) return;

        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        // No more sRGBEncoding – assume linear or use default color management
        // If needed: THREE.ColorManagement.enabled = true;

        const geometry = new THREE.PlaneGeometry(5, 3, 128, 64);
        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0.0 },
            uTexture: { value: texture },
          },
          vertexShader,
          fragmentShader,
          side: THREE.DoubleSide,
          transparent: true,
        });

        const flag = new THREE.Mesh(geometry, material);
        sceneRef.current.flag = flag;
        sceneRef.current.scene.add(flag);

        mountRef.current.innerHTML = "";
        mountRef.current.appendChild(sceneRef.current.renderer.domElement);

        const animate = () => {
          if (!sceneRef.current) return;
          sceneRef.current.animationId = requestAnimationFrame(animate);
          material.uniforms.time.value += 0.01;
          sceneRef.current.renderer.render(
            sceneRef.current.scene,
            sceneRef.current.camera
          );
        };

        animate();
        setLoaded(true);
      },
      undefined,
      (err) => {
        console.error("Texture load error", err);
      }
    );

    return () => {
      if (sceneRef.current) {
        if (sceneRef.current.animationId) {
          cancelAnimationFrame(sceneRef.current.animationId);
        }
        if (sceneRef.current.flag) {
          sceneRef.current.scene.remove(sceneRef.current.flag);
          sceneRef.current.flag.geometry.dispose();
          (sceneRef.current.flag.material as THREE.Material).dispose();
        }
        sceneRef.current.renderer.dispose();
        if (mountRef.current) {
          mountRef.current.innerHTML = "";
        }
        sceneRef.current = null;
      }
      setLoaded(false);
    };
  }, [textureUrl, width, height]);

  return (
    <div
      ref={mountRef}
      style={{
        width,
        height,
        display: loaded ? "block" : "none",
      }}
    />
  );
};
