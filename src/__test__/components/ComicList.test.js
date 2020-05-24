import React from 'react'
import { shallow } from 'enzyme'
import ComicList from '../../components/ComicList'


describe('<ComicList>', () => {
    it('Renders correctly', () => {
        const wrapper = shallow(<ComicList></ComicList>)
        expect(wrapper).toMatchSnapshot()
    })
})