import { Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'

export default function NothingToSee(props: any){
    const { t } = useTranslation()

    const AddButton = () => {
        if (!props.onAddClick) return null
    
        return (
        //   <Button title={props.buttonText} onClick={() => props.onAddClick?.()}>
        //     {props.buttonText}
        //   </Button>
        <Button title={props.buttonText} onClick={() =>  props.onAddClick?.()} sx={{ backgroundColor: 'black', color: 'white', '&.MuiButton-root': {
            textTransform: 'capitalize',
            marginTop: '10px',
            '&:hover': {
            color: 'black',
            border: '1px solid black'
            }
        } }}>
            {props.buttonText}
        </Button>
        )
      }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: '64px' }}>
            <Typography sx={{ fontSize: '28px', fontWeight: 700 }}>{t('nothing-to-see')}</Typography>
                <AddButton />
            </Box>
        )
}