import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface LandingPageCardProps {
  title: string;
  description: string;
  image: any;
  navPath: string;
}

const LandingPageCard = ({
  title,
  description,
  image,
  navPath,
}: LandingPageCardProps) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ width: 345 }} onClick={() => navigate(navPath)}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt="green iguana"
        />
        <CardContent sx={{ height: "100%" }}>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default LandingPageCard;
