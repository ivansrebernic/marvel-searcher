import React from 'react'
import { mount, shallow, render } from 'enzyme'
import NavBar from '../../components/NavBar'


describe('</NavBar>', () => {
    let wrapper
    beforeEach(() => {
        wrapper = shallow(<NavBar></NavBar>)
    });
    test('Render: </NavBar>', () => {
        expect(wrapper).toHaveLength(1)
    });
})