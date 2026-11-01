
import "./Services.css";

const services = [
    {
        number: "01",
        title: "Dental Implants",
        description:
            "Restore your smile with modern dental implant solutions designed for comfort and durability.",
        icon: "✦",
    },
    {
        number: "02",
        title: "Teeth Whitening",
        description:
            "Brighten your smile with professional whitening treatments and visible results.",
        icon: "☼",
    },
    {
        number: "03",
        title: "Cosmetic Dentistry",
        description:
            "Improve the appearance of your teeth with personalized cosmetic dental care.",
        icon: "◇",
    },
];

function Services() {
    return (
        <section className="services-section" id="services">
            <div className="services-container">

                <div className="services-heading">
                    <span className="services-label">WHAT WE OFFER</span>
                    <h2>Our Dental Services</h2>
                    <p>
                        Complete dental care to help you maintain a healthy,
                        confident and beautiful smile.
                    </p>
                </div>

                <div className="services-grid">
                    {services.map((service) => (
                        <article className="service-card" key={service.number}>
                            <div className="service-card-top">
                                <span className="service-icon">{service.icon}</span>
                                <span className="service-number">{service.number}</span>
                            </div>

                            <h3>{service.title}</h3>
                            <p>{service.description}</p>

                            <a href="/register/clinic1">Book a visit <span>→</span></a>
                        </article>
                    ))}
                </div>

            </div>
        </section>
    );
}

export default Services;
