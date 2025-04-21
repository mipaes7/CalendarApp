import { authSlice, clearErrorMessage, onLogin, onLogout } from '../../../src/store/auth/authSlice';
import { authenticatedState, initialState } from '../../__fixtures/authStates';
import { testUserCredentials } from '../../__fixtures/testUser';

describe('Tests on authSlice', () => {

    test('should return initial state', () => {

        expect(authSlice.getInitialState()).toEqual(initialState);

    });

    test('should login', () => {

        const state = authSlice.reducer(initialState, onLogin(testUserCredentials));
        expect(state).toEqual(
            {
                status: 'authenticated',
                user: {
                    email: 'test@gmail.com',
                    password: '123456',
                    uid: '680654bc5b28b0c8174cd45f',
                    name: 'testUser'
                },
                errorMessage: undefined
            }
        );

    });

    test('should logout', () => {
      
        const state = authSlice.reducer(authenticatedState, onLogout());
        expect(state).toEqual(
            { status: 'not-authenticated', user: {}, errorMessage: undefined }
        );

    });

    test('should logout with errormsg and clearErrorMessage should clear it', () => {
        
        const errorMessage = 'error test';
        let state = authSlice.reducer(authenticatedState, onLogout(errorMessage));
        expect(state).toEqual(
            { status: 'not-authenticated', user: {}, errorMessage: errorMessage }
        );

        state = authSlice.reducer(state, clearErrorMessage());
        expect(state).toEqual(
            { status: 'not-authenticated', user: {}, errorMessage: undefined }
        );

    });
    



});
