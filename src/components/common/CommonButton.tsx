import { Button, ButtonProps, SxProps } from '@mui/material';

interface HoverStyles {
  color: string;
  cursor: string;
}

interface CustomStyles {
  color: string;
  '&:hover'?: HoverStyles;
}

interface CommonButtonProps extends Omit<ButtonProps, 'sx'> {
  sx?: SxProps<CustomStyles> & { [key: string]: any };
}

export default function CommonButton({
  children,
  onClick,
  color,
  size,
  id,
  className,
  sx
}: CommonButtonProps) {

  const styles: SxProps<CustomStyles> = {
    color: 'black',
    '&:hover': { color: '#ef7b45', cursor: 'pointer' },
  };
  return (
    <Button
      className={className}
      onClick={onClick}
      color={color}
      size={size}
      id={id}
      sx={{ ...sx, ...styles }}
    >
      {children}
    </Button>
  );
}
