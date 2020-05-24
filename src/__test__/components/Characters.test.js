import React from 'react'
import { mount, shallow, render } from 'enzyme'
import API from '../../api'
import Characters from '../../containers/Characters'




describe('<Characters/>', () => {
    beforeAll(async () => {
        global.fetch = jest.fn()
        API.fetchRandomCharacter = jest.fn();
    })
    it('Characters: renders correctly', async () => {
        const wrapper = shallow(
            <Characters location={{ search: '' }}></Characters>
        );
        expect(wrapper).toMatchSnapshot()
    });

})
