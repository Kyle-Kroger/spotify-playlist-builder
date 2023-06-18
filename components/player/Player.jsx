/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable camelcase */
/* eslint no-unused-expressions: ["error", { "allowTernary": true }] */

import { useEffect, useState } from "react";
import styled from "styled-components";
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import { StyledImage } from "../ui";
import PlayerControls from "./PlayerControls";
import { QUERIES } from "../../styles";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  height: var(--player-height);
  width: 100%;
  background: var(--player-gradient);
`;

const PlayerImage = styled(StyledImage)`
  @media ${QUERIES.phone} {
    width: 54px;
    height: 54px;
  }
`;

const TrackInfo = styled.div`
  min-width: 250px;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin: 0 var(--spacing-md);
`;

const TitleArtistWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const TrackPlaceholder = styled.div`
  min-width: 250px;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin: 0 var(--spacing-md);

  @media ${QUERIES.phone} {
    display: none;
  }
`;

const PauseButton = styled(FaPauseCircle)`
  cursor: pointer;
  transition: color 200ms ease-in-out, transform 200ms ease-in-out;

  :hover {
    transform: scale(1.05);
    color: var(--color-spotify-green);
  }
`;

const PlayButton = styled(FaPlayCircle)`
  cursor: pointer;
  transition: color 200ms ease-in-out, transform 200ms ease-in-out;

  :hover {
    transform: scale(1.05);
    color: var(--color-spotify-green);
  }
`;

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

const Player = ({ token }) => {
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [player, setPlayer] = useState(undefined);
  const [current_track, setTrack] = useState(track);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        setTrack(state.track_window.current_track);
        setPaused(state.paused);
        setPosition(state.position);
        console.log(state.paused, "paused");

        player.getCurrentState().then((pState) => {
          !pState ? setActive(false) : setActive(true);
          console.log(pState);
        });
      });

      player.connect();
    };
  }, [token]);

  // needs to be in its own useEffect so it doesn't cause an infinite loop
  useEffect(() => {
    const intervalId = setInterval(() => {
      setPosition((prev) => (is_active && !is_paused ? prev + 500 : prev + 0));
      console.log(is_active, is_paused, "counting");
    }, 500);
    return () => clearInterval(intervalId);
  }, [is_active, is_paused]);

  return (
    <Wrapper>
      {current_track && (
        <TrackInfo>
          <PlayerImage
            src={current_track.album.images[0].url}
            alt="currently playing image"
            width="74px"
            height="74px"
            className=""
          />
          <TitleArtistWrapper>
            <h3>{current_track.name}</h3>
            <h5>
              {current_track.artists.map((artist) => artist.name).join(", ")}
            </h5>
          </TitleArtistWrapper>
        </TrackInfo>
      )}

      <div>{position}</div>

      {/* <PlayerControls
        playbackState={playbackState}
        mutateUserPlaybackState={mutateUserPlaybackState}
      /> */}

      <TrackPlaceholder />
    </Wrapper>
  );
};

export default Player;
