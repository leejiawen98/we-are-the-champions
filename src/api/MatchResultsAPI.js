import api from "./AxiosConfig";

export async function getAllMatchResults() {
    return api.get("/api/getAllMatchResults")
    .then(response => {
        return response.data;
    }).catch(error => {
        throw error.response.status;
    })
}

export async function insertMatchResults(matchResultsList) {
    return api.post("/api/insertMatchResults", {
        matchResultsList: matchResultsList
    }).then(response => {
        return response;
    }).catch(error => {
        throw error.response.status;
    })
}