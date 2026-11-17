import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';
import { filesService } from '@/services/files.service';
import { usePageTitle } from '@/hooks/usePageTitle';
import { getErrorMessage } from '@/utils/errors';
import { formatDate } from '@/utils/format';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Card from '@/components/common/Card';
import DataList from '@/components/common/DataList';
import ImageCropUpload from '@/components/common/ImageCropUpload';

export default function ProfilePage() {
  usePageTitle('Профіль');
  const user = useAuthStore((s) => s.user);

  const upload = useMutation({
    mutationFn: filesService.upload,
    onSuccess: () => toast.success('Фото завантажено'),
    onError: (e) => toast.error(getErrorMessage(e, 'Не вдалося завантажити фото')),
  });

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <Breadcrumbs items={[{ label: 'Огляд', to: '/dashboard' }, { label: 'Профіль' }]} />
      <h1 className="mb-6 text-3xl font-bold">Профіль</h1>

      <Card className="space-y-6">
        <ImageCropUpload
          isUploading={upload.isPending}
          onCropped={async (file) => void (await upload.mutateAsync(file).catch(() => undefined))}
        />
        <DataList
          items={[
            { label: "Ім'я", value: user.full_name },
            { label: 'Email', value: user.email },
            { label: 'Телефон', value: user.phone ?? '—' },
            { label: 'Зареєстровано', value: formatDate(user.created_at) },
          ]}
        />
      </Card>
    </div>
  );
}
