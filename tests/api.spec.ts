import { test, expect } from '@playwright/test';

test('Sign in success with valid user', async ({ request }) => {
    await test.step("1) GET /user/ids", async () => {
        const response = await request.get(
            `https://sertis-qa.glitch.me/user/ids`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                ignoreHTTPSErrors: true, // Ignore SSL certificate errors
            }
        );
        // Assert the response status
        expect(response.status()).toBe(200);

        // Parse and log the JSON response
        const data = await response.json();

        // Assert specific data in the response
        expect(data[0]).toBe('001');
        expect(data[1]).toBe('002');

    });

    let userData;
    await test.step("2) GET /user/ids/{id}", async () => {
        const response = await request.get(
            `https://sertis-qa.glitch.me/user/001`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                ignoreHTTPSErrors: true, // Ignore SSL certificate errors
            }
        );
        // Assert the response status
        expect(response.status()).toBe(200);

        // Parse and log the JSON response
        userData = await response.json();

        const expectResponse = {
            first_name: expect.any(String),
            last_name: expect.any(String),
            permission: expect.any(String),
            phone_no: expect.any(String),
            otp: expect.any(String),
        }

        // Assert specific fields in the response
        expect(userData).toEqual(expect.objectContaining(expectResponse));

    });

    await test.step("3) POST /user/ids/{id}", async () => {
        const requestBody = {
            "phone_no": `${userData.phone_no}`,
            "otp": `${userData.otp}`
        };

        const response = await request.post(
            `https://sertis-qa.glitch.me/signin`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                data: requestBody,
                ignoreHTTPSErrors: true, // Ignore SSL certificate errors
            }
        );
        // Assert the response status
        expect(response.status()).toBe(200);

        // Parse and log the JSON response
        const data = await response.json();
        
        const expectResponse = {
            status_code: 200,
            status: 'Pass',
            data: {
              id: '001',
              first_name: 'John',
              last_name: 'Doe',
              permission: 'admin'
            },
            message: 'Sign in success'
          }

        // Assert specific fields in the response
        expect(data).toEqual(expectResponse);

    });
});

test('Sign in not success with User not found when input an invalid phone_no', async ({ request }) => {
    await test.step("3) POST /signin", async () => {
        const requestBody = {
            "phone_no": `1234`,
            "otp": `12345`
        };

        const response = await request.post(
            `https://sertis-qa.glitch.me/signin`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                data: requestBody,
                ignoreHTTPSErrors: true, // Ignore SSL certificate errors
            }
        );
        // Assert the response status
        expect(response.status()).toBe(404);

        // Parse and log the JSON response
        const data = await response.json();
        
        const expectResponse = {
            "status_code": 404,
            "status": "Not found",
            "data": {},
            "message": "User not found"
          }

        // Assert specific fields in the response
        expect(data).toEqual(expectResponse);

    });
});

test('Sign in not success with User not found when input an invalid otp', async ({ request, context }) => {
    await test.step("3) POST /signin", async () => {
        const requestBody = {
            "phone_no": `020011893`,
            "otp": `999999`
        };
        
        await context.route('https://sertis-qa.glitch.me/signin', (route) => {
            route.fulfill({
              status: 500,
              contentType: 'application/json',
              body: JSON.stringify({ error: 'Internal Server Error' }),
            });
        });

        const response = await request.post(
            `https://sertis-qa.glitch.me/signin`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                data: requestBody,
                ignoreHTTPSErrors: true, // Ignore SSL certificate errors
            }
        );

        // Assert the response status
        expect(response.status()).toBe(404);

        // Parse and log the JSON response
        const data = await response.json();
        
        const expectResponse = {
            "status_code": 404,
            "status": "Not found",
            "data": {},
            "message": "User not found"
        }

        // Assert specific fields in the response
        expect(data).toEqual(expectResponse);

    });
});

test('Get user by ID unsuccess when input an invalid user id', async ({ request }) => {
    let userData;
    await test.step("1) GET /user/ids/{id}", async () => {
        const response = await request.get(
            `https://sertis-qa.glitch.me/user/999`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                ignoreHTTPSErrors: true, // Ignore SSL certificate errors
            }
        );
        // Assert the response status
        expect(response.status()).toBe(400);

        // Parse and log the JSON response
        userData = await response.json();

        const expectResponse = {
            "status_code": "400",
            "message": "999 is not a valid id"
          }

        // Assert specific fields in the response
        expect(userData).toEqual(expectResponse);

    });
});
