import React from 'react'
import ReactJkMusicPlayer from 'react-jinke-music-player'
import 'react-jinke-music-player/assets/index.css'


const Player = (props) => {
  return (
      <div>
          <ReactJkMusicPlayer {...props} />
    </div>
  )
}

export default Player