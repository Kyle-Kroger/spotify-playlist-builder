import styled from "styled-components";
import { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { StyledButton } from "../ui";
import { TrackList } from "../musicInfo";
import { useSearch } from "../../lib/hooks";
import { helpers } from "../../styles";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  border-left: 1px solid black;
`;

const SearchBarWrapper = styled.div`
  background-color: var(--color-grey-900);
  padding: var(--spacing-sm) var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SearchBar = styled.input`
  font-size: var(--fz-md);
  background-color: var(--color-grey-600);
  width: 80%;
  color: white;
  -webkit-appearance: none;
  outline: none;
  border: 1px solid transparent;
  padding: var(--spacing-xs);

  ::placeholder {
    color: var(--sidebar-text-color);
  }
`;

const CloseIcon = styled(AiOutlineClose)`
  color: var(--sidebar-text-color);
`;

const HeaderButtonWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-sm);
  background-color: var(--color-grey-800);
`;

const SearchListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex: 1;
  padding: var(--spacing-sm);

  ${helpers.spotifySearchBar}
`;

const PositionedTrackList = styled(TrackList)`
  flex: 1;
`;

const FooterWrapper = styled.footer`
  min-height: 80px;
`;

const SEARCH_TYPE = {
  SONG: "song",
  ARTIST: "artist",
  ALBUM: "album",
};

const Search = () => {
  const [currentSearch, setCurrentSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currSearchType, setCurrSearchType] = useState(SEARCH_TYPE.SONG);
  const [offset, setOffset] = useState("0");

  const { searchData, isLoading, isError } = useSearch(
    `${searchTerm}?type=track&offset=${offset}`
  );

  useEffect(() => {
    const timeOutId = setTimeout(
      () => setSearchTerm(encodeURIComponent(currentSearch)),
      1000
    );
    return () => clearTimeout(timeOutId);
  }, [currentSearch]);

  const handleSearchBarChange = (e) => {
    setCurrentSearch(e.target.value);
  };

  const handleSearchTypeClick = (searchType) => {
    setCurrSearchType(searchType);
  };

  return (
    <Wrapper>
      <SearchBarWrapper>
        <SearchBar
          type="text"
          placeholder="Search Spotify..."
          value={currentSearch}
          onChange={handleSearchBarChange}
        />
        <CloseIcon size="24px" />
      </SearchBarWrapper>
      <HeaderButtonWrapper>
        <StyledButton
          state={currSearchType === SEARCH_TYPE.SONG ? "filled" : "outline"}
          onClick={() => handleSearchTypeClick(SEARCH_TYPE.SONG)}
        >
          Song
        </StyledButton>
        <StyledButton
          state={currSearchType === SEARCH_TYPE.ARTIST ? "filled" : "outline"}
          onClick={() => handleSearchTypeClick(SEARCH_TYPE.ARTIST)}
        >
          Artist
        </StyledButton>
        <StyledButton
          state={currSearchType === SEARCH_TYPE.ALBUM ? "filled" : "outline"}
          onClick={() => handleSearchTypeClick(SEARCH_TYPE.ALBUM)}
        >
          Album
        </StyledButton>
      </HeaderButtonWrapper>
      <SearchListWrapper>
        {currSearchType === SEARCH_TYPE.SONG && !isLoading && (
          <PositionedTrackList className="" items={searchData.items} />
        )}
        {isLoading && <div>Loading...</div>}
        <FooterWrapper>Footer!!!</FooterWrapper>
      </SearchListWrapper>
    </Wrapper>
  );
};

export default Search;
