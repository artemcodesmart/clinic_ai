
import Header from "../components/Header";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Doctors from "../components/Doctors";
import "./Home.css";
import About from "../components/About";

function Home() {
    return (
        <div className="home-page">
            <Header />
            <main>
                <Hero />
                   <Services />
                   <Doctors />
                       <About />
            </main>
        </div>
    );
}

export default Home;

