"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

type HontoOpsCopy = {
  eyebrow: string;
  titlePre: string;
  titleItalic: string;
  titlePost: string;
  description: string;
  features: Array<{ k: string; v: string }>;
  cta: string;
  imageAlt: string;
};

export default function HontoOpsSection() {
  const { t, locale } = useLocale();
  const copy = (t.landing as { hontoOpsSection: HontoOpsCopy }).hontoOpsSection;

  return (
    <section className="sec honto-ops" id="honto-ops">
      <div className="container-x">
        <div className="honto-ops-inner">
          <div className="honto-ops-left">
            <div className="eyebrow">{copy.eyebrow}</div>
            <h2>
              {copy.titlePre}
              <i>{copy.titleItalic}</i>
              {copy.titlePost}
            </h2>
            <p>{copy.description}</p>
            <div className="honto-ops-feat">
              {copy.features.map((f) => (
                <div className="f" key={f.k}>
                  <div className="k">{f.k}</div>
                  <div className="v">{f.v}</div>
                </div>
              ))}
            </div>
            <Link href={`/${locale}/honto-ops`} className="btn primary">
              {copy.cta}
              <svg
                width="14"
                height="10"
                viewBox="0 0 14 10"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </Link>
          </div>
          <div className="honto-ops-right">
            <Image
              src="/honto-ops-v2.jpeg"
              alt={copy.imageAlt}
              width={1205}
              height={963}
              sizes="(max-width: 900px) 100vw, 50vw"
              priority={false}
              className="honto-ops-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
