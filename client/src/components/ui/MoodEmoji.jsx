import styles from './MoodEmoji.module.css'

/**
 * Fluent Emoji via jsDelivr CDN.
 * All 5 moods use the "Flat" variant.
 */
const CDN =
  'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets'

const MOOD_MAP = {
  great: {
    label: 'Great',
    src: `${CDN}/Grinning%20face%20with%20smiling%20eyes/Flat/grinning_face_with_smiling_eyes_flat.svg`,
  },
  good: {
    label: 'Good',
    src: `${CDN}/Slightly%20smiling%20face/Flat/slightly_smiling_face_flat.svg`,
  },
  okay: {
    label: 'Okay',
    src: `${CDN}/Neutral%20face/Flat/neutral_face_flat.svg`,
  },
  bad: {
    label: 'Bad',
    src: `${CDN}/Disappointed%20face/Flat/disappointed_face_flat.svg`,
  },
  awful: {
    label: 'Awful',
    src: `${CDN}/Loudly%20crying%20face/Flat/loudly_crying_face_flat.svg`,
  },
}

export function MoodEmoji({ mood, size = 24, className, title }) {
  const entry = MOOD_MAP[mood]

  if (!entry) return null

  return (
    <img
      className={`${styles.emoji} ${className ?? ''}`}
      src={entry.src}
      width={size}
      height={size}
      alt={entry.label}
      title={title ?? entry.label}
      loading="lazy"
      draggable="false"
    />
  )
}
