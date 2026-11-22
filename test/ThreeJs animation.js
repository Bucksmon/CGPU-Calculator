<script type="importmap">
{
    "imports": {
        "three": "https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.module.js",
        "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/"
    }
}
</script>

    <script type="module">
        import * as THREE from 'three';
        import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
        import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
        import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

        let scene, camera, renderer, composer, particles;
        let animationId;
        let isPaused = false; // ✅ pause flag
        const mouse = new THREE.Vector2(10000, 10000);
        let particleData = [];
        let mainGroup;

        function init() {
            scene = new THREE.Scene();

            mainGroup = new THREE.Group();
            scene.add(mainGroup);

            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 0, 20);

            const canvas = document.getElementById('bg-canvas');
            renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            composer = new EffectComposer(renderer);
            composer.addPass(new RenderPass(scene, camera));

            const bloomPass = new UnrealBloomPass(
                new THREE.Vector2(window.innerWidth, window.innerHeight),
                0.6, 0.4, 0.05
            );
            composer.addPass(bloomPass);

            createMainParticles();

            mainGroup.position.x = 15;

            window.addEventListener('resize', onWindowResize);
            window.addEventListener('mousemove', onMouseMove);
        }

        function createMainParticles() {
            const particleCount = 3000;
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            const baseColor = new THREE.Color(0x001f3f);

            particleData = []; // reset

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                const x = (Math.random() - 0.5) * 30;
                const y = (Math.random() - 0.5) * 30;

                particleData.push({
                    originalPos: new THREE.Vector3(x, y, (Math.random() - 0.5) * 5),
                    currentPos: new THREE.Vector3(x, y, (Math.random() - 0.5) * 5),
                    velocity: new THREE.Vector3(),
                });

                positions[i3] = x;
                positions[i3 + 1] = y;
                positions[i3 + 2] = particleData[i].originalPos.z;

                baseColor.toArray(colors, i3);
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const material = new THREE.PointsMaterial({
                size: 0.8,
                vertexColors: true,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                sizeAttenuation: true
            });

            particles = new THREE.Points(geometry, material);
            mainGroup.add(particles);
        }

        function onWindowResize() {
            if (!camera || !renderer) return;
            const width = window.innerWidth;
            const height = window.innerHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            composer.setSize(width, height);
        }

        function onMouseMove(event) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }

        const clock = new THREE.Clock();
        function animate() {
            animationId = requestAnimationFrame(animate);

            if (isPaused) return; // ✅ skip rendering when paused

            const elapsedTime = clock.getElapsedTime();
            const mousePos3D = new THREE.Vector3(mouse.x, mouse.y, 0.5);
            mousePos3D.unproject(camera);
            const dir = mousePos3D.sub(camera.position).normalize();
            const distance = -camera.position.z / dir.z;
            const finalMousePos = camera.position.clone().add(dir.multiplyScalar(distance));
            finalMousePos.sub(mainGroup.position);

            const positions = particles.geometry.attributes.position.array;
            const colors = particles.geometry.attributes.color.array;
            const highlightColor = new THREE.Color(0xffd700);

            for (let i = 0; i < particleData.length; i++) {
                const i3 = i * 3;
                const data = particleData[i];

                const diff = new THREE.Vector3().subVectors(data.currentPos, finalMousePos);
                const dist = diff.length();
                let force = 0;
                if (dist < 8) {
                    force = (1 - (dist / 8)) * 0.05;
                    diff.normalize();
                    data.velocity.add(diff.multiplyScalar(force));
                }

                const springForce = new THREE.Vector3().subVectors(data.originalPos, data.currentPos).multiplyScalar(0.01);
                data.velocity.add(springForce);
                data.velocity.multiplyScalar(0.9);
                data.currentPos.add(data.velocity);

                positions[i3] = data.currentPos.x;
                positions[i3 + 1] = data.currentPos.y;
                positions[i3 + 2] = data.currentPos.z + Math.sin(data.originalPos.x * 0.1 + elapsedTime) * 1.5;

                let colorMix = dist < 8 ? (1 - dist / 8) : 0;
                const color = new THREE.Color(0x001f3f).lerp(highlightColor, colorMix);
                color.toArray(colors, i3);
            }

            particles.geometry.attributes.position.needsUpdate = true;
            particles.geometry.attributes.color.needsUpdate = true;

            composer.render();
        }

        // ✅ Just pause instead of destroying
        function pauseScene() {
            isPaused = true;
            document.getElementById('bg-canvas').style.display = 'none';
        }

        function resumeScene() {
            isPaused = false;
            document.getElementById('bg-canvas').style.display = 'block';
            mainGroup.position.x = 15; // keep shift
        }

        // ✅ Handle responsiveness
        const mq = window.matchMedia("(max-width: 1162px)");
        function handleMediaQuery(e) {
            if (e.matches) {
                pauseScene(); // mobile → hide + pause
            } else {
                resumeScene(); // desktop → show + resume
            }
        }
        mq.addEventListener("change", handleMediaQuery);

        // Run once
        init();
        animate();
        handleMediaQuery(mq);
