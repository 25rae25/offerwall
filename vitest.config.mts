import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";

export default defineConfig({
  resolve: {
    // 소스에서 쓰는 @/ 경로를 테스트에서도 그대로 쓰기 위해
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
});
