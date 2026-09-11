'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'

export type CatalogueCategoryItem = {
  id: number
  level: number
  name: string
  count: number
  href: string
  active: boolean
  children: CatalogueCategoryItem[]
}

type Props = {
  items: CatalogueCategoryItem[]
  expandLabel: string
  collapseLabel: string
}

function containsActive(item: CatalogueCategoryItem): boolean {
  return item.active || item.children.some(containsActive)
}

export default function CatalogueCategoryTree({ items, expandLabel, collapseLabel }: Props) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(
    () => new Set(items.flatMap((root) => root.children.filter(containsActive).map((child) => child.id)))
  )

  const toggle = (id: number) => {
    setExpandedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const renderItem = (item: CatalogueCategoryItem): ReactNode => {
    const canToggle = item.level === 2 && item.children.length > 0
    const isOpen = item.level === 1 || expandedIds.has(item.id)

    return <li key={item.id} className={`stitch-category-tree-item level-${item.level} ${isOpen ? 'is-open' : ''}`}>
      <div className="stitch-category-tree-row">
        <Link className={item.active ? 'active' : ''} href={item.href}>
          <span>{item.name}</span><small>{item.count}</small>
        </Link>
        {canToggle ? <button type="button" aria-expanded={isOpen} aria-label={`${isOpen ? collapseLabel : expandLabel} ${item.name}`} onClick={() => toggle(item.id)}>{isOpen ? '−' : '+'}</button> : null}
      </div>
      {item.children.length > 0 && isOpen ? <ul>{item.children.map(renderItem)}</ul> : null}
    </li>
  }

  return <ul>{items.map(renderItem)}</ul>
}
