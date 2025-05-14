import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Noise } from 'noisejs';
import styles from './BlobContainer.module.css';
// Remove styles2 import for RadialSpread

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
      if (sceneRef.current) return;

      scene = new THREE.Scene();
      sceneRef.current = scene;

      const width = window.innerWidth;
      const height = window.innerHeight;

      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(0, 0, 73);
      camera.updateProjectionMatrix();

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setClearColor(0xffffff);
      renderer.setSize(width, height);
      rendererRef.current = renderer;

      const container = containerRef.current;
      if (container.firstChild) {
        container.removeChild(container.firstChild);
      }

      container.appendChild(renderer.domElement);

      // Geometry and material setup
      const geometry = new THREE.IcosahedronGeometry(40, 70);
      const material = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        roughness: 0.4,
        metalness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        reflectivity: 1.0,
        flatShading: false,
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

      // Lighting setup
      scene.add(new THREE.AmbientLight(0xffffff, 0.8));
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
      directionalLight.position.set(10, 20, 10);
      scene.add(directionalLight);

      // Handle window resize
      const onWindowResize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onWindowResize);

      // Audio setup
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        streamRef.current = stream;
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;
        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
        source.connect(analyser);
        animate();
      } catch (e) {
        console.error('Microphone access denied:', e);
        animate();
      }
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

      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x += 0.003;

      rendererRef.current.render(sceneRef.current, camera);
    };

    init();

    return () => {
      window.removeEventListener('resize', null);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      if (audioContextRef.current) audioContextRef.current.close();
      if (rendererRef.current) {
        rendererRef.current.domElement.remove();
        rendererRef.current.dispose();
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

  return (
    <div 
      ref={containerRef}
      className={styles.blobContainer}
      data-blob-container
    />
  );
};

export default BlobContainer;