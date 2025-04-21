import { render, screen } from '@testing-library/react';
import { FabDelete } from '../../../src/calendar/components/FabDelete';
import { useCalendarStore } from '../../../src/hooks/useCalendarStore';
import { Provider } from 'react-redux';
import { store } from '../../../src/store';

jest.mock('../../../src/hooks/useCalendarStore');

describe('tests on FabDelete component', () => {

    test('should render component', () => {

        useCalendarStore.mockReturnValue(
            {
                hasEventSelected: false
            }
        );
        render(
            <Provider store={store}>
                <FabDelete />
            </Provider>
        );
        screen.debug();

        const btn = screen.getByLabelText('btn-delete');

        expect(btn.classList).toContain('fab-danger');
        expect(btn.style.display).toBe('none');

    });


});
