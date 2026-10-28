import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" → 빌드 결과(dist)를 상대 경로로 만들어서
// Capacitor 같은 앱 래퍼 안에서도 파일을 바로 열 수 있게 합니다.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
