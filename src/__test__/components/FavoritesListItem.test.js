import React from 'react'
import { shallow } from 'enzyme'
import FavoritesListItem from '../../components/FavoritesListItem'


describe('<FavoritesListItem>', () => {
    it('Renders correctly', () => {
        const wrapper = shallow(<FavoritesListItem></FavoritesListItem>)
        expect(wrapper).toMatchSnapshot()
    })

})