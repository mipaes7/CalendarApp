import { useCalendarStore, useUiStore } from "../../hooks"

export const FabDelete = () => {

  const { startDeletingEvent, hasEventSelected } = useCalendarStore();
  const { isDateModalOpen } = useUiStore();
  
  const handleDelete = () => {
    startDeletingEvent();
  };

  return (
    <button
    aria-label="btn-delete"
      className="btn btn-danger fab-danger"
      onClick={handleDelete}
      style={{display: (hasEventSelected && !isDateModalOpen) ? '' : 'none'}}
    >
      <i className="fas fa-trash-alt icon"></i>
    </button>
  )
}