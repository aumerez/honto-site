export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="container-x">
        <div className="eyebrow" style={{ marginBottom: 32 }}>
          [06] Contact
        </div>
        <div className="contact-grid">
          <h2>
            Tell us about
            <br />
            the <i>problem.</i>
          </h2>
          <div className="contact-right">
            <div className="contact-row">
              <span className="k">Email</span>
              <span className="v">info@honto.ai</span>
            </div>
            <div className="contact-row">
              <span className="k">Response</span>
              <span className="v">&lt; 24 hours</span>
            </div>
            <div className="contact-row">
              <span className="k">Routing</span>
              <span className="v">Straight to engineering</span>
            </div>
            <div className="contact-row">
              <span className="k">NDA</span>
              <span className="v">On request · same day</span>
            </div>
            <a
              href="mailto:info@honto.ai"
              className="btn primary"
              style={{ marginTop: 12, alignSelf: "flex-start" }}
            >
              Start a conversation
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
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
