import React from 'react'
import { shallow } from 'enzyme'
import SearchInput from '../../components/SearchInput'


describe('<SearchInput>', () => {
    it('Renders correctly', () => {
        const wrapper = shallow(<SearchInput></SearchInput>)
        expect(wrapper).toMatchSnapshot()
    });
})