import styled from "styled-components";

interface ButtonProps {
  isDisabled?: boolean;
}

const StandardButton = styled.button<ButtonProps>`
  border-radius: var(--radius-pill);
  font-size: var(--fz-sm);
  color: ${(p) => (p.isDisabled ? "var(--color-grey-300)" : "white")};
  padding: 6px var(--spacing-md);
  cursor: ${(p) => (p.isDisabled ? "auto" : "pointer")};
  pointer-events: ${(p) => (p.isDisabled ? "none" : "auto")};
`;

const OutlineButton = styled(StandardButton)`
  border: 2px solid ${(p) => (p.isDisabled ? "var(--color-grey-300)" : "white")};
  background-color: transparent;
`;

const FilledButton = styled(StandardButton)`
  // color: ${(p) => (p.isDisabled ? "var(--color-grey-300)" : "Black")};
  font-weight: 600;
  border: 2px solid var(--color-spotify-outline);
  background-color: var(--color-spotify-green);
`;

interface Props {
  state: string;
  onClick: any;
  isDisabled?: boolean;
  children: any;
}

const StyledButton = ({
  state,
  onClick,
  isDisabled = false,
  children,
}: Props) => {
  if (state === "outline") {
    return (
      <OutlineButton type="button" onClick={onClick} isDisabled={isDisabled}>
        {children}
      </OutlineButton>
    );
  }

  if (state === "filled") {
    return (
      <FilledButton type="button" onClick={onClick} isDisabled={isDisabled}>
        {children}
      </FilledButton>
    );
  }

  return (
    <StandardButton type="button" onClick={onClick} isDisabled={isDisabled}>
      {children}
    </StandardButton>
  );
};

export default StyledButton;
