export default function () {
    return Promise.resolve({
        json: () =>
            Promise.resolve([
                {
                    id: 0,
                    name: 'Wash the dishes'
                },
                {
                    id: 1,
                    name: 'Make the bed'
                }
            ])

    })
}