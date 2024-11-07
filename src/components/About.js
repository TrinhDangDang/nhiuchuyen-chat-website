import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faGithub, faLinkedin} from "@fortawesome/free-brands-svg-icons"
const About = () => {
  const technologyIconsRef = useRef(null);
  const handEmojiRef = useRef(null);
  const gearEmojiRef = useRef(null);
  const raisingHandEmojiRef = useRef(null);
  const phoneIconRef = useRef(null);

  //useEffect hook to add an event listener that tracks the cursor's movement across the screen to make the handEmoji interactive
  useEffect(() => {
    const handEmoji = handEmojiRef.current;
    const gearEmoji = gearEmojiRef.current;
    const raisingHandEmoji = raisingHandEmojiRef.current;
    const phoneEmoji = phoneIconRef.current;
    if (!handEmoji) return;
    if (!gearEmoji) return;
    if (!raisingHandEmoji) return;
    if (!phoneEmoji) return;

    let isAnimating = false;

    const handleMouseMove = (event) => {
      if (isAnimating) return;

      isAnimating = true;
      handEmoji.classList.add("wave");
      gearEmoji.classList.add("spin");
      raisingHandEmoji.classList.add("shake");
      phoneEmoji.classList.add("shake");

      setTimeout(() => {
        handEmoji.classList.remove("wave");
        gearEmoji.classList.remove("spin");
        raisingHandEmoji.classList.remove("shake");
        phoneEmoji.classList.remove("shake");

        isAnimating = false;
      }, 2000);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const currentRef = technologyIconsRef.current; // Capture the current ref value

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 1,
    };

    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Section is entering the viewport
          entry.target.classList.add("animate");
          entry.target.classList.remove("fade-out");
        } else {
          // Section is exiting the viewport
          entry.target.classList.add("fade-out");
          entry.target.classList.remove("animate");
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
        console.log("Observer unobserved the element");
      }
    };
  }, []);


  const technologies = [
    // Programming Languages
    { name: "Python", emoji: "🐍" },
    { name: "JavaScript", emoji: "📜" },
    // { name: 'C', emoji: '💻' },
    // { name: 'C++', emoji: '➕' },
    // { name: 'Java', emoji: '☕️' },
    // { name: 'C#', emoji: '🎯' },
    { name: "SQL", emoji: "🗄️" },

    // Markup and Styling Languages
    { name: "HTML", emoji: "📄" },
    { name: "CSS", emoji: "🎨" },

    // Frameworks and Libraries
    { name: "React", emoji: "⚛️" },
    // { name: 'Redux', emoji: '🔄' },
    // { name: 'Express.js', emoji: '🚄' },
    { name: "Node.js", emoji: "🌿" },
    // { name: 'Unity', emoji: '🕹️' },

    // Databases
    // { name: 'MySQL', emoji: '🐬' },
    { name: "MongoDB", emoji: "🍃" },

    // Tools and Others
    { name: "Git", emoji: "🔀" },
    { name: "...", emoji: "" },
    // { name: 'Blender', emoji: '🌀' },
  ];

  const TechnologyList = (
    <>
      {technologies.map((tech) => (
        <div className="technology" key={tech.name}>
          {tech.emoji} {tech.name}
        </div>
      ))}
    </>
  );




  return (
    <main className="about">
      <section className="hi">
        <h1>
          Hi{" "}
          <span className="hand-emoji" ref={handEmojiRef}>
            👋
          </span>{" "}
          My name is Trinh
        </h1>
        <p>
          I am an aspiring Software Developer currently pursuing a Bachelor's
          Degree in Computer Science at the University of Houston Clear Lake.
          Available for internships or full-time roles starting December 2024.
        </p>
      </section>

      <section className="me">
        <h2>
          About Me{" "}
          <span className="me-raising-hand" ref={raisingHandEmojiRef}>
            🙋🏼‍♂️
          </span>
        </h2>
        <div className="me-cards">
          <div className="me-card">
            <h2>Lifelong Learner</h2>
            <p>
              In a time of rapid, unprecedented advancement, I strive to be a{" "}
              <span className="high-light-text">lifelong learner</span>,
              exploring new technologies and different aspects of life to keep
              growing with an ever-evolving world
            </p>
          </div>
          <div className="me-card">
            <h2>Progress Over Perfection</h2>
            <p>
              Aiming for perfection can sometimes hold me back, so I focus on{" "}
              <span className="high-light-text">taking action</span> over
              overthinking, and embrace challenges along the way.
            </p>
          </div>
          <div className="me-card">
            <h2>Learning from Mistakes</h2>
            <p>
              Mistakes are part of the journey, though sometimes hard to move
              past, they guide me forward. I'm commited to learning from every
              experience and{" "}
              <span className="high-light-text">growing from each misstep</span>
            </p>
          </div>
        </div>
      </section>

      <div className="technology_left">
        <h2 className="technologies_used">
          Technologies{" "}
          <span className="gear-emoji" ref={gearEmojiRef}>
            ⚙️
          </span>
          :
        </h2>
      </div>
      {TechnologyList}

      <section className="technologies">
        <h2>A little bit of everything </h2>
        <div className="technology-icons" ref={technologyIconsRef}>
          <div className="technology-icon" key="Python">
            🐍 Python
          </div>
          <div className="technology-icon" key="JavaScript">
            📜 JavaScript
          </div>
          <div className="technology-icon" key="C">
            💻 C
          </div>
          <div className="technology-icon" key="C++">
            ➕ C++
          </div>
          <div className="technology-icon" key="Java">
            ☕️ Java
          </div>
          <div className="technology-icon" key="C#">
            🎯 C#
          </div>
          <div className="technology-icon" key="SQL">
            🗄️ SQL
          </div>
          <div className="technology-icon" key="HTML">
            📄 HTML
          </div>
          <div className="technology-icon" key="CSS">
            🎨 CSS
          </div>
          <div className="technology-icon" key="React">
            ⚛️ React
          </div>
          <div className="technology-icon" key="Redux">
            🔄 Redux
          </div>
          <div className="technology-icon" key="Express.js">
            🚄 Express.js
          </div>
          <div className="technology-icon" key="Node.js">
            🌿 Node.js
          </div>
          <div className="technology-icon" key="Unity">
            🕹️ Unity
          </div>
          <div className="technology-icon" key="MySQL">
            🐬 MySQL
          </div>
          <div className="technology-icon" key="MongoDB">
            🍃 MongoDB
          </div>
          <div className="technology-icon" key="Git">
            🔀 Git
          </div>
          <div className="technology-icon" key="Blender">
            🌀 Blender
          </div>
        </div>
      </section>
      <section className="projects">
        <h1>Coding</h1>
        <p>
          I worked on this{" "}
          <a
            href="https://trinhdangdang.github.io/pacman-inspired-game/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button>pacman & spongebob</button> 🧽👀🧽 & 🟡▫️▫️▫️🍒
          </a>{" "}
        </p>
        <p>
          and this cards flipping game:  <a href="https://trinhdangdang.github.io/Flip-Card-Game/" target="_blank" rel="noopener noreferrer"><button>Flip-Card-Game</button></a> 🃏🎴
        </p>
        <p>
          You can find more on my Github:  <FontAwesomeIcon icon={faGithub} className="Github-icon" /> <a href="https://github.com/TrinhDangDang" target="_blank" rel="noopener noreferrer"><button>GitHub Profile</button></a>
        </p>
        <p>
          writings
        </p>
      </section>

      <section className="resume">
        <h2>
          Resume <span>📜</span>
        </h2>
        <button className="resumeButton">
          <a href="/Trinh_Resume.pdf" download>
            Download Resume (PDF)
          </a>
        </button>
        <div className="container">
          <h2>Trinh Dang Dang</h2>
          <p>
            Email:{" "}
            <a href="mailto:trinhdangdang@gmail.com">trinhdangdang@gmail.com</a>{" "}
            |{" "}
            <a href="https://www.linkedin.com/in/trinh-dang-9b09361b6/">
              LinkedIn
            </a>{" "}
            | Phone: +1 (346) 404-4935 |{" "}
            <a href="https://github.com/TrinhDangDang">GitHub</a>
          </p>

          <h3>Professional Summary</h3>
          <p>
            Motivated Computer Science student with hands-on experience in
            coding, software projects, and technical troubleshooting. I am eager
            to apply knowledge in a practical environment and grow through new
            challenges. Available for internships or full-time roles starting
            December 2024.
          </p>

          <h3>Technical Skills</h3>
          <ul>
            <li>
              <strong>Programming Languages:</strong> HTML, CSS, JavaScript,
              Java, Python, C, SQL
            </li>
            <li>
              <strong>Frameworks & Libraries:</strong> React, Express.js,
              Node.js
            </li>
            <li>
              <strong>Databases & Tools:</strong> MySQL, MongoDB, Blender
            </li>
            <li>
              <strong>Software Development Practices:</strong> Agile
              methodologies
            </li>
            <li>
              <strong>Version Control:</strong> Git, GitHub
            </li>
          </ul>

          <h3>Projects</h3>
          <h4>Maze Chaser</h4>
          <p>
            <strong>Technologies:</strong> JavaScript, HTML, CSS, Bootstrap
          </p>
          <ul>
            <li>
              Designed a maze-based chasing game inspired by classic arcade
              mechanics, using object-oriented programming principles.
            </li>
            <li>
              Implemented Breadth-First Search (BFS) to control the AI
              character’s movement, allowing it to dynamically chase the player
              when within range.
            </li>
            <li>
              Utilized HTML, JavaScript, and CSS to build game mechanics,
              animations, and a responsive browser-based interface.
            </li>
          </ul>

          <h4>Portfolio Website</h4>
          <p>
            <strong>Technologies:</strong> MongoDB, React, Express.js, Node.js
            (MERN Stack)
          </p>
          <ul>
            <li>
              Implemented a full-stack portfolio website with user
              authentication and role-based access control (admin vs. regular
              users).
            </li>
            <li>
              Connected the website to a MongoDB database to store and retrieve
              user information and posts dynamically.
            </li>
            <li>
              Applied RESTful API principles for backend communication and
              ensured secure data transmission.
            </li>
            <li>
              Developed modular front-end components using React hooks,
              improving maintainability and scalability.
            </li>
          </ul>

          <h4>Client-Server Communication System</h4>
          <p>
            <strong>Technologies:</strong> C, Linux (POSIX)
          </p>
          <ul>
            <li>
              Developed a client-server simulation to study operating system
              concepts, using named pipes (FIFOs) to enable message passing
              between multiple clients and a server.
            </li>
            <li>
              Implemented a message queue, allowing clients to send and receive
              messages with proper acknowledgment handling.
            </li>
          </ul>

          <h4>Lexical Analyzer & Recursive Descent Parser</h4>
          <p>
            <strong>Technologies:</strong> C
          </p>
          <ul>
            <li>
              Built a lexical analyzer to tokenize input code by identifying
              keywords, operators, and variables.
            </li>
            <li>
              Implemented a recursive descent parser to validate syntax and
              ensure compliance with predefined grammar rules.
            </li>
            <li>
              Handled conditional statements, loops, and assignments
              effectively, providing real-time error feedback.
            </li>
          </ul>

          <h3>Work Experience</h3>
          <h4>Computer Lab Assistant, University of Houston – Clear Lake</h4>
          <p>
            <strong>Sep 2021 - Present</strong>
          </p>
          <ul>
            <li>
              Provided technical support to students via phone, email, and
              in-person assistance.
            </li>
            <li>
              Managed the setup, configuration, and troubleshooting of printers,
              computers, and lab equipment.
            </li>
          </ul>

          <h3>Education</h3>
          <h4>The University of Houston – Clear Lake | Houston, TX</h4>
          <p>
            <strong>Jan 2021 - Dec 2024</strong>
          </p>
          <p>
            Bachelor of Science in Computer Science | Cumulative GPA: 3.53/4.0
          </p>

          <h4>San Jacinto Community College | Houston, TX</h4>
          <p>
            <strong>Aug 2018 - Dec 2020</strong>
          </p>
          <p>
            Associates of Science in Computer Science | Cumulative GPA: 3.70/4.0
          </p>
          <p>Dean’s Honor List: 2018, 2019, 2020</p>
        </div>
      </section>

      <section className="contact">
        <h2>
          Contact <span className="phoneIcon" ref={phoneIconRef}>☎️</span>
        </h2>
        <p>
          Reach me at{" "}
          <a href="mailto:trinhdangdang@gmail.com">trinhdangdang@gmail.com</a>{" "}
          {/* or shoot me a direct message on this website after creating an
          account. */}
        </p>
        <p>or on LinkedIn <a
  href="https://www.linkedin.com/in/trinh-dang-9b09361b6/"
  target="_blank"
  rel="noopener noreferrer"
  className="linkedin-link"
>
  <FontAwesomeIcon icon={faLinkedin} className="linkedin-icon" />
</a>
  </p>
        <p>
        I look forward to making new connections.
        </p>
      </section>
    </main>
  );
};

export default About;
