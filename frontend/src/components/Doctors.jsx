
import "./Doctors.css";

const doctors = [
    {
        name: "Dr. Ahmet",
        specialty: "Dentist",
        experience: "10+ years experience",
        initials: "DA",
    },
    {
        name: "Dr. Mehmet",
        specialty: "Dental Surgeon",
        experience: "8+ years experience",
        initials: "DM",
    },
    {
        name: "Dr. Hatice",
        specialty: "Cosmetic Dentist",
        experience: "7+ years experience",
        initials: "HD",
    },
];

function Doctors() {
    return (
        <section className="doctors-section" id="doctors">
            <div className="doctors-container">

                <div className="doctors-heading">
                    <span>MEET OUR TEAM</span>
                    <h2>Our Experienced Doctors</h2>
                    <p>
                        Meet our caring dental professionals dedicated
                        to making every visit comfortable.
                    </p>
                </div>

                <div className="doctors-grid">
                    {doctors.map((doctor, index) => (
                        <article className="doctor-card" key={index}>
                            <div className="doctor-avatar">
                                {doctor.initials}
                            </div>

                            <h3>{doctor.name}</h3>
                            <p className="doctor-specialty">
                                {doctor.specialty}
                            </p>
                            <span className="doctor-experience">
                                {doctor.experience}
                            </span>

                            <a href="/register/clinic1">
                                Book an appointment →
                            </a>
                        </article>
                    ))}
                </div>

            </div>
        </section>
    );
}

export default Doctors;
