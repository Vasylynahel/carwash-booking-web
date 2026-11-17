export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Не вдалося прочитати зображення'));
    img.src = src;
  });
}

// Вирізає вибрану область на canvas і повертає файл JPEG (до 512×512, щоб не вантажити зайве)
export async function cropImageToFile(src: string, area: PixelCrop, name = 'avatar.jpg') {
  const img = await loadImage(src);
  const size = Math.min(512, area.width);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas недоступний');
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, size, size);

  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.9));
  if (!blob) throw new Error('Не вдалося обрізати зображення');
  return new File([blob], name, { type: 'image/jpeg' });
}
