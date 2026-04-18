"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";

export default function HontoOpsSection() {
  const { locale, t } = useLocale();
  const s = t.hontoOpsSection;

  return (
    <section className="sec honto-ops" id="honto-ops">
      <div className="container-x">
        <div className="honto-ops-inner">
          <div className="honto-ops-left">
            <div className="eyebrow">{s.eyebrow}</div>
            <h2>
              {s.titlePre}
              <i>{s.titleItalic}</i>
              {s.titlePost}
            </h2>
            <p>{s.description}</p>
            <div className="honto-ops-feat">
              <div className="f">
                <div className="k">{s.f1Key}</div>
                <div className="v">{s.f1Val}</div>
              </div>
              <div className="f">
                <div className="k">{s.f2Key}</div>
                <div className="v">{s.f2Val}</div>
              </div>
              <div className="f">
                <div className="k">{s.f3Key}</div>
                <div className="v">{s.f3Val}</div>
              </div>
              <div className="f">
                <div className="k">{s.f4Key}</div>
                <div className="v">{s.f4Val}</div>
              </div>
            </div>
            <Link href={`/${locale}/honto-ops`} className="btn primary">
              {s.cta}
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
              alt={s.imgAlt}
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
