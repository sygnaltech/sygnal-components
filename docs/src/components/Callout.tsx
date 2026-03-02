import { ReactNode } from 'react'

type CalloutType = 'default' | 'info' | 'success' | 'warning' | 'error' | 'important'

interface CalloutProps {
  type?: CalloutType
  emoji?: string | ReactNode
  children: ReactNode
}

// SVG Icons for each callout type
const WarningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 256 256"
    style={{ flexShrink: 0 }}
  >
    <path
      fill="currentColor"
      d="M128 20a108 108 0 1 0 108 108A108.12 108.12 0 0 0 128 20m0 192a84 84 0 1 1 84-84a84.09 84.09 0 0 1-84 84m-12-80V80a12 12 0 0 1 24 0v52a12 12 0 0 1-24 0m28 40a16 16 0 1 1-16-16a16 16 0 0 1 16 16"
    />
  </svg>
)

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 256 256"
    style={{ flexShrink: 0 }}
  >
    <path
      fill="currentColor"
      d="M108 84a16 16 0 1 1 16 16a16 16 0 0 1-16-16m128 44A108 108 0 1 1 128 20a108.12 108.12 0 0 1 108 108m-24 0a84 84 0 1 0-84 84a84.09 84.09 0 0 0 84-84m-72 36.68V132a20 20 0 0 0-20-20a12 12 0 0 0-4 23.32V168a20 20 0 0 0 20 20a12 12 0 0 0 4-23.32"
    />
  </svg>
)

const DefaultIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    style={{ flexShrink: 0 }}
  >
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0"></path>
      <path d="m9 12l2 2l4-4"></path>
    </g>
  </svg>
)

const ErrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 256 256"
    style={{ flexShrink: 0 }}
  >
    <path
      fill="currentColor"
      d="M240.26 186.1L152.81 34.23a28.74 28.74 0 0 0-49.62 0L15.74 186.1a27.45 27.45 0 0 0 0 27.71A28.31 28.31 0 0 0 40.55 228h174.9a28.31 28.31 0 0 0 24.79-14.19a27.45 27.45 0 0 0 .02-27.71m-20.8 15.7a4.46 4.46 0 0 1-4 2.2H40.55a4.46 4.46 0 0 1-4-2.2a3.56 3.56 0 0 1 0-3.73L124 46.2a4.77 4.77 0 0 1 8 0l87.44 151.87a3.56 3.56 0 0 1 .02 3.73M116 136v-32a12 12 0 0 1 24 0v32a12 12 0 0 1-24 0m28 40a16 16 0 1 1-16-16a16 16 0 0 1 16 16"
    />
  </svg>
)

const defaultIcons: Record<CalloutType, () => ReactNode> = {
  default: InfoIcon, // Gray note icon
  info: InfoIcon,
  success: DefaultIcon, // Green checkmark icon
  warning: WarningIcon,
  error: ErrorIcon,
  important: ErrorIcon // Same icon as error
}

// Color schemes for each callout type
interface CalloutColors {
  background: string
  icon: string
}

const calloutColors: Record<CalloutType, CalloutColors> = {
  default: {
    background: '#f7f7f7',
    icon: '#a8a8a8'
  },
  info: {
    background: '#e8f4fd',
    icon: '#3b82f6'
  },
  success: {
    background: '#eefcf0',
    icon: '#1ed064'
  },
  warning: {
    background: '#fff5ec',
    icon: '#fe9a00'
  },
  error: {
    background: '#fff2ef',
    icon: '#fd8f93'
  },
  important: {
    background: '#fff2ef',
    icon: '#fd8f93'
  }
}

export function Callout({ type = 'default', emoji, children }: CalloutProps) {
  const IconComponent = defaultIcons[type]
  const icon = emoji ?? <IconComponent />
  const colors = calloutColors[type]

  return (
    <div
      className="custom-callout"
      data-type={type}
      style={{
        display: 'flex',
        gap: '0.75rem',
        padding: '1.25rem 1.5rem 1.25rem 1.5rem',
        backgroundColor: colors.background,
        border: 'none',
        borderRadius: '0',
        marginTop: '1.5rem',
        marginBottom: '1.5rem'
      }}
    >
      <div
        className="custom-callout-icon"
        style={{
          color: colors.icon,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'flex-start',
          paddingTop: '.3rem'
        }}
      >
        {icon}
      </div>
      <div
        className="custom-callout-content"
        style={{
          color: '#000',
          flex: 1
        }}
      >
        {children}
      </div>
    </div>
  )
}
