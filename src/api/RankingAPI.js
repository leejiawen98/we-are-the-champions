import api from "./AxiosConfig";

export async function insertTeamScores(teamScoreList) {
    return api.post("/api/insertTeamScores", {
        teamScoreList: teamScoreList
    })
    .then(response => {
        return response.data;
    }).catch(error => {
        throw error.response.status;
    })
}

export async function getAllTeamScores() {
    return api.get("/api/getAllTeamScores")
    .then(response => {
        return response.data;
    }).catch(error => {
        throw error.response.status;
    })
}

export async function clearAll() {
    return api.get("/api/clearAll")
    .then(response => {
        return response.data;
    }).catch(error => {
        throw error.response.status;
    })
}