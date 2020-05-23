import React from 'react'
import { mount, shallow, render } from 'enzyme'
import ProviderMock from '../../__mocks__/providerMock'
import CharacterMock from '../../__mocks__/characterMock'
import Characters from '../../containers/Characters'
import renderer from 'react-test-renderer'
import CharacterCard from '../../components/CharacterCard'
import Searchbox from '../../components/SearchBox'
import { act } from 'react-test-renderer'

describe('<Searchbox/>', () => {
    it('Renders correctly', () => {
        const wrapper = shallow(<Searchbox></Searchbox>)
        expect(wrapper).toHaveLength(1)
    })
})