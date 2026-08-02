# Work 项目图片

每个项目创建一个与 `src/data.ts` 中 `slug` 同名的文件夹：

```text
public/work/project-01/
├── 01.png
├── 02.webp
├── 03.gif
└── 10.png
```

- 支持 PNG、WebP 和 GIF。
- 页面会按自然数字顺序自动读取、展示全部图片。
- 新增或删除图片不需要修改组件；开发环境会自动刷新，构建时也会重新扫描。
- 建议使用 `01`、`02`、`03` 这样的补零文件名，便于管理。

## 图片间距

在 `src/data.ts` 的对应项目中设置 `imageGap`：

```ts
{
  slug: 'project-01',
  imageGap: 0, // 图片无缝衔接，整组使用一个圆角容器
}
```

如果希望图片之间保留间距：

```ts
{
  slug: 'project-02',
  imageGap: 24, // 间距单位为 px，每张图片独立带圆角
}
```

## 清晰度与加载速度

页面构建时会读取每张图片的原始宽高，为懒加载图片预留准确空间。除第一张图外，其余图片会在接近可视区域时再加载。

静态 UI 截图建议使用项目根目录的转换脚本：

```bash
python3 convert_webp.py public/work
```

转换结果会写入 `public/work-webp`，不会覆盖原图。PNG 默认使用无损 WebP，不缩小尺寸，因此界面文字和细线不会变糊。确认结果后，再用优化文件替换对应项目中的原图；不要把原图和同名 WebP 同时留在项目文件夹中，否则页面会把两张都展示出来。

照片可使用高质量有损模式进一步减小体积：

```bash
python3 convert_webp.py public/portfolio --lossy-png --photo-quality 94
```

GIF 不建议直接套用静态图片参数。它们是当前体积最大的资源，优先保留现有 GIF 配合视口懒加载；如需进一步压缩，建议使用视频编码工具转换成 WebM/MP4，而不是降低 WebP 清晰度。
