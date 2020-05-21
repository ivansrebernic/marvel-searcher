import React from 'react'
import { mount, shallow, render } from 'enzyme'
import ProviderMock from '../../__mocks__/providerMock'
import CharacterMock from '../../__mocks__/characterMock'
import Characters from '../../containers/Characters'
import CharacterCard from '../../components/CharacterCard'
import FavoriteButton from '../../components/FavoriteButton'




describe('<Characters/>', () => {
    test('Render character container', async () => {
        const container = shallow(
            <ProviderMock>
                <Characters ></Characters>
            </ProviderMock>)
        expect(container.length).toEqual(1)
    });
})

