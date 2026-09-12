import React, { createContext, useContext, useId, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DisclosureGroupContextValue {
  expandedKeys: Set<string>;
  toggleItem: (id: string) => void;
}

const DisclosureGroupContext = createContext<DisclosureGroupContextValue | null>(null);

export interface DisclosureGroupProps {
  defaultExpandedKeys?: string[];
  expandedKeys?: string[];
  onExpandedChange?: (keys: string[]) => void;
  allowsMultipleExpanded?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function DisclosureGroup({
  defaultExpandedKeys = ['faq-0'],
  expandedKeys: controlledKeys,
  onExpandedChange,
  allowsMultipleExpanded = false,
  className,
  children,
}: DisclosureGroupProps) {
  const [uncontrolledKeys, setUncontrolledKeys] = useState<Set<string>>(
    () => new Set(defaultExpandedKeys)
  );

  const isControlled = controlledKeys !== undefined;
  const currentKeys = isControlled ? new Set(controlledKeys) : uncontrolledKeys;

  const toggleItem = (id: string) => {
    let nextKeys: Set<string>;
    if (allowsMultipleExpanded) {
      nextKeys = new Set(currentKeys);
      if (nextKeys.has(id)) {
        nextKeys.delete(id);
      } else {
        nextKeys.add(id);
      }
    } else {
      nextKeys = new Set<string>();
      if (!currentKeys.has(id)) {
        nextKeys.add(id);
      }
    }

    if (!isControlled) {
      setUncontrolledKeys(nextKeys);
    }
    onExpandedChange?.(Array.from(nextKeys));
  };

  return (
    <DisclosureGroupContext.Provider value={{ expandedKeys: currentKeys, toggleItem }}>
      <div
        className={cn('space-y-4', className)}
        style={{ fontFamily: '"Times New Roman", Times, serif' }}
      >
        {children}
      </div>
    </DisclosureGroupContext.Provider>
  );
}

interface DisclosureContextValue {
  id: string;
  isExpanded: boolean;
  toggle: () => void;
  triggerId: string;
  panelId: string;
}

const DisclosureContext = createContext<DisclosureContextValue | null>(null);

function useDisclosureContext() {
  const context = useContext(DisclosureContext);
  if (!context) {
    throw new Error('Disclosure compound components must be used within a Disclosure');
  }
  return context;
}

export interface DisclosureProps {
  id?: string;
  className?: string;
  children: React.ReactNode | ((props: { isExpanded: boolean }) => React.ReactNode);
}

export function Disclosure({ id: propId, className, children }: DisclosureProps) {
  const generatedId = useId();
  const id = propId ?? generatedId;
  const groupContext = useContext(DisclosureGroupContext);

  const [standaloneExpanded, setStandaloneExpanded] = useState(false);

  const isExpanded = groupContext
    ? groupContext.expandedKeys.has(id)
    : standaloneExpanded;

  const toggle = () => {
    if (groupContext) {
      groupContext.toggleItem(id);
    } else {
      setStandaloneExpanded((prev) => !prev);
    }
  };

  const triggerId = `disclosure-trigger-${id}`;
  const panelId = `disclosure-panel-${id}`;

  return (
    <DisclosureContext.Provider
      value={{ id, isExpanded, toggle, triggerId, panelId }}
    >
      <div
        className={cn(
          'rounded-2xl border transition-all duration-200 overflow-hidden',
          isExpanded
            ? 'bg-white dark:bg-gray-900 border-indigo-200/80 dark:border-indigo-900/60 shadow-sm'
            : 'bg-white/80 dark:bg-gray-900/60 border-gray-200/90 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 shadow-2xs',
          className
        )}
      >
        {typeof children === 'function' ? children({ isExpanded }) : children}
      </div>
    </DisclosureContext.Provider>
  );
}

export interface DisclosureTriggerProps {
  className?: string;
  children: React.ReactNode;
}

export function DisclosureTrigger({ className, children }: DisclosureTriggerProps) {
  const { isExpanded, toggle, triggerId, panelId } = useDisclosureContext();

  return (
    <button
      type="button"
      id={triggerId}
      aria-expanded={isExpanded}
      aria-controls={panelId}
      onClick={toggle}
      className={cn(
        'group w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer select-none',
        'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900',
        'transition-colors duration-200',
        className
      )}
    >
      {children}
    </button>
  );
}

export interface DisclosureIndicatorProps {
  className?: string;
}

export function DisclosureIndicator({ className }: DisclosureIndicatorProps) {
  const { isExpanded } = useDisclosureContext();
  const shouldReduceMotion = useReducedMotion();

  const transitionStyle = shouldReduceMotion
    ? { transition: 'none' }
    : undefined;

  return (
    <span
      className={cn(
        'relative flex items-center justify-center w-6 h-6 shrink-0 text-gray-500 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200',
        className
      )}
      aria-hidden="true"
    >
      {/* Horizontal bar (persists for both + and −) */}
      <span
        style={transitionStyle}
        className="absolute w-3.5 h-[2px] bg-current rounded-full transition-transform duration-300 ease-in-out"
      />
      {/* Vertical bar (scales and rotates out to form −) */}
      <span
        style={transitionStyle}
        className={cn(
          'absolute w-[2px] h-3.5 bg-current rounded-full transition-all duration-300 ease-in-out',
          isExpanded
            ? 'scale-y-0 opacity-0 rotate-90'
            : 'scale-y-100 opacity-100 rotate-0'
        )}
      />
    </span>
  );
}

export interface DisclosurePanelProps {
  className?: string;
  children: React.ReactNode;
}

export function DisclosurePanel({ className, children }: DisclosurePanelProps) {
  const { isExpanded, triggerId, panelId } = useDisclosureContext();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      {isExpanded && (
        <motion.div
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          initial={shouldReduceMotion ? { opacity: 1, height: 'auto' } : { height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={shouldReduceMotion ? { opacity: 0, height: 'auto' } : { height: 0, opacity: 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  height: { duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] },
                  opacity: { duration: 0.22, ease: 'easeInOut' },
                }
          }
          className="overflow-hidden"
        >
          <div
            className={cn(
              'px-5 pb-5 sm:px-6 sm:pb-6 text-sm sm:text-base leading-relaxed border-t pt-4',
              'text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-800/80',
              className
            )}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default DisclosureGroup;
