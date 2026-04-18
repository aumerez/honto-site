import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="container-x">
        <div className="eyebrow" style={{ marginBottom: 32 }}>
          [06] Contact
        </div>
        <div className="contact-grid">
          <div className="contact-left">
            <h2>
              Tell us about
              <br />
              the <i>problem.</i>
            </h2>
            <div className="contact-meta">
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
            </div>
          </div>
          <div className="contact-right">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
