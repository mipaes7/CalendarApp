import { act, renderHook } from '@testing-library/react';
import { useUiStore } from '../../src/hooks/useUiStore';
import { Provider } from 'react-redux';
import { store, uiSlice } from '../../src/store';
import { configureStore } from '@reduxjs/toolkit';

const getMockStore = (initialState) => {
    return configureStore(
        {
            reducer: {
                ui: uiSlice.reducer
            },
            preloadedState: {
                ui: {...initialState}
            }
        }
    );
}

describe('tests uiStore hook', () => {
  
    test('should return default values', () => {
      
        const mockStore = getMockStore({isDateModalOpen: false});

        const {result} = renderHook(() => useUiStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        });
        expect(result.current).toEqual(
            {
                isDateModalOpen: false,
                openDateModal: expect.any(Function),
                closeDateModal: expect.any(Function),
                toggleDateModal: expect.any(Function)
            }
        )
    });

    test('isDateModalOpen should become truthy', () => {
      
        const mockStore = getMockStore({isDateModalOpen: false});
        const {result} = renderHook(() => useUiStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        });

        const {openDateModal} = result.current;

        act(() => {
            openDateModal();
        });

        expect(result.current.isDateModalOpen).toBeTruthy()

    });
    
    test('isDateModalOpen should become falsy', () => {
      
        const mockStore = getMockStore({isDateModalOpen: true});
        const {result} = renderHook(() => useUiStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        });

        const {closeDateModal} = result.current;

        act(() => {
            closeDateModal();
        });

        expect(result.current.isDateModalOpen).toBeFalsy()

    });
    
    test('isDateModalOpen should toggle between truthy and falsy', () => {
      
        const mockStore = getMockStore({isDateModalOpen: false});
        const {result} = renderHook(() => useUiStore(), {
            wrapper: ({children}) => <Provider store={mockStore}>{children}</Provider>
        });

        const {toggleDateModal} = result.current;

        act(() => {
            toggleDateModal();
        });
        
        expect(result.current.isDateModalOpen).toBeTruthy()
        
        act(() => {
            result.current.toggleDateModal();
        });

        expect(result.current.isDateModalOpen).toBeFalsy()

    });

});
