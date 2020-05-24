import React from 'react'
import { shallow, mount } from 'enzyme'
import ModalCharacterInfo from '../../components/ModalCharacterInfo'



describe('<ModalCharacterInfo>', () => {
    let wrapper
    beforeEach(() => {
        wrapper = shallow(<ModalCharacterInfo></ModalCharacterInfo>)
    })
    it('Renders correctly', () => {
        expect(wrapper).toMatchSnapshot()
    });
    it('Renders the image of the character', () => {
        wrapper = shallow(<ModalCharacterInfo></ModalCharacterInfo>)
    })

})