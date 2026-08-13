import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import styles from './PlanLimitBanner.module.css'

/**
 * Friendly usage indicator on Habits/Goals pages.
 * Hidden entirely for Pro users.
 */
export function PlanLimitBanner({ current, max, kind }) {
  const { user } = useAuth()

  if (user?.plan === 'pro') return null

  const atLimit = current >= max

  if (!atLimit && current < Math.floor(max * 0.6)) {
    return null
  }

  return (
    <div
      className={`${styles.banner} ${atLimit ? styles.warn : ''}`}
    >
      <Zap size={14} />

      <span>
        {atLimit
          ? `You've hit the free plan limit of ${max} ${kind}.`
          : `${current} of ${max} ${kind} used on the free plan.`}
      </span>

      <Link
        to="/settings/billing"
        className={styles.upgradeLink}
      >
        {atLimit ? 'Learn more' : 'View plans'} →
      </Link>
    </div>
  )
}
