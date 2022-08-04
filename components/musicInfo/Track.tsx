import styled from "styled-components";
import { BsPlusCircle } from "react-icons/bs";
import { StyledImage } from "../ui";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-sm);
`;

const TextWrapper = styled.div`
  flex: 1;
  padding: 0 var(--spacing-md);

  p {
    margin-top: 4px;
  }
`;

const TrackTitle = styled.h3``;

const ArtistName = styled.p``;

const AddIcon = styled(BsPlusCircle)`
  color: var(--color-spotify-green);
  font-size: 32px;
`;

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

const Track = (props) => {
  const { index, id, name, artists, image, showImage = false, onClick } = props;
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
        />
      )}
      {!showImage && (
        <IndexWrapper>
          <Index>{+index + 1}</Index>
        </IndexWrapper>
      )}
      <TextWrapper>
        <TrackTitle>{name}</TrackTitle>
        <ArtistName>{artists}</ArtistName>
      </TextWrapper>
      <AddIcon />
    </Wrapper>
  );
};

export default Track;
