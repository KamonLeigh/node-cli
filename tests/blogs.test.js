const Page = require('./helpers/page');

let page;


beforeEach( async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

afterEach( async () => {
    await page.close();
});



describe('When logged in', async () => {
    beforeEach(async () => {
        await page.login();
        await page.click('a.btn-floating');
    });

    test('can see blog create form', async () => {
        const label = await page.getContentOf('form label');
        expect(label).toEqual('Blog Title');
    });

    describe('And using valid inputs', async () => {
        beforeEach(async () => {
            await page.type('.title input', 'My Title');
            await page.type('.content input', 'My Content');
            await page.click('form button');
        });
        
        test('Submitting takes user to review screen', async () => {
            const text = await page.getContentOf('h5');
            expect(text).toEqual('Please confirm your entries');
        });

        test('Submitting then savings adds blog to index', async () => {
          await page.click('button.green');
          await page.waitFor('.card');

          const title = await page.getContentOf('.card-title');
          const content = await page.getContentOf('p');

          expect(title).toEqual('My Title');
          expect(content).toEqual('My Content'); 
        });
    });
    
    describe('And using invalid inputs', async () => {
        beforeEach(async () => {
            await page.click('form button');
        });
        test('the form shows an error message', async () => {
            const titleError = await page.getContentOf('.title .red-text');
            const contentError = await page.getContentOf('.content .red-text');

            expect(titleError).toEqual('You must provide a value');
            expect(comtentError).toEqual('You must provise a value')
        });
    });

});

describe('User is not logged in', async () => {
    const actions = [
        {
            method: 'get',
            path: '/api/blogs'
        },
        {
            method: 'post',
            path: '/api/blogs',
            data: {
                title: 'T',
                content: 'C'
            }
        }
    ];

    // test('User cannot create blog bost', async () => {
    //     const result = await page.post('/api/blogs', {title: 'My Title',content: 'My Content'})
    //     expect(result).toEqual({ error: 'You must log in!'})
    // });

    // test('Users cannot get a list of posts', async () => {
    //     const result = await page.get('/api/blogs');
    //      expect(result).toEqual({ error: 'You must log in!'})


    // });

    test('Blog related actions are prohibited', async () => {
        const results = await page.execRequests(actions);

        for (let result of resultd) {
            expect(result).toEqual({error: 'You must log in!'});
        }
    });
});