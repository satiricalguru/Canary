'use client';

import { useEffect, useRef } from 'react';

const points: [number, number][] = [
  [-0.86, 0.27], [-0.71, 0.45], [-0.57, 0.22], [-0.36, 0.37],
  [-0.17, 0.18], [0.02, 0.38], [0.15, 0.07], [0.34, 0.21],
  [0.54, -0.04], [0.74, 0.13], [0.89, -0.12], [-0.69, -0.02],
  [-0.48, -0.16], [-0.28, 0.02], [-0.08, -0.25], [0.17, -0.27],
  [0.41, -0.36], [0.68, -0.30], [0.86, -0.48],
];
const links = [
  [0, 1], [0, 11], [1, 2], [2, 3], [2, 11], [2, 13], [3, 4],
  [4, 5], [4, 13], [4, 6], [5, 7], [6, 7], [6, 8], [7, 9],
  [8, 9], [8, 16], [8, 17], [9, 10], [10, 17], [10, 18], [11, 12],
  [12, 13], [12, 14], [13, 14], [14, 15], [15, 6], [15, 16], [16, 17], [17, 18],
];

export function SignalField() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let dispose = () => {};

    const update = () => {
      dispose();
      if (motion.matches) return;
      let cancelled = false;
      let release = () => {};
      dispose = () => {
        cancelled = true;
        release();
      };
      void import('three').then((THREE) => {
        if (cancelled) return;
        let renderer;
        try {
          renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
        } catch {
          return;
        }
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
        element.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        camera.position.z = 3;
        const group = new THREE.Group();
        scene.add(group);

        const lineGeometry = new THREE.BufferGeometry().setFromPoints(
          links.flatMap((link) => link.map((index) => new THREE.Vector3(...points[index], 0))),
        );
        const lineMaterial = new THREE.LineBasicMaterial({ color: '#ccd9f4', transparent: true, opacity: 0.29 });
        group.add(new THREE.LineSegments(lineGeometry, lineMaterial));

        const dotGeometry = new THREE.CircleGeometry(0.009, 16);
        const ringGeometry = new THREE.RingGeometry(0.016, 0.019, 24);
        const dotMaterial = new THREE.MeshBasicMaterial({ color: '#e7ecf9' });
        const ringMaterial = new THREE.MeshBasicMaterial({ color: '#e7ecf9', transparent: true, opacity: 0.48 });
        const rings = [2, 4, 8, 13, 17].map((index) => {
          const ring = new THREE.Mesh(ringGeometry, ringMaterial);
          ring.position.set(...points[index], 0);
          group.add(ring);
          return ring;
        });
        points.forEach(([x, y]) => {
          const dot = new THREE.Mesh(dotGeometry, dotMaterial);
          dot.position.set(x, y, 0);
          group.add(dot);
        });

        let frame = 0;
        let visible = false;
        let animationStart: number | undefined;
        const resize = () => {
          const { clientWidth: width, clientHeight: height } = element;
          if (!width || !height) return;
          const aspect = width / height;
          camera.left = -aspect;
          camera.right = aspect;
          camera.updateProjectionMatrix();
          group.scale.x = Math.min(aspect * 0.94, 2.1);
          renderer.setSize(width, height);
          renderer.render(scene, camera);
        };
        const render = (time: number) => {
          animationStart ??= time;
          const elapsed = time - animationStart;
          group.position.y = Math.sin(elapsed * 0.0007) * 0.04;
          rings.forEach((ring, index) => ring.scale.setScalar(1 + 0.45 * (1 + Math.sin(elapsed * 0.0015 + index))));
          renderer.render(scene, camera);
          if (elapsed < 4200) frame = requestAnimationFrame(render);
        };
        const syncAnimation = () => {
          cancelAnimationFrame(frame);
          if (visible && !document.hidden) frame = requestAnimationFrame(render);
        };
        const resizeObserver = new ResizeObserver(resize);
        const intersectionObserver = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          syncAnimation();
        });
        resize();
        resizeObserver.observe(element);
        intersectionObserver.observe(element);
        document.addEventListener('visibilitychange', syncAnimation);

        release = () => {
          resizeObserver.disconnect();
          intersectionObserver.disconnect();
          document.removeEventListener('visibilitychange', syncAnimation);
          cancelAnimationFrame(frame);
          [lineGeometry, dotGeometry, ringGeometry, lineMaterial, dotMaterial, ringMaterial].forEach((resource) => resource.dispose());
          renderer.dispose();
          renderer.domElement.remove();
        };
      }).catch(() => {});
    };

    update();
    motion.addEventListener('change', update);
    return () => {
      motion.removeEventListener('change', update);
      dispose();
    };
  }, []);

  return <div ref={host} className="signal-field" aria-hidden="true" />;
}
