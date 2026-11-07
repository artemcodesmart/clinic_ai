
import Header from "../components/Header";
import "./Contacts.css";

function Contacts() {
    return (
        <div className="contacts-page">
            <Header />

            <main>
                <section className="contacts-hero">
                    <span className="contacts-label">GET IN TOUCH</span>

                    <h1>
                        We're here to
                        <span> help you smile.</span>
                    </h1>

                    <p>
                        Have a question or need to schedule an appointment?
                        Get in touch with our team. We'll be happy to help.
                    </p>
                </section>

                <section className="contacts-content">

                    <div className="contacts-info">

                        <div className="contact-card">
                            <div className="contact-icon">☎</div>
                            <div>
                                <h3>Phone</h3>
                                <p>Call us to schedule your visit.</p>
                                <span>Phone number to be added</span>
                            </div>
                        </div>

                        <div className="contact-card">
                            <div className="contact-icon">✉</div>
                            <div>
                                <h3>Email</h3>
                                <p>Send us your questions.</p>
                                <span>Email address to be added</span>
                            </div>
                        </div>

                        <div className="contact-card">
                            <div className="contact-icon">⌖</div>
                            <div>
                                <h3>Our Location</h3>
                                <p>Visit our dental clinic.</p>
                                <span>Clinic address to be added</span>
                            </div>
                        </div>

                        <div className="contact-card">
                            <div className="contact-icon">◷</div>
                            <div>
                                <h3>Working Hours</h3>
                                <p>Monday – Saturday</p>
                                <span>Working hours to be added</span>
                            </div>
                        </div>

                    </div>

                    <div className="contacts-message">
                        <span className="contacts-label">CONTACT US</span>
                        <h2>Let's talk about your smile.</h2>

                        <p>
                            Our team is ready to answer your questions
                            and help you find the right treatment.
                        </p>

                        <div className="contacts-message-decoration">
                            <span>CLINIC</span>
                            <strong>1</strong>
                        </div>
                    </div>

                </section>
            </main>
        </div>
    );
}

export default Contacts;
