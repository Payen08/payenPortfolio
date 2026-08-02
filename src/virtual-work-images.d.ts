declare module 'virtual:work-images' {
  type WorkImage = {
    src: string;
    width: number;
    height: number;
  };

  const workImages: Record<string, WorkImage[]>;
  export default workImages;
}
