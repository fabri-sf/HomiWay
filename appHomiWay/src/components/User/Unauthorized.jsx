import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

export function Unauthorized() {
  const { t } = useTranslation();

  return (
    <Container sx={{ p: 2 }} maxWidth="sm">
      <Typography
        component="h1"
        variant="h2"
        align="center"
        color="text.primary"
        gutterBottom
      >
        {t('auth.unauthorized.title')}
      </Typography>
      <Typography variant="h5" align="center" color="text.secondary" paragraph>
        {t('auth.unauthorized.message')}
      </Typography>
    </Container>
  );
}