import React, { useEffect, useState } from 'react'
import "./Ranking.css"
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearAll, getAllTeamScores } from '../../api/RankingAPI';

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
        // team score can be retrieved from database or from state (params, to reduce API calling)
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
            <li key={index} className="ranking-card">
                <div>
                    {index+1}. <b>{team.team_name}</b>
                </div>
                <div className="ranking-scores">
                    Total Match Points: {team.match_points}
                    <br/>
                    Total Goals Scored: {team.total_goals}
                    <br/>
                    Alternative Match Points: {team.alt_match_points}
                    <br/>
                    Registration Date: {new Date(team.registration_date).getDate()}/{new Date(team.registration_date).getMonth()+1} 
                </div>
            </li>
        )
    });

    const group2Ranking = group2Top4.map((team, index) => {
        return (
            <li key={index} className="ranking-card">
                <div>
                    {index+1}.  <b>{team.team_name}</b>
                </div>
                <div className="ranking-scores">
                    Total Match Points: {team.match_points}
                    <br/>
                    Total Goals Scored: {team.total_goals}
                    <br/>
                    Alternative Match Points: {team.alt_match_points}
                    <br/>
                    Registration Date: {new Date(team.registration_date).getDate()}/{new Date(team.registration_date).getMonth()+1} 
                </div>
            </li>
        )
    });

    return (
        <div>
            <h1>We are the champions!</h1>
            <div className="ranking">
                <div className="navigation-links">
                    <Link to="/"><h4>Edit Team Information</h4></Link>
                    <Link to="/matchResults"><h4>Edit Match Results</h4></Link>
                </div>
                <h4><u>Ranking</u></h4>

                <div className="ranking-body">
                    <div className="ranking-group">
                        <h5>Group 1:</h5>
                        {group1Ranking}
                    </div>
                    <div className="ranking-group">
                        <h5>Group 2:</h5>
                        {group2Ranking}
                    </div>
                </div>
                <button onClick={() => clearDB()}>Reset</button>
            </div>
        </div>
    )
}
