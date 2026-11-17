import { useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';
import toast from 'react-hot-toast';
import { cropImageToFile, type PixelCrop } from '@/utils/cropImage';
import Button from './Button';
import Modal from './Modal';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 МБ

interface ImageCropUploadProps {
  onCropped: (file: File) => Promise<void> | void;
  isUploading?: boolean;
}

// Вибір файлу → попередній перегляд і обрізання (квадрат) → готовий File у onCropped
export default function ImageCropUpload({ onCropped, isUploading }: ImageCropUploadProps) {
  const [source, setSource] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<PixelCrop | null>(null);

  // Звільняємо object URL, коли вони більше не потрібні
  useEffect(() => () => void (source && URL.revokeObjectURL(source)), [source]);
  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    // Тип і розмір перевіряємо на клієнті для зручності; справжню перевірку виконує сервер
    if (!ALLOWED.includes(file.type)) return toast.error('Дозволені лише JPG, PNG або WebP');
    if (file.size > MAX_SIZE) return toast.error('Файл завеликий (максимум 5 МБ)');
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setSource(URL.createObjectURL(file));
  };

  const handleApply = async () => {
    if (!source || !area) return;
    try {
      const file = await cropImageToFile(source, area);
      setPreview(URL.createObjectURL(file));
      setSource(null);
      await onCropped(file);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Не вдалося обрізати зображення');
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-3xl dark:bg-gray-800">
        {preview ? (
          <img src={preview} alt="Попередній перегляд" className="h-full w-full object-cover" />
        ) : (
          '👤'
        )}
      </div>

      <label className="cursor-pointer rounded-lg bg-gray-200 px-4 py-2 font-medium hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
        {isUploading ? 'Завантаження...' : 'Обрати фото'}
        <input
          type="file"
          accept={ALLOWED.join(',')}
          className="sr-only"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = ''; // дозволяє обрати той самий файл ще раз
          }}
        />
      </label>

      <Modal
        isOpen={source !== null}
        onClose={() => setSource(null)}
        title="Обріжте фото"
        size="md"
      >
        <div className="relative mb-4 h-72 overflow-hidden rounded-lg bg-gray-900">
          {source && (
            <Cropper
              image={source}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => setArea(pixels)}
            />
          )}
        </div>
        <label className="mb-4 block text-sm">
          Масштаб
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
        </label>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setSource(null)}>
            Скасувати
          </Button>
          <Button onClick={handleApply}>Застосувати</Button>
        </div>
      </Modal>
    </div>
  );
}
