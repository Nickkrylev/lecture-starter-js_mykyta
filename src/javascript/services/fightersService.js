import callApi from '../helpers/apiHelper';

class FighterService {
    #endpoint = 'fighters.json';

    async getFighters() {
        try {
            const apiResult = await callApi(this.#endpoint);
            return apiResult;
        } catch (error) {
            throw error;
        }
    }

    // eslint-disable-next-line class-methods-use-this
    getFighterDetails = async id => {
        try {
            const detailsEndpoint = `details/fighter/${id}.json`;
            const result = await callApi(detailsEndpoint);
            return result;
        } catch (error) {
            throw error;
        }
    };
}

const fighterService = new FighterService();

export default fighterService;
