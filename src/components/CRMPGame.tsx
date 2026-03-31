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
  const keysRef = useRef<Record<string, boolean>>({});
  const [state, setState] = useState<GameState>({
    inCar: false, speed: 0, gear: 1, health: 100, money: 500,
    hint: "Кликни на игру, затем WASD — движение  |  E — сесть в машину  |  ЛКМ — камера",
  });
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── SCENE ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 80, 220);

    // ── RENDERER ──
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    // ── CAMERA ──
    const camera = new THREE.PerspectiveCamera(70, mount.clientWidth / mount.clientHeight, 0.1, 500);

    // ── LIGHTS ──
    const sun = new THREE.DirectionalLight(0xffffff, 1.4);
    sun.position.set(60, 100, 40);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 400;
    sun.shadow.camera.left = -120;
    sun.shadow.camera.right = 120;
    sun.shadow.camera.top = 120;
    sun.shadow.camera.bottom = -120;
    scene.add(sun, new THREE.AmbientLight(0xffeedd, 0.7));

    // ── GROUND ──
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(500, 500),
      new THREE.MeshLambertMaterial({ color: 0x4a7c59 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // ── HELPER ──
    function box(w: number, h: number, d: number, color: number, x: number, y: number, z: number) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshLambertMaterial({ color }));
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      scene.add(m);
      return m;
    }

    // ── ROADS ──
    function road(x: number, z: number, w: number, l: number) {
      const r = new THREE.Mesh(new THREE.PlaneGeometry(w, l), new THREE.MeshLambertMaterial({ color: 0x2a2a2a }));
      r.rotation.x = -Math.PI / 2;
      r.position.set(x, 0.01, z);
      r.receiveShadow = true;
      scene.add(r);
      const cnt = Math.floor(l / 8);
      for (let i = 0; i < cnt; i++) {
        const mk = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 3), new THREE.MeshLambertMaterial({ color: 0xffffff }));
        mk.rotation.x = -Math.PI / 2;
        mk.position.set(x, 0.02, z - l / 2 + 4 + i * 8);
        scene.add(mk);
      }
    }
    road(0, 0, 10, 300);
    road(0, 0, 300, 10);
    road(45, 0, 8, 200);
    road(-45, 0, 8, 200);
    road(0, 55, 200, 8);
    road(0, -55, 200, 8);

    // ── SIDEWALKS ──
    function sidewalk(x: number, z: number, w: number, l: number) {
      const s = new THREE.Mesh(new THREE.PlaneGeometry(w, l), new THREE.MeshLambertMaterial({ color: 0x999999 }));
      s.rotation.x = -Math.PI / 2;
      s.position.set(x, 0.015, z);
      s.receiveShadow = true;
      scene.add(s);
    }
    sidewalk(7, 0, 3, 300);
    sidewalk(-7, 0, 3, 300);
    sidewalk(0, 7, 300, 3);
    sidewalk(0, -7, 300, 3);

    // ── BUILDINGS ──
    const bData = [
      { x: 18, z: 22, w: 12, h: 22, d: 12, color: 0x8b7355 },
      { x: 32, z: 20, w: 10, h: 32, d: 10, color: 0x6b8cba },
      { x: 18, z: 38, w: 14, h: 14, d: 10, color: 0x9b8b7a },
      { x: -18, z: 22, w: 12, h: 26, d: 12, color: 0x7a9e7a },
      { x: -32, z: 26, w: 10, h: 18, d: 14, color: 0xc4956a },
      { x: 18, z: -22, w: 14, h: 24, d: 12, color: 0xb5836a },
      { x: 32, z: -32, w: 10, h: 36, d: 10, color: 0x5577aa },
      { x: 20, z: -40, w: 8, h: 12, d: 8, color: 0xaaaa77 },
      { x: -18, z: -22, w: 12, h: 28, d: 12, color: 0x779977 },
      { x: -30, z: -30, w: 14, h: 16, d: 10, color: 0xcc8866 },
      { x: 60, z: 30, w: 16, h: 22, d: 14, color: 0x887799 },
      { x: 62, z: -22, w: 12, h: 34, d: 12, color: 0x668899 },
      { x: -60, z: 26, w: 14, h: 24, d: 14, color: 0x998866 },
      { x: -62, z: -26, w: 12, h: 20, d: 12, color: 0x779966 },
      { x: 0, z: 85, w: 22, h: 52, d: 22, color: 0x4466aa },
      { x: 0, z: -85, w: 22, h: 42, d: 22, color: 0x886644 },
    ];
    const collidables = bData.map(b => ({
      minX: b.x - b.w / 2 - 0.6, maxX: b.x + b.w / 2 + 0.6,
      minZ: b.z - b.d / 2 - 0.6, maxZ: b.z + b.d / 2 + 0.6,
    }));
    bData.forEach(b => {
      box(b.w, b.h, b.d, b.color, b.x, b.h / 2, b.z);
    });

    // ── TREES ──
    function tree(x: number, z: number) {
      box(0.4, 3, 0.4, 0x6b4513, x, 1.5, z);
      const top = new THREE.Mesh(new THREE.ConeGeometry(1.8, 3.5, 8), new THREE.MeshLambertMaterial({ color: 0x228b22 }));
      top.position.set(x, 5, z);
      top.castShadow = true;
      scene.add(top);
    }
    [[10,16],[-10,16],[10,-16],[-10,-16],[50,12],[50,-12],[-50,12],[-50,-12],
     [22,62],[-22,62],[22,-62],[-22,-62],[16,32],[-16,32],[16,-32]].forEach(([x,z])=>tree(x,z));

    // ── PLAYER ──
    const player = new THREE.Group();
    const bodyM = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.1, 0.4), new THREE.MeshLambertMaterial({ color: 0x1144cc }));
    bodyM.position.y = 0.55;
    bodyM.castShadow = true;
    const headM = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.44, 0.44), new THREE.MeshLambertMaterial({ color: 0xffcc99 }));
    headM.position.y = 1.42;
    headM.castShadow = true;
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.55, 0.22), new THREE.MeshLambertMaterial({ color: 0x222244 }));
    legL.position.set(-0.15, -0.28, 0);
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.55, 0.22), new THREE.MeshLambertMaterial({ color: 0x222244 }));
    legR.position.set(0.15, -0.28, 0);
    bodyM.add(legL, legR);
    player.add(bodyM, headM);
    player.position.set(3, 0, 3);
    scene.add(player);

    // ── CARS ──
    function makeCar(x: number, z: number, color: number) {
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      const bodyC = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.7, 4.5), new THREE.MeshLambertMaterial({ color }));
      bodyC.position.y = 0.65; bodyC.castShadow = true;
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.58, 2.2), new THREE.MeshLambertMaterial({ color }));
      cabin.position.set(0, 1.19, -0.2); cabin.castShadow = true;
      const winMat = new THREE.MeshLambertMaterial({ color: 0x99ccff, transparent: true, opacity: 0.6 });
      const fWin = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.45), winMat);
      fWin.position.set(0, 1.18, 0.91);
      const bWin = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.45), winMat);
      bWin.position.set(0, 1.18, -1.31); bWin.rotation.y = Math.PI;
      const wGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.24, 12);
      const wMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
      [[-1.15,0.34,1.4],[1.15,0.34,1.4],[-1.15,0.34,-1.4],[1.15,0.34,-1.4]].forEach(([wx,wy,wz])=>{
        const w = new THREE.Mesh(wGeo, wMat); w.rotation.z = Math.PI/2; w.position.set(wx,wy,wz); g.add(w);
      });
      const hlMat = new THREE.MeshLambertMaterial({ color: 0xffffaa, emissive: 0xffff00 });
      [-0.6,0.6].forEach(ox=>{ const hl=new THREE.Mesh(new THREE.BoxGeometry(0.28,0.18,0.08),hlMat); hl.position.set(ox,0.7,2.3); g.add(hl); });
      g.add(bodyC, cabin, fWin, bWin);
      scene.add(g);
      return g;
    }
    const cars = [
      makeCar(14, 12, 0xff2222),
      makeCar(-14, -12, 0x2288ff),
      makeCar(6, -18, 0xffaa00),
      makeCar(-18, 16, 0x22cc44),
    ];

    // ── COLLISION ──
    function collides(x: number, z: number, r: number) {
      for (const c of collidables) {
        if (x + r > c.minX && x - r < c.maxX && z + r > c.minZ && z - r < c.maxZ) return true;
      }
      return false;
    }

    function nearestCar() {
      let best: THREE.Group | null = null, bestD = 4.5;
      for (const car of cars) {
        const d = player.position.distanceTo(car.position);
        if (d < bestD) { best = car; bestD = d; }
      }
      return best;
    }

    // ── CAMERA STATE ──
    let camYaw = 0, camPitch = 0.35, camDist = 11;
    let isDrag = false, lastMX = 0, lastMY = 0;

    renderer.domElement.addEventListener("mousedown", e => {
      isDrag = true; lastMX = e.clientX; lastMY = e.clientY;
    });
    window.addEventListener("mouseup", () => { isDrag = false; });
    window.addEventListener("mousemove", e => {
      if (!isDrag) return;
      camYaw   -= (e.clientX - lastMX) * 0.006;
      camPitch  = Math.max(0.1, Math.min(0.9, camPitch - (e.clientY - lastMY) * 0.004));
      lastMX = e.clientX; lastMY = e.clientY;
    });
    renderer.domElement.addEventListener("wheel", e => {
      camDist = Math.max(4, Math.min(28, camDist + e.deltaY * 0.02));
      e.preventDefault();
    }, { passive: false });

    // ── INPUT — вешаем на document чтобы всегда работало ──
    const keys = keysRef.current;
    const onKD = (e: KeyboardEvent) => {
      keys[e.code] = true;
      if (["KeyW","KeyA","KeyS","KeyD","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space","KeyE"].includes(e.code)) {
        e.preventDefault();
      }
    };
    const onKU = (e: KeyboardEvent) => { keys[e.code] = false; };
    document.addEventListener("keydown", onKD);
    document.addEventListener("keyup", onKU);

    // ── GAME STATE ──
    let inCar = false, currentCar: THREE.Group | null = null;
    let carSpeed = 0, carAngle = 0;
    let eWasDown = false;
    let walkTime = 0;

    // ── LOOP ──
    let animId: number;
    let prev = performance.now();

    const tick = () => {
      animId = requestAnimationFrame(tick);
      const now = performance.now();
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;

      const W = keys["KeyW"] || keys["ArrowUp"];
      const S = keys["KeyS"] || keys["ArrowDown"];
      const A = keys["KeyA"] || keys["ArrowLeft"];
      const D = keys["KeyD"] || keys["ArrowRight"];
      const E = keys["KeyE"];
      const SHIFT = keys["ShiftLeft"] || keys["ShiftRight"];

      // ── E — войти/выйти ──
      if (E && !eWasDown) {
        eWasDown = true;
        if (!inCar) {
          const near = nearestCar();
          if (near) { inCar = true; currentCar = near; player.visible = false; }
        } else {
          inCar = false;
          if (currentCar) {
            player.position.set(
              currentCar.position.x + Math.sin(carAngle + Math.PI / 2) * 3,
              0,
              currentCar.position.z + Math.cos(carAngle + Math.PI / 2) * 3
            );
          }
          player.visible = true;
          currentCar = null;
          carSpeed = 0;
        }
      }
      if (!E) eWasDown = false;

      // ── В МАШИНЕ ──
      if (inCar && currentCar) {
        const accel = W ? 1 : S ? -0.5 : 0;
        const steer = A ? 1 : D ? -1 : 0;
        const MAX = 30;
        carSpeed += accel * 14 * dt;
        carSpeed *= 0.91;
        carSpeed = Math.max(-9, Math.min(MAX, carSpeed));
        if (Math.abs(carSpeed) > 0.15) carAngle += steer * 1.9 * dt * (carSpeed / MAX);

        const nx = currentCar.position.x + Math.sin(carAngle) * carSpeed * dt;
        const nz = currentCar.position.z + Math.cos(carAngle) * carSpeed * dt;
        if (!collides(nx, nz, 1.6)) {
          currentCar.position.x = Math.max(-190, Math.min(190, nx));
          currentCar.position.z = Math.max(-190, Math.min(190, nz));
        } else { carSpeed *= -0.25; }
        currentCar.rotation.y = carAngle;

        const spd = Math.abs(carSpeed);
        const gear = spd < 4 ? 1 : spd < 11 ? 2 : spd < 20 ? 3 : 4;
        setState(s => ({ ...s, inCar: true, speed: Math.round(spd * 3.6), gear, hint: "E — выйти из машины  |  WASD — управление" }));

      // ── ПЕШКОМ ──
      } else {
        const moving = W || S || A || D;
        const spd = SHIFT ? 8 : 4.5;

        if (moving) {
          walkTime += dt;

          // направление относительно yaw камеры
          const fwd = (W ? 1 : 0) - (S ? 1 : 0);
          const rgt = (D ? 1 : 0) - (A ? 1 : 0);

          // вектор движения в мировых координатах
          const mx = rgt * Math.cos(camYaw) + fwd * Math.sin(camYaw);
          const mz = rgt * -Math.sin(camYaw) + fwd * Math.cos(camYaw);
          const len = Math.sqrt(mx * mx + mz * mz) || 1;

          const nx = player.position.x + (mx / len) * spd * dt;
          const nz = player.position.z + (mz / len) * spd * dt;

          if (!collides(nx, player.position.z, 0.4)) player.position.x = Math.max(-190, Math.min(190, nx));
          if (!collides(player.position.x, nz, 0.4)) player.position.z = Math.max(-190, Math.min(190, nz));

          // поворот персонажа в сторону движения
          player.rotation.y = Math.atan2(mx / len, mz / len);

          // анимация ног
          const swing = Math.sin(walkTime * spd * 2.5) * 0.35;
          legL.rotation.x = swing;
          legR.rotation.x = -swing;
          bodyM.position.y = 0.55 + Math.abs(Math.sin(walkTime * spd * 2.5)) * 0.03;
        } else {
          walkTime = 0;
          legL.rotation.x = 0;
          legR.rotation.x = 0;
          bodyM.position.y = 0.55;
        }

        const near = nearestCar();
        setState(s => ({
          ...s, inCar: false, speed: 0, gear: 1,
          hint: near ? "Нажми E — сесть в машину" : "WASD — движение  |  Shift — бег  |  Подойди к машине → E",
        }));
      }

      // ── КАМЕРА ──
      const target = inCar && currentCar ? currentCar.position : player.position;
      const cx = target.x + Math.sin(camYaw) * Math.cos(camPitch) * camDist;
      const cy = target.y + Math.sin(camPitch) * camDist + 0.5;
      const cz = target.z + Math.cos(camYaw) * Math.cos(camPitch) * camDist;
      camera.position.lerp(new THREE.Vector3(cx, cy, cz), 0.1);
      camera.lookAt(target.x, target.y + 1.2, target.z);

      renderer.render(scene, camera);
    };
    tick();

    // ── RESIZE ──
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("keydown", onKD);
      document.removeEventListener("keyup", onKU);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mouseup", () => { isDrag = false; });
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-full rounded-xl overflow-hidden" style={{ height: "calc(100vh - 130px)" }}>
      <div ref={mountRef} className="w-full h-full" />

      {/* Оверлей если нет фокуса */}
      {!focused && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}
          onClick={() => setFocused(true)}
        >
          <div className="text-center px-8 py-6 rounded-2xl" style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(0,245,255,0.3)" }}>
            <div className="text-4xl mb-3">🎮</div>
            <div className="font-orbitron font-bold text-xl mb-2" style={{ color: "#00f5ff" }}>НАЖМИ ЧТОБЫ ИГРАТЬ</div>
            <div className="font-rajdhani text-sm" style={{ color: "rgba(200,220,240,0.7)" }}>WASD — ходить · E — сесть в машину · ЛКМ — камера</div>
          </div>
        </div>
      )}

      {/* HUD */}
      <div className="absolute top-4 left-4 space-y-2 pointer-events-none">
        {state.inCar && (
          <div className="px-4 py-3 rounded-xl" style={{ background: "rgba(0,0,0,0.72)", border: "1px solid rgba(0,245,255,0.3)" }}>
            <div className="font-orbitron font-black text-3xl leading-none" style={{ color: "#00f5ff", textShadow: "0 0 15px rgba(0,245,255,0.8)" }}>
              {state.speed} <span className="text-sm font-normal">км/ч</span>
            </div>
            <div className="font-mono text-xs mt-1" style={{ color: "rgba(0,245,255,0.6)" }}>ПЕРЕДАЧА {state.gear}</div>
          </div>
        )}
        <div className="px-3 py-2 rounded-lg flex items-center gap-3" style={{ background: "rgba(0,0,0,0.65)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <span>❤️</span>
          <div className="w-28 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>
            <div className="h-2 rounded-full" style={{ width: `${state.health}%`, background: "linear-gradient(90deg,#ff2d78,#ff6b6b)", boxShadow: "0 0 6px rgba(255,45,120,0.6)" }} />
          </div>
          <span className="font-mono text-xs" style={{ color: "#ff6b6b" }}>{state.health}</span>
        </div>
        <div className="px-3 py-2 rounded-lg flex items-center gap-2" style={{ background: "rgba(0,0,0,0.65)", border: "1px solid rgba(255,215,0,0.2)" }}>
          <span>💰</span>
          <span className="font-orbitron font-bold text-sm" style={{ color: "#ffd700" }}>${state.money}</span>
        </div>
      </div>

      {/* Minimap */}
      <div className="absolute top-4 right-4 rounded-xl overflow-hidden pointer-events-none"
        style={{ width: 130, height: 130, background: "rgba(0,0,0,0.75)", border: "1px solid rgba(0,245,255,0.3)" }}>
        <div className="w-full h-full relative" style={{ background: "#182818" }}>
          <div className="absolute" style={{ left: "47%", top: 0, width: "6%", height: "100%", background: "#444" }} />
          <div className="absolute" style={{ left: 0, top: "47%", width: "100%", height: "6%", background: "#444" }} />
          <div className="absolute w-2.5 h-2.5 rounded-full" style={{ background: "#00f5ff", boxShadow: "0 0 8px #00f5ff", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }} />
        </div>
        <div className="absolute bottom-1 left-0 right-0 text-center font-mono text-xs" style={{ color: "rgba(0,245,255,0.5)" }}>КАРТА</div>
      </div>

      {/* Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full pointer-events-none"
        style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.15)" }}>
        <span className="font-rajdhani text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>{state.hint}</span>
      </div>

      {state.inCar && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full pointer-events-none"
          style={{ background: "rgba(0,245,255,0.15)", border: "1px solid rgba(0,245,255,0.4)" }}>
          <span>🚗</span>
          <span className="font-orbitron text-xs font-bold" style={{ color: "#00f5ff" }}>В МАШИНЕ</span>
        </div>
      )}
    </div>
  );
}
