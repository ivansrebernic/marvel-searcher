import React from 'react'
import { shallow } from 'enzyme'
import FavoritesList from '../../components/FavoritesList'


describe('<FavoritesList>', () => {
    it('Renders correctly', () => {
        const wrapper = shallow(<FavoritesList></FavoritesList>)
        expect(wrapper).toMatchSnapshot()
    })

})