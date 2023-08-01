import { Typography, TypographyProps, SxProps } from '@mui/material';

interface HoverStyles {
  color: string;
  cursor: string;
}

interface CustomStyles {
  color: string;
  '&:hover'?: HoverStyles;
}

interface CommonTypographyProps extends Omit<TypographyProps, 'sx'> {
  sx?: SxProps<CustomStyles> & { [key: string]: any };
}

export default function CommonTypography({
  children,
  onClick,
  color,
  fontSize,
  id,
  className,
  sx,
}: CommonTypographyProps) {

  const styles: SxProps<CustomStyles> = {
    color: 'black',
    '&:hover': { color: '#ef7b45', cursor: 'pointer' },
  };

  return (
    <Typography
      component="div"
      className={className}
      onClick={onClick}
      color={color}
      fontSize={fontSize}
      id={id}
      sx={{ ...styles, ...sx }}
    >
      {children}
    </Typography>
  );
}
