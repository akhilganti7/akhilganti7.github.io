import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Site lives at https://YOUR-USERNAME.github.io (repo named YOUR-USERNAME.github.io), so base is "/".
// If you ever host it at https://YOUR-USERNAME.github.io/some-repo instead, change base to "/some-repo/".
export default defineConfig({
  base: '/',
  plugins: [react()],
})
