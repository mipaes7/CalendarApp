import { configureStore } from '@reduxjs/toolkit';
import { useAuthStore } from '../../src/hooks';
import { authSlice } from '../../src/store/auth/authSlice';
import { Provider } from 'react-redux';
import { initialState, notAuthenticatedState } from '../__fixtures/authStates';
import { act, renderHook, waitFor } from '@testing-library/react';
import { testUserCredentials } from '../__fixtures/testUser';
import { calendarApi } from '../../src/api';

const getMockStore = (initialStateMock) => {
    return configureStore(
        {
            reducer: {
                auth: authSlice.reducer
            },
            preloadedState: {
                auth: { ...initialStateMock }
            }
        }
    );
}

describe('tests on useAuthStore', () => {

    beforeEach(() => localStorage.clear());

    test('should return default values', () => {

        const mockStore = getMockStore(initialState);

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        console.log(result)

        expect(result.current).toEqual(
            {
                status: 'checking',
                user: {},
                errorMessage: undefined,
                startLogin: expect.any(Function),
                startRegister: expect.any(Function),
                checkAuthToken: expect.any(Function),
                startLogout: expect.any(Function)
            }
        )

    });

    test('should login', async () => {

        const mockStore = getMockStore({ ...notAuthenticatedState });

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {
            await result.current.startLogin(testUserCredentials);
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual(
            {
                errorMessage: undefined,
                status: 'authenticated',
                user: { uid: '680654bc5b28b0c8174cd45f', name: 'testUser' }
            }
        );

        expect(localStorage.getItem('token')).toEqual(expect.any(String));
        expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String));

    });

    test('login should fail', async () => {

        const mockStore = getMockStore({ ...notAuthenticatedState });

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {
            await result.current.startLogin({ email: 'error@email.com', password: '1234' });
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual(
            {
                errorMessage: 'Failed Sign In',
                status: 'not-authenticated',
                user: {}
            }
        );

        waitFor(
            () => expect(result.current.errorMessage).toBe(undefined)
        );

    });

    test('should create user', async () => {

        const newUser = { email: 'error@email.com', password: '1234', name: 'qwerty' };

        const mockStore = getMockStore({ ...notAuthenticatedState });

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
            data: {
                ok: true,
                uid: "123456",
                name: "testUser",
                token: "1.12345.12-token"
            }
        });

        await act(async () => {
            await result.current.startRegister(newUser);
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual(
            {
                errorMessage: undefined,
                status: 'authenticated',
                user: { name: 'testUser', uid: '123456' }
            }
        );
        spy.mockRestore();
    });

    test('should fail create user', async () => {

        const newUser = testUserCredentials;

        const mockStore = getMockStore({ ...notAuthenticatedState });

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {
            await result.current.startRegister(newUser);
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual(
            {
                errorMessage: 'User already registered',
                status: 'not-authenticated',
                user: {}
            }
        );
    });

    test('should fail if no token found', async () => {

        const mockStore = getMockStore({ ...initialState });

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {
            await result.current.checkAuthToken();
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual(
            {
                errorMessage: undefined,
                status: 'not-authenticated',
                user: {}
            }
        );
    });

    test('should authenticate if token found', async () => {

        const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem('token', data.token);

        const mockStore = getMockStore({ ...initialState });

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {
            await result.current.checkAuthToken();
        });
        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual(
            {
                errorMessage: undefined,
                status: 'authenticated',
                user: { name: 'testUser', uid: '680654bc5b28b0c8174cd45f' }
            }
        );
    });
});
