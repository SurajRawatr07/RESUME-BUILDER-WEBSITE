import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { useState, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';

export interface Section {
  id: string;
  label: string;
  icon: ReactNode;
  content: ReactNode;
  required?: boolean;
}

interface SortableSectionProps {
  section: Section;
  isDark: boolean;
}

function SortableSection({ section, isDark }: SortableSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        rounded-2xl border transition-all duration-200 overflow-hidden
        ${isDragging ? 'shadow-2xl scale-[1.02]' : 'shadow-sm'}
        ${isDark
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
        }
      `}
    >
      {/* Section Header */}
      <div
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer select-none
          ${isDark ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          onClick={e => e.stopPropagation()}
          className={`
            touch-none p-1 rounded cursor-grab active:cursor-grabbing flex-shrink-0
            ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}
          `}
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Icon & Label */}
        <span className="text-lg flex-shrink-0">{section.icon}</span>
        <span className={`font-semibold text-sm flex-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {section.label}
        </span>
        {section.required && (
          <span className="text-xs bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
            Required
          </span>
        )}

        {/* Toggle */}
        <button
          onClick={e => { e.stopPropagation(); setIsOpen(!isOpen); }}
          className={`flex-shrink-0 p-1 rounded transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
          aria-label={isOpen ? 'Collapse section' : 'Expand section'}
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Section Content */}
      {isOpen && (
        <div className={`px-4 pb-4 pt-1 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
          {section.content}
        </div>
      )}
    </div>
  );
}

interface DragDropEditorProps {
  sections: Section[];
  onReorder: (sections: Section[]) => void;
}

export default function DragDropEditor({ sections, onReorder }: DragDropEditorProps) {
  const { isDark } = useTheme();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex(s => s.id === active.id);
      const newIndex = sections.findIndex(s => s.id === over.id);
      onReorder(arrayMove(sections, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {sections.map(section => (
            <SortableSection key={section.id} section={section} isDark={isDark} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

// Utility components for inside sections
export { Plus, Trash2 };
export type { Section };
