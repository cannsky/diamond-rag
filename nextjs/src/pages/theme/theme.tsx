import { extendTheme } from '@chakra-ui/react';

const customTheme = extendTheme({
    colors: {
        gray: {
            720: '#333333',
            750: '#282828',
            780: '#1d1d1d'
        }
    }
});

export default customTheme;