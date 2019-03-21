import React, { useState, useCallback, useEffect } from 'react'
import { useSpring, animated } from 'react-spring'
import PropTypes from 'prop-types'
import ImageResizer from './ImageResizer'
import styles from '../../styles.css'
import { Loader } from './Loader'

const LOAD_STATES = {
  LOADING: 'LOADING',
  TRANSITION: 'TRANSITION',
  LOADED: 'LOADED',
}

const imageMinRatio = 2 / 3

export const LOADER_TYPES = {
  SPINNER: 'SPINNER',
  LINEAR: 'LINEAR',
}

const BlurredLoader = ({
  className,
  alt,
  loaderUrl,
  realUrls,
  thresholds,
  onload,
  bestUrlIndex,
  loaderType,
}) => {
  const [state, setState] = useState({
    loadState: LOAD_STATES.LOADING,
    realUrlIndex: null,
  })

  let loadCounter = 0

  const generateImage = urlIndex => {
    const { realUrlIndex } = state
    const newBestUrlIndex = urlIndex || bestUrlIndex

    if (realUrlIndex && bestUrlIndex <= realUrlIndex) {
      return
    }

    const hdImageLoader = new Image()
    hdImageLoader.src = realUrls[newBestUrlIndex]

    hdImageLoader.onerror = () => {
      let { realUrlIndex } = state
      if (!realUrlIndex) realUrlIndex = 0
      console.log('erro')

      if (loadCounter > 10) return
      loadCounter++
      generateImage(Math.max(newBestUrlIndex - 1, realUrlIndex))
    }

    hdImageLoader.onload = () => {
      const { realUrlIndex } = state
      if (realUrlIndex && newBestUrlIndex <= realUrlIndex) return
      console.log(realUrlIndex)

      setState({
        realUrlIndex: newBestUrlIndex,
      })

      if (bestUrlIndex > newBestUrlIndex) {
        console.log('bestUrlIndex > newBestUrlIndex')
        generateImage()
      } else {
        setState({ loadState: LOAD_STATES.LOADED })
        onload && onload()
      }
    }
  }

  useEffect(() => {
    generateImage()
  }, [])

  const { loadState, realUrlIndex } = state
  const loaded = loadState === LOAD_STATES.LOADED
  console.log('Rendering')

  return (
    <div className={`${styles.image} w-100 relative`}>
      <div className="h-100 w-100 z-5">
        <Loader loaded={loaded} loaderType={loaderType}>
          <ImageResizer
            alt={alt}
            src={loaderUrl}
            minRatio={imageMinRatio}
            className={`w-100 db ${className}`}
          />
        </Loader>
      </div>
      <div className="h-100 w-100 z-1 absolute top-0 left-0">
        <ImageResizer
          className="w-100 h-100"
          alt={alt}
          src={realUrls[realUrlIndex]}
          minRatio={imageMinRatio}
        />
      </div>
    </div>
  )
}

BlurredLoader.propTypes = {
  className: PropTypes.string,
  alt: PropTypes.string,
  loaderUrl: PropTypes.string.isRequired,
  realUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  thresholds: PropTypes.arrayOf(PropTypes.number),
  onload: PropTypes.func,
  bestUrlIndex: PropTypes.number,
  loaderType: PropTypes.string,
}

BlurredLoader.defaultProps = {
  thresholds: [],
}

export default BlurredLoader
