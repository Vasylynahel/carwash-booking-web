import Card from '@/components/common/Card';

const points = [
  {
    title: 'Без подвійних записів',
    text: 'Система сама стежить, щоб на пост не потрапило два авто одночасно.',
  },
  {
    title: 'Історія кожного авто',
    text: 'Усі візити зберігаються: що робили, коли і хто з майстрів.',
  },
  {
    title: 'Сповіщення наживо',
    text: 'Підтвердження, початок і завершення робіт приходять без оновлення сторінки.',
  },
];

export default function AboutPage() {
  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">Про нас</h1>
      <p className="mb-8 max-w-3xl text-gray-600 dark:text-gray-400">
        Це вебсервіс запису на автомийку та детейлінг. Він допомагає клієнтам швидко обрати послугу
        і час, а адміністраторам і майстрам — керувати постами та завантаженістю протягом дня.
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {points.map((p) => (
          <Card key={p.title}>
            <h3 className="mb-2 text-lg font-semibold">{p.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{p.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
