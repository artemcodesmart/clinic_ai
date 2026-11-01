
import "./About.css";

const advantages = [
    {
        number: "01",
        title: "Personalized Care",
        description: "Treatment plans adapted to each patient's needs.",
    },
    {
        number: "02",
        title: "Modern Approach",
        description: "A focus on modern techniques and patient comfort.",
    },
    {
        number: "03",
        title: "Friendly Team",
        description: "A welcoming environment throughout your visit.",
    },
];

function About() {
    return (
        <section className="about-section" id="about">
            <div className="about-container">

                <div className="about-content">
                    <span className="about-label">ABOUT OUR CLINIC</span>

                    <h2>
                        Your Smile Deserves
                        <span> The Best Care</span>
                    </h2>

                    <p>
                        At CLINIC1 DENTAL CARE, we believe that a healthy
                        smile starts with attentive care, clear communication
                        and a comfortable experience.
                    </p>

                    <p>
                        Our goal is to make every visit as welcoming and
                        straightforward as possible, while helping you
                        make confident decisions about your dental health.
                    </p>

                    <a href="/register/clinic1" className="about-button">
                        Book Your Visit →
                    </a>
                </div>

                <div className="about-advantages">
                    {advantages.map((item) => (
                        <div className="about-advantage" key={item.number}>
                            <span className="about-number">{item.number}</span>

                            <div>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

export default About;
