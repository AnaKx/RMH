import { LANGUAGES_LIST } from '@/constants/languages_list';

export const LANGUAGE_OPTIONS = LANGUAGES_LIST.map(lang => ({
  value: lang,
  label: lang,
}));