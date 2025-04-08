import { useDispatch, useSelector } from 'react-redux';
import { onAddNewEvent, onDeactiveEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent } from '../store';


export const useCalendarStore = () => {

    const dispatch = useDispatch();

    const {events, activeEvent} = useSelector(state => state.calendar);

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent)); 
    };

    const setDeactiveEvent = () => {
        dispatch(onDeactiveEvent());
    };

    const startSavingEvent = async(calendarEvent) => {
        if (calendarEvent._id) {
            //? update
            dispatch(onUpdateEvent({...calendarEvent}));
        } else {
            //? create
            dispatch(onAddNewEvent({...calendarEvent, _id: new Date().toTimeString()}));
        }
    };

    const startDeletingEvent = async() => {
        dispatch(onDeleteEvent());
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
        setDeactiveEvent
    }

};