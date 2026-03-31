import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface GameState {
  inCar: boolean;
  speed: number;
  gear: number;
  health: number;
  money: number;
  hint: string;
}

export default function CRMPGame() {
  const mountRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<{ renderer: THREE.WebGLRenderer; animId: number } | null>(null);
  const [state, setState] = useState<GameState>({
    inCar: false, speed: 0, gear: 1, health: 100, money: 500, hint: "WASD — движение  |  E — сесть/выйти из машины  |  ЛКМ — камера"
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── SCENE ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 60, 200);

    // ── RENDERER ──
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // ── CAMERA ──
    const camera = new THREE.PerspectiveCamera(70, mount.clientWidth / mount.clientHeight, 0.1, 500);
    camera.position.set(0, 6, 12);

    // ── LIGHTS ──
    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(50, 80, 30);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 300;
    sun.shadow.camera.left = -100;
    sun.shadow.camera.right = 100;
    sun.shadow.camera.top = 100;
    sun.shadow.camera.bottom = -100;
    scene.add(sun);
    scene.add(new THREE.AmbientLight(0xffeedd, 0.6));

    // ── GROUND ──
    const groundGeo = new THREE.PlaneGeometry(400, 400);
    const groundMat = new THREE.MeshLambertMaterial({ color: 0x4a7c59 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // ── HELPERS ──
    function makeBox(w: number, h: number, d: number, color: number, x: number, y: number, z: number, castShadow = true) {
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshLambertMaterial({ color })
      );
      m.position.set(x, y, z);
      m.castShadow = castShadow;
      m.receiveShadow = true;
      scene.add(m);
      return m;
    }

    // ── ROADS ──
    function makeRoad(x: number, z: number, w: number, l: number) {
      const r = new THREE.Mesh(
        new THREE.PlaneGeometry(w, l),
        new THREE.MeshLambertMaterial({ color: 0x333333 })
      );
      r.rotation.x = -Math.PI / 2;
      r.position.set(x, 0.01, z);
      r.receiveShadow = true;
      scene.add(r);

      // road markings
      const mCount = Math.floor(l / 10);
      for (let i = 0; i < mCount; i++) {
        const mark = new THREE.Mesh(
          new THREE.PlaneGeometry(0.3, 3),
          new THREE.MeshLambertMaterial({ color: 0xffffff })
        );
        mark.rotation.x = -Math.PI / 2;
        mark.position.set(x, 0.02, z - l / 2 + 5 + i * 10);
        scene.add(mark);
      }
    }

    // Main roads
    makeRoad(0, 0, 10, 300);     // vertical main
    makeRoad(0, 0, 300, 10);     // horizontal main
    makeRoad(40, 0, 8, 200);     // right vertical
    makeRoad(-40, 0, 8, 200);    // left vertical
    makeRoad(0, 50, 200, 8);     // top horizontal
    makeRoad(0, -50, 200, 8);    // bottom horizontal

    // ── SIDEWALKS ──
    function makeSidewalk(x: number, z: number, w: number, l: number) {
      const s = new THREE.Mesh(
        new THREE.PlaneGeometry(w, l),
        new THREE.MeshLambertMaterial({ color: 0xaaaaaa })
      );
      s.rotation.x = -Math.PI / 2;
      s.position.set(x, 0.015, z);
      s.receiveShadow = true;
      scene.add(s);
    }
    makeSidewalk(7, 0, 3, 300);
    makeSidewalk(-7, 0, 3, 300);
    makeSidewalk(0, 7, 300, 3);
    makeSidewalk(0, -7, 300, 3);

    // ── BUILDINGS ──
    const buildingData = [
      // block 1
      { x: 18, z: 20, w: 12, h: 20, d: 12, color: 0x8b7355 },
      { x: 32, z: 20, w: 10, h: 30, d: 10, color: 0x6b8cba },
      { x: 18, z: 35, w: 14, h: 15, d: 10, color: 0x9b8b7a },
      // block 2
      { x: -18, z: 20, w: 12, h: 25, d: 12, color: 0x7a9e7a },
      { x: -32, z: 25, w: 10, h: 18, d: 14, color: 0xc4956a },
      // block 3
      { x: 18, z: -20, w: 14, h: 22, d: 12, color: 0xb5836a },
      { x: 32, z: -30, w: 10, h: 35, d: 10, color: 0x5577aa },
      { x: 20, z: -38, w: 8, h: 12, d: 8, color: 0xaaaa77 },
      // block 4
      { x: -18, z: -20, w: 12, h: 28, d: 12, color: 0x779977 },
      { x: -30, z: -28, w: 14, h: 16, d: 10, color: 0xcc8866 },
      // block 5 — far
      { x: 55, z: 30, w: 16, h: 20, d: 14, color: 0x887799 },
      { x: 60, z: -20, w: 12, h: 32, d: 12, color: 0x668899 },
      { x: -55, z: 25, w: 14, h: 24, d: 14, color: 0x998866 },
      { x: -60, z: -25, w: 12, h: 18, d: 12, color: 0x779966 },
      // center landmark
      { x: 0, z: 80, w: 20, h: 50, d: 20, color: 0x4466aa },
      { x: 0, z: -80, w: 20, h: 40, d: 20, color: 0x886644 },
    ];

    const buildings: THREE.Mesh[] = [];
    buildingData.forEach(b => {
      const building = makeBox(b.w, b.h, b.d, b.color, b.x, b.h / 2, b.z);
      // windows
      const winMat = new THREE.MeshLambertMaterial({ color: 0xffffcc, emissive: 0x444400 });
      const rows = Math.floor(b.h / 4);
      const cols = 3;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() > 0.3) {
            const win = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.8), winMat);
            win.position.set(
              b.x + (c - 1) * 2.5,
              2 + r * 4,
              b.z + b.d / 2 + 0.05
            );
            scene.add(win);
          }
        }
      }
      buildings.push(building);
    });

    // ── TREES ──
    function makeTree(x: number, z: number) {
      makeBox(0.4, 3, 0.4, 0x8b6914, x, 1.5, z, false);
      const top = new THREE.Mesh(
        new THREE.ConeGeometry(1.5, 3, 7),
        new THREE.MeshLambertMaterial({ color: 0x228b22 })
      );
      top.position.set(x, 4.5, z);
      top.castShadow = true;
      scene.add(top);
    }

    const treePositions = [
      [10, 15], [-10, 15], [10, -15], [-10, -15],
      [45, 10], [45, -10], [-45, 10], [-45, -10],
      [20, 60], [-20, 60], [20, -60], [-20, -60],
      [15, 30], [-15, 30], [15, -30],
      [50, 50], [-50, 50], [50, -50], [-50, -50],
    ];
    treePositions.forEach(([x, z]) => makeTree(x, z));

    // ── STREET LIGHTS ──
    function makeLight(x: number, z: number) {
      makeBox(0.15, 5, 0.15, 0x555555, x, 2.5, z, false);
      const head = makeBox(1.5, 0.15, 0.15, 0x555555, x + 0.75, 5.1, z, false);
      const bulb = new THREE.PointLight(0xfff5cc, 0.8, 20);
      bulb.position.set(x + 1.5, 5, z);
      scene.add(bulb);
    }
    [[12, 10], [-12, 10], [12, -10], [-12, -10],
     [12, 30], [-12, 30], [12, -30], [-12, -30],
     [45, 20], [-45, 20]].forEach(([x, z]) => makeLight(x, z));

    // ── PLAYER ──
    const playerGroup = new THREE.Group();
    // body
    const bodyMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 1.2, 0.4),
      new THREE.MeshLambertMaterial({ color: 0x2255aa })
    );
    bodyMesh.position.y = 0.6;
    bodyMesh.castShadow = true;
    // head
    const headMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.45, 0.45),
      new THREE.MeshLambertMaterial({ color: 0xffcc99 })
    );
    headMesh.position.y = 1.5;
    headMesh.castShadow = true;
    playerGroup.add(bodyMesh, headMesh);
    playerGroup.position.set(0, 0, 5);
    scene.add(playerGroup);

    // ── CAR ──
    function makeCar(x: number, z: number, color: number) {
      const carGroup = new THREE.Group();
      carGroup.position.set(x, 0, z);

      // body
      const bodyC = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.7, 4.5),
        new THREE.MeshLambertMaterial({ color })
      );
      bodyC.position.y = 0.65;
      bodyC.castShadow = true;

      // cabin
      const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.6, 2.2),
        new THREE.MeshLambertMaterial({ color })
      );
      cabin.position.set(0, 1.2, -0.2);
      cabin.castShadow = true;

      // windows
      const winMat2 = new THREE.MeshLambertMaterial({ color: 0x88ccff, transparent: true, opacity: 0.7 });
      const frontWin = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.5), winMat2);
      frontWin.position.set(0, 1.2, 0.91);
      const backWin = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.5), winMat2);
      backWin.position.set(0, 1.2, -1.31);
      backWin.rotation.y = Math.PI;

      // wheels
      const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 12);
      const wheelMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
      const wheelPositions = [
        [-1.15, 0.35, 1.4], [1.15, 0.35, 1.4],
        [-1.15, 0.35, -1.4], [1.15, 0.35, -1.4]
      ];
      wheelPositions.forEach(([wx, wy, wz]) => {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, wy, wz);
        wheel.castShadow = true;
        carGroup.add(wheel);
      });

      // headlights
      const hlMat = new THREE.MeshLambertMaterial({ color: 0xffffaa, emissive: 0xffff44 });
      [-0.6, 0.6].forEach(ox => {
        const hl = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.1), hlMat);
        hl.position.set(ox, 0.7, 2.3);
        carGroup.add(hl);
      });

      carGroup.add(bodyC, cabin, frontWin, backWin);
      carGroup.castShadow = true;
      scene.add(carGroup);
      return carGroup;
    }

    const cars = [
      makeCar(15, 10, 0xff3333),
      makeCar(-15, -10, 0x33aaff),
      makeCar(5, -20, 0xffaa22),
      makeCar(-20, 15, 0x44cc44),
    ];

    // ── COLLISION BOXES (simplified) ──
    const collidables = buildingData.map(b => ({
      minX: b.x - b.w / 2 - 0.5,
      maxX: b.x + b.w / 2 + 0.5,
      minZ: b.z - b.d / 2 - 0.5,
      maxZ: b.z + b.d / 2 + 0.5,
    }));

    function checkCollision(x: number, z: number, r: number) {
      for (const c of collidables) {
        if (x + r > c.minX && x - r < c.maxX && z + r > c.minZ && z - r < c.maxZ) return true;
      }
      return false;
    }

    // ── INPUT ──
    const keys: Record<string, boolean> = {};
    const onKeyDown = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = true;
      if (["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"," "].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // ── CAMERA MOUSE ──
    let camYaw = 0, camPitch = 0.3;
    let isDragging = false;
    let lastMX = 0, lastMY = 0;
    mount.addEventListener("mousedown", e => { isDragging = true; lastMX = e.clientX; lastMY = e.clientY; });
    window.addEventListener("mouseup", () => { isDragging = false; });
    window.addEventListener("mousemove", e => {
      if (!isDragging) return;
      camYaw -= (e.clientX - lastMX) * 0.005;
      camPitch = Math.max(0.1, Math.min(1.0, camPitch - (e.clientY - lastMY) * 0.004));
      lastMX = e.clientX; lastMY = e.clientY;
    });
    mount.addEventListener("wheel", e => {
      camDist = Math.max(4, Math.min(30, camDist + e.deltaY * 0.02));
    });

    // ── GAME STATE ──
    let camDist = 10;
    let inCar = false;
    let playerAngle = 0;
    let carSpeed = 0;
    let carAngle = 0;
    let currentCar: THREE.Group | null = null;
    let ePressed = false;

    function getNearestCar() {
      let best: THREE.Group | null = null;
      let bestDist = 4;
      cars.forEach(car => {
        const d = playerGroup.position.distanceTo(car.position);
        if (d < bestDist) { best = car; bestDist = d; }
      });
      return best;
    }

    // ── ANIMATE ──
    let animId: number;
    let lastTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // E key — enter/exit car
      const eDown = keys["e"];
      if (eDown && !ePressed) {
        ePressed = true;
        if (!inCar) {
          const near = getNearestCar();
          if (near) {
            inCar = true;
            currentCar = near;
            playerGroup.visible = false;
          }
        } else {
          inCar = false;
          if (currentCar) {
            playerGroup.position.set(
              currentCar.position.x + Math.sin(carAngle + Math.PI / 2) * 2.5,
              0,
              currentCar.position.z + Math.cos(carAngle + Math.PI / 2) * 2.5
            );
          }
          currentCar = null;
          playerGroup.visible = true;
          carSpeed = 0;
        }
      }
      if (!eDown) ePressed = false;

      if (inCar && currentCar) {
        // Car physics
        const accel = keys["w"] || keys["arrowup"] ? 1 : keys["s"] || keys["arrowdown"] ? -0.4 : 0;
        const steer = keys["a"] || keys["arrowleft"] ? 1 : keys["d"] || keys["arrowright"] ? -1 : 0;

        const maxSpeed = 28;
        const friction = 0.92;
        carSpeed += accel * 12 * dt;
        carSpeed *= friction;
        carSpeed = Math.max(-8, Math.min(maxSpeed, carSpeed));

        if (Math.abs(carSpeed) > 0.1) {
          carAngle += steer * 1.8 * dt * (carSpeed / maxSpeed);
        }

        const nx = currentCar.position.x + Math.sin(carAngle) * carSpeed * dt;
        const nz = currentCar.position.z + Math.cos(carAngle) * carSpeed * dt;

        if (!checkCollision(nx, nz, 1.5)) {
          currentCar.position.x = nx;
          currentCar.position.z = nz;
        } else {
          carSpeed *= -0.3;
        }

        currentCar.position.x = Math.max(-190, Math.min(190, currentCar.position.x));
        currentCar.position.z = Math.max(-190, Math.min(190, currentCar.position.z));
        currentCar.rotation.y = carAngle;

        // Update state
        const spd = Math.abs(carSpeed);
        const gear = spd < 5 ? 1 : spd < 12 ? 2 : spd < 20 ? 3 : 4;
        setState(s => ({ ...s, inCar: true, speed: Math.round(spd * 3.6), gear, hint: "E — выйти из машины  |  WASD — управление" }));

      } else {
        // Player movement — relative to camera yaw
        const moveSpeed = keys["shift"] ? 8 : 4;
        const fw = (keys["w"] || keys["arrowup"]) ? 1 : 0;
        const bk = (keys["s"] || keys["arrowdown"]) ? 1 : 0;
        const lt = (keys["a"] || keys["arrowleft"]) ? 1 : 0;
        const rt = (keys["d"] || keys["arrowright"]) ? 1 : 0;

        const dx = rt - lt;
        const dz = bk - fw;

        if (dx !== 0 || dz !== 0) {
          // world-space direction based on camera yaw
          const sinY = Math.sin(camYaw);
          const cosY = Math.cos(camYaw);

          // forward = -Z in camera space
          const worldX = dx * cosY + dz * sinY;
          const worldZ = -dx * sinY + dz * cosY;

          const len = Math.sqrt(worldX * worldX + worldZ * worldZ);
          const nx = playerGroup.position.x + (worldX / len) * moveSpeed * dt;
          const nz = playerGroup.position.z + (worldZ / len) * moveSpeed * dt;

          if (!checkCollision(nx, nz, 0.5)) {
            playerGroup.position.x = nx;
            playerGroup.position.z = nz;
          }
          playerGroup.position.x = Math.max(-190, Math.min(190, playerGroup.position.x));
          playerGroup.position.z = Math.max(-190, Math.min(190, playerGroup.position.z));

          // Rotate player to face movement direction
          playerAngle = Math.atan2(worldX / len, worldZ / len);
          playerGroup.rotation.y = playerAngle;

          // Leg animation
          const t = now * 0.008;
          bodyMesh.position.y = 0.6 + Math.abs(Math.sin(t * moveSpeed)) * 0.05;
          headMesh.position.y = 1.5 + Math.abs(Math.sin(t * moveSpeed)) * 0.05;
        }

        const near = getNearestCar();
        setState(s => ({
          ...s, inCar: false, speed: 0, gear: 1,
          hint: near ? "Нажми E — сесть в машину" : "WASD — движение  |  Подойди к машине и нажми E"
        }));
      }

      // Camera follow
      const target = inCar && currentCar ? currentCar.position : playerGroup.position;
      const camX = target.x + Math.sin(camYaw) * camDist * Math.cos(camPitch);
      const camY = target.y + Math.sin(camPitch) * camDist + 1;
      const camZ = target.z + Math.cos(camYaw) * camDist * Math.cos(camPitch);
      camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.12);
      camera.lookAt(target.x, target.y + 1.5, target.z);

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    gameRef.current = { renderer, animId };

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-full rounded-xl overflow-hidden" style={{ height: "calc(100vh - 130px)", background: "#000" }}>
      <div ref={mountRef} className="w-full h-full" />

      {/* HUD */}
      <div className="absolute top-4 left-4 space-y-2 pointer-events-none">
        {/* Speedometer */}
        {state.inCar && (
          <div className="px-4 py-3 rounded-xl" style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(0,245,255,0.3)", backdropFilter: "blur(10px)" }}>
            <div className="font-orbitron font-black text-3xl leading-none" style={{ color: "#00f5ff", textShadow: "0 0 15px rgba(0,245,255,0.8)" }}>
              {state.speed} <span className="text-sm font-normal">км/ч</span>
            </div>
            <div className="font-mono text-xs mt-1" style={{ color: "rgba(0,245,255,0.6)" }}>ПЕРЕДАЧА {state.gear}</div>
          </div>
        )}

        {/* Health */}
        <div className="px-3 py-2 rounded-lg flex items-center gap-3" style={{ background: "rgba(0,0,0,0.65)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <span className="text-lg">❤️</span>
          <div className="flex-1">
            <div className="w-28 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>
              <div className="h-2 rounded-full" style={{ width: `${state.health}%`, background: "linear-gradient(90deg, #ff2d78, #ff6b6b)", boxShadow: "0 0 6px rgba(255,45,120,0.6)" }} />
            </div>
          </div>
          <span className="font-mono text-xs" style={{ color: "#ff6b6b" }}>{state.health}</span>
        </div>

        {/* Money */}
        <div className="px-3 py-2 rounded-lg flex items-center gap-2" style={{ background: "rgba(0,0,0,0.65)", border: "1px solid rgba(255,215,0,0.2)" }}>
          <span className="text-base">💰</span>
          <span className="font-orbitron font-bold text-sm" style={{ color: "#ffd700" }}>${state.money.toLocaleString("ru")}</span>
        </div>
      </div>

      {/* Minimap */}
      <div className="absolute top-4 right-4 rounded-xl overflow-hidden pointer-events-none"
        style={{ width: 140, height: 140, background: "rgba(0,0,0,0.75)", border: "1px solid rgba(0,245,255,0.3)" }}>
        <div className="w-full h-full relative" style={{ background: "#1a2a1a" }}>
          {/* roads */}
          <div className="absolute" style={{ left: "48%", top: 0, width: "4%", height: "100%", background: "#444" }} />
          <div className="absolute" style={{ left: 0, top: "48%", width: "100%", height: "4%", background: "#444" }} />
          {/* player dot */}
          <div className="absolute w-2 h-2 rounded-full" style={{ background: "#00f5ff", boxShadow: "0 0 6px #00f5ff", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }} />
        </div>
        <div className="absolute bottom-1 left-0 right-0 text-center font-mono text-xs" style={{ color: "rgba(0,245,255,0.5)" }}>КАРТА</div>
      </div>

      {/* Hint bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full pointer-events-none"
        style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}>
        <span className="font-rajdhani text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>{state.hint}</span>
      </div>

      {/* Car indicator */}
      {state.inCar && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full pointer-events-none"
          style={{ background: "rgba(0,245,255,0.15)", border: "1px solid rgba(0,245,255,0.4)" }}>
          <span className="text-sm">🚗</span>
          <span className="font-orbitron text-xs font-bold" style={{ color: "#00f5ff" }}>В МАШИНЕ</span>
        </div>
      )}
    </div>
  );
}