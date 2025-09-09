import React from 'react';
import styled from '@emotion/styled';
import { HomeIcon, SearchIcon, DownloadIcon, ProfileIcon } from '../Icons/Icons';

const GNB: React.FC = () => {
  return (
    <BottomNavigation>
      <NavItem>
        <HomeIcon />
      </NavItem>
      <NavItem>
        <SearchIcon />
      </NavItem>
      <NavItem>
        <DownloadIcon />
      </NavItem>
      <NavItem>
        <ProfileIcon />
      </NavItem>
    </BottomNavigation>
  );
};

export default GNB;

const BottomNavigation = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f5f5dc;
  padding: 12px 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #e0e0e0;
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
`;

