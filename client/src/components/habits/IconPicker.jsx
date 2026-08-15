import { useState, useMemo } from 'react'
import {
  // Health
  Dumbbell,
  HeartPulse,
  Apple,
  Bed,
  Droplet,
  Bike,
  Footprints,
  Salad,
  // Mind
  Brain,
  Sparkles,
  BookOpen,
  PenLine,
  Music,
  Headphones,
  Palette,
  Camera,
  // Work
  Briefcase,
  Code2,
  Rocket,
  Target,
  Clock,
  Laptop,
  Mail,
  Coffee,
  // Money
  PiggyBank,
  TrendingUp,
  Wallet,
  Receipt,
  // Life / Social
  Users,
  Phone,
  Gift,
  Heart,
  Home,
  Sun,
  Leaf,
  Star,
  // Focus / Habit staples
  Flame,
  CheckCircle2,
  Zap,
  // UI
  Search,
} from 'lucide-react'
import styles from './IconPicker.module.css'

/**
 * key → Lucide component. `key` is what we persist to the DB
 * (e.g. "dumbbell") — never the component itself.
 */
const ICON_REGISTRY = {
  // Health
  dumbbell: Dumbbell,
  heartpulse: HeartPulse,
  apple: Apple,
  bed: Bed,
  droplet: Droplet,
  bike: Bike,
  footprints: Footprints,
  salad: Salad,

  // Mind
  brain: Brain,
  sparkles: Sparkles,
  book: BookOpen,
  pen: PenLine,
  music: Music,
  headphones: Headphones,
  palette: Palette,
  camera: Camera,

  // Work
  briefcase: Briefcase,
  code: Code2,
  rocket: Rocket,
  target: Target,
  clock: Clock,
  laptop: Laptop,
  mail: Mail,
  coffee: Coffee,

  // Money
  piggybank: PiggyBank,
  trendingup: TrendingUp,
  wallet: Wallet,
  receipt: Receipt,

  // Life / Social
  users: Users,
  phone: Phone,
  gift: Gift,
  heart: Heart,
  home: Home,
  sun: Sun,
  leaf: Leaf,
  star: Star,

  // Focus / staples
  flame: Flame,
  check: CheckCircle2,
  zap: Zap,
}

const CATEGORIES = [
  { id: 'all', label: 'All', keys: null },
  {
    id: 'health',
    label: 'Health',
    keys: [
      'dumbbell',
      'heartpulse',
      'apple',
      'bed',
      'droplet',
      'bike',
      'footprints',
      'salad',
    ],
  },
  {
    id: 'mind',
    label: 'Mind',
    keys: [
      'brain',
      'sparkles',
      'book',
      'pen',
      'music',
      'headphones',
      'palette',
      'camera',
    ],
  },
  {
    id: 'work',
    label: 'Work',
    keys: [
      'briefcase',
      'code',
      'rocket',
      'target',
      'clock',
      'laptop',
      'mail',
      'coffee',
    ],
  },
  {
    id: 'money',
    label: 'Money',
    keys: [
      'piggybank',
      'trendingup',
      'wallet',
      'receipt',
    ],
  },
  {
    id: 'life',
    label: 'Life',
    keys: [
      'users',
      'phone',
      'gift',
      'heart',
      'home',
      'sun',
      'leaf',
      'star',
    ],
  },
  {
    id: 'focus',
    label: 'Focus',
    keys: ['flame', 'check', 'zap'],
  },
]

/**
 * Renders a single habit icon anywhere in the app.
 * - Falls back to Zap if the key isn't in the registry.
 * - Backwards-compatible: if a legacy emoji (e.g. "⚡") is passed,
 *   we render it as text so existing habits keep working.
 */
export function HabitIcon({
  name,
  size = 20,
  color,
  className,
}) {
  const Cmp = name ? ICON_REGISTRY[name] : null

  // Legacy emoji fallback — anything not in the registry
  // is rendered as text so existing habits keep working.
  if (!Cmp && name && typeof name === 'string') {
    return (
      <span
        className={className}
        style={{
          fontSize: size,
          color,
          lineHeight: 1,
          display: 'inline-flex',
        }}
      >
        {name}
      </span>
    )
  }

  const Final = Cmp ?? Zap

  return (
    <Final
      size={size}
      color={color}
      className={className}
      strokeWidth={1.8}
    />
  )
}

/**
 * Grid picker used inside HabitFormModal.
 * Search + category filters. Selected tile tinted with habit's color.
 */
export function IconPicker({
  value,
  onChange,
  color = '#7C5CFF',
}) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const visible = useMemo(() => {
    const catFilter = CATEGORIES.find(
      (c) => c.id === category
    )

    const pool =
      catFilter?.keys ?? Object.keys(ICON_REGISTRY)

    const q = query.trim().toLowerCase()

    if (!q) {
      return pool
    }

    return pool.filter((key) =>
      key.includes(q)
    )
  }, [query, category])

  return (
    <div className={styles.wrap}>
      {/* Search */}
      <div className={styles.searchBox}>
        <Search
          size={14}
          className={styles.searchIcon}
        />

        <input
          type="text"
          className={styles.search}
          placeholder="Search icons..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Category tabs */}
      <div className={styles.tabs}>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`${styles.tab} ${
              category === c.id
                ? styles.tabActive
                : ''
            }`}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Icon grid */}
      <div className={styles.grid}>
        {visible.map((key) => {
          const isSelected = value === key

          return (
            <button
              key={key}
              type="button"
              className={`${styles.tile} ${
                isSelected
                  ? styles.tileSelected
                  : ''
              }`}
              onClick={() => onChange(key)}
              style={
                isSelected
                  ? {
                      background: `${color}22`,
                      borderColor: color,
                    }
                  : undefined
              }
              aria-label={key}
              title={key}
            >
              <HabitIcon
                name={key}
                size={18}
                color={
                  isSelected
                    ? color
                    : 'currentColor'
                }
              />
            </button>
          )
        })}

        {visible.length === 0 && (
          <p className={styles.empty}>
            No icons match &ldquo;{query}&rdquo;
          </p>
        )}
      </div>
    </div>
  )
}
