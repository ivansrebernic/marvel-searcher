import React from 'react'
import { mount, shallow, render } from 'enzyme'
import ProviderMock from '../../__mocks__/providerMock'
import CharacterMock from '../../__mocks__/characterMock'
import Characters from '../../containers/Characters'
import CharacterCard from '../../components/CharacterCard'



describe('<CharacterCard/>', () => {
    let wrapper, character, handleShowModal
    beforeEach(() => {
        character = {
            name: 'super hero name',
        };
        wrapper = shallow(<CharacterCard character={character} onClick={handleShowModal} onOpenModal={handleShowModal}></CharacterCard>);
        handleShowModal = jest.fn();
    });
    test('Rendering CharacterCard', () => {
        const container = shallow(
            <ProviderMock>
                <CharacterCard ></CharacterCard>
            </ProviderMock>)
        expect(container.length).toEqual(1)
    });
    test('Clicking on CharacterCard', () => {

        const container = shallow(
            <ProviderMock >
                <CharacterCard onClick={handleShowModal}>
                </CharacterCard>
            </ProviderMock>)
        container.find(CharacterCard).simulate('click');
        expect(handleShowModal).toHaveBeenCalledTimes(1)
    });
    test('CharacterCard rendering hero name', () => {
        expect(wrapper.find('h1').text()).toMatch(/super hero name/)
    })

})