const state = () => ({
    crimes: []
})

const mutations = {
    initial (state, data) {
        state.crimes = data
    }
}

export { state, mutations }
