import { React, useState, useEffect } from "react";
import axios from 'axios';
import styled from "styled-components";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";
import YouTube from 'react-youtube';
import Loader from "../components/Loader";
import NotAvailable from "../components/NotAvailable";

export default function Player() {
  const navigate = useNavigate();
  const location = useLocation();
  const [trailer, setTrailer] = useState("_Z3QKkl1WyM");
  const [isMoviePlayed, setIsMoviePlayed] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_TMDB_BASE_URL}/movie/${location.state?.id?.id}?api_key=6d75b2a2e2b05ca51b4dda2ad6426fda&append_to_response=videos`)
      .then(response => {
        const x = response.data.videos.results.find(vid => vid.name === "Official Trailer")
        setTrailer(x?.key);
        setLoading(false);
        setIsMoviePlayed(true);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
        setIsMoviePlayed(false);
      });
  }, []);

  return (
    <Container>
      {loading ? <Loader style={{ height: '100vh' }} /> : !isMoviePlayed ? <NotAvailable customStyling={{ height: '100vh' }} text={'No Movie Found! You Might Not Have Selected A TV Show Or Movie To Be Played.'} navigateBack={true} /> :
        <div className="player">
          <div className="back-btn-player">
            <BsArrowLeft onClick={() => navigate(-1)} />
          </div>
          <YouTube videoId={trailer} className="video" opts={
            {
              width: '100%',
              height: '100%',
              playerVars: {
                autoplay: 1,
                controls: 0,
                cc_load_policy: 0,
                fs: 0,
                iv_load_policy: 0,
                modestbranding: 0,
                rel: 0,
                showinfo: 0,
              },
            }
          } />
        </div>}
    </Container>
  );
}

const Container = styled.div`
  .player {
    width: 100vw;
    height: 100vh;
    margin: 5.5rem auto 3.5rem;
    position: relative;
    .back-btn-player {
      position: fixed;
      left: 28px;
      top: 34px;
      z-index: 5;
      svg {
        font-size: 2.3rem;
        cursor: pointer;
      }
    }
    .video {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
`;
