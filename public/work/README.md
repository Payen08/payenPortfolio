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
