import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { PencilIcon } from '~/icons/PencilIcon'
import { CheckIcon } from '~/icons/CheckIcon'
import { updateTask } from '~/store/task'
import './TaskItem.css'

export const TaskItem = ({ task, onEdit }) => {
  const dispatch = useDispatch()
  const { id, title, detail, done, limit } = task

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleToggle = useCallback(() => {
    setIsSubmitting(true)
    void dispatch(updateTask({ id, done: !done })).finally(() => {
      setIsSubmitting(false)
    })
  }, [id, done])

  function getRemainingText(limit) {
    if (!limit) return ''

    const now = new Date()
    const due = new Date(limit)
    const diffMs = due - now

    if (diffMs <= 0) return 'Expired'

    const totalMinutes = Math.floor(diffMs / 1000 / 60)
    const days = Math.floor(totalMinutes / (60 * 24))
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
    const minutes = totalMinutes % 60

    if (days > 0) return `${days}days ${hours}hours ${minutes}minutes remaining`
    if (hours > 0) return `${hours}hours ${minutes}minutes remaining`
    return `${minutes}minutes remaining`
  }

  function formatLimit(limit) {
    if (!limit) return ''

    const date = new Date(limit)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    // 例: 2025-11-28 11:11
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  return (
    <div className="task_item">
      <div className="task_item__title_container">
        <button
          type="button"
          onClick={handleToggle}
          disabled={isSubmitting}
          className="task__item__mark_button"
        >
          {done ? (
            <div className="task_item__mark____complete" aria-label="Completed">
              <CheckIcon className="task_item__mark____complete_check" />
            </div>
          ) : (
            <div
              className="task_item__mark____incomplete"
              aria-label="Incomplete"
            ></div>
          )}
        </button>
        <div className="task_item__title" data-done={done}>
          {title}
        </div>
        <div aria-hidden className="task_item__title_spacer"></div>
        <button
          type="button"
          className="task_item__title_action"
          onClick={() => onEdit(id)}
        >
          <PencilIcon aria-label="Edit" />
        </button>
      </div>
      <div className="task_item__detail">{detail}</div>
      <div className="task_item__limit">Due:{formatLimit(limit)}</div>
      <div className="task_item__limit_remaining">
        {getRemainingText(limit)}
      </div>
    </div>
  )
}
