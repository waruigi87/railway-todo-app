import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { TaskItem } from '~/components/TaskItem'
import { TaskCreateForm } from '~/components/TaskCreateForm'
import { setCurrentList } from '~/store/list'
import { fetchTasks } from '~/store/task'
import Button from '~/components/Button'
import Modal from '~/components/Modal'
import EditList from './edit/index.page'
import EditTask from './tasks/[taskId]/index.page'
import './index.css'

const ListIndex = () => {
  const dispatch = useDispatch()
  const { listId } = useParams()

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const openEditModal = useCallback(() => setIsEditModalOpen(true), [])
  const closeEditModal = useCallback(() => setIsEditModalOpen(false), [])

  const [editingTaskId, setEditingTaskId] = useState(null)
  const openTaskEditModal = useCallback((taskId) => {
    setEditingTaskId(taskId)
  }, [])
  const closeTaskEditModal = useCallback(() => {
    setEditingTaskId(null)
  }, [])

  const isLoading = useSelector(
    (state) => state.task.isLoading || state.list.isLoading
  )

  const tasks = useSelector((state) => state.task.tasks)
  const listName = useSelector((state) => {
    const currentId = state.list.current
    const list = state.list.lists?.find((list) => list.id === currentId)
    return list?.title
  })
  const incompleteTasksCount = useSelector((state) => {
    return state.task.tasks?.filter((task) => !task.done).length
  })

  useEffect(() => {
    dispatch(setCurrentList(listId))
    dispatch(fetchTasks()).unwrap()
  }, [listId, dispatch])

  if (isLoading) {
    return <div></div>
  }

  return (
    <div className="tasks_list">
      <div className="tasks_list__title">
        {listName}
        {incompleteTasksCount > 0 && (
          <span className="tasks_list__title__count">
            {incompleteTasksCount}
          </span>
        )}
        <div className="tasks_list__title_spacer"></div>
        <Button type="button" onClick={openEditModal}>
          Edit...
        </Button>
      </div>
      <div className="tasks_list__items">
        <TaskCreateForm />
        {tasks?.map((task) => (
          <TaskItem key={task.id} task={task} onEdit={openTaskEditModal} />
        ))}
        {tasks?.length === 0 && (
          <div className="tasks_list__items__empty">No tasks yet!</div>
        )}
      </div>
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <EditList listId={listId} onClose={closeEditModal} />
      </Modal>

      <Modal isOpen={!!editingTaskId} onClose={closeTaskEditModal}>
        {editingTaskId && (
          <EditTask
            listId={listId}
            taskId={editingTaskId}
            onClose={closeTaskEditModal}
          />
        )}
      </Modal>
    </div>
  )
}

export default ListIndex
