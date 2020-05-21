import React from 'react'
import Router from 'react-router-dom'



const store = []

const ProviderMock = props => (

    <ProviderMock theme={store}>
        {props.children}
    </ProviderMock>
)

export default ProviderMock