import type { Metadata } from 'next';
import { BookFlow } from '@/components/BookFlow';
import { LANGS, type Lang } from '@/lib/questionnaire';

export const metadata: Metadata = {
  title: 'Book a demo — Honto',
  description: 'Bring us a process that gets stuck. See your AI maturity map and book a demo built around your business.',
};

export default function BookPage({ searchParams }: { searchParams: { lang?: string } }) {
  const lang = (LANGS as readonly string[]).includes(searchParams.lang ?? '') ? (searchParams.lang as Lang) : 'en';
  return <BookFlow initialLang={lang} />;
}
