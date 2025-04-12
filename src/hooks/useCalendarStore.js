import { useDispatch, useSelector } from 'react-redux';
import { calendarApi } from '../api';
import { onAddNewEvent, onDeactiveEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent, onLoadEvents } from '../store';
import { normalizeDateEvents } from '../helpers';
import Swal from 'sweetalert2';


export const useCalendarStore = () => {

    const dispatch = useDispatch();

    const { events, activeEvent } = useSelector(state => state.calendar);
    const { user } = useSelector(state => state.auth);

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent));
    };

    const setDeactiveEvent = () => {
        dispatch(onDeactiveEvent());
    };

    const startSavingEvent = async (calendarEvent) => {
        try {
            if (!calendarEvent.id) {
                // create
                const { data } = await calendarApi.post('/event', calendarEvent);
                dispatch(onAddNewEvent({ ...calendarEvent, id: data.createdEvent.id, user }));
            } else {
                // update
                const resp = await calendarApi.put(`/event/${calendarEvent.id}`, calendarEvent);
                console.log(resp);
                dispatch(onUpdateEvent({ ...calendarEvent, user }));
                return;
            }
        } catch (error) {
            console.log(error)
            Swal.fire('Not able to save modifications', error.response.data.msg, 'error');
        }

    };

    const startDeletingEvent = async () => {
        try {
            const resp = await calendarApi.delete(`/event/${activeEvent.id}`);
            console.log(resp);
            dispatch(onDeleteEvent());
        } catch (error) {
            console.log(error);
            Swal.fire('Not able to delete', error.response.data.msg, 'error');
        }
    };

    const startLoadingEvents = async () => {
        try {
            const { data } = await calendarApi.get('/event');
            const events = normalizeDateEvents(data.events);
            console.log(events);
            dispatch(onLoadEvents(events));

        } catch (error) {
            console.log(error);
        }
    };

    return {
        //? porperties
        events,
        activeEvent,
        hasEventSelected: !!activeEvent,

        //?methods
        setActiveEvent,
        startSavingEvent,
        startDeletingEvent,
        setDeactiveEvent,
        startLoadingEvents
    }

};