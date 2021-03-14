import React, { useCallback } from 'react'
import { useMeasure } from 'react-use'
import { FixedSizeGrid, GridChildComponentProps, GridItemKeySelector } from 'react-window'
import {
  ITaskItem,
} from '../../common/constants'
import Item from '../containers/Task'
import __ from '../../locales'

import './TaskList.less'

export interface ITaskListProps {
  tasks: ITaskItem[]
}

const LIST_MARGIN = 10

export default function TaskList({
  tasks,
}: ITaskListProps) {
  const [ref, { width, height }] = useMeasure<HTMLDivElement>()
  const columnWidth = 260
  const rowHeight = columnWidth + 60
  const columnCount = Math.floor((width - LIST_MARGIN * 2) / columnWidth)
  const rowCount = Math.ceil(tasks.length / columnCount)
  const taskCount = tasks.length

  const getItemIndex = useCallback((rowIndex: number, columnIndex: number) => rowIndex * columnCount + columnIndex, [columnCount])

  const gridItemKeySelector: GridItemKeySelector = ({ rowIndex, columnIndex }) => {
    const index = getItemIndex(rowIndex, columnIndex)
    return tasks[index]?.id
  }

  const renderItem = useCallback(({ rowIndex, columnIndex, style }: GridChildComponentProps) => {
    const index = getItemIndex(rowIndex, columnIndex)
    if (index >= taskCount) return null

    return (
      <div
        style={style}
      >
        <Item
          index={index}
        />
      </div>
    )
  }, [getItemIndex, taskCount])

  return (
    <div
      ref={ref}
      className="task-list-container"
    >
      {
        tasks.length ? (
          <FixedSizeGrid
            className="task-list"
            columnWidth={columnWidth}
            columnCount={columnCount}
            rowHeight={rowHeight}
            rowCount={rowCount}
            width={width}
            height={height}
            itemKey={gridItemKeySelector}
          >
            {renderItem}
          </FixedSizeGrid>
        ) : (
          <div className="task-list task-empty">
            <span>{__('drag_files')}</span>
          </div>
        )
      }
    </div>
  )
}
