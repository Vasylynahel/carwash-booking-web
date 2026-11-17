import { formatDuration, parseApiError } from './format';

test('formatDuration: хвилини, години та їх сума', () => {
  expect(formatDuration(45)).toBe('45 хв');
  expect(formatDuration(120)).toBe('2 год');
  expect(formatDuration(90)).toBe('1 год 30 хв');
});

test('parseApiError: рядок, список помилок валідації та запасний текст', () => {
  expect(parseApiError('Невірний пароль')).toBe('Невірний пароль');
  expect(parseApiError([{ msg: 'поле обов’язкове' }, { msg: 'надто коротке' }])).toBe(
    'поле обов’язкове; надто коротке'
  );
  expect(parseApiError(undefined)).toBe('Щось пішло не так');
});
