import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

const VIRTUAL_MODULE_ID = 'virtual:work-images';
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`;
const supportedImage = /\.(png|webp|gif)$/i;

function createWorkImageManifest(root: string) {
  const workRoot = path.resolve(root, 'public/work');
  let base = '/';

  const readManifest = () => {
    if (!fs.existsSync(workRoot)) return {};

    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    const manifest: Record<string, string[]> = {};

    for (const entry of fs.readdirSync(workRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;

      manifest[entry.name] = fs
        .readdirSync(path.join(workRoot, entry.name), { withFileTypes: true })
        .filter((file) => file.isFile() && supportedImage.test(file.name))
        .map((file) => file.name)
        .sort(collator.compare)
        .map((fileName) => `${base}work/${entry.name}/${encodeURIComponent(fileName)}`);
    }

    return manifest;
  };

  return {
    name: 'work-image-manifest',
    configResolved(config) {
      base = config.base;
    },
    resolveId(id) {
      return id === VIRTUAL_MODULE_ID ? RESOLVED_VIRTUAL_MODULE_ID : undefined;
    },
    load(id) {
      if (id !== RESOLVED_VIRTUAL_MODULE_ID) return undefined;
      return `export default ${JSON.stringify(readManifest())}`;
    },
    configureServer(server) {
      server.watcher.add(workRoot);
      const reloadManifest = (file: string) => {
        if (!file.startsWith(workRoot) || !supportedImage.test(file)) return;
        const module = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID);
        if (module) server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', reloadManifest);
      server.watcher.on('unlink', reloadManifest);
    },
  } satisfies Plugin;
}

export default defineConfig(() => {
  return {
    // GitHub Pages 子路径部署：仓库名 payenPortfolio
    base: '/payenPortfolio/',
    plugins: [createWorkImageManifest(process.cwd()), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
