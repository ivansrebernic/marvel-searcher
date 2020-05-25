const credentials = "?&ts=1&apikey=d267dc8180768e976a2442235e0617f6&hash=0ad4c739d3e46cefdb021c410ddefe5e"

export default {
    //This object is created for easier testing by replacing the API module with a mock
    fetchRandomCharacter: async () => {

        //Asumimos que la busqueda inicial tendra por lo menos 50 paginas de resultados de las cuales obtendremos nuestro personaje random

        const randomPage = () => {
            return Math.floor(Math.random() * 1300)
        }
        const response = await fetch(`http://gateway.marvel.com/v1/public/characters${credentials}&offset=${randomPage()}`)
        const { data } = await response.json();


        return data
    },
    fetchCharacterByName: async (character, offset) => {

        return new Promise(resolve => {
            const response = fetch(`http://gateway.marvel.com/v1/public/characters${credentials}${(character === "") ? "" : "&nameStartsWith=" + character}&offset=${offset}`)
            const { data } = response.json();
            resolve(data)
        })


    }

}