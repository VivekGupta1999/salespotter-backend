const request = require('supertest');
const Ad = require('../models/ad');
const app = require('../app');
const mongoose = require('mongoose');


beforeAll(async()=>{
    await mongoose.connect(process.env.DATABASE_URL);

});

afterEach(async () => {
    await Ad.deleteMany({}); // Clear the test database after each test
  });
  
  afterAll(async () => {
    await mongoose.connection.close(); // Close the database connection after all tests
  });




describe("GET /api/ad/Get-All-Ads",function(){
    it('should return a list of ads',async() =>{
        const res = await request(app).get('/api/ad/get-All-Ads')
        
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);

        
    });
})