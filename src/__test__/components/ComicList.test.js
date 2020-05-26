import React from 'react'
import { shallow } from 'enzyme'
import ComicList from '../../components/ComicList'


describe('<ComicList>', () => {
    let wrapper
    beforeEach(() => {
        wrapper = shallow(<ComicList></ComicList>)
    })
    it('Renders correctly', () => {
        expect(wrapper).toMatchSnapshot()
    });
    it('Fetches comics', () => {
        const spy = jest.spyOn(global, 'fetch')
        setTimeout(() => {
            wrapper.update()
            expect(spy).toHaveBeenCalledTimes(1)
        })
    });
    it('displays a set of comics', () => {
        const comics = [{ id: 1, title: "comic title 1" }, { id: 2, title: "comic title 2" }, { id: 3, title: "comic title 3" }]
        wrapper.setState({ comics: comics });
        console.log(wrapper.debug())
        expect(wrapper.find('span')).toHaveLength(3)
    })
})