// @ts-check
import react from '@vitejs/plugin-react'
import createSvgSpritePlugin from 'vite-plugin-svg-sprite'

/**
 * @type { import('vite').UserConfig }
 */
const config = {
  base: './',
  plugins: [
    react(),
    createSvgSpritePlugin({
      symbolId: 'icon-[name]',
    }),
  ],
  build: {
    outDir: './dist/web',
  },
  server: {
    port: 9999,
  },
}

export default config
