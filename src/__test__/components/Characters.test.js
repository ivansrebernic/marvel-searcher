import React from 'react'
import { mount, shallow, render } from 'enzyme'
import API from '../../api'
import Characters from '../../containers/Characters'



jest.mock('../../api')
describe('<Characters/>', () => {
    let wrapper;
    beforeAll(async () => {
        global.fetch = jest.fn()
        API.fetchRandomCharacter.mockImplementation(() => { name: 'super hero name' })
    });
    beforeEach(() => {
        wrapper = shallow(
            <Characters location={{ search: '' }}></Characters>
        );
    })
    it('Characters: renders correctly', async () => {
        expect(wrapper).toMatchSnapshot()
    });
    it('fetches a random character on start (no url query)', () => {
        setTimeout(() => {
            wrapper.update()
            expect(wrapper.state().results).toHaveLength(1)
        })
    });
})
