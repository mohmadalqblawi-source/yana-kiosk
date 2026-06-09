'use client'

import {
  CATEGORY_ICONS,
  CATEGORY_ICON_OPTIONS,
  CATEGORY_COLORS,
  CATEGORY_COLOR_OPTIONS,
  DEFAULT_ICON_KEY,
  DEFAULT_COLOR_KEY,
  getCategoryIconLabel,
  getCategoryColorLabel,
} from '@/lib/category-styles'
import { Palette, Sparkles } from 'lucide-react'

interface CategoryStylePickerProps {
  selectedIcon: string
  selectedColor: string
  onIconChange: (icon: string) => void
  onColorChange: (color: string) => void
  previewName?: string
}

export default function CategoryStylePicker({
  selectedIcon,
  selectedColor,
  onIconChange,
  onColorChange,
  previewName = 'Kategorie',
}: CategoryStylePickerProps) {
  const iconKey = selectedIcon || DEFAULT_ICON_KEY
  const colorKey = selectedColor || DEFAULT_COLOR_KEY
  const PreviewIcon = CATEGORY_ICONS[iconKey] ?? CATEGORY_ICONS[DEFAULT_ICON_KEY]
  const previewColor = CATEGORY_COLORS[colorKey] ?? CATEGORY_COLORS[DEFAULT_COLOR_KEY]

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-4 sm:p-5 space-y-5">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
          <Palette className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">Icon & Farbe</p>
          <p className="text-xs text-gray-500">So erscheint die Kategorie im Shop</p>
        </div>
      </div>

      {/* Live preview */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${previewColor} flex items-center justify-center shrink-0 shadow-md`}>
          <PreviewIcon className="w-7 h-7 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Vorschau
          </p>
          <p className="text-base font-bold text-gray-900 truncate">{previewName || 'Kategorie'}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {getCategoryIconLabel(iconKey)} · {getCategoryColorLabel(colorKey)}
          </p>
        </div>
      </div>

      {/* Icon picker */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-800">Icon auswählen</p>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
            {getCategoryIconLabel(iconKey)}
          </span>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-5 gap-2">
          {CATEGORY_ICON_OPTIONS.map((key) => {
            const Icon = CATEGORY_ICONS[key]
            const active = iconKey === key
            return (
              <button
                key={key}
                type="button"
                title={getCategoryIconLabel(key)}
                onClick={() => onIconChange(key)}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all ${
                  active
                    ? 'border-emerald-500 bg-white text-emerald-700 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:bg-emerald-50/30'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-medium truncate w-full text-center leading-tight">
                  {getCategoryIconLabel(key)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Color picker */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-800">Hintergrundfarbe</p>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
            {getCategoryColorLabel(colorKey)}
          </span>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-8 gap-2.5">
          {CATEGORY_COLOR_OPTIONS.map((key) => {
            const active = colorKey === key
            return (
              <button
                key={key}
                type="button"
                title={getCategoryColorLabel(key)}
                onClick={() => onColorChange(key)}
                className={`group flex flex-col items-center gap-1.5`}
              >
                <span
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${CATEGORY_COLORS[key]} transition-all block ${
                    active
                      ? 'ring-2 ring-offset-2 ring-emerald-500 scale-105 shadow-md'
                      : 'hover:scale-105 opacity-90 hover:shadow-sm'
                  }`}
                />
                <span className={`text-[9px] font-medium ${active ? 'text-emerald-700' : 'text-gray-400'}`}>
                  {getCategoryColorLabel(key)}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
