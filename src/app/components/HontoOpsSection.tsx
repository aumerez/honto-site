import Image from "next/image";
import Link from "next/link";

export default function HontoOpsSection() {
  return (
    <section className="sec honto-ops" id="honto-ops">
      <div className="container-x">
        <div className="honto-ops-inner">
          <div className="honto-ops-left">
            <div className="eyebrow">[04] Product · honto.ops</div>
            <h2>
              The expert <i>second brain</i> for your engineering org.
            </h2>
            <p>
              honto.ops watches your systems, reads your docs, and answers the
              questions your senior engineers field fifty times a week — with
              the same judgment, at 2am, in every timezone.
            </p>
            <div className="honto-ops-feat">
              <div className="f">
                <div className="k">Capture</div>
                <div className="v">Every decision, indexed.</div>
              </div>
              <div className="f">
                <div className="k">Scale</div>
                <div className="v">One expert, whole org.</div>
              </div>
              <div className="f">
                <div className="k">Ground</div>
                <div className="v">Cites every answer.</div>
              </div>
              <div className="f">
                <div className="k">Audit</div>
                <div className="v">Logged, replayable.</div>
              </div>
            </div>
            <Link href="/honto-ops" className="btn primary">
              Explore honto.ops
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
              alt="honto.ops product visualization"
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
