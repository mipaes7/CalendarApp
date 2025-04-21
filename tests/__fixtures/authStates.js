export const initialState = {
    status: 'checking', // 'authenticated' 'not-authenticated'
    user: {},
    errorMessage: undefined
};
export const authenticatedState = {
    status: 'authenticated', // 'authenticated' 'not-authenticated'
    user: {
        uid: '1234abc',
        name: 'Jotaro'
    },
    errorMessage: undefined
};
export const notAuthenticatedState = {
    status: 'not-authenticated', // 'authenticated' 'not-authenticated'
    user: {},
    errorMessage: undefined
};