import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Loader, StyledButton } from "../ui";
import { AlbumPage, ArtistPage, MusicItemList, TrackList } from "../musicInfo";
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

const HeaderButtonWrapper = styled.div<{ showSubPage: boolean }>`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-sm);
  background-color: ${(p) =>
    p.showSubPage ? "black" : "var(--color-grey-800)"};
`;

const SearchListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex: 1;

  ${helpers.spotifyScrollBar}
`;

const PositionedTrackList = styled(TrackList)`
  flex: 1;
`;

const PositionedArtistPage = styled(ArtistPage)`
  flex: 1;
`;

const PositionedAlbumPage = styled(AlbumPage)`
  flex: 1;
`;

const PositionedMusicList = styled(MusicItemList)`
  flex: 1;
`;

const LoaderWrapper = styled.div`
  flex: 1;
  padding-top: var(--spacing-xl);
`;

const FooterWrapper = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 80px;
  // border-top: 1px solid white;
  background-color: var(--color-grey-800);
  padding: var(--spacing-lg);
`;

const SEARCH_TYPE = {
  SONG: "track",
  ARTIST: "artist",
  ALBUM: "album",
};

const Search = () => {
  const [currentSearch, setCurrentSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currSearchType, setCurrSearchType] = useState(SEARCH_TYPE.SONG);
  const [offset, setOffset] = useState("0");

  const [showSubPage, setShowSubPage] = useState(false);
  const [artistId, setArtistId] = useState("");
  const [albumId, setAlbumId] = useState("");

  const searchListTopRef = useRef(null);

  const { searchData, isLoading, isError } = useSearch(
    `${
      searchTerm !== "" ? searchTerm : " "
    }?type=${currSearchType}&offset=${offset}`
  );

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setShowSubPage(false);
      setOffset("0");
      setSearchTerm(encodeURIComponent(currentSearch));
    }, 1000);
    return () => clearTimeout(timeOutId);
  }, [currentSearch]);

  const handleSearchBarChange = (e) => {
    setCurrentSearch(e.target.value);
  };

  const handleSearchTypeClick = (searchType) => {
    setShowSubPage(false);
    setOffset("0");
    setCurrSearchType(searchType);
    searchListTopRef.current.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleArtistClicked = (id) => {
    setShowSubPage(true);
    setArtistId(id);
  };

  const handleAlbumClicked = (id) => {
    setShowSubPage(true);
    setAlbumId(id);
    setCurrSearchType(SEARCH_TYPE.ALBUM);
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
        <CloseIcon
          size="24px"
          style={{ cursor: "pointer" }}
          onClick={() => setCurrentSearch("")}
        />
      </SearchBarWrapper>
      <HeaderButtonWrapper showSubPage={showSubPage}>
        <StyledButton
          state={currSearchType === SEARCH_TYPE.SONG ? "filled" : "outline"}
          onClick={() => handleSearchTypeClick(SEARCH_TYPE.SONG)}
          className=""
        >
          Song
        </StyledButton>
        <StyledButton
          state={currSearchType === SEARCH_TYPE.ARTIST ? "filled" : "outline"}
          onClick={() => handleSearchTypeClick(SEARCH_TYPE.ARTIST)}
          className=""
        >
          Artist
        </StyledButton>
        <StyledButton
          state={currSearchType === SEARCH_TYPE.ALBUM ? "filled" : "outline"}
          onClick={() => handleSearchTypeClick(SEARCH_TYPE.ALBUM)}
          className=""
        >
          Album
        </StyledButton>
      </HeaderButtonWrapper>
      <SearchListWrapper>
        <div ref={searchListTopRef} />
        {currSearchType === SEARCH_TYPE.SONG && !isLoading && (
          <PositionedTrackList
            className=""
            items={searchData.items}
            showImage
            onClick={handleAlbumClicked}
          />
        )}
        {currSearchType === SEARCH_TYPE.ARTIST &&
          !isLoading &&
          !showSubPage && (
            <PositionedMusicList
              className=""
              items={searchData.items}
              isRound
              onClick={handleArtistClicked}
            />
          )}
        {currSearchType === SEARCH_TYPE.ARTIST && !isLoading && showSubPage && (
          <PositionedArtistPage
            className=""
            id={artistId}
            onAlbumClick={handleAlbumClicked}
          />
        )}
        {currSearchType === SEARCH_TYPE.ALBUM && !isLoading && !showSubPage && (
          <PositionedMusicList
            className=""
            items={searchData.items}
            hasSubtitle
            onClick={handleAlbumClicked}
          />
        )}
        {currSearchType === SEARCH_TYPE.ALBUM && !isLoading && showSubPage && (
          <PositionedAlbumPage className="" id={albumId} />
        )}
        {isLoading && (
          <LoaderWrapper>
            <Loader />
          </LoaderWrapper>
        )}
        <FooterWrapper>
          <StyledButton
            state={searchData.prev && !showSubPage ? "filled" : "outline"}
            isDisabled={!searchData.prev || showSubPage}
            className=""
            onClick={() => {
              setOffset((prev) => (+prev - 50).toString());
              searchListTopRef.current.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            Last Page
          </StyledButton>
          <StyledButton
            state={searchData.next && !showSubPage ? "filled" : "outline"}
            isDisabled={!searchData.next || showSubPage}
            className=""
            onClick={() => {
              setOffset((prev) => (+prev + 50).toString());
              searchListTopRef.current.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            Next Page
          </StyledButton>
        </FooterWrapper>
      </SearchListWrapper>
    </Wrapper>
  );
};

export default Search;
