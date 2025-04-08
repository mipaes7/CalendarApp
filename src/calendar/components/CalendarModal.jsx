import { useEffect, useMemo, useState } from 'react';
import { addHours, differenceInSeconds } from 'date-fns';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useCalendarStore, useUiStore } from '../../hooks';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root');

export const CalendarModal = () => {

    const {isDateModalOpen, closeDateModal} = useUiStore();

    const {activeEvent, startSavingEvent} = useCalendarStore();
    
    const [formSubmitted, setFormSubmitted] = useState(false);

    const [formValues, setFormValues] = useState(
        {
            title: 'eventtitle',
            notes: 'eventnotes',
            start: new Date(),
            end: addHours(new Date(), 2)
        }
    );

    const titleClass = useMemo(() => {
        if (!formSubmitted) return '';

        return (formValues.title.length > 0)
            ? ''
            : 'is-invalid'

    }, [formValues.title, formSubmitted])

    useEffect(() => {
        if (activeEvent !== null) {
            setFormValues({...activeEvent});
        }

    }, [activeEvent]);

    const onInputChange = ({ target }) => {
        setFormValues(
            {
                ...formValues,
                [target.name]: target.value
            }
        )
    };

    const onCloseModal = () => {
        closeDateModal();
    };

    const onDateChange = (event, changing) => {
        setFormValues(
            {
                ...formValues,
                [changing]: event
            }
        )
    };

    const onSubmitForm = async(event) => {
        event.preventDefault();
        setFormSubmitted(true);

        const diff = differenceInSeconds(formValues.end, formValues.start);

        if (isNaN(diff) || diff <= 0) {
            console.log('date error')
            Swal.fire('Invalid dates', 'Check dates', 'error');
            return;
        }

        if (formValues.title.length <= 0) {
            Swal.fire('Title is mandatory', 'Fill title input', 'error');
            return;
        };

        // console.log(formValues);

        await startSavingEvent(formValues);
        closeDateModal();
        setFormSubmitted(false);
    };

    return (
        <Modal
            isOpen={isDateModalOpen}
            onRequestClose={onCloseModal}
            style={customStyles}
            contentLabel="Example Modal"
            className="modal"
            overlayClassName="modal-fondo"
            closeTimeoutMS={200}
        >
            <h1> New Event </h1>
            <hr />
            <form className="container" onSubmit={onSubmitForm}>

                <div className="form-group mb-2 d-flex flex-column">
                    <label htmlFor="startDate">From:</label>
                    <DatePicker
                        id="startDate"
                        minDate={formValues.start}
                        selected={formValues.start}
                        onChange={(event) => onDateChange(event, 'start')}
                        className="form-control"
                        timeFormat="HH:mm"
                        dateFormat="dd/MM/yyyy HH:mm"
                        showTimeSelect
                    />
                </div>

                <div className="form-group mb-2 d-flex flex-column">
                    <label htmlFor="startDate">To:</label>
                    <DatePicker
                        id="endDate"
                        minDate={formValues.start}
                        selected={formValues.end}
                        onChange={(event) => onDateChange(event, 'end')}
                        className="form-control"
                        timeFormat="HH:mm"
                        dateFormat="dd/MM/yyyy HH:mm"
                        showTimeSelect
                    />
                </div>

                <hr />
                <div className="form-group mb-2">
                    <label>Title and notes</label>
                    <input
                        type="text"
                        className={`form-control ${titleClass}`}
                        placeholder="Event title"
                        name="title"
                        autoComplete="off"
                        value={formValues.title}
                        onChange={onInputChange}
                    />
                    {formValues.title?.length === 0 && (
                        <div className="invalid-feedback">Title is required.</div>
                    )}
                    <small id="emailHelp" className="form-text text-muted">Short description</small>
                </div>

                <div className="form-group mb-2">
                    <textarea
                        type="text"
                        className="form-control"
                        placeholder="Notes"
                        rows="5"
                        name="notes"
                        value={formValues.notes}
                        onChange={onInputChange}
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Additional info</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary d-block mx-auto"
                >
                    <i className="far fa-save"></i>
                    <span> Save</span>
                </button>

            </form>
        </Modal>
    )
}