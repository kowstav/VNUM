import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Noise } from 'noisejs';
import styles from './BlobContainer.module.css';

const BlobContainer = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationFrameRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const basePositionsRef = useRef(null);
  const meshRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, mesh;
    const noise = new Noise(Math.random());

    const init = async () => {
      // Prevent multiple scene creations
      if (sceneRef.current) return;

      scene = new THREE.Scene();
      sceneRef.current = scene;

      const container = containerRef.current;
      const width = 400;
      const height = 400;

      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(0, 0, 50);

      renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(width, height);
      rendererRef.current = renderer;
      container.appendChild(renderer.domElement);

      const geometry = new THREE.IcosahedronGeometry(20, 70);
      const material = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        roughness: 0.4,
        metalness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        reflectivity: 1.0,
        flatShading: false
      });
      mesh = new THREE.Mesh(geometry, material);
      meshRef.current = mesh;
      scene.add(mesh);

      // Store base positions
      const posAttr = mesh.geometry.attributes.position;
      basePositionsRef.current = new Float32Array(posAttr.count * 3);
      for (let i = 0; i < posAttr.count * 3; i++) {
        basePositionsRef.current[i] = posAttr.array[i];
      }

      scene.add(new THREE.AmbientLight(0xffffff, 0.8));
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
      directionalLight.position.set(10, 20, 10);
      scene.add(directionalLight);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        streamRef.current = stream;
        handleAudio(stream);
      } catch (e) {
        console.error('Microphone access denied:', e);
      }
    };

    const handleAudio = (stream) => {
      if (audioContextRef.current) return;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
      source.connect(analyser);
      animate();
    };

    const animate = () => {
      if (!sceneRef.current || !meshRef.current) return;

      animationFrameRef.current = requestAnimationFrame(animate);

      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        const avgFreq = dataArrayRef.current.reduce((a, b) => a + b, 0) / dataArrayRef.current.length;

        const posAttr = meshRef.current.geometry.attributes.position;
        const time = performance.now() * 0.001;

        for (let i = 0; i < posAttr.count; i++) {
          const ix = i * 3;
          const x = basePositionsRef.current[ix];
          const y = basePositionsRef.current[ix + 1];
          const z = basePositionsRef.current[ix + 2];

          const offset = noise.perlin3(x * 0.1 + time, y * 0.1 + time, z * 0.1 + time);
          const scale = 1 + 0.3 * offset * (avgFreq / 128);

          posAttr.array[ix] = x * scale;
          posAttr.array[ix + 1] = y * scale;
          posAttr.array[ix + 2] = z * scale;
        }

        posAttr.needsUpdate = true;
        meshRef.current.geometry.computeVertexNormals();
      }

      if (meshRef.current) {
        meshRef.current.rotation.y += 0.005;
        meshRef.current.rotation.x += 0.003;
      }

      if (rendererRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, camera);
      }
    };

    init();

    return () => {
      // Proper cleanup
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (containerRef.current && rendererRef.current.domElement) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
      }

      if (meshRef.current) {
        meshRef.current.geometry.dispose();
        meshRef.current.material.dispose();
      }

      sceneRef.current = null;
      rendererRef.current = null;
      meshRef.current = null;
      analyserRef.current = null;
      dataArrayRef.current = null;
      basePositionsRef.current = null;
      streamRef.current = null;
      audioContextRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className={styles.blobContainer} />;
};

export default BlobContainer;