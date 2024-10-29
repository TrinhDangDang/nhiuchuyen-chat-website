import { useState, useEffect, useRef } from "react";
import { gsap, Power4 } from "gsap";
import './about.css';

const About = () => {
  const correctName = ['T', 'D'];

  const createCardSet = (name) => {
    const cards = [...name, ...name];
    return cards
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        flipped: false,
        matched: false,
      }));
  };

  const [cards, setCards] = useState(createCardSet(correctName));
  const [flippedCards, setFlippedCards] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const portfolioRef = useRef(null);

  const handleCardClick = (card) => {
    if (disabled || card.flipped || card.matched) return;

    const newCards = cards.map((c) =>
      c.id === card.id ? { ...c, flipped: true } : c
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, card];

    if (newFlippedCards.length === 2) {
      setDisabled(true);
      setTimeout(() => checkForMatch(newCards, newFlippedCards), 1000);
    }
    setFlippedCards(newFlippedCards);
  };

  const checkForMatch = (newCards, flippedCards) => {
    const [firstCard, secondCard] = flippedCards;

    if (firstCard.value === secondCard.value) {
      const updatedCards = newCards.map((card) =>
        card.value === firstCard.value ? { ...card, matched: true } : card
      );
      setCards(updatedCards);
    } else {
      const resetCards = newCards.map((card) =>
        card.flipped && !card.matched ? { ...card, flipped: false } : card
      );
      setCards(resetCards);
    }

    setFlippedCards([]);
    setMoves((prev) => prev + 1);
    setDisabled(false);
  };

  useEffect(() => {
    if (cards.every((card) => card.matched)) {
      setShowPortfolio(true);
    }
  }, [cards, moves]);

  useEffect(() => {
    if (showPortfolio && portfolioRef.current) {
      const tl = gsap.timeline();

      // Step 1: Slide up small
      tl.fromTo(
        portfolioRef.current,
        { y: 100, scale: 0.8, autoAlpha: 0 },
        {
          y: 10, // Slide up to a small offset
          autoAlpha: 1,
          duration: 0.7,
          ease: Power4.easeOut,
        }
      )
      // Step 2: Scale up after sliding stops
      .to(portfolioRef.current, {
        scale: 1,
        duration: 0.8,
        ease: Power4.easeOut,
      });
    }
  }, [showPortfolio]);

  return (
    <main className="public__main">
      {!showPortfolio && (
        <div className="game-section">
          <div className="flip-card-container">
            {cards.map((card) => (
              <div
                className={`flip-card ${card.flipped ? 'flipped' : ''}`}
                key={card.id}
                onClick={() => handleCardClick(card)}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front"></div>
                  <div className="flip-card-back">
                    <h3>{card.value}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className="portfolio-section"
        style={{ display: showPortfolio ? 'block' : 'none' }}
      >
        <div ref={portfolioRef} className="colorful-background">Hi 👋 My name is Trinh</div>
        <section className="details">
          <p>
            My name is Trinh. I am a computer science student at UHCL. I know a
            bit of Python, JavaScript, C, Java, React, Redux, ExpressJs, NodeJs,
            Blender, HTML, CSS, Git version control, and MySQL. Just a bit of
            this and that, figuring things out. I worked on this{" "}
            <a href="https://trinhdangdang.github.io/pacman-inspired-game/">
              PACMAN & SPONGEBOB
            </a>
            . I put stuff I worked on here:{" "}
            <a href="https://github.com/TrinhDangDang">
              https://github.com/TrinhDangDang
            </a>
          </p>
          <p>Life-long learner</p>
          <p>Perfectionist turns procrastinator</p>
          <p>Worrier to warrior</p>
          <p>Shameless fighter</p>
        </section>

        <section className="resume">
          If you like, you can check out my resume here.
        </section>

        <section>
          You can contact me at trinhdangdang@gmail.com or shoot me a direct
          message on this website after creating an account.
        </section>
      </div>
    </main>
  );
};

export default About;
