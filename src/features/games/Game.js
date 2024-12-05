import React from 'react'
import { useState } from 'react';

const Game = () => {

    const [index, setIndex] = useState(0)
    const elements = [<div><a className='spongebob' href="https://trinhdangdang.github.io/pacman-inspired-game/"  target="_blank" rel="noopener noreferrer">🧽</a></div>, <div ><a className='card-flipping' href='https://trinhdangdang.github.io/Flip-Card-Game/' target="_blank" rel="noopener noreferrer">🃏</a></div>]
    const increaseCount = () => {
        if(index < elements.length - 1){
        setIndex((prevCount)=> prevCount + 1)
        }
    }
    const decreaseCount = () => {
        if(index > 0){
        setIndex((prevCount)=> prevCount - 1)
        }
    }
    
  return (
    <div className='game_slides'>
       <button onClick={decreaseCount} className='icon-button'/* disabled={index===0} */>⬅️</button>
       <div>{elements[index]}</div>
       <button onClick={increaseCount} className='icon-button'/* disabled={index===elements.length -1} */>➡️</button>
    </div>
  )
}

export default Game