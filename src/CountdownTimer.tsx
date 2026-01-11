import React, { useEffect, useRef, useState } from 'react';

// ============================================================================
// Duration Parser
// ============================================================================

interface ParsedDuration {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function parseDuration(durationStr: string): number {
  const parsed: ParsedDuration = {
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  const seen = new Set<string>();
  const parts = durationStr.trim().split(/\s+/);

  for (const part of parts) {
    const match = part.match(/^(\d+)([yMdhms])$/);
    if (!match) continue;

    const value = parseInt(match[1], 10);
    const unit = match[2];

    if (value < 0 || seen.has(unit)) continue;
    seen.add(unit);

    switch (unit) {
      case 'y':
        parsed.years = value;
        break;
      case 'M':
        parsed.months = value;
        break;
      case 'd':
        parsed.days = value;
        break;
      case 'h':
        parsed.hours = value;
        break;
      case 'm':
        parsed.minutes = value;
        break;
      case 's':
        parsed.seconds = value;
        break;
    }
  }

  // Convert to milliseconds (approximate: 1 year = 365 days, 1 month = 30 days)
  const ms =
    parsed.years * 365 * 24 * 60 * 60 * 1000 +
    parsed.months * 30 * 24 * 60 * 60 * 1000 +
    parsed.days * 24 * 60 * 60 * 1000 +
    parsed.hours * 60 * 60 * 1000 +
    parsed.minutes * 60 * 1000 +
    parsed.seconds * 1000;

  return ms;
}

// ============================================================================
// LocalStorage Manager
// ============================================================================

interface TimerState {
  firstVisit: number;
  endTime: number;
  durationMs: number;
}

function getTimerState(storageKey: string): TimerState | null {
  try {
    const data = localStorage.getItem(`${storageKey}_state`);
    if (!data) return null;
    const parsed = JSON.parse(data);
    if (
      typeof parsed.firstVisit === 'number' &&
      typeof parsed.endTime === 'number' &&
      typeof parsed.durationMs === 'number'
    ) {
      return parsed as TimerState;
    }
    return null;
  } catch {
    return null;
  }
}

function setTimerState(storageKey: string, state: TimerState): void {
  try {
    localStorage.setItem(`${storageKey}_state`, JSON.stringify(state));
  } catch {
    // LocalStorage unavailable - graceful fallback
  }
}

// ============================================================================
// Time Calculation
// ============================================================================

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
  totalMs: number;
}

function calculateTimeRemaining(endTime: number): TimeRemaining {
  const now = Date.now();
  const totalMs = endTime - now;

  if (totalMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: true,
      totalMs: 0,
    };
  }

  const totalSeconds = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    expired: false,
    totalMs,
  };
}

// ============================================================================
// DOM Update Logic
// ============================================================================

function updateCountdownElements(
  container: HTMLElement,
  time: TimeRemaining,
  leadingZeros: boolean
): void {
  const format = (val: number): string => {
    if (leadingZeros && val < 10) {
      return `0${val}`;
    }
    return String(val);
  };

  const updateElement = (attr: string, value: string) => {
    const elements = container.querySelectorAll(`[countdown-remaining="${attr}"]`);
    elements.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.innerText = value;
      }
    });
  };

  updateElement('days', format(time.days));
  updateElement('hours', format(time.hours));
  updateElement('minutes', format(time.minutes));
  updateElement('seconds', format(time.seconds));

  // Handle visibility for active/expired states
  const activeElements = container.querySelectorAll('[countdown-remaining="active"]');
  const expiredElements = container.querySelectorAll('[countdown-remaining="expired"]');

  activeElements.forEach((el) => {
    if (el instanceof HTMLElement) {
      el.style.display = time.expired ? 'none' : '';
    }
  });

  expiredElements.forEach((el) => {
    if (el instanceof HTMLElement) {
      el.style.display = time.expired ? '' : 'none';
    }
  });
}

// ============================================================================
// Event Broadcasting
// ============================================================================

function dispatchCountdownEvents(
  current: TimeRemaining,
  previous: TimeRemaining | null
): void {
  // Always dispatch update event
  window.dispatchEvent(
    new CustomEvent('countdown:update', {
      detail: {
        days: current.days,
        hours: current.hours,
        minutes: current.minutes,
        seconds: current.seconds,
        expired: current.expired,
        totalMs: current.totalMs,
      },
    })
  );

  if (!previous) return;

  // Dispatch granular events on value changes
  if (current.days !== previous.days) {
    window.dispatchEvent(
      new CustomEvent('countdown:days', {
        detail: { value: current.days, previous: previous.days },
      })
    );
  }

  if (current.hours !== previous.hours) {
    window.dispatchEvent(
      new CustomEvent('countdown:hours', {
        detail: { value: current.hours, previous: previous.hours },
      })
    );
  }

  if (current.minutes !== previous.minutes) {
    window.dispatchEvent(
      new CustomEvent('countdown:minutes', {
        detail: { value: current.minutes, previous: previous.minutes },
      })
    );
  }

  if (current.seconds !== previous.seconds) {
    window.dispatchEvent(
      new CustomEvent('countdown:seconds', {
        detail: { value: current.seconds, previous: previous.seconds },
      })
    );
  }

  // Dispatch expired event once
  if (current.expired && !previous.expired) {
    window.dispatchEvent(
      new CustomEvent('countdown:expired', {
        detail: { expired: true },
      })
    );
  }
}

// ============================================================================
// Main Component
// ============================================================================

export interface CountdownTimerProps {
  duration?: string;
  content?: React.ReactNode;
  storageKey?: string;
  debugMode?: boolean;
  leadingZeros?: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  duration = '24h',
  content,
  storageKey = 'countdown',
  debugMode = false,
  leadingZeros = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousTimeRef = useRef<TimeRemaining | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
    totalMs: 0,
  });
  const [timerState, setTimerStateLocal] = useState<TimerState | null>(null);

  useEffect(() => {
    // Parse duration
    const durationMs = parseDuration(duration);
    if (durationMs <= 0) return;

    // Initialize or update timer state
    const now = Date.now();
    let state = getTimerState(storageKey);

    if (!state) {
      // First visit - create new state
      state = {
        firstVisit: now,
        endTime: now + durationMs,
        durationMs,
      };
      setTimerState(storageKey, state);
    } else if (state.durationMs !== durationMs) {
      // Duration changed - recalculate from first visit
      state = {
        ...state,
        endTime: state.firstVisit + durationMs,
        durationMs,
      };
      setTimerState(storageKey, state);
    }

    setTimerStateLocal(state);

    // Calculate initial time
    const initialTime = calculateTimeRemaining(state.endTime);
    setTimeRemaining(initialTime);

    // Update DOM immediately
    if (containerRef.current) {
      updateCountdownElements(containerRef.current, initialTime, leadingZeros);
    }

    // Dispatch initial events
    dispatchCountdownEvents(initialTime, null);
    previousTimeRef.current = initialTime;

    // Start interval
    const intervalId = setInterval(() => {
      const currentState = getTimerState(storageKey);
      if (!currentState) return;

      const time = calculateTimeRemaining(currentState.endTime);
      setTimeRemaining(time);

      if (containerRef.current) {
        updateCountdownElements(containerRef.current, time, leadingZeros);
      }

      dispatchCountdownEvents(time, previousTimeRef.current);
      previousTimeRef.current = time;

      // Stop interval if expired
      if (time.expired) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [duration, storageKey, leadingZeros]);

  return (
    <div ref={containerRef}>
      {content}
      {debugMode && timerState && (
        <div
          style={{
            marginTop: 8,
            padding: '8px 10px',
            borderRadius: 6,
            border: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
            color: '#111827',
            fontSize: 13,
            lineHeight: 1.4,
            fontFamily:
              'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Countdown Debug</div>
          <div>Storage Key: {storageKey}</div>
          <div>Duration: {duration} ({parseDuration(duration)}ms)</div>
          <div>First Visit: {new Date(timerState.firstVisit).toISOString()}</div>
          <div>End Time: {new Date(timerState.endTime).toISOString()}</div>
          <div>
            Remaining: {timeRemaining.days}d {timeRemaining.hours}h{' '}
            {timeRemaining.minutes}m {timeRemaining.seconds}s
          </div>
          <div>Expired: {timeRemaining.expired ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  );
};
