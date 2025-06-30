
import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  }
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  textAlign: 'center',
  '& img': {
    borderRadius: '50%',
    boxShadow: `0 10px 20px ${theme.palette.primary.main}33`,
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    width: '120px',
    height: '120px',
    [theme.breakpoints.down('sm')]: {
      width: '80px',
      height: '80px',
    },
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: `0 15px 30px ${theme.palette.primary.main}4D`,
    }
  }
}));

const ContentBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  maxWidth: '800px',
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: '600px',
    padding: theme.spacing(0, 2),
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    padding: theme.spacing(0, 1),
  }
}));

const AnimatedTitle = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light}, ${theme.palette.custom.accentGreen})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  fontSize: '2.5rem',
  [theme.breakpoints.down('md')]: {
    fontSize: '2rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.75rem',
  },
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '3px',
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    borderRadius: '2px',
    [theme.breakpoints.down('sm')]: {
      width: '60px',
      height: '2px',
    }
  }
}));

const SubtitleText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '1.1rem',
  lineHeight: 1.6,
  opacity: 0.8,
  fontWeight: '400',
  [theme.breakpoints.down('md')]: {
    fontSize: '1rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.95rem',
    lineHeight: 1.5,
  }
}));

export function Home() {
  return (
    <StyledContainer maxWidth={false} disableGutters>
      <LogoContainer>
        <img
          src="/src/assets/logo.png"
          alt="Logo HomiWay"
        />
      </LogoContainer>
      
      <ContentBox>
        <AnimatedTitle
          component="h1"
          variant="h2"
          gutterBottom
        >
          HomiWay: Vive la experiencia
        </AnimatedTitle>
        
        <SubtitleText variant="h5">
          Encuentra alojamientos únicos, explora tours increíbles y reserva servicios locales en Costa Rica.
        </SubtitleText>
      </ContentBox>
    </StyledContainer>
  );
}