import * as React from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded'
import FolderIcon from '@mui/icons-material/Folder'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import { useStore } from './store'

export default function Welcome() {
  const setInitState = useStore((state) => state.setInitState)

  return (
    <Grid container>
      <StyledGridItem item xs={6}>
        <StyledCard>
          <StyledActionBox>
            <StyledInsertDriveFileOutlinedIcon />
            <Typography variant="h6" sx={{ mb: 4 }}>
              I Have a File
            </Typography>
            <Typography sx={{ mb: 3 }}>
              You have a file!. Next step is to upload your file for data processing step.
            </Typography>
            <Button
              size="large"
              variant="outlined"
              startIcon={<FileUploadRoundedIcon />}
              sx={{ '& .MuiSvgIcon-root': { margin: 0 } }}
              onClick={() => setInitState(false)}
            >
              Upload Your File
            </Button>
          </StyledActionBox>
          <CardContent>
            <Typography gutterBottom variant="h6">
              What&apos;s Next ?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You can then apply following actions to your data:
            </Typography>
            <StyledList component="ul">
              <CustomListItem
                title="Describe:"
                url="#"
                description="Describe adds metadata to your data by automatically inferring metadata if
                it is not defined."
              />
              <CustomListItem
                title="Extract:"
                url="#"
                description="You can then extract and view your data in tabular format and also apply
                validation."
              />
              <CustomListItem
                title="Validate:"
                url="#"
                description="Validation will report the errors if there are any in the dataset."
              />
              <CustomListItem
                title="Transform:"
                url="#"
                description="You can also modify your data by applying various transformation
                functions."
              />
            </StyledList>
          </CardContent>
          <CardContent>
            <Typography variant="h6">More Links:</Typography>
            <StyledList component="ul">
              <CustomListItem title="Frictionless Specs" url="#" />
              <CustomListItem title="Frictionless Framework" url="#" />
            </StyledList>
          </CardContent>
        </StyledCard>
      </StyledGridItem>
      <StyledGridItem item xs={6}>
        <StyledCard>
          <StyledActionBox>
            <StyledFileCopyIcon />
            <Typography variant="h6" sx={{ mb: 4 }}>
              I Have a Dataset
            </Typography>
            <Typography sx={{ mb: 3 }}>
              Now you are ready to upload all your files to create data package!.
            </Typography>
            <Button
              size="large"
              variant="contained"
              startIcon={<FolderIcon />}
              sx={{ '& .MuiSvgIcon-root': { margin: 0 } }}
              onClick={() => setInitState(false)}
            >
              Create Data Package
            </Button>
          </StyledActionBox>
          <CardContent>
            <Typography gutterBottom variant="h6">
              What&apos;s Next ?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You can apply following actions to your dataset:
            </Typography>
            <StyledList component="ul">
              <CustomListItem
                title="Process Your Data:"
                description="Apply functions to generate metadata, clean, validate and transform your
                package resources."
                url="#"
              />
              <CustomListItem
                title="Publish Your Data:"
                description="Publish your data to github, zenodo or ckan."
                url="#"
              />
            </StyledList>
          </CardContent>
          <CardContent>
            <Typography variant="h6">More Links:</Typography>
            <StyledList component="ul">
              <CustomListItem title="CKAN" url="#" />
              <CustomListItem title="Zenodo" url="#" />
              <CustomListItem title="Github" url="#" />
            </StyledList>
          </CardContent>
        </StyledCard>
      </StyledGridItem>
    </Grid>
  )
}

const StyledGridItem = styled(Grid)({
  borderRight: 'solid 1px #ddd',
  display: 'flex',
  alignItems: 'center',
})

const StyledCard = styled(Card)(({ theme }) => ({
  height: `calc(100vh - ${theme.spacing(8)})`,
  width: '100%',
  border: 'none',
  boxShadow: 'none',
  borderRadius: 0,
  square: 'true',
  padding: `${theme.spacing(10)}`,
}))

const StyledActionBox = styled(Box)({
  display: 'flex',
  textAlign: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  '& svg': { mb: 2 },
})

const StyledList = styled(Box)(({ theme }) => ({
  marginBottom: 0,
  '& li': { marginBottom: `${theme.spacing(1)}`, listStyle: 'none' },
  '& li a': { marginRight: `${theme.spacing(0.5)}` },
  '& li .MuiSvgIcon-root': { fontSize: '1.25rem' },
}))

const StyledInsertDriveFileOutlinedIcon = styled(InsertDriveFileOutlinedIcon)({
  fontSize: 100,
  color: '#3577D2',
})

const StyledFileCopyIcon = styled(FileCopyIcon)({ fontSize: 100, color: '#3577D2' })

const CustomListItem = (props: { title: string; url: string; description?: string }) => {
  return (
    <li>
      <a href={props.url}>
        <ArrowForwardIosIcon /> {props.title}
      </a>
      {props.description && props.description}
    </li>
  )
}
