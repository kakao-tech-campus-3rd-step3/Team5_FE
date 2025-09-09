import styled from '@emotion/styled';

export const HomeIcon = styled.div`
  width: 24px;
  height: 24px;
  background-color: #333;
  margin-bottom: 4px;
  border-radius: 2px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 4px;
    left: 4px;
    right: 4px;
    bottom: 8px;
    border: 2px solid #333;
    border-bottom: none;
    border-radius: 2px 2px 0 0;
  }

  &::after {
    content: '';
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 4px;
    background-color: #333;
  }
`;

export const SearchIcon = styled.div`
  width: 24px;
  height: 24px;
  background-color: #333;
  margin-bottom: 4px;
  border-radius: 50%;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 8px;
    height: 2px;
    background-color: #333;
    transform: rotate(45deg);
  }
`;

export const DownloadIcon = styled.div`
  width: 24px;
  height: 24px;
  background-color: #333;
  margin-bottom: 4px;
  border-radius: 2px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 4px;
    left: 6px;
    right: 6px;
    height: 2px;
    background-color: #f5f5dc;
  }

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 10px;
    width: 4px;
    height: 4px;
    background-color: #f5f5dc;
    border-radius: 50%;
  }
`;

export const ProfileIcon = styled.div`
  width: 24px;
  height: 24px;
  background-color: #333;
  margin-bottom: 4px;
  border-radius: 50%;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 4px;
    left: 6px;
    right: 6px;
    height: 8px;
    background-color: #f5f5dc;
    border-radius: 4px 4px 0 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 8px;
    right: 8px;
    height: 6px;
    background-color: #f5f5dc;
    border-radius: 0 0 3px 3px;
  }
`;
