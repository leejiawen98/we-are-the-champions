import React, { useEffect, useState } from 'react'
import "./Ranking.css"
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearAll, getAllTeamScores, getRanking } from '../../api/RankingAPI';

export default function Ranking() {

    let navigate = useNavigate();
    const { state } = useLocation();
    const [group1Top4, setGroup1Top4] = useState([]);
    const [group2Top4, setGroup2Top4] = useState([]);

    useEffect(() => {
        computeRanking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    async function getTeamScores() {
        try {
            const response = await getAllTeamScores();
            if (response) {
                return await response;
            }
        } catch (error) {
            let msg = "";
            if (error ===  400) {
            msg = "Bad Request. Please check input format"
            }
            alert('Error: ' + msg);
        }
    }

    async function clearDB() {
        try {
            const response = await clearAll();
            if (response) {
                alert('ok');
                navigate('/');
            }
        } catch (error) {
            let msg = "";
            if (error ===  400) {
            msg = "Bad Request. Please check input format"
            }
            alert('Error: ' + msg);
        }
    }

    async function computeRanking() {
        let teamScoreArr;
        // team score can be retrieved from database or from params
        if (!state) {
            teamScoreArr = await getTeamScores();
        } else {
            teamScoreArr = Array.from(state.teamScoreMap.values());
        }
        let group1 = teamScoreArr.filter(x => x.group_number === 1);
        let group2 = teamScoreArr.filter(x => x.group_number === 2);
        setGroup1Top4(findTop4(group1));
        setGroup2Top4(findTop4(group2));
    }

    function findTop4(group) {
        // sort group by required metrics
        // highest total match points > highest total goals > highest alternate totat match points > registration date
        group.sort(function(a,b){
            // sort by total match points first
            
            // if match_points are tied, return highest total goals
            if (a.match_points === b.match_points) {

                //  if match_points and total goals are tied, return highest alt match points
                if (a.total_goals === b.total_goals) {

                    // if match points, total goals and alt match points are tied, return earliest registration date
                    if (a.alt_match_point === b.alt_match_point) {
                        return a.registration_date > b.registration_date ? 1 : a.registration_date < b.registration_date ? -1 : 0;
                    }
                    return a.alt_match_point < b.alt_match_point ? 1 : a.alt_match_point > b.alt_match_point ? -1 : 0;
                }
                return a.total_goals < b.total_goals ? 1 : a.total_goals > b.total_goals ? -1 : 0;
            }
            return a.match_points < b.match_points ? 1 : -1;
        });
        console.log(group);
        // get first 4 elements === top 4 since group is already sorted by metrics
        return group.slice(0,4);
    }

    const group1Ranking = group1Top4.map((team, index) => {
        return (
            <p key={index}>{index+1}. {team.team_name}</p>
        )
    });

    const group2Ranking = group2Top4.map((team, index) => {
        return (
            <p key={index}>{index+1}. {team.team_name}</p>
        )
    });

    return (
        <div>
            <h1>We are the champions!</h1>
            <Link to="/">Edit Team Information</Link>
            <br/>
            <Link to="/matchResults">Edit Match Results</Link>
            <div className="ranking">
                <label><b>Ranking</b></label>

                <div className="ranking-body">
                    <div className="ranking-group">
                        <label>Group 1:</label>
                        {group1Ranking}
                    </div>
                    <div className="ranking-group">
                        <label>Group 2:</label>
                        {group2Ranking}
                    </div>
                </div>
                <button onClick={() => clearDB()}>Clear All</button>
            </div>
        </div>
    )
}
