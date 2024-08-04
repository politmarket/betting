import { Box } from "@mui/material";

const CenterCropImage: React.FC<{
    imageUrl: string;
    width?: string | number;
    height?: string | number;
    aspectRatio?: number; // Aspect ratio as a decimal (e.g., 16/9 for 16:9)

}> = ({ imageUrl, width, height, aspectRatio }) => {
    return (
        <Box
            sx={{
                width: width,
                height: height,
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                ...(aspectRatio && {
                    '&::before': {
                        content: '""',
                        display: 'block',
                        paddingTop: `${(1 / aspectRatio) * 100}%`, // This maintains the aspect ratio
                    },
                })
            }}
        >
            <img
                src={imageUrl}
                alt="Center cropped image"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                }}
            />
        </Box>
    );
};

export default CenterCropImage;