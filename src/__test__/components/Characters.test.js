import React from 'react'
import { mount, shallow, render } from 'enzyme'
import Characters from '../../containers/Characters'




function flushPromises() {
    return new Promise(resolve => setImmediate(resolve([{ name: "Super hero name" }])));
}

describe('<Characters/>', () => {
    beforeEach(async () => {
        const mockSuccessResponse = [{ name: "Super hero name" }];
        const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
        const mockFetchPromise = Promise.resolve({ // 3
            json: () => mockJsonPromise,
        });
        jest.spyOn(global, 'fetch').mockImplementation(() => { return [{ name: "Super hero name" }] }); // 4
    })

    it('Characters: renders correctly', async () => {
        const wrapper = shallow(
            <Characters location={{ search: '' }}></Characters>
        );
        expect(wrapper).toHaveLength(1)
    });
    it('Characters: A CharacterCard is fetched and rendered', async (done) => {


        const wrapper = shallow(
            <Characters location={{ search: undefined }} ></Characters>
        );
        expect(wrapper.state().loading).toEqual(true)
        await flushPromises()
        wrapper.update()

        setTimeout(() => { // 6

            expect(wrapper.state().results).toEqual([{ name: "Super hero name" }]);

            global.fetch.mockClear(); // 7
            done(); // 8
        }, 1000);






    })

})
