import styled from "styled-components";
import { IconContext } from "react-icons";
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import {
  BiShuffle,
  BiRepeat,
  BiSkipNext,
  BiSkipPrevious,
} from "react-icons/bi";
import { helpers } from "../../styles";

const Wrapper = styled.div`
  height: 100%;
  ${helpers.flexCenter}
  flex-direction: column;
`;

const ControlsWrapper = styled.div`
  ${helpers.flexCenter}
  margin-bottom: 4px;

  * {
    margin: 0 var(--spacing-xs);
  }
`;

const PlayerBarWrapper = styled.div`
  ${helpers.flexCenter}
`;

const PlayerBarTrack = styled.div`
  position: relative;
  width: 40vw;
  background-color: white;
  height: 4px;
  border-radius: 4px;
  margin: 8px;
`;

const ActiveBar = styled.div`
  position: absolute;
  top: 0;
  width: 20%;
  background-color: red;
  border-radius: 4px;
  height: 4px;
`;

const CurrentTime = styled.div``;

const TotalTime = styled.div``;

const PlayerControls = () => {
  return (
    <Wrapper>
      <ControlsWrapper>
        <BiShuffle fontSize="24px" />
        <BiSkipPrevious fontSize="42px" />
        <FaPauseCircle fontSize="40px" />
        <BiSkipNext fontSize="42px" />
        <BiRepeat fontSize="24px" />
      </ControlsWrapper>

      <PlayerBarWrapper>
        <CurrentTime>0:45</CurrentTime>
        <PlayerBarTrack>
          <ActiveBar />
        </PlayerBarTrack>
        <TotalTime>3:21</TotalTime>
      </PlayerBarWrapper>
    </Wrapper>
  );
};

export default PlayerControls;
