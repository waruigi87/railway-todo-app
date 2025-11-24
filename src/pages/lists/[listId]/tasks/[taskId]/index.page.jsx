import { useCallback, useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { BackButton } from '~/components/BackButton'
import Button from '~/components/Button'
import './index.css'
import { setCurrentList } from '~/store/list'
import { fetchTasks, updateTask, deleteTask } from '~/store/task'
import { useId } from '~/hooks/useId'
import InputField from '~/components/InputField'
import TextAreaField from '~/components/TextAreaField'

const EditTask = ({ listId, taskId, onClose }) => {
  const id = useId()
  const dispatch = useDispatch()

  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [done, setDone] = useState(false)
  const [limit, setLimit] = useState('')

  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const task = useSelector((state) =>
    state.task.tasks?.find((task) => task.id === taskId)
  )

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDetail(task.detail)
      setLimit(isoToLocalInputValue(task.limit))
      setDone(task.done)
    }
  }, [task])

  useEffect(() => {
    void dispatch(setCurrentList(listId))
    void dispatch(fetchTasks())
  }, [listId, dispatch])

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault()

      setIsSubmitting(true)

      const apiLimit = localInputValueToIso(limit)

      void dispatch(
        updateTask({ id: taskId, title, detail, done, limit: apiLimit })
      )
        .unwrap()
        .then(() => {
          onClose()
        })
        .catch((err) => {
          setErrorMessage(err.message)
        })
        .finally(() => {
          setIsSubmitting(false)
        })
    },
    [title, taskId, listId, detail, done, limit, onClose, dispatch]
  )

  const handleDelete = useCallback(() => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return
    }

    setIsSubmitting(true)

    void dispatch(deleteTask({ id: taskId }))
      .unwrap()
      .then(() => {
        onClose()
      })
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }, [taskId, onClose, dispatch])

  function isoToLocalInputValue(isoString) {
    if (!isoString) return ''

    const date = new Date(isoString)

    const pad = (n) => String(n).padStart(2, '0')

    const year = date.getFullYear()
    const month = pad(date.getMonth() + 1)
    const day = pad(date.getDate())
    const hours = pad(date.getHours())
    const minutes = pad(date.getMinutes())

    // datetime-local が期待する形式: "YYYY-MM-DDTHH:MM"
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  function localInputValueToIso(localValue) {
    if (!localValue) return null

    // localValue は "2025-11-22T21:30" のような文字列
    const date = new Date(localValue)

    // "2025-11-22T12:30:00.000Z" みたいなISO文字列になる
    const iso = date.toISOString()

    // ミリ秒を削って "YYYY-MM-DDTHH:MM:SSZ" 形式に整える
    return iso.replace(/\.\d{3}Z$/, 'Z')
  }

  return (
    <main className="edit_list">
      <h2 className="edit_list__title">Edit List</h2>
      <p className="edit_list__error">{errorMessage}</p>
      <form className="edit_list__form" onSubmit={onSubmit}>
        <fieldset className="edit_list__form_field">
          <label htmlFor={`${id}-title`} className="edit_list__form_label">
            Title
          </label>
          <InputField
            id={`${id}-title`}
            className="app_input"
            placeholder="Buy some milk"
            value={title}
            onChange={setTitle}
          />
        </fieldset>
        <fieldset className="edit_list__form_field">
          <label htmlFor={`${id}-detail`} className="edit_list__form_label">
            Description
          </label>
          <TextAreaField
            id={`${id}-detail`}
            className="app_input"
            placeholder="Blah blah blah"
            value={detail}
            onChange={setDetail}
          />
        </fieldset>
        <fieldset className="edit_limit__form_field">
          <label htmlFor={`${id}-detail`} className="edit_list__form_label">
            Limit
          </label>
          <input
            type="datetime-local"
            className="edit_limit_form"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />
        </fieldset>
        <fieldset className="edit_list__form_field">
          <label htmlFor={`${id}-done`} className="edit_list__form_label">
            Is Done
          </label>
          <div>
            <InputField
              id={`${id}-done`}
              type="checkbox"
              checked={done}
              onChange={setDone}
            />
          </div>
        </fieldset>
        <div className="edit_list__form_actions">
          <button
            type="button"
            data-variant="secondary"
            className="app_button"
            onClick={onClose} // ← Cancel はモーダルを閉じる
          >
            Cancel
          </button>
          <div className="edit_list__form_actions_spacer"></div>
          <Button
            type="button"
            className="edit_list__form_actions_delete"
            isSubmitting={isSubmitting}
            onClick={handleDelete}
          >
            Delete
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Update
          </Button>
        </div>
      </form>
    </main>
  )
}

export default EditTask
