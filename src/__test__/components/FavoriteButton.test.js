import React from 'react'
import { shallow } from 'enzyme'
import FavoriteButton from '../../components/FavoriteButton'
import ProviderMock from '../../__mocks__/providerMock'
import { Simulate } from 'react-dom/test-utils';


describe('<FavoriteButton>', () => {
    it('Renders correctly', () => {
        const wrapper = shallow(<FavoriteButton></FavoriteButton>)
        expect(wrapper).toMatchSnapshot()
    });

})