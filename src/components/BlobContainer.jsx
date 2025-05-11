import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Noise } from 'noisejs';
import styles from './BlobContainer.module.css';

const BlobContainer = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, mesh, analyser, dataArray, basePositions;
    const noise = new Noise(Math.random());

    const init = async () => {
      scene = new THREE.Scene();
      sceneRef.current = scene;

      const container = containerRef.current;
      // Fixed size for the blob visualization
      const width = 400;  // You can adjust these dimensions
      const height = 400; // to match your desired blob size

      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(0, 0, 50);

      renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(width, height);
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
      scene.add(mesh);

      // Store base positions
      const posAttr = mesh.geometry.attributes.position;
      basePositions = new Float32Array(posAttr.count * 3);
      for (let i = 0; i < posAttr.count * 3; i++) {
        basePositions[i] = posAttr.array[i];
      }

      scene.add(new THREE.AmbientLight(0xffffff, 0.8));
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
      directionalLight.position.set(10, 20, 10);
      scene.add(directionalLight);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        handleAudio(stream);
      } catch (e) {
        console.error('Microphone access denied:', e);
      }

      // Cleanup function
      cleanupRef.current = () => {
        renderer.dispose();
        geometry.dispose();
        material.dispose();
        container.removeChild(renderer.domElement);
      };
    };

    const handleAudio = (stream) => {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      dataArray = new Uint8Array(analyser.frequencyBinCount);
      source.connect(analyser);
      animate();
    };

    const animate = () => {
      if (!sceneRef.current) return;

      requestAnimationFrame(animate);

      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
        const avgFreq = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

        const posAttr = mesh.geometry.attributes.position;
        const time = performance.now() * 0.001;

        for (let i = 0; i < posAttr.count; i++) {
          const ix = i * 3;
          const x = basePositions[ix];
          const y = basePositions[ix + 1];
          const z = basePositions[ix + 2];

          const offset = noise.perlin3(x * 0.1 + time, y * 0.1 + time, z * 0.1 + time);
          const scale = 1 + 0.3 * offset * (avgFreq / 128);

          posAttr.array[ix] = x * scale;
          posAttr.array[ix + 1] = y * scale;
          posAttr.array[ix + 2] = z * scale;
        }

        posAttr.needsUpdate = true;
        mesh.geometry.computeVertexNormals();
      }

      mesh.rotation.y += 0.005;
      mesh.rotation.x += 0.003;

      renderer.render(scene, camera);
    };

    init();

    return () => {
      sceneRef.current = null;
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  return <div ref={containerRef} className={styles.blobContainer} />;
};

export default BlobContainer;