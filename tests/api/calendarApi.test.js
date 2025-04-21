import calendarApi from '../../src/api/calendarApi';

describe('Tests on calendarApi', () => {
    
    test('should have deafault config', () => {

        expect(calendarApi.defaults.baseURL).toBe(process.env.VITE_API_URL);
      
    });

    test('should have x-token in headers', async () => {
        
        const token = '12345-mnb';
        localStorage.setItem('token', token);
        const res = await calendarApi.get('/auth');
        expect(res.config.headers['x-token']).toBe(token);

    });
    
    

});
