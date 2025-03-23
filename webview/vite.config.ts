import type { UserConfig } from 'vite'
import react from "@vitejs/plugin-react"
import svgr from 'vite-plugin-svgr';

const config: UserConfig = {
  plugins: [react(), svgr()],
  build: {
    minify: 'esbuild',
    outDir: "build",
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
    sourcemap: true,
    cssCodeSplit: false,
    assetsInlineLimit: 0,
  },
  base: './',
  server: {
    port: 3000,
    hmr: {
      protocol: "ws",
      host: "localhost",
    },
  },
}

export default config