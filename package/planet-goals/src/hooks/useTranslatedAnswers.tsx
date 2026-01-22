import { useTranslate } from '@tolgee/react';

export function useTranslatedAnswers(strings: string[]): string[] {
  const { t } = useTranslate();
  return strings.map(str => t(str));
}