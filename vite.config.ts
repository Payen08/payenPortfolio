import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

const VIRTUAL_MODULE_ID = 'virtual:work-images';
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`;
const supportedImage = /\.(png|webp|gif)$/i;

function readImageSize(filePath: string) {
  const buffer = fs.readFileSync(filePath);

  // PNG: the IHDR width and height are fixed at bytes 16–23.
  if (buffer.length >= 24 && buffer.toString('ascii', 1, 4) === 'PNG') {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }

  // GIF: logical screen dimensions are stored directly after the signature.
  if (buffer.length >= 10 && buffer.toString('ascii', 0, 3) === 'GIF') {
    return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
  }

  if (buffer.length >= 30 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = buffer.toString('ascii', 12, 16);

    if (chunk === 'VP8X') {
      return { width: buffer.readUIntLE(24, 3) + 1, height: buffer.readUIntLE(27, 3) + 1 };
    }

    if (chunk === 'VP8L' && buffer.length >= 25) {
      const b1 = buffer[21];
      const b2 = buffer[22];
      const b3 = buffer[23];
      const b4 = buffer[24];
      return {
        width: 1 + (b1 | ((b2 & 0x3f) << 8)),
        height: 1 + ((b2 >> 6) | (b3 << 2) | ((b4 & 0x0f) << 10)),
      };
    }

    if (chunk === 'VP8 ' && buffer.length >= 30) {
      return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
    }
  }

  return { width: 16, height: 9 };
}

function createWorkImageManifest(root: string) {
  const workRoot = path.resolve(root, 'public/work');
  let base = '/';

  const readManifest = () => {
    if (!fs.existsSync(workRoot)) return {};

    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    const manifest: Record<string, Array<{ src: string; width: number; height: number }>> = {};

    for (const entry of fs.readdirSync(workRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;

      manifest[entry.name] = fs
        .readdirSync(path.join(workRoot, entry.name), { withFileTypes: true })
        .filter((file) => file.isFile() && supportedImage.test(file.name))
        .map((file) => file.name)
        .sort(collator.compare)
        .map((fileName) => ({
          src: `${base}work/${entry.name}/${encodeURIComponent(fileName)}`,
          ...readImageSize(path.join(workRoot, entry.name, fileName)),
        }));
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

/**
 * GitHub Pages 没有 SPA 回退：刷新子路由（如 /project/1）会 404。
 * 该插件在构建完成后把 index.html 复制为 404.html，
 * 使 GitHub Pages 对任意未匹配路径都返回 SPA 入口，由前端路由接管渲染。
 */
function generate404Page(): Plugin {
  return {
    name: 'generate-404-page',
    closeBundle() {
      const outDir = path.resolve(process.cwd(), 'dist');
      const indexFile = path.join(outDir, 'index.html');
      const errorFile = path.join(outDir, '404.html');
      if (fs.existsSync(indexFile)) {
        fs.copyFileSync(indexFile, errorFile);
        console.log('[generate-404-page] created 404.html for SPA deep-link fallback');
      }
    },
  };
}

export default defineConfig(() => {
  return {
    // GitHub Pages 子路径部署：仓库名 payenPortfolio
    base: '/payenPortfolio/',
    plugins: [createWorkImageManifest(process.cwd()), generate404Page(), react(), tailwindcss()],
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
