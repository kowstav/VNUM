import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Replace with your GitHub repo name
const repoName = 'your-repo'

export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`,
  optimizeDeps: {
    include: ['three', 'noisejs']
  }
})