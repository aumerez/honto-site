"use client";

import { useLocale } from "@/context/LocaleContext";
import ContactForm from "./ContactForm";

type ContactCopy = {
  eyebrow: string;
  titlePre: string;
  titleBreak: string;
  titleItalic: string;
  metaEmailKey: string;
  metaEmailValue: string;
  metaResponseKey: string;
  metaResponseValue: string;
  metaRoutingKey: string;
  metaRoutingValue: string;
  metaNdaKey: string;
  metaNdaValue: string;
};

export default function Contact() {
  const { t } = useLocale();
  const copy = (t.landing as { contact: ContactCopy }).contact;

  return (
    <section className="contact" id="contact">
      <div className="container-x">
        <div className="eyebrow" style={{ marginBottom: 32 }}>
          {copy.eyebrow}
        </div>
        <div className="contact-grid">
          <div className="contact-left">
            <h2>
              {copy.titlePre}
              <br />
              {copy.titleBreak}
              <i>{copy.titleItalic}</i>
            </h2>
            <div className="contact-meta">
              <div className="contact-row">
                <span className="k">{copy.metaEmailKey}</span>
                <span className="v">{copy.metaEmailValue}</span>
              </div>
              <div className="contact-row">
                <span className="k">{copy.metaResponseKey}</span>
                <span className="v">{copy.metaResponseValue}</span>
              </div>
              <div className="contact-row">
                <span className="k">{copy.metaRoutingKey}</span>
                <span className="v">{copy.metaRoutingValue}</span>
              </div>
              <div className="contact-row">
                <span className="k">{copy.metaNdaKey}</span>
                <span className="v">{copy.metaNdaValue}</span>
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
