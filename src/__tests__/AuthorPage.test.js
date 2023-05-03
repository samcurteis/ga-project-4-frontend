
test('Verify receipt of Author object.name', async () => {
    
     const actualValue = {
         name: 'Wendy Videlock'
     };

    const expectedValue = {
        name: 'Wendy Videlock'
    }

    expect(actualValue.name).toEqual(expectedValue.name);

})
