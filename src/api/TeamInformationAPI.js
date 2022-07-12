import api from "./AxiosConfig";

export async function getAllTeamInformation() {
    return api.get("/api/getAllTeamInformation")
    .then(response => {
        return response.data;
    }).catch(error => {
        throw error.response.status;
    })
}

export async function insertTeamInformation(teamList) {
    return api.post("/api/insertTeamInformation", {
        teamList: teamList
    }).then(response => {
        return response;
    }).catch(error => {
        throw error.response.status;
    })
}