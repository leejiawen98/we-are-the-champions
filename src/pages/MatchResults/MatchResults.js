import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from 'reactstrap';
import { getAllMatchResults, insertMatchResults } from '../../api/MatchResultsAPI';
import { insertTeamScores } from '../../api/RankingAPI';
import './MatchResults.css';
import '../Home/Home.css';

export default function MatchResults() {

    let navigate = useNavigate();
    const { state } = useLocation();
 
    let error = false;
    
    useEffect(() => {
        getAllResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [matchResults, setMatchResults] = useState('');

    const handleMatchResults = (e) => {
        setMatchResults(e.target.value);
    }

    const submit = () => {
        if (matchResults !== '') {
            let matchResultsList = convertInputToMatchResults(matchResults.trim());
            if (!error) {
                save(matchResultsList);
            } else {
                error = false;
            }
        } else {
            alert("Please input team information");
        }
    }

    function handleTeamScores(matchResultsList) {
        let teamScoreMap = state.teamScoreMap;
        matchResultsList.forEach(x => {
            let score1 = teamScoreMap.get(x.team1);
            score1.total_goals += x.team1_goals;

            let score2 = teamScoreMap.get(x.team2);
            score2.total_goals += x.team2_goals;

            if (x.team1_goals > x.team2_goals) { // team 1 wins, team 2 lose
                score1.match_points += 3;
                score1.alt_match_points += 5;
            
                score2.alt_match_points -= 1;
            } else if (x.team1_goals === x.team2_goals) { // draw
                score1.match_points += 1;
                score1.alt_match_points += 3;
                
                score2.match_points += 1;
                score2.alt_match_points += 3;
            } else if (x.team1_goals < x.team2_goals) { // team 1 lose, team 2 wins
                score1.alt_match_points -= 1;
                
                score2.match_points += 3;
                score2.alt_match_points += 5;
            }

            teamScoreMap.set(x.team1, score1);
            teamScoreMap.set(x.team2, score2);
        })
        return teamScoreMap;
      }

      async function saveTeamScores(teamScores) {
        try {
            const response = await insertTeamScores(teamScores);
            if (response) {
                
            }
        } catch (error) {
            let msg = "";
            if (error ===  400) {
            msg = "Bad Request. Please check input format"
            }
            alert('Error: ' + msg);
        }
    }

    async function save(matchResults) {
        try {
            const response = await insertMatchResults(matchResults);
            if (response) {
                let teamScoreMap = handleTeamScores(matchResults);
                saveTeamScores(Array.from(teamScoreMap.values()));
                navigate('/ranking', {
                    state: {
                        teamScoreMap: teamScoreMap
                    }
                });
            }
        } catch (error) {
            let msg = "";
            if (error ===  400) {
            msg = "Bad Request. Please check input format"
            }
            alert('Error: ' + msg);
        }
    }
    
    async function getAllResults() {
        try {
            const response = await getAllMatchResults();
            if (response) {
                let input = convertDataToInput(response);
                setMatchResults(input);
            }
        } catch (error) {
            let msg = "";
            if (error ===  400) {
            msg = "Bad Request. Please check input format"
            }
            alert('Error: ' + msg);
        }
    }

    const convertInputToMatchResults = (input) => {
        const inputArr = input.split(/\r?\n/);
        const inputObjArr = [];
        let matchResults = {
          team1: '',
          team2: '',
          team1_goals: '',
          team2_goals: '',
        }
        inputArr.forEach(x => {
            // exit loop if there exists error in input
            if (error) {
                return false;
            }
            const xArr = x.split(" ");
            if (xArr.length === 4) {
                let newMatchResults = JSON.parse(JSON.stringify(matchResults)); // deep clone
                newMatchResults.team1 = xArr[0];
                newMatchResults.team2 = xArr[1];
                newMatchResults.team1_goals = parseInt(xArr[2]);
                newMatchResults.team2_goals = parseInt(xArr[3]);
                inputObjArr.push(newMatchResults);
            } else {
                alert("Please input in the correct format");
                error = true;
            }
            })
        return inputObjArr;
    }

    const convertDataToInput = (data) => {
        let input = "";
        data.forEach(x => {
        input += x.team_1 + " " +  x.team_2 + " " + x.team_1_goals + " " + x.team_2_goals + "\n";
        })
        return input;
    }

    return (
        <div>
            <Navbar color="light">
                <h1>We Are the Champions!</h1>
            </Navbar>
            
            <div className="form">
                <Link to="/ranking" className="view-button">
                    <h4>View current ranking</h4>
                </Link>
                <div className="form-title">
                    <h5>Match Results:</h5>
                </div>
                <textarea 
                type="text" 
                name="matchResults" 
                onChange={handleMatchResults}
                value={matchResults}
                placeholder="<Team A name> <Team B name> <Team A goals scored> <Team B goals scored>"
                />
                <div className="buttons">
                    <button className="next-button2" onClick={()=>navigate("/")}>Back</button>    
                    <button className="next-button2" onClick={submit}>Next</button>      
                </div>
            </div>
        </div>
    )
}