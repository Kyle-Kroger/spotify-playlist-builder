import styled from "styled-components";
import { BsPlusCircle } from "react-icons/bs";
import { StyledImage } from "../ui";
import { durationMSToStandard } from "../../lib/spotify";
import { usePlaylistStateStore } from "../../lib/store";
import { fetcher } from "../../lib/fetcher";
import { usePlaylistId } from "../../lib/hooks";
import { ITrack } from "../../lib/types";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: var(--spacing-xs);
  transition: background-color 150ms ease-in-out;

  :hover {
    background-color: var(--color-grey-550);
  }
`;

const TextWrapper = styled.div`
  min-width: 0;
  flex: 1;
  padding: 0 var(--spacing-md);
  line-height: normal;
`;

const TrackTitle = styled.h3`
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 200ms ease-in-out;

  :hover {
    color: var(--color-spotify-green);
    cursor: pointer;
  }
`;

const ArtistName = styled.p`
  color: var(--color-text-subdued);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AddIcon = styled(BsPlusCircle)`
  color: var(--color-spotify-green);
  font-size: 30px;
  cursor: pointer;
`;

const ImageWrapper = styled.div``;

const IndexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 50px;
`;

const Index = styled.p`
  font-size: 24px;
`;

const Duration = styled.p`
  padding: 0 var(--spacing-sm);
`;

const Track = (props) => {
  const {
    index,
    playlistUri,
    id,
    uri,
    name,
    durationMS,
    artistArray,
    artists,
    image,
    images,
    showImage = false,
    albumId,
    albumName,
    onClick,
  } = props;

  const currentPlaylistId = usePlaylistStateStore(
    (state) => state.currentPlaylistId
  );
  const { mutatePlaylist } = usePlaylistId(currentPlaylistId);
  // convert durationMS to to minutes and seconds
  const standardTime = durationMSToStandard(durationMS);

  // track to add
  const addTrack: ITrack = {
    id,
    uri,
    name,
    duration: durationMS,
    images,
    artists: artistArray,
    firstArtist: artists[0].name,
    albumId,
    albumName,
    tagArray: [],
  };

  const spotifyAdd = async (trackUri) => {
    // optimistically update current playlist with track
    await mutatePlaylist((data) => {
      return {
        ...data,
        tracks: [...data.tracks, addTrack],
      };
    }, false);

    setTimeout(() => {
      // move playlist to the bottom
      // this is probably a bad why to go about this but uncertain of a better way currently
      const playlistBottom = document.querySelector("#playlistBottom");
      playlistBottom.scrollIntoView({
        behavior: "smooth",
      });
    }, 20);

    // add the track serverside to the playlist
    const bodyData = { trackUri };
    const response = await fetcher(
      `/playlists/${currentPlaylistId}/add`,
      bodyData,
      "POST"
    );

    // tell swr to revalidate to make sure they match up
    await mutatePlaylist();
  };

  const handleTitleClicked = async () => {
    try {
      const bodyData = { uri };
      if (playlistUri !== "") {
        // eslint-disable-next-line dot-notation
        bodyData["playlistUri"] = playlistUri;
      }
      await fetcher("/user/player/play", bodyData, "PUT");
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleAddClicked = () => {
    if (currentPlaylistId !== "") {
      spotifyAdd(uri);
    }
    // tell the user to have an active playlist with a modal?
  };

  return (
    <Wrapper>
      {showImage && (
        <StyledImage
          src={image}
          alt={artists}
          width="50px"
          height="50px"
          handleClick={() => {
            onClick(id);
          }}
          className=""
        />
      )}
      {!showImage && (
        <IndexWrapper>
          <Index>{+index + 1}</Index>
        </IndexWrapper>
      )}
      <TextWrapper>
        <TrackTitle onClick={handleTitleClicked}>{name}</TrackTitle>
        <ArtistName>{artists}</ArtistName>
      </TextWrapper>
      <Duration>{standardTime}</Duration>
      <AddIcon onClick={handleAddClicked} />
    </Wrapper>
  );
};

export default Track;
